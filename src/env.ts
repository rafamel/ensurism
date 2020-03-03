import { PureCollection } from './collection';

export const env = new PureCollection(
  /* istanbul ignore next */
  typeof process === 'undefined' ? {} : process.env
);
