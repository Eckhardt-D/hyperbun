import {Server, Serve, serve} from 'bun'
import {HyperBunRouter} from './router';

type HyperBunListenerOptions = Omit<Serve, "fetch">

class HyperBunServer extends HyperBunRouter {
  listen(options: HyperBunListenerOptions): Server {
    return serve({
      ...options,
      fetch: (request) => {
        return this.handle(request);
      }
    })
  }
}

export const createServer = (options?: never) => {
  return new HyperBunServer();
}