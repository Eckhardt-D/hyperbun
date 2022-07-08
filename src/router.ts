import {HyperBunRequest} from './request';

type NextFn = (error?: Error) => void;

type HandlerReturnType =
  | Response
  | undefined
  | number
  | string
  | object
  | Array<string | object | number>
  | Promise<
      | Response
      | undefined
      | number
      | string
      | object
      | Array<string | object | number>
    >;

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
  private _GET = {} as HandlerByPath;
  private _POST = {} as HandlerByPath;
  private _PUT = {} as HandlerByPath;
  private _DELETE = {} as HandlerByPath;

  private async _handle(input?: HandlerReturnType) {
    if (input instanceof Response) {
      return input;
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

  async handle(request: HyperBunRequest): Promise<Response> {
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

    console.log(request.url);

    const path = new URL(request.url).pathname;
    const method = request.method;
    let handler: HyperBunHandler | Promise<HyperBunHandler>;

    switch (method.toUpperCase()) {
      case 'GET':
        handler = this._GET[path];
        break;
      case 'POST':
        handler = this._POST[path];
        break;
      case 'PUT':
        handler = this._PUT[path];
        break;
      case 'DELETE':
        handler = this._DELETE[path];
        break;
      default:
        handler = undefined;
    }

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
    this._GET[path] = handler;
  }

  post(path: string, handler: HyperBunHandler) {
    this._POST[path] = handler;
  }

  put(path: string, handler: HyperBunHandler) {
    this._PUT[path] = handler;
  }

  delete(path: string, handler: HyperBunHandler) {
    this._DELETE[path] = handler;
  }
}
