import type {Serve} from 'bun';
import {RadixRouter} from 'radix3';
import {HyperBunRequest} from './request';
export type {RadixRouter} from 'radix3';

export type HyperBunListenerOptions = Omit<Serve, 'fetch'>;

export interface AsAttachmentOptions {
  name: string;
  type?: string;
}

export interface BlobAttachment {
  blob: Blob;
  filename: string;
}

export type ParamOrQuery = Record<string, unknown>;
export interface Context {
  params: ParamOrQuery;
  query: ParamOrQuery;
  [key: string]: unknown;
}
export type Returntypes =
  | Response
  | undefined
  | number
  | string
  | object
  | Array<string | object | number>
  | BlobAttachment
  | void;

type HandlerReturnType = Returntypes | Promise<Returntypes>;
export type MethodTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Router = {
  [key in MethodTypes]: RadixRouter;
};

export type HyperBunHandler = (
  request: HyperBunRequest,
  context: Context
) => HandlerReturnType;

export type HyperBunMiddleware = (
  request: HyperBunRequest,
  context: Context
) => Error | Response | void | Promise<void>;
