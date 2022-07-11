import type {Serve} from 'bun';

export type HyperBunListenerOptions = Omit<Serve, 'fetch'>;
