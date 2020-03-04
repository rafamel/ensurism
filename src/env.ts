import { PureCollection } from './collection';

/**
 * A `PureCollection` instantiated with `process.env`. See `PureCollection`.
 */
export const env = new PureCollection(
  /* istanbul ignore next */
  typeof process === 'undefined' ? {} : process.env
);
