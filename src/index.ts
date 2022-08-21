import {HyperBunRouter} from './router';
import type {HyperBunRequest} from './request';
import type {
  HyperBunListenerOptions,
  HyperBunMiddleware,
  HyperBunHandler,
  Context,
} from './types';

class HyperBunServer extends HyperBunRouter {
  listen(options: HyperBunListenerOptions): ReturnType<typeof Bun.serve> {
    return Bun.serve({
      ...options,
      fetch: async request => {
        return this.handle(request);
      },
    });
  }
}

export const createServer = () => {
  return new HyperBunServer();
};

export {asAttachment} from './file';
export {createRouter} from './router';
export type {
  HyperBunMiddleware,
  Context,
  HyperBunRouter,
  HyperBunHandler,
  HyperBunRequest,
};
