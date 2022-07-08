interface HyperBunRequestParams {
  [key: string]: string;
}

type HyperBunRequestQuery = HyperBunRequestParams;

export interface HyperBunRequestContext {
  params: HyperBunRequestParams;
  query: HyperBunRequestQuery;
  [key: string]: unknown;
}

export class HyperBunRequest extends Request {
  declare context: HyperBunRequestContext;

  constructor(info: RequestInfo, init: RequestInit) {
    super(info, init);

    this.context = {
      query: {},
      params: {},
    };
  }
}
