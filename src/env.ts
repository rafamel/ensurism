import { PureCollection } from './collection';

export const env = new PureCollection(
  typeof process === 'undefined' ? {} : process.env
);
