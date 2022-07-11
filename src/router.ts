import {createRouter as createRadixRouter} from 'radix3';
import {HyperBunRequest} from './request';
import {join} from 'path';

import {
  BlobAttachment,
  HyperBunMiddleware,
  Context,
  Returntypes,
  HyperBunHandler,
  Router,
  MethodTypes,
} from './types';

export class HyperBunRouter {
  #routers: Router = {
    GET: createRadixRouter(),
    POST: createRadixRouter(),
    PUT: createRadixRouter(),
    PATCH: createRadixRouter(),
    DELETE: createRadixRouter(),
  };

  #middlewares: HyperBunMiddleware[] = [];

  use(path: string, router: HyperBunRouter) {
    if (typeof path !== 'string' || !(router instanceof HyperBunRouter)) {
      throw new Error('A router middleware requires a base path to use');
    }

    this.#middlewares = [...this.#middlewares, ...router.#middlewares];

    Object.keys(router.#routers).forEach(method => {
      const _router = router.#routers[method as MethodTypes];

      Object.keys(_router.ctx.staticRoutesMap).forEach(innerPath => {
        const data = _router.lookup(innerPath);
        let joinedPath = join(path, innerPath);

        if (joinedPath.length > 1 && joinedPath.endsWith('/')) {
          joinedPath = joinedPath.slice(0, -1);
        }

        if (data !== null) {
          this.#routers[method as MethodTypes].insert(joinedPath, {
            handler: data.handler,
            method: data.method,
          });
        }
      });
    });
  }

  protected async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const {pathname, searchParams} = url;

    const context: Context = {
      query: {},
      params: {},
    };

    const matched =
      this.#routers[request.method as MethodTypes].lookup(pathname);

    if (!matched) {
      return new Response(`Could not ${request.method} ${pathname}`, {
        status: 404,
      });
    }

    context.params = matched.params || {};

    // @ts-ignore: ITERABLE
    for (const [key, value] of searchParams) {
      context.query[key] = value;
    }

    const hyperRequest = new HyperBunRequest(request);

    for (const middleware of this.#middlewares) {
      const response = await middleware(hyperRequest, context);

      if (response instanceof Error) {
        return new Response(response.message, {
          status: 500,
        });
      }

      if (response instanceof Response) {
        return response;
      }
    }

    const value = await matched.handler(hyperRequest, context);
    return this.#createResponse(value);
  }

  async #createResponse(input?: Returntypes) {
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
    this.#middlewares.push(middleware);
  }

  get(path: string, handler: HyperBunHandler) {
    this.#routers['GET'].insert(path, {
      handler,
    });
  }

  post(path: string, handler: HyperBunHandler) {
    this.#routers['POST'].insert(path, {
      handler,
    });
  }

  put(path: string, handler: HyperBunHandler) {
    this.#routers['PUT'].insert(path, {
      handler,
    });
  }

  patch(path: string, handler: HyperBunHandler) {
    this.#routers['PATCH'].insert(path, {
      handler,
    });
  }

  delete(path: string, handler: HyperBunHandler) {
    this.#routers['DELETE'].insert(path, {
      handler,
    });
  }
}

export const createRouter = () => new HyperBunRouter();
