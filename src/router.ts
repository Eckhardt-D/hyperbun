import {BlobAttachment} from './file';

type ParamOrQuery = {[key: string]: string};

interface Context {
  params: ParamOrQuery;
  query: ParamOrQuery;
  [key: string]: unknown;
}

type Returntypes =
  | Response
  | undefined
  | number
  | string
  | object
  | Array<string | object | number>
  | BlobAttachment
  | void;

type HandlerReturnType = Returntypes | Promise<Returntypes>;

type HyperBunHandler = (
  request: Request,
  context: Context
) => HandlerReturnType;

type HyperBunMiddleware = (
  request: Request,
  context: Context
) => Error | Response | void;

interface HandlerByPath {
  [key: string]: HyperBunHandler;
}

export class HyperBunRouter {
  private _middlewares = [] as HyperBunMiddleware[];
  private handlers = {
    _GET: {} as HandlerByPath,
    _POST: {} as HandlerByPath,
    _PUT: {} as HandlerByPath,
    _PATCH: {} as HandlerByPath,
    _DELETE: {} as HandlerByPath,
  };

  protected async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const search = new URLSearchParams(url.search);

    const context: Context = {
      query: {},
      params: {},
    };

    for (const [key, value] of search) {
      context.query[key] = value;
    }

    let middlewareResponse: Error | Response | void;
    /**
     * @todo, for some reason, middlewares cannot be
     * async - otherwise the response never gets sent
     * debug later, for now MWs must be sync...
     */
    for (const middleware of this._middlewares) {
      middlewareResponse = middleware(request, context);

      if (
        middlewareResponse instanceof Error ||
        middlewareResponse instanceof Response
      ) {
        break;
      }
    }

    if (middlewareResponse instanceof Response) {
      return middlewareResponse;
    }

    if (middlewareResponse instanceof Error) {
      return new Response(middlewareResponse.message, {
        status: 500,
      });
    }

    const method = request.method as
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE';

    const handler = this.handlers[`_${method}`][path];

    if (handler === undefined) {
      return new Response(`Could not ${method} ${path}`, {
        status: 404,
      });
    }

    const isAsync = handler.constructor.name === 'AsyncFunction';

    const result = isAsync
      ? await handler(request, context)
      : handler(request, context);

    return this._createResponse(result);
  }

  private async _createResponse(input?: Returntypes) {
    if (input instanceof Response) {
      return input;
    }

    if (input instanceof Blob) {
      const response = new Response(input);
      response.headers.set('Content-Type', input.type);
      return response;
    }

    if ((input as BlobAttachment)?.blob instanceof Blob) {
      const blobby = input as BlobAttachment;
      const response = new Response(blobby.blob);
      response.headers.set('Content-Type', blobby.blob.type);
      response.headers.set(
        'Content-Disposition',
        `attachment; filename="${blobby.filename}"`
      );
      return response;
    }

    if (typeof input === 'undefined') {
      return new Response('OK');
    }

    if (typeof input === 'string' || typeof input === 'number') {
      return new Response(input.toString());
    }

    const response = Response.json(input);
    response.headers.set('Content-Type', 'application/json');
    return response;
  }

  middleware(middleware: HyperBunMiddleware) {
    this._middlewares.push(middleware);
  }

  get(path: string, handler: HyperBunHandler) {
    this.handlers._GET[path] = handler;
  }

  post(path: string, handler: HyperBunHandler) {
    this.handlers._POST[path] = handler;
  }

  put(path: string, handler: HyperBunHandler) {
    this.handlers._PUT[path] = handler;
  }

  patch(path: string, handler: HyperBunHandler) {
    this.handlers._PATCH[path] = handler;
  }

  delete(path: string, handler: HyperBunHandler) {
    this.handlers._DELETE[path] = handler;
  }
}
