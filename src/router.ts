export type NextFn = (error?: Error) => void;
export type HyperBunHandler = (req: Request) => any;
export type HyperBunMiddleware = (req: Request, next: NextFn) => Response | void;

export class HyperBunRouter {
  private _middlewares = [] as HyperBunMiddleware[];
  private _GET = {} as {[key: string]: HyperBunHandler};
  private _POST = {} as {[key: string]: HyperBunHandler};;
  private _PUT = {} as {[key: string]: HyperBunHandler};;
  private _DELETE = {} as {[key: string]: HyperBunHandler};;

  private _handle(input: number | string | object | Array<string | object | number>) {
    if (typeof input === 'undefined') {
      return new Response('OK');
    }

    if (typeof input === 'string' || typeof input === 'number') {
      return new Response(input.toString())
    }

    const response = Response.json(input);
    response.headers.set('Content-Type', 'application/json');
    return response;
  }

  async handle(request: Request): Promise<Response> {
    for (const middleware of this._middlewares) {
      const response = await middleware(request, (error: unknown): Response | void => {
        if (error instanceof Error) {
          return new Response(error.message || '', {
            status: 500,
          })
        }
      });

      if (response instanceof Response) return response;
    }

    const path = new URL(request.url).pathname;
    const method = request.method;
    let handler: HyperBunHandler | undefined;

    switch(method.toUpperCase()) {
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

    return this._handle(handler(request))
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
};