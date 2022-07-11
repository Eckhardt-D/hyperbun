import {createRouter as createRadixRouter} from 'radix3';
import {join} from 'path';

import {
  BlobAttachment,
  HyperBunMiddleware,
  Context,
  Returntypes,
  HyperBunHandler,
  RadixRouter,
} from './types';

export class HyperBunRouter {
  #router: RadixRouter;
  #middlewares: HyperBunMiddleware[] = [];

  constructor() {
    this.#router = createRadixRouter();
  }

  use(path: string, router: HyperBunRouter) {
    if (typeof path !== 'string' || !(router instanceof HyperBunRouter)) {
      throw new Error('A router middleware requires a base path to use');
    }

    this.#middlewares = [...this.#middlewares, ...router.#middlewares];

    Object.keys(router.#router.ctx.staticRoutesMap).forEach(innerPath => {
      const data = router.#router.lookup(innerPath);
      let joinedPath = join(path, innerPath);

      if (joinedPath.length > 1 && joinedPath.endsWith('/')) {
        joinedPath = joinedPath.slice(0, -1);
      }

      if (data !== null) {
        this.#router.insert(joinedPath, {
          handler: data.handler,
          method: data.method,
        });
      }
    });
  }

  protected async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const {pathname, searchParams} = url;

    const context: Context = {
      query: {},
      params: {},
    };

    const matched = this.#router.lookup(pathname);

    if (!matched || matched.method !== request.method) {
      return new Response(`Could not ${request.method} ${pathname}`, {
        status: 404,
      });
    }

    context.params = matched.params || {};

    // @ts-ignore: ITERABLE
    for (const [key, value] of searchParams) {
      context.query[key] = value;
    }

    /**
     * Freeze workaround.
     */
    request.blob();

    for (const middleware of this.#middlewares) {
      const response = await middleware(request, context);

      if (response instanceof Error) {
        return new Response(response.message, {
          status: 500,
        });
      }

      if (response instanceof Response) {
        return response;
      }
    }

    const value = await matched.handler(request, context);
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
    this.#router.insert(path, {
      handler,
      method: 'GET',
    });
  }

  post(path: string, handler: HyperBunHandler) {
    this.#router.insert(path, {
      handler,
      method: 'POST',
    });
  }

  put(path: string, handler: HyperBunHandler) {
    this.#router.insert(path, {
      handler,
      method: 'PUT',
    });
  }

  patch(path: string, handler: HyperBunHandler) {
    this.#router.insert(path, {
      handler,
      method: 'PATCH',
    });
  }

  delete(path: string, handler: HyperBunHandler) {
    this.#router.insert(path, {
      handler,
      method: 'DELETE',
    });
  }
}

export const createRouter = () => new HyperBunRouter();
