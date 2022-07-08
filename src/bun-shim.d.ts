// Type definitions for bun 0.0
// Project: https://github.com/Jarred-Sumner/bun
// Definitions by: Jarred Sumner <https://github.com/Jarred-Sumner>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />

// This file is bundled so that your TypeScript editor integration loads it faster.
// ./bun.d.ts

interface VoidFunction {
  (): void;
}

/**
 *
 * Bun.js runtime APIs
 *
 * @example
 *
 * ```js
 * import {file} from 'bun';
 *
 * // Log the file to the console
 * const input = await file('/path/to/file.txt').text();
 * console.log(input);
 * ```
 *
 * This module aliases `globalThis.Bun`.
 *
 */
declare module "bun" {
  /**
   * Start a fast HTTP server.
   *
   * @param options Server options (port defaults to $PORT || 8080)
   *
   * -----
   *
   * @example
   *
   * ```ts
   * Bun.serve({
   *   fetch(req: Request): Response | Promise<Response> {
   *     return new Response("Hello World!");
   *   },
   *
   *   // Optional port number - the default value is 3000
   *   port: process.env.PORT || 3000,
   * });
   * ```
   * -----
   *
   * @example
   *
   * Send a file
   *
   * ```ts
   * Bun.serve({
   *   fetch(req: Request): Response | Promise<Response> {
   *     return new Response(Bun.file("./package.json"));
   *   },
   *
   *   // Optional port number - the default value is 3000
   *   port: process.env.PORT || 3000,
   * });
   * ```
   */
  export function serve(options: Serve): Server;

  /**
   * Synchronously resolve a `moduleId` as though it were imported from `parent`
   *
   * On failure, throws a `ResolveError`
   */
  // tslint:disable-next-line:unified-signatures
  export function resolveSync(moduleId: string, parent: string): string;

  /**
   * Resolve a `moduleId` as though it were imported from `parent`
   *
   * On failure, throws a `ResolveError`
   *
   * For now, use the sync version. There is zero performance benefit to using this async version. It exists for future-proofing.
   */
  // tslint:disable-next-line:unified-signatures
  export function resolve(moduleId: string, parent: string): Promise<string>;

  /**
   *
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file.
   *
   * @param destination The file or file path to write to
   * @param input The data to copy into `destination`.
   * @returns A promise that resolves with the number of bytes written.
   */
  // tslint:disable-next-line:unified-signatures
  export function write(
    destination: FileBlob | PathLike,
    input: Blob | TypedArray | string | BlobPart[]
  ): Promise<number>;

  /**
   *
   * Persist a {@link Response} body to disk.
   *
   * @param destination The file to write to. If the file doesn't exist,
   * it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input - `Response` object
   * @returns A promise that resolves with the number of bytes written.
   */
  export function write(
    destination: FileBlob,
    input: Response
  ): Promise<number>;

  /**
   *
   * Persist a {@link Response} body to disk.
   *
   * @param destinationPath The file path to write to. If the file doesn't
   * exist, it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input - `Response` object
   * @returns A promise that resolves with the number of bytes written.
   */
  // tslint:disable-next-line:unified-signatures
  export function write(
    destinationPath: PathLike,
    input: Response
  ): Promise<number>;

  /**
   *
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file.
   *
   * On Linux, this uses `copy_file_range`.
   *
   * On macOS, when the destination doesn't already exist, this uses
   * [`clonefile()`](https://www.manpagez.com/man/2/clonefile/) and falls
   * back to [`fcopyfile()`](https://www.manpagez.com/man/2/fcopyfile/)
   *
   * @param destination The file to write to. If the file doesn't exist,
   * it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input The file to copy from.
   * @returns A promise that resolves with the number of bytes written.
   */
  // tslint:disable-next-line:unified-signatures
  export function write(
    destination: FileBlob,
    input: FileBlob
  ): Promise<number>;

  /**
   *
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file.
   *
   * On Linux, this uses `copy_file_range`.
   *
   * On macOS, when the destination doesn't already exist, this uses
   * [`clonefile()`](https://www.manpagez.com/man/2/clonefile/) and falls
   * back to [`fcopyfile()`](https://www.manpagez.com/man/2/fcopyfile/)
   *
   * @param destinationPath The file path to write to. If the file doesn't
   * exist, it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input The file to copy from.
   * @returns A promise that resolves with the number of bytes written.
   */
  // tslint:disable-next-line:unified-signatures
  export function write(
    destinationPath: PathLike,
    input: FileBlob
  ): Promise<number>;

  export interface SystemError extends Error {
    errno?: number | undefined;
    code?: string | undefined;
    path?: string | undefined;
    syscall?: string | undefined;
  }

  /**
   * Concatenate an array of typed arrays into a single `ArrayBuffer`. This is a fast path.
   *
   * You can do this manually if you'd like, but this function will generally
   * be a little faster.
   *
   * If you want a `Uint8Array` instead, consider `Buffer.concat`.
   *
   * @param buffers An array of typed arrays to concatenate.
   * @returns An `ArrayBuffer` with the data from all the buffers.
   *
   * Here is similar code to do it manually, except about 30% slower:
   * ```js
   *   var chunks = [...];
   *   var size = 0;
   *   for (const chunk of chunks) {
   *     size += chunk.byteLength;
   *   }
   *   var buffer = new ArrayBuffer(size);
   *   var view = new Uint8Array(buffer);
   *   var offset = 0;
   *   for (const chunk of chunks) {
   *     view.set(chunk, offset);
   *     offset += chunk.byteLength;
   *   }
   *   return buffer;
   * ```
   *
   * This function is faster because it uses uninitialized memory when copying. Since the entire
   * length of the buffer is known, it is safe to use uninitialized memory.
   */
  export function concatArrayBuffers(
    buffers: Array<ArrayBufferView | ArrayBufferLike>
  ): ArrayBuffer;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single {@link ArrayBuffer}.
   *
   * Each chunk must be a TypedArray or an ArrayBuffer. If you need to support
   * chunks of different types, consider {@link readableStreamToBlob}
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks or the concatenated chunks as an `ArrayBuffer`.
   */
  export function readableStreamToArrayBuffer(
    stream: ReadableStream
  ): Promise<ArrayBuffer> | ArrayBuffer;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single {@link Blob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link Blob}.
   */
  export function readableStreamToBlob(stream: ReadableStream): Promise<Blob>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single string. Chunks must be a TypedArray or an ArrayBuffer. If you need to support chunks of different types, consider {@link readableStreamToBlob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link String}.
   */
  export function readableStreamToText(stream: ReadableStream): Promise<string>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single string and parse as JSON. Chunks must be a TypedArray or an ArrayBuffer. If you need to support chunks of different types, consider {@link readableStreamToBlob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link String}.
   */
  export function readableStreamToJSON(stream: ReadableStream): Promise<any>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * @param stream The stream to consume
   * @returns A promise that resolves with the chunks as an array
   *
   */
  export function readableStreamToArray<T>(
    stream: ReadableStream
  ): Promise<T[]> | T[];

  /**
   * Escape the following characters in a string:
   *
   * - `"` becomes `"&quot;"`
   * - `&` becomes `"&amp;"`
   * - `'` becomes `"&#x27;"`
   * - `<` becomes `"&lt;"`
   * - `>` becomes `"&gt;"`
   *
   * This function is optimized for large input. On an M1X, it processes 480 MB/s -
   * 20 GB/s, depending on how much data is being escaped and whether there is non-ascii
   * text.
   *
   * Non-string types will be converted to a string before escaping.
   */
  export function escapeHTML(input: string | object | number | boolean): string;

  /**
   * Convert a filesystem path to a file:// URL.
   *
   * @param path The path to convert.
   * @returns A {@link URL} with the file:// scheme.
   *
   * @example
   * ```js
   * const url = Bun.pathToFileURL("/foo/bar.txt");
   * console.log(url.href); // "file:///foo/bar.txt"
   *```
   *
   * Internally, this function uses WebKit's URL API to
   * convert the path to a file:// URL.
   */
  export function pathToFileURL(path: string): URL;

  /**
   * Convert a {@link URL} to a filesystem path.
   * @param url The URL to convert.
   * @returns A filesystem path.
   * @throws If the URL is not a URL.
   * @example
   * ```js
   * const path = Bun.fileURLToPath(new URL("file:///foo/bar.txt"));
   * console.log(path); // "/foo/bar.txt"
   * ```
   */
  export function fileURLToPath(url: URL): string;

  /**
   * Fast incremental writer that becomes an `ArrayBuffer` on end().
   */
  export class ArrayBufferSink {
    constructor();

    start(options?: {
      asUint8Array?: boolean;
      /**
       * Preallocate an internal buffer of this size
       * This can significantly improve performance when the chunk size is small
       */
      highWaterMark?: number;
      /**
       * On {@link ArrayBufferSink.flush}, return the written data as a `Uint8Array`.
       * Writes will restart from the beginning of the buffer.
       */
      stream?: boolean;
    }): void;

    write(chunk: string | ArrayBufferView | ArrayBuffer): number;
    /**
     * Flush the internal buffer
     *
     * If {@link ArrayBufferSink.start} was passed a `stream` option, this will return a `ArrayBuffer`
     * If {@link ArrayBufferSink.start} was passed a `stream` option and `asUint8Array`, this will return a `Uint8Array`
     * Otherwise, this will return the number of bytes written since the last flush
     *
     * This API might change later to separate Uint8ArraySink and ArrayBufferSink
     */
    flush(): number | Uint8Array | ArrayBuffer;
    end(): ArrayBuffer | Uint8Array;
  }

  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   * - `type` is auto-set based on the file extension when possible
   *
   * @example
   * ```js
   * const file = Bun.file("./hello.json");
   * console.log(file.type); // "application/json"
   * console.log(await file.text()); // '{"hello":"world"}'
   * ```
   *
   * @example
   * ```js
   * await Bun.write(
   *   Bun.file("./hello.txt"),
   *   "Hello, world!"
   * );
   * ```
   *
   */
  export interface FileBlob extends Blob {
    /**
     * Offset any operation on the file starting at `begin` and ending at `end`. `end` is relative to 0
     *
     * Similar to [`TypedArray.subarray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray). Does not copy the file, open the file, or modify the file.
     *
     * If `begin` > 0, {@link Bun.write()} will be slower on macOS
     *
     * @param begin - start offset in bytes
     * @param end - absolute offset in bytes (relative to 0)
     */
    slice(begin?: number, end?: number): FileBlob;
  }

  /**
   *   This lets you use macros as regular imports
   *   @example
   *   ```
   *   {
   *     "react-relay": {
   *       "graphql": "bun-macro-relay/bun-macro-relay.tsx"
   *     }
   *   }
   *  ```
   */
  export type MacroMap = Record<string, Record<string, string>>;

  /**
   * Hash a string or array buffer using Wyhash
   *
   * This is not a cryptographic hash function.
   * @param data The data to hash.
   * @param seed The seed to use.
   */
  export const hash: ((
    data: string | ArrayBufferView | ArrayBuffer,
    seed?: number
  ) => number | bigint) &
    Hash;

  interface Hash {
    wyhash: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    crc32: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    adler32: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    cityHash32: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    cityHash64: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    murmur32v3: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
    murmur64v2: (
      data: string | ArrayBufferView | ArrayBuffer,
      seed?: number
    ) => number | bigint;
  }

  export type Platform =
    /**
     * When building for bun.js
     */
    | "bun"
    /**
     * When building for the web
     */
    | "browser"
    /**
     * When building for node.js
     */
    | "node"
    | "neutral";

  export type JavaScriptLoader = "jsx" | "js" | "ts" | "tsx";

  export interface TranspilerOptions {
    /**
     * Replace key with value. Value must be a JSON string.
     * @example
     *  ```
     *  { "process.env.NODE_ENV": "\"production\"" }
     * ```
     */
    define?: Record<string, string>;

    /** What is the default loader used for this transpiler?  */
    loader?: JavaScriptLoader;

    /**  What platform are we targeting? This may affect how import and/or require is used */
    /**  @example "browser" */
    platform?: Platform;

    /**
     *  TSConfig.json file as stringified JSON or an object
     *  Use this to set a custom JSX factory, fragment, or import source
     *  For example, if you want to use Preact instead of React. Or if you want to use Emotion.
     */
    tsconfig?: string;

    /**
     *    Replace an import statement with a macro.
     *
     *    This will remove the import statement from the final output
     *    and replace any function calls or template strings with the result returned by the macro
     *
     *    @example
     *    ```json
     *    {
     *        "react-relay": {
     *            "graphql": "bun-macro-relay"
     *        }
     *    }
     *    ```
     *
     *    Code that calls `graphql` will be replaced with the result of the macro.
     *
     *    ```js
     *    import {graphql} from "react-relay";
     *
     *    // Input:
     *    const query = graphql`
     *        query {
     *            ... on User {
     *                id
     *            }
     *        }
     *    }`;
     *    ```
     *
     *    Will be replaced with:
     *
     *    ```js
     *    import UserQuery from "./UserQuery.graphql";
     *    const query = UserQuery;
     *    ```
     */
    macros?: MacroMap;

    autoImportJSX?: boolean;
    allowBunRuntime?: boolean;
    exports?: {
      eliminate?: string[];
      replace?: Record<string, string>;
    };
    treeShaking?: boolean;
    trimUnusedImports?: boolean;
    jsxOptimizationInline?: boolean;
  }

  /**
   * Quickly transpile TypeScript, JSX, or JS to modern JavaScript.
   *
   * @example
   * ```js
   * const transpiler = new Bun.Transpiler();
   * transpiler.transformSync(`
   *   const App = () => <div>Hello World</div>;
   *export default App;
   * `);
   * // This outputs:
   * const output = `
   * const App = () => jsx("div", {
   *   children: "Hello World"
   * }, undefined, false, undefined, this);
   *export default App;
   * `
   * ```
   *
   */
  export class Transpiler {
    constructor(options: TranspilerOptions);

    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     */
    transform(code: StringOrBuffer, loader?: JavaScriptLoader): Promise<string>;
    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     *
     */
    transformSync(
      code: StringOrBuffer,
      loader: JavaScriptLoader,
      ctx: object
    ): string;
    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     * @param ctx An object to pass to macros
     *
     */
    transformSync(code: StringOrBuffer, ctx: object): string;

    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     *
     */
    transformSync(code: StringOrBuffer, loader: JavaScriptLoader): string;

    /**
     * Get a list of import paths and paths from a TypeScript, JSX, TSX, or JavaScript file.
     * @param code The code to scan
     * @example
     * ```js
     * const {imports, exports} = transpiler.scan(`
     * import {foo} from "baz";
     * const hello = "hi!";
     * `);
     *
     * console.log(imports); // ["baz"]
     * console.log(exports); // ["hello"]
     * ```
     */
    scan(code: StringOrBuffer): { exports: string[]; imports: Import[] };

    /**
     *  Get a list of import paths from a TypeScript, JSX, TSX, or JavaScript file.
     * @param code The code to scan
     * @example
     * ```js
     * const imports = transpiler.scanImports(`
     * import {foo} from "baz";
     * import type {FooType} from "bar";
     * import type {DogeType} from "wolf";
     * `);
     *
     * console.log(imports); // ["baz"]
     * ```
     * This is a fast path which performs less work than `scan`.
     */
    scanImports(code: StringOrBuffer): Import[];
  }

  export interface Import {
    path: string;

    kind:
      | "import-statement"
      | "require-call"
      | "require-resolve"
      | "dynamic-import"
      | "import-rule"
      | "url-token"
      | "internal"
      | "entry-point";
  }

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

  export interface Errorlike extends Error {
    code?: string;
    errno?: number;
    syscall?: string;
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

  export type SSLServeOptions = ServeOptions &
    SSLOptions &
    SSLAdvancedOptions & {
      /**
       *  The keys are [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication) hostnames.
       *  The values are SSL options objects.
       */
      serverNames: Record<string, SSLOptions & SSLAdvancedOptions>;
    };

  /**
   * HTTP & HTTPS Server
   *
   * To start the server, see {@link serve}
   *
   * Often, you don't need to interact with this object directly. It exists to help you with the following tasks:
   * - Stop the server
   * - How many requests are currently being handled?
   *
   * For performance, Bun pre-allocates most of the data for 2048 concurrent requests.
   * That means starting a new server allocates about 500 KB of memory. Try to
   * avoid starting and stopping the server often (unless it's a new instance of bun).
   *
   * Powered by a fork of [uWebSockets](https://github.com/uNetworking/uWebSockets). Thank you @alexhultman.
   *
   */
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

  export type Serve = SSLServeOptions | ServeOptions;

  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   * - `type` is auto-set based on the file extension when possible
   *
   * @example
   * ```js
   * const file = Bun.file("./hello.json");
   * console.log(file.type); // "application/json"
   * console.log(await file.json()); // { hello: "world" }
   * ```
   *
   * @example
   * ```js
   * await Bun.write(
   *   Bun.file("./hello.txt"),
   *   "Hello, world!"
   * );
   * ```
   * @param path The path to the file (lazily loaded)
   *
   */
  // tslint:disable-next-line:unified-signatures
  export function file(path: string, options?: BlobPropertyBag): FileBlob;

  /**
   * `Blob` that leverages the fastest system calls available to operate on files.
   *
   * This Blob is lazy. It won't do any work until you read from it. Errors propagate as promise rejections.
   *
   * `Blob.size` will not be valid until the contents of the file are read at least once.
   * `Blob.type` will have a default set based on the file extension
   *
   * @example
   * ```js
   * const file = Bun.file(new TextEncoder.encode("./hello.json"));
   * console.log(file.type); // "application/json"
   * ```
   *
   * @param path The path to the file as a byte buffer (the buffer is copied)
   */
  // tslint:disable-next-line:unified-signatures
  export function file(
    path: ArrayBufferLike | Uint8Array,
    options?: BlobPropertyBag
  ): FileBlob;

  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   *
   * @example
   * ```js
   * const file = Bun.file(fd);
   * ```
   *
   * @param fileDescriptor The file descriptor of the file
   */
  // tslint:disable-next-line:unified-signatures
  export function file(
    fileDescriptor: number,
    options?: BlobPropertyBag
  ): FileBlob;

  /**
   * Allocate a new [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) without zeroing the bytes.
   *
   * This can be 3.5x faster than `new Uint8Array(size)`, but if you send uninitialized memory to your users (even unintentionally), it can potentially leak anything recently in memory.
   */
  export function allocUnsafe(size: number): Uint8Array;

  /**
   * Pretty-print an object the same as {@link console.log} to a `string`
   *
   * Supports JSX
   *
   * @param args
   */
  export function inspect(...args: any): string;

  interface MMapOptions {
    /**
     * Sets MAP_SYNC flag on Linux. Ignored on macOS due to lack of support.
     */
    sync?: boolean;
    /**
     * Allow other processes to see results instantly?
     * This enables MAP_SHARED. If false, it enables MAP_PRIVATE.
     * @default true
     */
    shared?: boolean;
  }
  /**
   * Open a file as a live-updating `Uint8Array` without copying memory
   * - Writing to the array writes to the file.
   * - Reading from the array reads from the file.
   *
   * This uses the [`mmap()`](https://man7.org/linux/man-pages/man2/mmap.2.html) syscall under the hood.
   *
   * ---
   *
   * This API inherently has some rough edges:
   * - It does not support empty files. It will throw a `SystemError` with `EINVAL`
   * - Usage on shared/networked filesystems is discouraged. It will be very slow.
   * - If you delete or truncate the file, that will crash bun. This is called a segmentation fault.
   *
   * ---
   *
   * To close the file, set the array to `null` and it will be garbage collected eventually.
   *
   */
  export function mmap(path: PathLike, opts?: MMapOptions): Uint8Array;

  /** Write to stdout */
  const stdout: FileBlob;
  /** Write to stderr */
  const stderr: FileBlob;
  /**
   * Read from stdin
   *
   * This is read-only
   */
  const stdin: FileBlob;

  interface unsafe {
    /**
     * Cast bytes to a `String` without copying. This is the fastest way to get a `String` from a `Uint8Array` or `ArrayBuffer`.
     *
     * **Only use this for ASCII strings**. If there are non-ascii characters, your application may crash and/or very confusing bugs will happen such as `"foo" !== "foo"`.
     *
     * **The input buffer must not be garbage collected**. That means you will need to hold on to it for the duration of the string's lifetime.
     *
     */
    arrayBufferToString(buffer: Uint8Array | ArrayBufferLike): string;

    /**
     * Cast bytes to a `String` without copying. This is the fastest way to get a `String` from a `Uint16Array`
     *
     * **The input must be a UTF-16 encoded string**. This API does no validation whatsoever.
     *
     * **The input buffer must not be garbage collected**. That means you will need to hold on to it for the duration of the string's lifetime.
     *
     */
    // tslint:disable-next-line:unified-signatures
    arrayBufferToString(buffer: Uint16Array): string;

    /** Mock bun's segfault handler. You probably don't want to use this */
    segfault(): void;
  }
  export const unsafe: unsafe;

  type DigestEncoding = "hex" | "base64";

  /**
   * Are ANSI colors enabled for stdin and stdout?
   *
   * Used for {@link console.log}
   */
  export const enableANSIColors: boolean;

  /**
   * What script launched bun?
   *
   * Absolute file path
   *
   * @example "/never-gonna-give-you-up.js"
   */
  export const main: string;

  /**
   * Manually trigger the garbage collector
   *
   * This does two things:
   * 1. It tells JavaScriptCore to run the garbage collector
   * 2. It tells [mimalloc](https://github.com/microsoft/mimalloc) to clean up fragmented memory. Mimalloc manages the heap not used in JavaScriptCore.
   *
   * @param force Synchronously run the garbage collector
   */
  export function gc(force: boolean): void;

  /**
   * JavaScriptCore engine's internal heap snapshot
   *
   * I don't know how to make this something Chrome or Safari can read.
   *
   * If you have any ideas, please file an issue https://github.com/Jarred-Sumner/bun
   */
  interface HeapSnapshot {
    /** "2" */
    version: string;

    /** "Inspector" */
    type: string;

    nodes: number[];

    nodeClassNames: string[];
    edges: number[];
    edgeTypes: string[];
    edgeNames: string[];
  }

  /**
   * Nanoseconds since Bun.js was started as an integer.
   *
   * This uses a high-resolution monotonic system timer.
   *
   * After 14 weeks of consecutive uptime, this function
   * wraps
   */
  export function nanoseconds(): number;

  /**
   * Generate a heap snapshot for seeing where the heap is being used
   */
  export function generateHeapSnapshot(): HeapSnapshot;

  /**
   * The next time JavaScriptCore is idle, clear unused memory and attempt to reduce the heap size.
   */
  export function shrink(): void;

  /**
   * Open a file in your local editor. Auto-detects via `$VISUAL` || `$EDITOR`
   *
   * @param path path to open
   */
  export function openInEditor(path: string, options?: EditorOptions): void;

  interface EditorOptions {
    editor?: "vscode" | "subl";
    line?: number;
    column?: number;
  }

  /**
   * This class only exists in types
   */
  abstract class CryptoHashInterface<T> {
    /**
     * Update the hash with data
     *
     * @param data
     */
    update(data: StringOrBuffer): T;

    /**
     * Finalize the hash
     *
     * @param encoding `DigestEncoding` to return the hash in. If none is provided, it will return a `Uint8Array`.
     */
    digest(encoding: DigestEncoding): string;

    /**
     * Finalize the hash
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    digest(hashInto?: TypedArray): TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    static hash(input: StringOrBuffer, hashInto?: TypedArray): TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param encoding `DigestEncoding` to return the hash in
     */
    static hash(input: StringOrBuffer, encoding: DigestEncoding): string;
  }

  /**
   *
   * Hash `input` using [SHA-2 512/256](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions)
   *
   * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` will be faster
   * @param hashInto optional `Uint8Array` to write the hash to. 32 bytes minimum.
   *
   * This hashing function balances speed with cryptographic strength. This does not encrypt or decrypt data.
   *
   * The implementation uses [BoringSSL](https://boringssl.googlesource.com/boringssl) (used in Chromium & Go)
   *
   * The equivalent `openssl` command is:
   *
   * ```bash
   * # You will need OpenSSL 3 or later
   * openssl sha512-256 /path/to/file
   *```
   */
  export function sha(input: StringOrBuffer, hashInto?: Uint8Array): Uint8Array;

  /**
   *
   * Hash `input` using [SHA-2 512/256](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions)
   *
   * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` will be faster
   * @param encoding `DigestEncoding` to return the hash in
   *
   * This hashing function balances speed with cryptographic strength. This does not encrypt or decrypt data.
   *
   * The implementation uses [BoringSSL](https://boringssl.googlesource.com/boringssl) (used in Chromium & Go)
   *
   * The equivalent `openssl` command is:
   *
   * ```bash
   * # You will need OpenSSL 3 or later
   * openssl sha512-256 /path/to/file
   *```
   */
  export function sha(input: StringOrBuffer, encoding: DigestEncoding): string;

  /**
   * This is not the default because it's not cryptographically secure and it's slower than {@link SHA512}
   *
   * Consider using the ugly-named {@link SHA512_256} instead
   */
  export class SHA1 extends CryptoHashInterface<SHA1> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 20;
  }
  export class MD5 extends CryptoHashInterface<MD5> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 16;
  }
  export class MD4 extends CryptoHashInterface<MD4> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 16;
  }
  export class SHA224 extends CryptoHashInterface<SHA224> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 28;
  }
  export class SHA512 extends CryptoHashInterface<SHA512> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 64;
  }
  export class SHA384 extends CryptoHashInterface<SHA384> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 48;
  }
  export class SHA256 extends CryptoHashInterface<SHA256> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 32;
  }
  /**
   * See also {@link sha}
   */
  export class SHA512_256 extends CryptoHashInterface<SHA512_256> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 32;
  }
}

type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;
type TimeLike = string | number | Date;
type StringOrBuffer = string | TypedArray | ArrayBufferLike;
type PathLike = string | TypedArray | ArrayBufferLike;
type PathOrFileDescriptor = PathLike | number;
type NoParamCallback = VoidFunction;


interface BufferEncodingOption {
  encoding?: BufferEncoding;
}

declare var Bun: typeof import("bun");


// ./ffi.d.ts

/**
 * `bun:ffi` lets you efficiently call C functions & FFI functions from JavaScript
 *  without writing bindings yourself.
 *
 * ```js
 * import {dlopen, CString, ptr} from 'bun:ffi';
 *
 * const lib = dlopen('libsqlite3', {
 * });
 * ```
 *
 * This is powered by just-in-time compiling C wrappers
 * that convert JavaScript types to C types and back. Internally,
 * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
 * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
 *
 */
declare module "bun:ffi" {
  export enum FFIType {
    char = 0,
    /**
     * 8-bit signed integer
     *
     * Must be a value between -127 and 127
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * signed char
     * char // on x64 & aarch64 macOS
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    int8_t = 1,
    /**
     * 8-bit signed integer
     *
     * Must be a value between -127 and 127
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * signed char
     * char // on x64 & aarch64 macOS
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    i8 = 1,

    /**
     * 8-bit unsigned integer
     *
     * Must be a value between 0 and 255
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * unsigned char
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    uint8_t = 2,
    /**
     * 8-bit unsigned integer
     *
     * Must be a value between 0 and 255
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * unsigned char
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    u8 = 2,

    /**
     * 16-bit signed integer
     *
     * Must be a value between -32768 and 32767
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * in16_t
     * short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    int16_t = 3,
    /**
     * 16-bit signed integer
     *
     * Must be a value between -32768 and 32767
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * in16_t
     * short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    i16 = 3,

    /**
     * 16-bit unsigned integer
     *
     * Must be a value between 0 and 65535, inclusive.
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * uint16_t
     * unsigned short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    uint16_t = 4,
    /**
     * 16-bit unsigned integer
     *
     * Must be a value between 0 and 65535, inclusive.
     *
     * When passing to a FFI function (C ABI), type coercsion is not performed.
     *
     * In C:
     * ```c
     * uint16_t
     * unsigned short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    u16 = 4,

    /**
     * 32-bit signed integer
     *
     */
    int32_t = 5,

    /**
     * 32-bit signed integer
     *
     * Alias of {@link FFIType.int32_t}
     */
    i32 = 5,
    /**
     * 32-bit signed integer
     *
     * The same as `int` in C
     *
     * ```c
     * int
     * ```
     */
    int = 5,

    /**
     * 32-bit unsigned integer
     *
     * The same as `unsigned int` in C (on x64 & arm64)
     *
     * C:
     * ```c
     * unsigned int
     * ```
     * JavaScript:
     * ```js
     * ptr(new Uint32Array(1))
     * ```
     */
    uint32_t = 6,
    /**
     * 32-bit unsigned integer
     *
     * Alias of {@link FFIType.uint32_t}
     */
    u32 = 6,

    /**
     * int64 is a 64-bit signed integer
     *
     * This is not implemented yet!
     */
    int64_t = 7,
    /**
     * i64 is a 64-bit signed integer
     *
     * This is not implemented yet!
     */
    i64 = 7,

    /**
     * 64-bit unsigned integer
     *
     * This is not implemented yet!
     */
    uint64_t = 8,
    /**
     * 64-bit unsigned integer
     *
     * This is not implemented yet!
     */
    u64 = 8,

    /**
     * Doubles are not supported yet!
     */
    double = 9,
    /**
     * Doubles are not supported yet!
     */
    f64 = 9,
    /**
     * Floats are not supported yet!
     */
    float = 10,
    /**
     * Floats are not supported yet!
     */
    f32 = 10,

    /**
     * Booelan value
     *
     * Must be `true` or `false`. `0` and `1` type coercion is not supported.
     *
     * In C, this corresponds to:
     * ```c
     * bool
     * _Bool
     * ```
     *
     *
     */
    bool = 11,

    /**
     * Pointer value
     *
     * See {@link Bun.FFI.ptr} for more information
     *
     * In C:
     * ```c
     * void*
     * ```
     *
     * In JavaScript:
     * ```js
     * ptr(new Uint8Array(1))
     * ```
     */
    ptr = 12,
    /**
     * Pointer value
     *
     * alias of {@link FFIType.ptr}
     */
    pointer = 12,

    /**
     * void value
     *
     * void arguments are not supported
     *
     * void return type is the default return type
     *
     * In C:
     * ```c
     * void
     * ```
     *
     */
    void = 13,

    /**
     * When used as a `returns`, this will automatically become a {@link CString}.
     *
     * When used in `args` it is equivalent to {@link FFIType.pointer}
     *
     */
    cstring = 14,

    /**
     * Attempt to coerce `BigInt` into a `Number` if it fits. This improves performance
     * but means you might get a `BigInt` or you might get a `number`.
     *
     * In C, this always becomes `int64_t`
     *
     * In JavaScript, this could be number or it could be BigInt, depending on what
     * value is passed in.
     *
     */
    i64_fast = 15,

    /**
     * Attempt to coerce `BigInt` into a `Number` if it fits. This improves performance
     * but means you might get a `BigInt` or you might get a `number`.
     *
     * In C, this always becomes `uint64_t`
     *
     * In JavaScript, this could be number or it could be BigInt, depending on what
     * value is passed in.
     *
     */
    u64_fast = 16,
  }
  export type FFITypeOrString =
    | FFIType
    | "char"
    | "int8_t"
    | "i8"
    | "uint8_t"
    | "u8"
    | "int16_t"
    | "i16"
    | "uint16_t"
    | "u16"
    | "int32_t"
    | "i32"
    | "int"
    | "uint32_t"
    | "u32"
    | "int64_t"
    | "i64"
    | "uint64_t"
    | "u64"
    | "double"
    | "f64"
    | "float"
    | "f32"
    | "bool"
    | "ptr"
    | "pointer"
    | "void"
    | "cstring";

  interface FFIFunction {
    /**
     * Arguments to a FFI function (C ABI)
     *
     * Defaults to an empty array, which means no arguments.
     *
     * To pass a pointer, use "ptr" or "pointer" as the type name. To get a pointer, see {@link ptr}.
     *
     * @example
     * From JavaScript:
     * ```js
     * const lib = dlopen('add', {
     *    // FFIType can be used or you can pass string labels.
     *    args: [FFIType.i32, "i32"],
     *    returns: "i32",
     * });
     * lib.symbols.add(1, 2)
     * ```
     * In C:
     * ```c
     * int add(int a, int b) {
     *   return a + b;
     * }
     * ```
     */
    args?: FFITypeOrString[];
    /**
     * Return type to a FFI function (C ABI)
     *
     * Defaults to {@link FFIType.void}
     *
     * To pass a pointer, use "ptr" or "pointer" as the type name. To get a pointer, see {@link ptr}.
     *
     * @example
     * From JavaScript:
     * ```js
     * const lib = dlopen('z', {
     *    version: {
     *      returns: "ptr",
     *   }
     * });
     * console.log(new CString(lib.symbols.version()));
     * ```
     * In C:
     * ```c
     * char* version()
     * {
     *  return "1.0.0";
     * }
     * ```
     */
    returns?: FFITypeOrString;

    /**
     * Function pointer to the native function
     *
     * If provided, instead of using dlsym() to lookup the function, Bun will use this instead.
     * This pointer should not be null (0).
     *
     * This is useful if the library has already been loaded
     * or if the module is also using Node-API.
     */
    ptr?: number | bigint;
  }

  type Symbols = Record<string, FFIFunction>;

  // /**
  //  * Compile a callback function
  //  *
  //  * Returns a function pointer
  //  *
  //  */
  // export function callback(ffi: FFIFunction, cb: Function): number;

  export interface Library {
    symbols: Record<
      string,
      CallableFunction & {
        /**
         * The function without a wrapper
         */
        native: CallableFunction;
      }
    >;

    /**
     * `dlclose` the library, unloading the symbols and freeing allocated memory.
     *
     * Once called, the library is no longer usable.
     *
     * Calling a function from a library that has been closed is undefined behavior.
     */
    close(): void;
  }

  /**
   * Open a library using `"bun:ffi"`
   *
   * @param name The name of the library or file path. This will be passed to `dlopen()`
   * @param symbols Map of symbols to load where the key is the symbol name and the value is the {@link FFIFunction}
   *
   * @example
   *
   * ```js
   * import {dlopen} from 'bun:ffi';
   *
   * const lib = dlopen("duckdb.dylib", {
   *   get_version: {
   *     returns: "cstring",
   *     args: [],
   *   },
   * });
   * lib.symbols.get_version();
   * // "1.0.0"
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   *
   */
  export function dlopen(name: string, symbols: Symbols): Library;

  /**
   * Turn a native library's function pointer into a JavaScript function
   *
   * Libraries using Node-API & bun:ffi in the same module could use this to skip an extra dlopen() step.
   *
   * @param fn {@link FFIFunction} declaration. `ptr` is required
   *
   * @example
   *
   * ```js
   * import {CFunction} from 'bun:ffi';
   *
   * const getVersion = new CFunction({
   *   returns: "cstring",
   *   args: [],
   *   ptr: myNativeLibraryGetVersion,
   * });
   * getVersion();
   * getVersion.close();
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   *
   */
  export function CFunction(
    fn: FFIFunction & { ptr: number | bigint }
  ): CallableFunction & {
    /**
     * Free the memory allocated by the wrapping function
     */
    close(): void;
  };

  /**
   * Link a map of symbols to JavaScript functions
   *
   * This lets you use native libraries that were already loaded somehow. You usually will want {@link dlopen} instead.
   *
   * You could use this with Node-API to skip loading a second time.
   *
   * @param symbols Map of symbols to load where the key is the symbol name and the value is the {@link FFIFunction}
   *
   * @example
   *
   * ```js
   * import { linkSymbols } from "bun:ffi";
   *
   * const [majorPtr, minorPtr, patchPtr] = getVersionPtrs();
   *
   * const lib = linkSymbols({
   *   // Unlike with dlopen(), the names here can be whatever you want
   *   getMajor: {
   *     returns: "cstring",
   *     args: [],
   *
   *     // Since this doesn't use dlsym(), you have to provide a valid ptr
   *     // That ptr could be a number or a bigint
   *     // An invalid pointer will crash your program.
   *     ptr: majorPtr,
   *   },
   *   getMinor: {
   *     returns: "cstring",
   *     args: [],
   *     ptr: minorPtr,
   *   },
   *   getPatch: {
   *     returns: "cstring",
   *     args: [],
   *     ptr: patchPtr,
   *   },
   * });
   *
   * const [major, minor, patch] = [
   *   lib.symbols.getMajor(),
   *   lib.symbols.getMinor(),
   *   lib.symbols.getPatch(),
   * ];
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   *
   */
  export function linkSymbols(symbols: Symbols): Library;

  /**
   * Read a pointer as a {@link Buffer}
   *
   * If `byteLength` is not provided, the pointer is assumed to be 0-terminated.
   *
   * @param ptr The memory address to read
   * @param byteOffset bytes to skip before reading
   * @param byteLength bytes to read
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   *
   */
  export function toBuffer(
    ptr: number,
    byteOffset?: number,
    byteLength?: number
  ): Buffer;

  /**
   * Read a pointer as an {@link ArrayBuffer}
   *
   * If `byteLength` is not provided, the pointer is assumed to be 0-terminated.
   *
   * @param ptr The memory address to read
   * @param byteOffset bytes to skip before reading
   * @param byteLength bytes to read
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   */
  export function toArrayBuffer(
    ptr: number,
    byteOffset?: number,
    byteLength?: number
  ): ArrayBuffer;

  /**
   * Get the pointer backing a {@link TypedArray} or {@link ArrayBuffer}
   *
   * Use this to pass {@link TypedArray} or {@link ArrayBuffer} to C functions.
   *
   * This is for use with FFI functions. For performance reasons, FFI will
   * not automatically convert typed arrays to C pointers.
   *
   * @param {TypedArray|ArrayBuffer|DataView} view the typed array or array buffer to get the pointer for
   * @param {number} byteOffset optional offset into the view in bytes
   *
   * @example
   *
   * From JavaScript:
   * ```js
   * const array = new Uint8Array(10);
   * const rawPtr = ptr(array);
   * myFFIFunction(rawPtr);
   * ```
   * To C:
   * ```c
   * void myFFIFunction(char* rawPtr) {
   *  // Do something with rawPtr
   * }
   * ```
   *
   */
  export function ptr(
    view: TypedArray | ArrayBufferLike | DataView,
    byteOffset?: number
  ): number;

  /**
   * Get a string from a UTF-8 encoded C string
   * If `byteLength` is not provided, the string is assumed to be null-terminated.
   *
   * @example
   * ```js
   * var ptr = lib.symbols.getVersion();
   * console.log(new CString(ptr));
   * ```
   *
   * @example
   * ```js
   * var ptr = lib.symbols.getVersion();
   * // print the first 4 characters
   * console.log(new CString(ptr, 0, 4));
   * ```
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   */

  export class CString extends String {
    /**
     * Get a string from a UTF-8 encoded C string
     * If `byteLength` is not provided, the string is assumed to be null-terminated.
     *
     * @param ptr The pointer to the C string
     * @param byteOffset bytes to skip before reading
     * @param byteLength bytes to read
     *
     *
     * @example
     * ```js
     * var ptr = lib.symbols.getVersion();
     * console.log(new CString(ptr));
     * ```
     *
     * @example
     * ```js
     * var ptr = lib.symbols.getVersion();
     * // print the first 4 characters
     * console.log(new CString(ptr, 0, 4));
     * ```
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    constructor(ptr: number, byteOffset?: number, byteLength?: number);

    /**
     * The ptr to the C string
     *
     * This `CString` instance is a clone of the string, so it
     * is safe to continue using this instance after the `ptr` has been
     * freed.
     */
    ptr: number;
    byteOffset?: number;
    byteLength?: number;

    /**
     * Get the {@link ptr} as an `ArrayBuffer`
     *
     * `null` or empty ptrs returns an `ArrayBuffer` with `byteLength` 0
     */
    get arrayBuffer(): ArrayBuffer;
  }

  /**
   * View the generated C code for FFI bindings
   *
   * You probably won't need this unless there's a bug in the FFI bindings
   * generator or you're just curious.
   */
  export function viewSource(symbols: Symbols, is_callback?: false): string[];
  export function viewSource(callback: FFIFunction, is_callback: true): string;

  /**
   * Platform-specific file extension name for dynamic libraries
   *
   * "." is not included
   *
   * @example
   * ```js
   * "dylib" // macOS
   * ```
   *
   * @example
   * ```js
   * "so" // linux
   * ```
   */
  export const suffix: string;
}


// ./sqlite.d.ts

/**
 * Fast SQLite3 driver for Bun.js
 * @since v0.0.83
 *
 * @example
 * ```ts
 * import { Database } from 'bun:sqlite';
 *
 * var db = new Database('app.db');
 * db.query('SELECT * FROM users WHERE name = ?').all('John');
 * // => [{ id: 1, name: 'John' }]
 * ```
 *
 * The following types can be used when binding parameters:
 *
 * | JavaScript type | SQLite type |
 * | -------------- | ----------- |
 * | `string` | `TEXT` |
 * | `number` | `INTEGER` or `DECIMAL` |
 * | `boolean` | `INTEGER` (1 or 0) |
 * | `Uint8Array` | `BLOB` |
 * | `Buffer` | `BLOB` |
 * | `bigint` | `INTEGER` |
 * | `null` | `NULL` |
 */
declare module "bun:sqlite" {
  export class Database {
    /**
     * Open or create a SQLite3 database
     *
     * @param filename The filename of the database to open. Pass an empty string (`""` or undefined) or `":memory:"` for an in-memory database.
     * @param options defaults to `{readwrite: true, create: true}`. If a number, then it's treated as `SQLITE_OPEN_*` constant flags.
     *
     * @example
     *
     * ```ts
     * const db = new Database("mydb.sqlite");
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", "baz");
     * console.log(db.query("SELECT * FROM foo").all());
     * ```
     *
     * @example
     *
     * Open an in-memory database
     *
     * ```ts
     * const db = new Database(":memory:");
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", "hiiiiii");
     * console.log(db.query("SELECT * FROM foo").all());
     * ```
     *
     * @example
     *
     * Open read-only
     *
     * ```ts
     * const db = new Database("mydb.sqlite", {readonly: true});
     * ```
     */
    constructor(
      filename?: string,
      options?:
        | number
        | {
            /**
             * Open the database as read-only (no write operations, no create).
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
             */
            readonly?: boolean;
            /**
             * Allow creating a new database
             *
             * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
             */
            create?: boolean;
            /**
             * Open the database as read-write
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
             */
            readwrite?: boolean;
          }
    );

    /**
     * This is an alias of `new Database()`
     *
     * See {@link Database}
     */
    static open(
      filename: string,
      options?:
        | number
        | {
            /**
             * Open the database as read-only (no write operations, no create).
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
             */
            readonly?: boolean;
            /**
             * Allow creating a new database
             *
             * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
             */
            create?: boolean;
            /**
             * Open the database as read-write
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
             */
            readwrite?: boolean;
          }
    ): Database;

    /**
     * Execute a SQL query **without returning any results**.
     *
     * This does not cache the query, so if you want to run a query multiple times, you should use {@link prepare} instead.
     *
     * @example
     * ```ts
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", "baz");
     * ```
     *
     * Useful for queries like:
     * - `CREATE TABLE`
     * - `INSERT INTO`
     * - `UPDATE`
     * - `DELETE FROM`
     * - `DROP TABLE`
     * - `PRAGMA`
     * - `ATTACH DATABASE`
     * - `DETACH DATABASE`
     * - `REINDEX`
     * - `VACUUM`
     * - `EXPLAIN ANALYZE`
     * - `CREATE INDEX`
     * - `CREATE TRIGGER`
     * - `CREATE VIEW`
     * - `CREATE VIRTUAL TABLE`
     * - `CREATE TEMPORARY TABLE`
     *
     * @param sql The SQL query to run
     *
     * @param bindings Optional bindings for the query
     *
     * @returns `Database` instance
     *
     * Under the hood, this calls `sqlite3_prepare_v3` followed by `sqlite3_step` and `sqlite3_finalize`.
     *
     *  * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type |
     * | -------------- | ----------- |
     * | `string` | `TEXT` |
     * | `number` | `INTEGER` or `DECIMAL` |
     * | `boolean` | `INTEGER` (1 or 0) |
     * | `Uint8Array` | `BLOB` |
     * | `Buffer` | `BLOB` |
     * | `bigint` | `INTEGER` |
     * | `null` | `NULL` |
     */
    run<ParamsType = SQLQueryBindings>(
      sqlQuery: string,
      ...bindings: ParamsType[]
    ): void;
    /**
        This is an alias of {@link Database.prototype.run}
     */
    exec<ParamsType = SQLQueryBindings>(
      sqlQuery: string,
      ...bindings: ParamsType[]
    ): void;

    /**
     * Compile a SQL query and return a {@link Statement} object. This is the
     * same as {@link prepare} except that it caches the compiled query.
     *
     * This **does not execute** the query, but instead prepares it for later
     * execution and caches the compiled query if possible.
     *
     * @example
     * ```ts
     * // compile the query
     * const stmt = db.query("SELECT * FROM foo WHERE bar = ?");
     * // run the query
     * stmt.all("baz");
     *
     * // run the query again
     * stmt.all();
     * ```
     *
     * @param sql The SQL query to compile
     *
     * @returns `Statment` instance
     *
     * Under the hood, this calls `sqlite3_prepare_v3`.
     *
     */
    query<ParamsType = SQLQueryBindings, ReturnType = any>(
      sqlQuery: string
    ): Statement<ParamsType, ReturnType>;

    /**
     * Compile a SQL query and return a {@link Statement} object.
     *
     * This does not cache the compiled query and does not execute the query.
     *
     * @example
     * ```ts
     * // compile the query
     * const stmt = db.query("SELECT * FROM foo WHERE bar = ?");
     * // run the query
     * stmt.all("baz");
     * ```
     *
     * @param sql The SQL query to compile
     * @param params Optional bindings for the query
     *
     * @returns `Statment` instance
     *
     * Under the hood, this calls `sqlite3_prepare_v3`.
     *
     */
    prepare<ParamsType = SQLQueryBindings, ReturnType = any>(
      sql: string,
      ...params: ParamsType[]
    ): Statement<ParamsType, ReturnType>;

    /**
     * Is the database in a transaction?
     *
     * @returns `true` if the database is in a transaction, `false` otherwise
     *
     * @example
     * ```ts
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", "baz");
     * db.run("BEGIN");
     * db.run("INSERT INTO foo VALUES (?)", "qux");
     * console.log(db.inTransaction());
     * ```
     */
    get inTransaction(): boolean;

    /**
     * Close the database connection.
     *
     * It is safe to call this method multiple times. If the database is already
     * closed, this is a no-op. Running queries after the database has been
     * closed will throw an error.
     *
     * @example
     * ```ts
     * db.close();
     * ```
     * This is called automatically when the database instance is garbage collected.
     *
     * Internally, this calls `sqlite3_close_v2`.
     */
    close(): void;

    /**
     * The filename passed when `new Database()` was called
     * @example
     * ```ts
     * const db = new Database("mydb.sqlite");
     * console.log(db.filename);
     * // => "mydb.sqlite"
     * ```
     */
    readonly filename: string;

    /**
     * The underlying `sqlite3` database handle
     *
     * In native code, this is not a file descriptor, but an index into an array of database handles
     */
    readonly handle: number;

    /**
     * Load a SQLite3 extension
     *
     * macOS requires a custom SQLite3 library to be linked because the Apple build of SQLite for macOS disables loading extensions. See {@link Database.setCustomSQLite}
     *
     * Bun chooses the Apple build of SQLite on macOS because it brings a ~50% performance improvement.
     *
     * @param extension name/path of the extension to load
     * @param entryPoint optional entry point of the extension
     */
    loadExtension(extension: string, entryPoint?: string): void;

    /**
     * Change the dynamic library path to SQLite
     *
     * @note macOS-only
     *
     * This only works before SQLite is loaded, so
     * that's before you call `new Database()`.
     *
     * It can only be run once because this will load
     * the SQLite library into the process.
     *
     * @param path The path to the SQLite library
     *
     */
    static setCustomSQLite(path: string): boolean;

    /**
     * Creates a function that always runs inside a transaction. When the
     * function is invoked, it will begin a new transaction. When the function
     * returns, the transaction will be committed. If an exception is thrown,
     * the transaction will be rolled back (and the exception will propagate as
     * usual).
     *
     * @param insideTransaction The callback which runs inside a transaction
     *
     * @example
     * ```ts
     * // setup
     * import { Database } from "bun:sqlite";
     * const db = Database.open(":memory:");
     * db.exec(
     *   "CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, age INTEGER)"
     * );
     *
     * const insert = db.prepare("INSERT INTO cats (name, age) VALUES ($name, $age)");
     * const insertMany = db.transaction((cats) => {
     *   for (const cat of cats) insert.run(cat);
     * });
     *
     * insertMany([
     *   { $name: "Joey", $age: 2 },
     *   { $name: "Sally", $age: 4 },
     *   { $name: "Junior", $age: 1 },
     * ]);
     * ```
     */
    transaction(insideTransaction: (...args: any) => void): CallableFunction & {
      /**
       * uses "BEGIN DEFERRED"
       */
      deferred: (...args: any) => void;
      /**
       * uses "BEGIN IMMEDIATE"
       */
      immediate: (...args: any) => void;
      /**
       * uses "BEGIN EXCLUSIVE"
       */
      exclusive: (...args: any) => void;
    };
  }

  /**
   * A prepared statement.
   *
   * This is returned by {@link Database.prepare} and {@link Database.query}.
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.all("baz");
   * // => [{bar: "baz"}]
   * ```
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.get("baz");
   * // => {bar: "baz"}
   * ```
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.run("baz");
   * // => undefined
   * ```
   */
  export class Statement<ParamsType = SQLQueryBindings, ReturnType = any> {
    /**
     * Creates a new prepared statement from native code.
     *
     * This is used internally by the {@link Database} class. Probably you don't need to call this yourself.
     */
    constructor(nativeHandle: any);

    /**
     * Execute the prepared statement and return all results as objects.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.all("baz");
     * // => [{bar: "baz"}]
     *
     * stmt.all();
     * // => [{bar: "baz"}]
     *
     * stmt.all("foo");
     * // => [{bar: "foo"}]
     * ```
     */
    all(...params: ParamsType[]): ReturnType[];

    /**
     * Execute the prepared statement and return **the first** result.
     *
     * If no result is returned, this returns `null`.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.all("baz");
     * // => [{bar: "baz"}]
     *
     * stmt.all();
     * // => [{bar: "baz"}]
     *
     * stmt.all("foo");
     * // => [{bar: "foo"}]
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type |
     * | -------------- | ----------- |
     * | `string` | `TEXT` |
     * | `number` | `INTEGER` or `DECIMAL` |
     * | `boolean` | `INTEGER` (1 or 0) |
     * | `Uint8Array` | `BLOB` |
     * | `Buffer` | `BLOB` |
     * | `bigint` | `INTEGER` |
     * | `null` | `NULL` |
     *
     */
    get(...params: ParamsType[]): ReturnType | null;

    /**
     * Execute the prepared statement. This returns `undefined`.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("UPDATE foo SET bar = ?");
     * stmt.run("baz");
     * // => undefined
     *
     * stmt.run();
     * // => undefined
     *
     * stmt.run("foo");
     * // => undefined
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type |
     * | -------------- | ----------- |
     * | `string` | `TEXT` |
     * | `number` | `INTEGER` or `DECIMAL` |
     * | `boolean` | `INTEGER` (1 or 0) |
     * | `Uint8Array` | `BLOB` |
     * | `Buffer` | `BLOB` |
     * | `bigint` | `INTEGER` |
     * | `null` | `NULL` |
     *
     */
    run(...params: ParamsType[]): void;

    /**
     * Execute the prepared statement and return the results as an array of arrays.
     *
     * This is a little faster than {@link all}.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.values("baz");
     * // => [['baz']]
     *
     * stmt.values();
     * // => [['baz']]
     *
     * stmt.values("foo");
     * // => [['foo']]
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type |
     * | -------------- | ----------- |
     * | `string` | `TEXT` |
     * | `number` | `INTEGER` or `DECIMAL` |
     * | `boolean` | `INTEGER` (1 or 0) |
     * | `Uint8Array` | `BLOB` |
     * | `Buffer` | `BLOB` |
     * | `bigint` | `INTEGER` |
     * | `null` | `NULL` |
     *
     */
    values(
      ...params: ParamsType[]
    ): Array<Array<string | bigint | number | boolean | Uint8Array>>;

    /**
     * The names of the columns returned by the prepared statement.
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT bar FROM foo WHERE bar = ?");
     *
     * console.log(stmt.columnNames);
     * // => ["bar"]
     * ```
     */
    readonly columnNames: string[];

    /**
     * The number of parameters expected in the prepared statement.
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     * console.log(stmt.paramsCount);
     * // => 1
     * ```
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ? AND baz = ?");
     * console.log(stmt.paramsCount);
     * // => 2
     * ```
     *
     */
    readonly paramsCount: number;

    /**
     * Finalize the prepared statement, freeing the resources used by the
     * statement and preventing it from being executed again.
     *
     * This is called automatically when the prepared statement is garbage collected.
     *
     * It is safe to call this multiple times. Calling this on a finalized
     * statement has no effect.
     *
     * Internally, this calls `sqlite3_finalize`.
     */
    finalize(): void;

    /**
     * Return the expanded SQL string for the prepared statement.
     *
     * Internally, this calls `sqlite3_expanded_sql()` on the underlying `sqlite3_stmt`.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?", "baz");
     * console.log(stmt.toString());
     * // => "SELECT * FROM foo WHERE bar = 'baz'"
     * console.log(stmt);
     * // => "SELECT * FROM foo WHERE bar = 'baz'"
     * ```
     */
    toString(): string;

    /**
     * Native object representing the underlying `sqlite3_stmt`
     *
     * This is left untyped because the ABI of the native bindings may change at any time.
     */
    readonly native: any;
  }

  /**
   * Constants from `sqlite3.h`
   *
   * This list isn't exhaustive, but some of the ones which are relevant
   */
  export const constants: {
    /**
     * Open the database as read-only (no write operations, no create).
     * @value 0x00000001
     */
    SQLITE_OPEN_READONLY: number;
    /**
     * Open the database for reading and writing
     * @value 0x00000002
     */
    SQLITE_OPEN_READWRITE: number;
    /**
     * Allow creating a new database
     * @value 0x00000004
     */
    SQLITE_OPEN_CREATE: number;
    /**
     *
     * @value 0x00000008
     */
    SQLITE_OPEN_DELETEONCLOSE: number;
    /**
     *
     * @value 0x00000010
     */
    SQLITE_OPEN_EXCLUSIVE: number;
    /**
     *
     * @value 0x00000020
     */
    SQLITE_OPEN_AUTOPROXY: number;
    /**
     *
     * @value 0x00000040
     */
    SQLITE_OPEN_URI: number;
    /**
     *
     * @value 0x00000080
     */
    SQLITE_OPEN_MEMORY: number;
    /**
     *
     * @value 0x00000100
     */
    SQLITE_OPEN_MAIN_DB: number;
    /**
     *
     * @value 0x00000200
     */
    SQLITE_OPEN_TEMP_DB: number;
    /**
     *
     * @value 0x00000400
     */
    SQLITE_OPEN_TRANSIENT_DB: number;
    /**
     *
     * @value 0x00000800
     */
    SQLITE_OPEN_MAIN_JOURNAL: number;
    /**
     *
     * @value 0x00001000
     */
    SQLITE_OPEN_TEMP_JOURNAL: number;
    /**
     *
     * @value 0x00002000
     */
    SQLITE_OPEN_SUBJOURNAL: number;
    /**
     *
     * @value 0x00004000
     */
    SQLITE_OPEN_SUPER_JOURNAL: number;
    /**
     *
     * @value 0x00008000
     */
    SQLITE_OPEN_NOMUTEX: number;
    /**
     *
     * @value 0x00010000
     */
    SQLITE_OPEN_FULLMUTEX: number;
    /**
     *
     * @value 0x00020000
     */
    SQLITE_OPEN_SHAREDCACHE: number;
    /**
     *
     * @value 0x00040000
     */
    SQLITE_OPEN_PRIVATECACHE: number;
    /**
     *
     * @value 0x00080000
     */
    SQLITE_OPEN_WAL: number;
    /**
     *
     * @value 0x01000000
     */
    SQLITE_OPEN_NOFOLLOW: number;
    /**
     *
     * @value 0x02000000
     */
    SQLITE_OPEN_EXRESCODE: number;
    /**
     *
     * @value 0x01
     */
    SQLITE_PREPARE_PERSISTENT: number;
    /**
     *
     * @value 0x02
     */
    SQLITE_PREPARE_NORMALIZE: number;
    /**
     *
     * @value 0x04
     */
    SQLITE_PREPARE_NO_VTAB: number;
  };

  /**
   * The native module implementing the sqlite3 C bindings
   *
   * It is lazily-initialized, so this will return `undefined` until the first
   * call to new Database().
   *
   * The native module makes no gurantees about ABI stability, so it is left
   * untyped
   *
   * If you need to use it directly for some reason, please let us know because
   * that probably points to a deficiency in this API.
   *
   */
  export var native: any;

  export type SQLQueryBindings =
    | string
    | bigint
    | TypedArray
    | number
    | boolean
    | null
    | Record<string, string | bigint | TypedArray | number | boolean | null>;

  export default Database;
}


// ./html-rewriter.d.ts

declare namespace HTMLRewriterTypes {
  interface HTMLRewriterElementContentHandlers {
    element?(element: Element): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
  }

  interface HTMLRewriterDocumentContentHandlers {
    doctype?(doctype: Doctype): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
    end?(end: DocumentEnd): void | Promise<void>;
  }

  interface Text {
    readonly text: string;
    readonly lastInTextNode: boolean;
    readonly removed: boolean;
    before(content: Content, options?: ContentOptions): Text;
    after(content: Content, options?: ContentOptions): Text;
    replace(content: Content, options?: ContentOptions): Text;
    remove(): Text;
  }

  interface Doctype {
    readonly name: string | null;
    readonly publicId: string | null;
    readonly systemId: string | null;
  }

  interface DocumentEnd {
    append(content: Content, options?: ContentOptions): DocumentEnd;
  }

  interface ContentOptions {
    html?: boolean;
  }
  type Content = string;

  interface Comment {
    text: string;
    readonly removed: boolean;
    before(content: Content, options?: ContentOptions): Comment;
    after(content: Content, options?: ContentOptions): Comment;
    replace(content: Content, options?: ContentOptions): Comment;
    remove(): Comment;
  }

  interface Element {
    tagName: string;
    readonly attributes: IterableIterator<string[]>;
    readonly removed: boolean;
    readonly namespaceURI: string;
    getAttribute(name: string): string | null;
    hasAttribute(name: string): boolean;
    setAttribute(name: string, value: string): Element;
    removeAttribute(name: string): Element;
    before(content: Content, options?: ContentOptions): Element;
    after(content: Content, options?: ContentOptions): Element;
    prepend(content: Content, options?: ContentOptions): Element;
    append(content: Content, options?: ContentOptions): Element;
    replace(content: Content, options?: ContentOptions): Element;
    remove(): Element;
    removeAndKeepContent(): Element;
    setInnerContent(content: Content, options?: ContentOptions): Element;
    onEndTag(handler: (tag: EndTag) => void | Promise<void>): void;
  }

  interface EndTag {
    name: string;
    before(content: Content, options?: ContentOptions): EndTag;
    after(content: Content, options?: ContentOptions): EndTag;
    remove(): EndTag;
  }
}

/**
 * [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter?bun) is a fast API for transforming HTML.
 *
 * Bun leverages a native implementation powered by [lol-html](https://github.com/cloudflare/lol-html).
 *
 * HTMLRewriter can be used to transform HTML in a variety of ways, including:
 * * Rewriting URLs
 * * Adding meta tags
 * * Removing elements
 * * Adding elements to the head
 *
 * @example
 * ```ts
 * const rewriter = new HTMLRewriter().on('a[href]', {
 *   element(element: Element) {
 *     // Rewrite all the URLs to this youtube video
 *     element.setAttribute('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 *   }
 * });
 * rewriter.transform(await fetch("https://remix.run"));
 * ```
 */
declare class HTMLRewriter {
  constructor();
  on(
    selector: string,
    handlers: HTMLRewriterTypes.HTMLRewriterElementContentHandlers
  ): HTMLRewriter;
  onDocument(
    handlers: HTMLRewriterTypes.HTMLRewriterDocumentContentHandlers
  ): HTMLRewriter;
  /**
   * @param input - The HTML to transform
   * @returns A new {@link Response} with the transformed HTML
   */
  transform(input: Response): Response;
}


// ./globals.d.ts

type Encoding = "utf-8" | "windows-1252" | "utf-16";


interface ImportMeta {
  /**
   * `file://` url string for the current module.
   *
   * @example
   * ```ts
   * console.log(import.meta.url);
   * "file:///Users/me/projects/my-app/src/my-app.ts"
   * ```
   */
  url: string;
  /**
   * Absolute path to the source file
   */
  path: string;
  /**
   * Absolute path to the directory containing the source file.
   *
   * Does not have a trailing slash
   */
  dir: string;
  /**
   * Filename of the source file
   */
  file: string;
  /**
   * Resolve a module ID the same as if you imported it
   *
   * On failure, throws a `ResolveError`
   */
  resolve(moduleId: string): Promise<string>;
  /**
   * Resolve a `moduleId` as though it were imported from `parent`
   *
   * On failure, throws a `ResolveError`
   */
  // tslint:disable-next-line:unified-signatures
  resolve(moduleId: string, parent: string): Promise<string>;
}

interface EncodeIntoResult {
  /**
   * The read Unicode code units of input.
   */
  read: number;
  /**
   * The written UTF-8 bytes of output.
   */
  written: number;
}

interface Process {
  /**
   * The current version of Bun
   */
  version: string;
  /**
   * Run a function on the next tick of the event loop
   *
   * This is the same as {@link queueMicrotask}
   *
   * @param callback - The function to run
   */
  nextTick(callback: (...args: any) => any, ...args: any): void;
  versions: Record<string, string>;
  ppid: number;
  pid: number;
  arch:
    | "arm64"
    | "arm"
    | "ia32"
    | "mips"
    | "mipsel"
    | "ppc"
    | "ppc64"
    | "s390"
    | "s390x"
    | "x32"
    | "x64"
    | "x86";
  platform: "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32";
  argv: string[];
  // execArgv: string[];
  env: Record<string, string> & {
    NODE_ENV: string;
  };
  // execPath: string;
  // abort(): void;
  chdir(directory: string): void;
  cwd(): string;
  exit(code?: number): void;
  getgid(): number;
  setgid(id: number | string): void;
  getuid(): number;
  setuid(id: number | string): void;
}

interface BlobInterface {
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  json(): Promise<JSON>;
}

type BlobPart = string | Blob | ArrayBufferView | ArrayBuffer;
interface BlobPropertyBag {
  /** Set a default "type" */
  type?: string;

  /** Not implemented in Bun yet. */
  endings?: "transparent" | "native";
}

/**
 * This Fetch API interface allows you to perform various actions on HTTP
 * request and response headers. These actions include retrieving, setting,
 * adding to, and removing. A Headers object has an associated header list,
 * which is initially empty and consists of zero or more name and value
 * pairs.
 *
 * You can add to this using methods like append()
 *
 * In all methods of this interface, header names are matched by
 * case-insensitive byte sequence.
 */
interface Headers {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  forEach(
    callbackfn: (value: string, key: string, parent: Headers) => void,
    thisArg?: any
  ): void;
}

declare var Headers: {
  prototype: Headers;
  new (init?: HeadersInit): Headers;
};

type HeadersInit = Array<[string, string]> | Record<string, string> | Headers;
type ResponseType =
  | "basic"
  | "cors"
  | "default"
  | "error"
  | "opaque"
  | "opaqueredirect";

declare class Blob implements BlobInterface {
  /**
   * Create a new [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
   *
   * @param `parts` - An array of strings, numbers, TypedArray, or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) objects
   * @param `options` - An object containing properties to be added to the [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
   */
  constructor(parts?: BlobPart[] | Blob, options?: BlobPropertyBag);
  /**
   * Create a new view **without 🚫 copying** the underlying data.
   *
   * Similar to [`TypedArray.subarray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray)
   *
   * @param begin The index that sets the beginning of the view.
   * @param end The index that sets the end of the view.
   *
   */
  slice(begin?: number, end?: number): Blob;

  /**
   * Read the data from the blob as a string. It will be decoded from UTF-8.
   */
  text(): Promise<string>;

  /**
   * Read the data from the blob as an ArrayBuffer.
   *
   * This copies the data into a new ArrayBuffer.
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Read the data from the blob as a JSON object.
   *
   * This first decodes the data from UTF-8, then parses it as JSON.
   *
   */
  json(): Promise<JSON>;

  type: string;
  size: number;
}

interface ResponseInit {
  headers?: HeadersInit;
  /** @default 200 */
  status?: number;

  /** @default "OK" */
  statusText?: string;
}

/**
 * Represents an HTTP [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 *
 * Use it to get the body of the response, the status code, and other information.
 *
 * @example
 * ```ts
 * const response: Response = await fetch("https://remix.run");
 * await response.text();
 * ```
 * @example
 * ```ts
 * const response: Response = await fetch("https://remix.run");
 * await Bun.write("remix.html", response);
 * ```
 */
declare class Response implements BlobInterface {
  constructor(body: BlobPart | BlobPart[], options?: ResponseInit);

  /**
   * Create a new {@link Response} with a JSON body
   *
   * @param body - The body of the response
   * @param options - options to pass to the response
   *
   * @example
   *
   * ```ts
   * const response = Response.json({hi: "there"});
   * console.assert(
   *   await response.text(),
   *   `{"hi":"there"}`
   * );
   * ```
   * -------
   *
   * This is syntactic sugar for:
   * ```js
   *  new Response(JSON.stringify(body), {headers: { "Content-Type": "application/json" }})
   * ```
   * @link https://github.com/whatwg/fetch/issues/1389
   */
  static json(body?: any, options?: ResponseInit | number): Response;
  /**
   * Create a new {@link Response} that redirects to url
   *
   * @param url - the URL to redirect to
   * @param status - the HTTP status code to use for the redirect
   */
  // tslint:disable-next-line:unified-signatures
  static redirect(url: string, status?: number): Response;

  /**
   * Create a new {@link Response} that redirects to url
   *
   * @param url - the URL to redirect to
   * @param options - options to pass to the response
   */
  // tslint:disable-next-line:unified-signatures
  static redirect(url: string, options?: ResponseInit): Response;

  /**
   * Create a new {@link Response} that has a network error
   */
  static error(): Response;

  /**
   * HTTP [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) sent with the response.
   *
   * @example
   * ```ts
   * const {headers} = await fetch("https://remix.run");
   * headers.get("Content-Type");
   * headers.get("Content-Length");
   * headers.get("Set-Cookie");
   * ```
   */
  readonly headers: Headers;

  /**
   * Has the body of the response already been consumed?
   */
  readonly bodyUsed: boolean;

  /**
   * Read the data from the Response as a string. It will be decoded from UTF-8.
   *
   * When the body is valid latin1, this operation is zero copy.
   */
  text(): Promise<string>;

  /**
   * Read the data from the Response as a string. It will be decoded from UTF-8.
   *
   * When the body is valid latin1, this operation is zero copy.
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Read the data from the Response as a JSON object.
   *
   * This first decodes the data from UTF-8, then parses it as JSON.
   *
   */
  json(): Promise<JSON>;

  /**
   * Read the data from the Response as a Blob.
   *
   * This allows you to reuse the underlying data.
   *
   * @returns Promise<Blob> - The body of the response as a {@link Blob}.
   */
  blob(): Promise<Blob>;

  readonly ok: boolean;
  readonly redirected: boolean;
  /**
   * HTTP status code
   *
   * @example
   * 200
   *
   * 0 for network errors
   */
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  /** HTTP url as a string */
  readonly url: string;

  /** Copy the Response object into a new Response, including the body */
  clone(): Response;
}

type RequestCache =
  | "default"
  | "force-cache"
  | "no-cache"
  | "no-store"
  | "only-if-cached"
  | "reload";
type RequestCredentials = "include" | "omit" | "same-origin";
type RequestDestination =
  | ""
  | "audio"
  | "audioworklet"
  | "document"
  | "embed"
  | "font"
  | "frame"
  | "iframe"
  | "image"
  | "manifest"
  | "object"
  | "paintworklet"
  | "report"
  | "script"
  | "sharedworker"
  | "style"
  | "track"
  | "video"
  | "worker"
  | "xslt";
type RequestMode = "cors" | "navigate" | "no-cors" | "same-origin";
type RequestRedirect = "error" | "follow" | "manual";
type ReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";
type RequestInfo = Request | string;

type BodyInit = ReadableStream | XMLHttpRequestBodyInit;
type XMLHttpRequestBodyInit = Blob | BufferSource | string;
type ReadableStreamController<T> = ReadableStreamDefaultController<T>;
type ReadableStreamDefaultReadResult<T> =
  | ReadableStreamDefaultReadValueResult<T>
  | ReadableStreamDefaultReadDoneResult;
type ReadableStreamReader<T> = ReadableStreamDefaultReader<T>;

interface RequestInit {
  /**
   * A BodyInit object or null to set request's body.
   */
  body?: BodyInit | null;
  /**
   * A string indicating how the request will interact with the browser's cache to set request's cache.
   *
   * Note: as of Bun v0.0.74, this is not implemented yet.
   */
  cache?: RequestCache;
  /**
   * A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
   */
  credentials?: RequestCredentials;
  /**
   * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
   */
  headers?: HeadersInit;
  /**
   * A cryptographic hash of the resource to be fetched by request. Sets request's integrity.
   *
   * Note: as of Bun v0.0.74, this is not implemented yet.
   */
  integrity?: string;
  /**
   * A boolean to set request's keepalive.
   *
   * Note: as of Bun v0.0.74, this is not implemented yet.
   */
  keepalive?: boolean;
  /**
   * A string to set request's method.
   */
  method?: string;
  /**
   * A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.
   */
  mode?: RequestMode;
  /**
   * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
   */
  redirect?: RequestRedirect;
  /**
   * A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.
   */
  referrer?: string;
  /**
   * A referrer policy to set request's referrerPolicy.
   */
  referrerPolicy?: ReferrerPolicy;
  /**
   * An AbortSignal to set request's signal.
   *
   * Note: as of Bun v0.0.74, this is not implemented yet.
   */
  signal?: AbortSignal | null;
  /**
   * Can only be null. Used to disassociate request from any Window.
   *
   * This does nothing in Bun
   */
  window?: any;
}

/**
 * [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) represents an HTTP request.
 *
 * @example
 * ```ts
 * const request = new Request("https://remix.run/");
 * await fetch(request);
 * ```
 *
 * @example
 * ```ts
 * const request = new Request("https://remix.run/");
 * await fetch(request);
 * ```
 */
declare class Request implements BlobInterface {
  constructor(requestInfo: RequestInfo, requestInit?: RequestInit);

  /**
   * Read or write the HTTP headers for this request.
   *
   * @example
   * ```ts
   * const request = new Request("https://remix.run/");
   * request.headers.set("Content-Type", "application/json");
   * request.headers.set("Accept", "application/json");
   * await fetch(request);
   * ```
   */
  headers: Headers;

  /**
   * The URL (as a string) corresponding to the HTTP request
   * @example
   * ```ts
   * const request = new Request("https://remix.run/");
   * request.url; // "https://remix.run/"
   * ```
   */
  readonly url: string;

  /**
   * Consume the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) body as a string. It will be decoded from UTF-8.
   *
   * When the body is valid latin1, this operation is zero copy.
   */
  text(): Promise<string>;

  /**
   * Consume the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) body as an ArrayBuffer.
   *
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Consume the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) body as a JSON object.
   *
   * This first decodes the data from UTF-8, then parses it as JSON.
   *
   */
  json(): Promise<JSON>;

  /**
   * Consume the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) body as a `Blob`.
   *
   * This allows you to reuse the underlying data.
   *
   */
  blob(): Promise<Blob>;

  /**
   * Returns the cache mode associated with request, which is a string indicating how the request will interact with the browser's cache when fetching.
   */
  readonly cache: RequestCache;
  /**
   * Returns the credentials mode associated with request, which is a string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL.
   */
  readonly credentials: RequestCredentials;
  /**
   * Returns the kind of resource requested by request, e.g., "document" or "script".
   *
   * In Bun, this always returns "navigate".
   */
  readonly destination: RequestDestination;
  /**
   * Returns request's subresource integrity metadata, which is a cryptographic hash of the resource being fetched. Its value consists of multiple hashes separated by whitespace. [SRI]
   *
   * This does nothing in Bun right now.
   */
  readonly integrity: string;
  /**
   * Returns a boolean indicating whether or not request can outlive the global in which it was created.
   *
   * In Bun, this always returns false.
   */
  readonly keepalive: boolean;
  /**
   * Returns request's HTTP method, which is "GET" by default.
   */
  readonly method: string;
  /**
   * Returns the mode associated with request, which is a string indicating whether the request will use CORS, or will be restricted to same-origin URLs.
   */
  readonly mode: RequestMode;
  /**
   * Returns the redirect mode associated with request, which is a string indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.
   */
  readonly redirect: RequestRedirect;
  /**
   * Returns the referrer of request. Its value can be a same-origin URL
   * if explicitly set in init, the empty string to indicate no referrer,
   * and "about:client" when defaulting to the global's default. This is
   * used during fetching to determine the value of the `Referer` header
   * of the request being made.
   */
  readonly referrer: string;
  /**
   * Returns the referrer policy associated with request. This is used during fetching to compute the value of the request's referrer.
   */
  readonly referrerPolicy: ReferrerPolicy;
  /**
   * Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort event handler.
   *
   * Note: this is **not implemented yet**. The cake is a lie.
   */
  readonly signal: AbortSignal;

  /** Copy the Request object into a new Request, including the body */
  clone(): Request;
}

interface Crypto {
  getRandomValues(array: TypedArray): void;
  /**
   * Generate a cryptographically secure random UUID.
   *
   * @example
   *
   * ```js
   * crypto.randomUUID()
   * '5e6adf82-f516-4468-b1e1-33d6f664d7dc'
   * ```
   */
  randomUUID(): string;
}

declare var crypto: Crypto;

/**
 * [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/atob) converts ascii text into base64.
 *
 * @param asciiText The ascii text to convert.
 */
declare function atob(asciiText: string): string;

/**
 * [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/btoa) decodes base64 into ascii text.
 *
 * @param base64Text The base64 text to convert.
 */
declare function btoa(base64Text: string): string;

/**
 * An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextEncoder` API. All
 * instances of `TextEncoder` only support UTF-8 encoding.
 *
 * ```js
 * const encoder = new TextEncoder();
 * const uint8array = encoder.encode('this is some data');
 * ```
 *
 */
declare class TextEncoder {
  constructor(encoding?: "utf-8");
  readonly encoding: "utf-8";

  /**
   * UTF-8 encodes the `input` string and returns a `Uint8Array` containing the
   * encoded bytes.
   * @param [input='an empty string'] The text to encode.
   */
  encode(input?: string): Uint8Array;
  /**
   * UTF-8 encodes the `src` string to the `dest` Uint8Array and returns an object
   * containing the read Unicode code units and written UTF-8 bytes.
   *
   * ```js
   * const encoder = new TextEncoder();
   * const src = 'this is some data';
   * const dest = new Uint8Array(10);
   * const { read, written } = encoder.encodeInto(src, dest);
   * ```
   * @param src The text to encode.
   * @param dest The array to hold the encode result.
   */
  encodeInto(src?: string, dest?: TypedArray): EncodeIntoResult;
}

declare class TextDecoder {
  constructor(
    encoding?: Encoding,
    options?: { fatal?: boolean; ignoreBOM?: boolean }
  );

  encoding: Encoding;
  ignoreBOM: boolean;
  fatal: boolean;

  /**
   * Decodes the `input` and returns a string. If `options.stream` is `true`, any
   * incomplete byte sequences occurring at the end of the `input` are buffered
   * internally and emitted after the next call to `textDecoder.decode()`.
   *
   * If `textDecoder.fatal` is `true`, decoding errors that occur will result in a`TypeError` being thrown.
   * @param input An `ArrayBuffer`, `DataView` or `TypedArray` instance containing the encoded data.
   */
  decode(input?: TypedArray | ArrayBuffer): string;
}

/**
 * ShadowRealms are a distinct global environment, with its own global object
 * containing its own intrinsics and built-ins (standard objects that are not
 * bound to global variables, like the initial value of Object.prototype).
 *
 *
 * @example
 *
 * ```js
 * const red = new ShadowRealm();
 *
 * // realms can import modules that will execute within it's own environment.
 * // When the module is resolved, it captured the binding value, or creates a new
 * // wrapped function that is connected to the callable binding.
 * const redAdd = await red.importValue('./inside-code.js', 'add');
 *
 * // redAdd is a wrapped function exotic object that chains it's call to the
 * // respective imported binding.
 * let result = redAdd(2, 3);
 *
 * console.assert(result === 5); // yields true
 *
 * // The evaluate method can provide quick code evaluation within the constructed
 * // shadowRealm without requiring any module loading, while it still requires CSP
 * // relaxing.
 * globalThis.someValue = 1;
 * red.evaluate('globalThis.someValue = 2'); // Affects only the ShadowRealm's global
 * console.assert(globalThis.someValue === 1);
 *
 * // The wrapped functions can also wrap other functions the other way around.
 * const setUniqueValue =
 * await red.importValue('./inside-code.js', 'setUniqueValue');
 *
 * // setUniqueValue = (cb) => (cb(globalThis.someValue) * 2);
 *
 * result = setUniqueValue((x) => x ** 3);
 *
 * console.assert(result === 16); // yields true
 * ```
 */
declare class ShadowRealm {
  /**
   * Creates a new [ShadowRealm](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md#introduction)
   *
   * @example
   *
   * ```js
   * const red = new ShadowRealm();
   *
   * // realms can import modules that will execute within it's own environment.
   * // When the module is resolved, it captured the binding value, or creates a new
   * // wrapped function that is connected to the callable binding.
   * const redAdd = await red.importValue('./inside-code.js', 'add');
   *
   * // redAdd is a wrapped function exotic object that chains it's call to the
   * // respective imported binding.
   * let result = redAdd(2, 3);
   *
   * console.assert(result === 5); // yields true
   *
   * // The evaluate method can provide quick code evaluation within the constructed
   * // shadowRealm without requiring any module loading, while it still requires CSP
   * // relaxing.
   * globalThis.someValue = 1;
   * red.evaluate('globalThis.someValue = 2'); // Affects only the ShadowRealm's global
   * console.assert(globalThis.someValue === 1);
   *
   * // The wrapped functions can also wrap other functions the other way around.
   * const setUniqueValue =
   * await red.importValue('./inside-code.js', 'setUniqueValue');
   *
   * // setUniqueValue = (cb) => (cb(globalThis.someValue) * 2);
   *
   * result = setUniqueValue((x) => x ** 3);
   *
   * console.assert(result === 16); // yields true
   * ```
   */
  constructor();
  importValue(specifier: string, bindingName: string): Promise<any>;
  evaluate(sourceText: string): any;
}

interface Blob {
  /**
   * Read the contents of the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) as a JSON object
   * @warn in browsers, this function is only available for `Response` and `Request`
   */
  json(): Promise<any>;
  /**
   * Read the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) as a UTF-8 string
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
   */
  text(): Promise<string>;
  /**
   * Read the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) as an ArrayBuffer object
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
   */
  arrayBuffer(): Promise<ArrayBuffer>;
}

declare var performance: {
  /**
   * Seconds since Bun.js started
   *
   * Uses a high-precision system timer to measure the time elapsed since the
   * Bun.js runtime was initialized. The value is represented as a double
   * precision floating point number. The value is monotonically increasing
   * during the lifetime of the runtime.
   *
   */
  now: () => number;
};

/**
 * Cancel a repeating timer by its timer ID.
 * @param id timer id
 */
declare function clearInterval(id?: number): void;
/**
 * Cancel a delayed function call by its timer ID.
 * @param id timer id
 */
declare function clearTimeout(id?: number): void;
// declare function createImageBitmap(image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>;
// declare function createImageBitmap(image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, options?: ImageBitmapOptions): Promise<ImageBitmap>;
/**
 * Send a HTTP(s) request
 *
 * @param url URL string
 * @param init A structured value that contains settings for the fetch() request.
 *
 * @returns A promise that resolves to {@link Response} object.
 *
 *
 */
declare function fetch(url: string, init?: RequestInit): Promise<Response>;

/**
 * Send a HTTP(s) request
 *
 * @param request Request object
 * @param init A structured value that contains settings for the fetch() request.
 *
 * @returns A promise that resolves to {@link Response} object.
 *
 *
 */
// tslint:disable-next-line:unified-signatures
declare function fetch(request: Request, init?: RequestInit): Promise<Response>;

declare function queueMicrotask(callback: () => void): void;
/**
 * Log an error using the default exception handler
 * @param error Error or string
 */
declare function reportError(error: any): void;
/**
 * Run a function every `interval` milliseconds
 * @param handler function to call
 * @param interval milliseconds to wait between calls
 */
declare function setInterval(
  handler: TimerHandler,
  interval?: number,
  ...arguments: any[]
): number;
/**
 * Run a function after `timeout` (milliseconds)
 * @param handler function to call
 * @param timeout milliseconds to wait between calls
 */
declare function setTimeout(
  handler: TimerHandler,
  timeout?: number,
  ...arguments: any[]
): number;
declare function addEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
declare function addEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void;
declare function removeEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void;
declare function removeEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
): void;

// -----------------------
// -----------------------
// --- libdom.d.ts

interface ErrorEventInit extends EventInit {
  colno?: number;
  error?: any;
  filename?: string;
  lineno?: number;
  message?: string;
}

interface EventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

interface EventListenerOptions {
  capture?: boolean;
}

interface UIEventInit extends EventInit {
  detail?: number;
  view?: null;
  /** @deprecated */
  which?: number;
}

interface EventModifierInit extends UIEventInit {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  modifierAltGraph?: boolean;
  modifierCapsLock?: boolean;
  modifierFn?: boolean;
  modifierFnLock?: boolean;
  modifierHyper?: boolean;
  modifierNumLock?: boolean;
  modifierScrollLock?: boolean;
  modifierSuper?: boolean;
  modifierSymbol?: boolean;
  modifierSymbolLock?: boolean;
  shiftKey?: boolean;
}

interface EventSourceInit {
  withCredentials?: boolean;
}

/** A controller object that allows you to abort one or more DOM requests as and when desired. */
interface AbortController {
  /**
   * Returns the AbortSignal object associated with this object.
   */
  readonly signal: AbortSignal;
  /**
   * Invoking this method will set this object's AbortSignal's aborted flag and signal to any observers that the associated activity is to be aborted.
   */
  abort(): void;
}

/** EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them. */
interface EventTarget {
  /**
   * Appends an event listener for events whose type attribute value is
   * type. The callback argument sets the callback that will be invoked
   * when the event is dispatched.
   *
   * The options argument sets listener-specific options. For
   * compatibility this can be a boolean, in which case the method behaves
   * exactly as if the value was specified as options's capture.
   *
   * When set to true, options's capture prevents callback from being
   * invoked when the event's eventPhase attribute value is
   * BUBBLING_PHASE. When false (or not present), callback will not be
   * invoked when event's eventPhase attribute value is CAPTURING_PHASE.
   * Either way,callback will be invoked if event's eventPhase attribute
   * value is AT_TARGET.
   *
   * When set to true, options's passive indicates that the callback will
   * not cancel the event by invoking preventDefault(). This is used to
   * enable performance optimizations described in § 2.8 Observing event
   * listeners.
   *
   * When set to true, options's once indicates that the callback will
   * only be invoked once after which the event listener will be removed.
   *
   * If an AbortSignal is passed for options's signal, then the event
   * listener will be removed when signal is aborted.
   *
   * The event listener is appended to target's event listener list and is
   * not appended if it has the same type, callback, and capture.
   */
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void;
  /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
  dispatchEvent(event: Event): boolean;
  /** Removes the event listener in target's event listener list with the same type, callback, and options. */
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
}

declare var EventTarget: {
  prototype: EventTarget;
  new (): EventTarget;
};

/** An event which takes place in the DOM. */
interface Event {
  /**
   * Returns true or false depending on how event was initialized. True
   * if event goes through its target's ancestors in reverse tree order,
   * and false otherwise.
   */
  readonly bubbles: boolean;
  cancelBubble: boolean;
  /**
   * Returns true or false depending on how event was initialized. Its
   * return value does not always carry meaning, but true can indicate
   * that part of the operation during which event was dispatched, can be
   * canceled by invoking the preventDefault() method.
   */
  readonly cancelable: boolean;
  /**
   * Returns true or false depending on how event was initialized. True
   * if event invokes listeners past a ShadowRoot node that is the root of
   * its target, and false otherwise.
   */
  readonly composed: boolean;
  /**
   * Returns the object whose event listener's callback is currently
   * being invoked.
   */
  readonly currentTarget: EventTarget | null;
  /**
   * Returns true if preventDefault() was invoked successfully to
   * indicate cancelation, and false otherwise.
   */
  readonly defaultPrevented: boolean;
  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE,
   * AT_TARGET, and BUBBLING_PHASE.
   */
  readonly eventPhase: number;
  /**
   * Returns true if event was dispatched by the user agent, and false
   * otherwise.
   */
  readonly isTrusted: boolean;
  /**
   * @deprecated
   */
  returnValue: boolean;
  /**
   * @deprecated
   */
  readonly srcElement: EventTarget | null;
  /**
   * Returns the object to which event is dispatched (its target).
   */
  readonly target: EventTarget | null;
  /**
   * Returns the event's timestamp as the number of milliseconds measured
   * relative to the time origin.
   */
  readonly timeStamp: DOMHighResTimeStamp;
  /**
   * Returns the type of event, e.g. "click", "hashchange", or "submit".
   */
  readonly type: string;
  /**
   * Returns the invocation target objects of event's path (objects on
   * which listeners will be invoked), except for any nodes in shadow
   * trees of which the shadow root's mode is "closed" that are not
   * reachable from event's currentTarget.
   */
  composedPath(): EventTarget[];
  /**
   * @deprecated
   */
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  /**
   * If invoked when the cancelable attribute value is true, and while
   * executing a listener for the event with passive set to false, signals
   * to the operation that caused event to be dispatched that it needs to
   * be canceled.
   */
  preventDefault(): void;
  /**
   * Invoking this method prevents event from reaching any registered
   * event listeners after the current one finishes running and, when
   * dispatched in a tree, also prevents event from reaching any other
   * objects.
   */
  stopImmediatePropagation(): void;
  /**
   * When dispatched in a tree, invoking this method prevents event from
   * reaching any objects other than the current object.
   */
  stopPropagation(): void;
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;
}

declare var Event: {
  prototype: Event;
  new (type: string, eventInitDict?: EventInit): Event;
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;
};

/**
 * Events providing information related to errors in scripts or in files.
 */
interface ErrorEvent extends Event {
  readonly colno: number;
  readonly error: any;
  readonly filename: string;
  readonly lineno: number;
  readonly message: string;
}

declare var ErrorEvent: {
  prototype: ErrorEvent;
  new (type: string, eventInitDict?: ErrorEventInit): ErrorEvent;
};

/**
 * The URL interface represents an object providing static methods used for
 * creating object URLs.
 */
interface URL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  toString(): string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: URLSearchParams;
  username: string;
  toJSON(): string;
}

interface URLSearchParams {
  /** Appends a specified key/value pair as a new search parameter. */
  append(name: string, value: string): void;
  /** Deletes the given search parameter, and its associated value, from the list of all search parameters. */
  delete(name: string): void;
  /** Returns the first value associated to the given search parameter. */
  get(name: string): string | null;
  /** Returns all the values association with a given search parameter. */
  getAll(name: string): string[];
  /** Returns a Boolean indicating if such a search parameter exists. */
  has(name: string): boolean;
  /** Sets the value associated to a given search parameter to the given value. If there were several values, delete the others. */
  set(name: string, value: string): void;
  sort(): void;
  /** Returns a string containing a query string suitable for use in a URL. Does not include the question mark. */
  toString(): string;
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: any
  ): void;
}

type TimerHandler = (...args: any[]) => void;

interface EventListener {
  (evt: Event): void;
}

interface EventListenerObject {
  handleEvent(object: Event): void;
}

declare var AbortController: {
  prototype: AbortController;
  new (): AbortController;
};

interface FetchEvent extends Event {
  readonly request: Request;
  readonly url: string;

  waitUntil(promise: Promise<any>): void;
  respondWith(response: Response | Promise<Response>): void;
}

interface EventMap {
  fetch: FetchEvent;
  // exit: Event;
}

interface AbortSignalEventMap {
  abort: Event;
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}

/** A signal object that allows you to communicate with a DOM request (such as a Fetch) and abort it if required via an AbortController object. */
interface AbortSignal extends EventTarget {
  /**
   * Returns true if this AbortSignal's AbortController has signaled to abort, and false otherwise.
   */
  readonly aborted: boolean;
  onabort: ((this: AbortSignal, ev: Event) => any) | null;
  addEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare var AbortSignal: {
  prototype: AbortSignal;
  new (): AbortSignal;
};

// type AlgorithmIdentifier = Algorithm | string;
// type BodyInit = ReadableStream | XMLHttpRequestBodyInit;
type BufferSource = ArrayBufferView | ArrayBuffer;
// type COSEAlgorithmIdentifier = number;
// type CSSNumberish = number;
// type CanvasImageSource =
//   | HTMLOrSVGImageElement
//   | HTMLVideoElement
//   | HTMLCanvasElement
//   | ImageBitmap;
type DOMHighResTimeStamp = number;
// type EpochTimeStamp = number;
type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

/**
 * Low-level JavaScriptCore API for accessing the native ES Module loader (not a Bun API)
 *
 * Before using this, be aware of a few things:
 *
 * **Using this incorrectly will crash your application**.
 *
 * This API may change any time JavaScriptCore is updated.
 *
 * Bun may rewrite ESM import specifiers to point to bundled code. This will
 * be confusing when using this API, as it will return a string like
 * "/node_modules.server.bun".
 *
 * Bun may inject additional imports into your code. This usually has a `bun:` prefix.
 *
 */
declare var Loader: {
  /**
   * ESM module registry
   *
   * This lets you implement live reload in Bun. If you
   * delete a module specifier from this map, the next time it's imported, it
   * will be re-transpiled and loaded again.
   *
   * The keys are the module specifiers and the
   * values are metadata about the module.
   *
   * The keys are an implementation detail for Bun that will change between
   * versions.
   *
   * - Userland modules are an absolute file path
   * - Virtual modules have a `bun:` prefix or `node:` prefix
   * - JS polyfills start with `"/bun-vfs/"`. `"buffer"` is an example of a JS polyfill
   * - If you have a `node_modules.bun` file, many modules will point to that file
   *
   * Virtual modules and JS polyfills are embedded in bun's binary. They don't
   * point to anywhere in your local filesystem.
   *
   *
   */
  registry: Map<
    string,
    {
      /**
       * This refers to the state the ESM module is in
       *
       * TODO: make an enum for this number
       *
       *
       */
      state: number;
      dependencies: string[];
      /**
       * Your application will probably crash if you mess with this.
       */
      module: any;
    }
  >;
  /**
   * For an already-evaluated module, return the dependencies as module specifiers
   *
   * This list is already sorted and uniqued.
   *
   * @example
   *
   * For this code:
   * ```js
   * // /foo.js
   * import classNames from 'classnames';
   * import React from 'react';
   * import {createElement} from 'react';
   * ```
   *
   * This would return:
   * ```js
   * Loader.dependencyKeysIfEvaluated("/foo.js")
   * ["bun:wrap", "/path/to/node_modules/classnames/index.js", "/path/to/node_modules/react/index.js"]
   * ```
   *
   * @param specifier - module specifier as it appears in transpiled source code
   *
   */
  dependencyKeysIfEvaluated: (specifier: string) => string[];
  /**
   * The function JavaScriptCore internally calls when you use an import statement.
   *
   * This may return a path to `node_modules.server.bun`, which will be confusing.
   *
   * Consider {@link Bun.resolve} or {@link ImportMeta.resolve}
   * instead.
   *
   * @param specifier - module specifier as it appears in transpiled source code
   */
  resolve: (specifier: string) => Promise<string>;
  /**
   * Synchronously resolve a module specifier
   *
   * This may return a path to `node_modules.server.bun`, which will be confusing.
   *
   * Consider {@link Bun.resolveSync}
   * instead.
   */
  resolveSync: (specifier: string, from: string) => string;
};

/** This Streams API interface represents a readable stream of byte data. The Fetch API offers a concrete instance of a ReadableStream through the body property of a Response object. */
interface ReadableStream<R = any> {
  readonly locked: boolean;
  cancel(reason?: any): Promise<void>;
  getReader(): ReadableStreamDefaultReader<R>;
  pipeThrough<T>(
    transform: ReadableWritablePair<T, R>,
    options?: StreamPipeOptions
  ): ReadableStream<T>;
  pipeTo(
    destination: WritableStream<R>,
    options?: StreamPipeOptions
  ): Promise<void>;
  tee(): [ReadableStream<R>, ReadableStream<R>];
  forEach(
    callbackfn: (value: any, key: number, parent: ReadableStream<R>) => void,
    thisArg?: any
  ): void;
}

declare var ReadableStream: {
  prototype: ReadableStream;
  new <R = any>(
    underlyingSource?: DirectUnderlyingSource<R> | UnderlyingSource<R>,
    strategy?: QueuingStrategy<R>
  ): ReadableStream<R>;
};

interface QueuingStrategy<T = any> {
  highWaterMark?: number;
  size?: QueuingStrategySize<T>;
}

interface QueuingStrategyInit {
  /**
   * Creates a new ByteLengthQueuingStrategy with the provided high water mark.
   *
   * Note that the provided high water mark will not be validated ahead of time. Instead, if it is negative, NaN, or not a number, the resulting ByteLengthQueuingStrategy will cause the corresponding stream constructor to throw.
   */
  highWaterMark: number;
}

/** This Streams API interface provides a built-in byte length queuing strategy that can be used when constructing streams. */
interface ByteLengthQueuingStrategy extends QueuingStrategy<ArrayBufferView> {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize<ArrayBufferView>;
}

declare var ByteLengthQueuingStrategy: {
  prototype: ByteLengthQueuingStrategy;
  new (init: QueuingStrategyInit): ByteLengthQueuingStrategy;
};

interface ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk?: R): void;
  error(e?: any): void;
}

interface ReadableStreamDirectController {
  close(error?: Error): void;
  write(data: ArrayBufferView | ArrayBuffer | string): number | Promise<number>;
  end(): number | Promise<number>;
  flush(): number | Promise<number>;
  start(): void;
}

declare var ReadableStreamDefaultController: {
  prototype: ReadableStreamDefaultController;
  new (): ReadableStreamDefaultController;
};

interface ReadableStreamDefaultReader<R = any>
  extends ReadableStreamGenericReader {
  read(): Promise<ReadableStreamDefaultReadResult<R>>;
  releaseLock(): void;
}

declare var ReadableStreamDefaultReader: {
  prototype: ReadableStreamDefaultReader;
  new <R = any>(stream: ReadableStream<R>): ReadableStreamDefaultReader<R>;
};

interface ReadableStreamGenericReader {
  readonly closed: Promise<undefined>;
  cancel(reason?: any): Promise<void>;
}

interface ReadableStreamDefaultReadDoneResult {
  done: true;
  value?: undefined;
}

interface ReadableStreamDefaultReadValueResult<T> {
  done: false;
  value: T;
}

interface ReadableWritablePair<R = any, W = any> {
  readable: ReadableStream<R>;
  /**
   * Provides a convenient, chainable way of piping this readable stream through a transform stream (or any other { writable, readable } pair). It simply pipes the stream into the writable side of the supplied pair, and returns the readable side for further use.
   *
   * Piping a stream will lock it for the duration of the pipe, preventing any other consumer from acquiring a reader.
   */
  writable: WritableStream<W>;
}

/** This Streams API interface provides a standard abstraction for writing streaming data to a destination, known as a sink. This object comes with built-in backpressure and queuing. */
interface WritableStream<W = any> {
  readonly locked: boolean;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  getWriter(): WritableStreamDefaultWriter<W>;
}

declare var WritableStream: {
  prototype: WritableStream;
  new <W = any>(
    underlyingSink?: UnderlyingSink<W>,
    strategy?: QueuingStrategy<W>
  ): WritableStream<W>;
};

/** This Streams API interface represents a controller allowing control of a WritableStream's state. When constructing a WritableStream, the underlying sink is given a corresponding WritableStreamDefaultController instance to manipulate. */
interface WritableStreamDefaultController {
  error(e?: any): void;
}

declare var WritableStreamDefaultController: {
  prototype: WritableStreamDefaultController;
  new (): WritableStreamDefaultController;
};

/** This Streams API interface is the object returned by WritableStream.getWriter() and once created locks the < writer to the WritableStream ensuring that no other streams can write to the underlying sink. */
interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<undefined>;
  readonly desiredSize: number | null;
  readonly ready: Promise<undefined>;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  releaseLock(): void;
  write(chunk?: W): Promise<void>;
}

declare var WritableStreamDefaultWriter: {
  prototype: WritableStreamDefaultWriter;
  new <W = any>(stream: WritableStream<W>): WritableStreamDefaultWriter<W>;
};

interface TransformerFlushCallback<O> {
  (controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
}

interface TransformerStartCallback<O> {
  (controller: TransformStreamDefaultController<O>): any;
}

interface TransformerTransformCallback<I, O> {
  (
    chunk: I,
    controller: TransformStreamDefaultController<O>
  ): void | PromiseLike<void>;
}

interface UnderlyingSinkAbortCallback {
  (reason?: any): void | PromiseLike<void>;
}

interface UnderlyingSinkCloseCallback {
  (): void | PromiseLike<void>;
}

interface UnderlyingSinkStartCallback {
  (controller: WritableStreamDefaultController): any;
}

interface UnderlyingSinkWriteCallback<W> {
  (
    chunk: W,
    controller: WritableStreamDefaultController
  ): void | PromiseLike<void>;
}

interface UnderlyingSourceCancelCallback {
  (reason?: any): void | PromiseLike<void>;
}

interface UnderlyingSink<W = any> {
  abort?: UnderlyingSinkAbortCallback;
  close?: UnderlyingSinkCloseCallback;
  start?: UnderlyingSinkStartCallback;
  type?: undefined | "default" | "bytes";
  write?: UnderlyingSinkWriteCallback<W>;
}

interface UnderlyingSource<R = any> {
  cancel?: UnderlyingSourceCancelCallback;
  pull?: UnderlyingSourcePullCallback<R>;
  start?: UnderlyingSourceStartCallback<R>;
  type?: undefined;
}

interface DirectUnderlyingSource<R = any> {
  cancel?: UnderlyingSourceCancelCallback;
  pull: (
    controller: ReadableStreamDirectController
  ) => void | PromiseLike<void>;
  type: "direct";
}

interface UnderlyingSourcePullCallback<R> {
  (controller: ReadableStreamController<R>): void | PromiseLike<void>;
}

interface UnderlyingSourceStartCallback<R> {
  (controller: ReadableStreamController<R>): any;
}

interface GenericTransformStream {
  readonly readable: ReadableStream;
  readonly writable: WritableStream;
}

interface TransformStream<I = any, O = any> {
  readonly readable: ReadableStream<O>;
  readonly writable: WritableStream<I>;
}

declare var TransformStream: {
  prototype: TransformStream;
  new <I = any, O = any>(
    transformer?: Transformer<I, O>,
    writableStrategy?: QueuingStrategy<I>,
    readableStrategy?: QueuingStrategy<O>
  ): TransformStream<I, O>;
};

interface TransformStreamDefaultController<O = any> {
  readonly desiredSize: number | null;
  enqueue(chunk?: O): void;
  error(reason?: any): void;
  terminate(): void;
}

declare var TransformStreamDefaultController: {
  prototype: TransformStreamDefaultController;
  new (): TransformStreamDefaultController;
};

interface StreamPipeOptions {
  preventAbort?: boolean;
  preventCancel?: boolean;
  /**
   * Pipes this readable stream to a given writable stream destination. The way in which the piping process behaves under various error conditions can be customized with a number of passed options. It returns a promise that fulfills when the piping process completes successfully, or rejects if any errors were encountered.
   *
   * Piping a stream will lock it for the duration of the pipe, preventing any other consumer from acquiring a reader.
   *
   * Errors and closures of the source and destination streams propagate as follows:
   *
   * An error in this source readable stream will abort destination, unless preventAbort is truthy. The returned promise will be rejected with the source's error, or with any error that occurs during aborting the destination.
   *
   * An error in destination will cancel this source readable stream, unless preventCancel is truthy. The returned promise will be rejected with the destination's error, or with any error that occurs during canceling the source.
   *
   * When this source readable stream closes, destination will be closed, unless preventClose is truthy. The returned promise will be fulfilled once this process completes, unless an error is encountered while closing the destination, in which case it will be rejected with that error.
   *
   * If destination starts out closed or closing, this source readable stream will be canceled, unless preventCancel is true. The returned promise will be rejected with an error indicating piping to a closed stream failed, or with any error that occurs during canceling the source.
   *
   * The signal option can be set to an AbortSignal to allow aborting an ongoing pipe operation via the corresponding AbortController. In this case, this source readable stream will be canceled, and destination aborted, unless the respective options preventCancel or preventAbort are set.
   */
  preventClose?: boolean;
  signal?: AbortSignal;
}

/** This Streams API interface provides a built-in byte length queuing strategy that can be used when constructing streams. */
interface CountQueuingStrategy extends QueuingStrategy {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize;
}

declare var CountQueuingStrategy: {
  prototype: CountQueuingStrategy;
  new (init: QueuingStrategyInit): CountQueuingStrategy;
};

interface QueuingStrategySize<T = any> {
  (chunk?: T): number;
}

interface Transformer<I = any, O = any> {
  flush?: TransformerFlushCallback<O>;
  readableType?: undefined;
  start?: TransformerStartCallback<O>;
  transform?: TransformerTransformCallback<I, O>;
  writableType?: undefined;
}


// ./path.d.ts




// ./bun-test.d.ts

/**
 *
 * This isn't really designed for third-party usage yet.
 * You can try it if you want though!
 *
 * To run the tests, run `bun wiptest`
 *
 * @example
 *
 * ```bash
 * $ bun wiptest
 * ```
 *
 * @example
 * ```bash
 * $ bun wiptest file-name
 * ```
 */

declare module "bun:test" {
  export function describe(label: string, body: () => void): any;
  export function it(label: string, test: () => void | Promise<any>): any;
  export function test(label: string, test: () => void | Promise<any>): any;

  export function expect(value: any): Expect;

  interface Expect {
    toBe(value: any): void;
    toContain(value: any): void;
  }
}

declare module "test" {
  import BunTestModule = require("bun:test");
  export = BunTestModule;
}


// ./jsc.d.ts

declare module "bun:jsc" {
  export function describe(value: any): string;
  export function describeArray(args: any[]): string;
  export function gcAndSweep(): void;
  export function fullGC(): void;
  export function edenGC(): void;
  export function heapSize(): number;
  export function heapStats(): {
    heapSize: number;
    heapCapacity: number;
    extraMemorySize: number;
    objectCount: number;
    protectedObjectCount: number;
    globalObjectCount: number;
    protectedGlobalObjectCount: number;
    objectTypeCounts: Record<string, number>;
    protectedObjectTypeCounts: Record<string, number>;
  };
  export function memoryUsage(): {
    current: number;
    peak: number;
    currentCommit: number;
    peakCommit: number;
    pageFaults: number;
  };
  export function getRandomSeed(): number;
  export function setRandomSeed(value: number): void;
  export function isRope(input: string): boolean;
  export function callerSourceOrigin(): string;
  export function noFTL(func: Function): Function;
  export function noOSRExitFuzzing(func: Function): Function;
  export function optimizeNextInvocation(func: Function): Function;
  export function numberOfDFGCompiles(func: Function): number;
  export function releaseWeakRefs(): void;
  export function totalCompileTime(func: Function): number;
  export function reoptimizationRetryCount(func: Function): number;
  export function drainMicrotasks(): void;

  /**
   * This returns objects which native code has explicitly protected from being
   * garbage collected
   *
   * By calling this function you create another reference to the object, which
   * will further prevent it from being garbage collected
   *
   * This function is mostly a debugging tool for bun itself.
   *
   * Warning: not all objects returned are supposed to be observable from JavaScript
   */
  export function getProtectedObjects(): any[];

  /**
   * Start a remote debugging socket server on the given port.
   *
   * This exposes JavaScriptCore's built-in debugging server.
   *
   * This is untested. May not be supported yet on macOS
   */
  export function startRemoteDebugger(host?: string, port?: number): void;
}

