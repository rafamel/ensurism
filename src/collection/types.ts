import { PureCollection } from './PureCollection';

export type PureCollectionInitial<T> = () => T;

export type CollectionInitial<T, V> = (variables: PureCollection<V>) => T;

export type CollectionType<
  T extends PureCollection<any>
> = T extends PureCollection<infer U> ? U : never;
