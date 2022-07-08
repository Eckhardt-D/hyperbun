import {HyperBunRouter} from './router';
import {Serve} from './serve-types';

type HyperBunListenerOptions = Omit<Serve, 'fetch'>;

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
