import {HyperBunRequest} from './request';
import {HyperBunRouter} from './router';
import {Serve} from './serve-types';

type HyperBunListenerOptions = Omit<Serve, 'fetch'>;

class HyperBunServer extends HyperBunRouter {
  listen(options: HyperBunListenerOptions): ReturnType<typeof Bun.serve> {
    return Bun.serve({
      ...options,
      fetch: request => {
        return this.handle(
          new HyperBunRequest(request.url, {
            ...request,
            method: request.method,
            headers: request.headers,
          })
        );
      },
    });
  }
}

export const createServer = () => {
  return new HyperBunServer();
};

export {asAttachment} from './file';
