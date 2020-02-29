import { PureCollection } from './PureCollection';

export type PureCollectionDefine<T> = () => T;

export type CollectionDefine<T, V> = (variables: PureCollection<V>) => T;

export type CollectionType<
  T extends PureCollection<any>
> = T extends PureCollection<infer U> ? U : never;
