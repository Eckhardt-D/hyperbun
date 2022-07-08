import {BlobAttachment} from './file';
import {HyperBunRequest} from './request';

type NextFn = (error?: Error) => void;

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

type HyperBunHandler =
  | undefined
  | ((req: HyperBunRequest) => HandlerReturnType);

type HyperBunMiddleware = (
  req: HyperBunRequest,
  next: NextFn
) => Response | void | Promise<Response | void>;

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

  private async _handle(input?: HandlerReturnType) {
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

  protected async handle(request: HyperBunRequest): Promise<Response> {
    for (const middleware of this._middlewares) {
      const response = await middleware(
        request,
        (error: unknown): Response | void => {
          if (error instanceof Error) {
            return new Response(error.message || '', {
              status: 500,
            });
          }
        }
      );

      if (response instanceof Response) return response;
    }

    const path = new URL(request.url).pathname;
    const method = request.method as
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE';

    console.log(request.method);

    const handler = this.handlers[`_${method}`][path];

    if (!handler) {
      return new Response(`Could not ${method} ${path}`, {
        status: 404,
      });
    }

    return this._handle(await handler(request));
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
