interface Server {
  /**
   * Stop listening to prevent new connections from being accepted.
   *
   * It does not close existing connections.
   *
   * It may take a second or two to actually stop.
   */
  stop(): void;

  /**
   * How many requests are in-flight right now?
   */
  readonly pendingRequests: number;
  readonly port: number;
  readonly hostname: string;
  readonly development: boolean;
}

export interface SSLAdvancedOptions {
  passphrase?: string;
  caFile?: string;
  dhParamsFile?: string;

  /**
   * This sets `OPENSSL_RELEASE_BUFFERS` to 1.
   * It reduces overall performance but saves some memory.
   * @default false
   */
  lowMemoryMode?: boolean;
}
interface SSLOptions {
  /**
   * File path to a TLS key
   *
   * To enable TLS, this option is required.
   */
  keyFile: string;
  /**
   * File path to a TLS certificate
   *
   * To enable TLS, this option is required.
   */
  certFile: string;
}

export interface Errorlike extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
}

export type SSLServeOptions = ServeOptions &
    SSLOptions &
    SSLAdvancedOptions & {
      /**
       *  The keys are [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication) hostnames.
       *  The values are SSL options objects.
       */
      serverNames: Record<string, SSLOptions & SSLAdvancedOptions>;
    };

export type Serve = SSLServeOptions | ServeOptions;

export interface ServeOptions {
  /**
   * What port should the server listen on?
   * @default process.env.PORT || "3000"
   */
  port?: string | number;

  /**
   * What hostname should the server listen on?
   *
   * @default
   * ```js
   * "0.0.0.0" // listen on all interfaces
   * ```
   * @example
   *  ```js
   * "127.0.0.1" // Only listen locally
   * ```
   * @example
   * ```js
   * "remix.run" // Only listen on remix.run
   * ````
   *
   * note: hostname should not include a {@link port}
   */
  hostname?: string;

  /**
   * What URI should be used to make {@link Request.url} absolute?
   *
   * By default, looks at {@link hostname}, {@link port}, and whether or not SSL is enabled to generate one
   *
   * @example
   *```js
   * "http://my-app.com"
   * ```
   *
   * @example
   *```js
   * "https://wongmjane.com/"
   * ```
   *
   * This should be the public, absolute URL – include the protocol and {@link hostname}. If the port isn't 80 or 443, then include the {@link port} too.
   *
   * @example
   * "http://localhost:3000"
   *
   */
  baseURI?: string;

  /**
   * What is the maximum size of a request body? (in bytes)
   * @default 1024 * 1024 * 128 // 128MB
   */
  maxRequestBodySize?: number;

  /**
   * Render contextual errors? This enables bun's error page
   * @default process.env.NODE_ENV !== 'production'
   */
  development?: boolean;

  /**
   * Handle HTTP requests
   *
   * Respond to {@link Request} objects with a {@link Response} object.
   *
   */
  fetch(this: Server, request: Request): Response | Promise<Response>;

  error?: (
    this: Server,
    request: Errorlike
  ) => Response | Promise<Response> | undefined | Promise<undefined>;
}