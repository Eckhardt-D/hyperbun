export class HyperBunRequest implements Request {
  #bodyUsed = false;
  #request;
  #blob;

  constructor(request: Request) {
    this.#request = request;
    this.#blob = request.blob();
    this.#bodyUsed = true;
  }

  get bodyUsed() {
    return this.#bodyUsed;
  }

  get cache() {
    return this.#request.cache;
  }

  get credentials() {
    return this.#request.credentials;
  }

  get destination() {
    return this.#request.destination;
  }

  get headers() {
    return this.#request.headers;
  }

  get integrity() {
    return this.#request.integrity;
  }

  get keepalive() {
    return this.#request.keepalive;
  }

  get signal() {
    return this.#request.signal;
  }

  get method() {
    return this.#request.method;
  }

  get mode() {
    return this.#request.mode;
  }

  get redirect() {
    return this.#request.redirect;
  }

  get referrer() {
    return this.#request.referrer;
  }

  get referrerPolicy() {
    return this.#request.referrerPolicy;
  }

  get url() {
    return this.#request.url;
  }

  async arrayBuffer() {
    return (await this.#blob).arrayBuffer();
  }

  async blob() {
    return await this.#blob;
  }

  clone() {
    // @todo
    return new Request(this.#request.url);
  }

  async formData() {
    // @todo
  }

  async json() {
    return (await this.#blob).json();
  }

  async text() {
    return (await this.#blob).text();
  }
}
