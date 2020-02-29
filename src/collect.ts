import {
  SchemaOptions,
  Response,
  Type,
  SchemaTypeName,
  EmptyType,
  BasicType
} from './types';
import { constrain } from './constrain';
import { coerce } from './coerce';
import { assert, AssertValue } from './assert';
import { Selector, Selection, SelectStrategy, select } from './select';

export type Collector<
  I extends Record<string, Type>,
  O extends Record<string, any>
> = (fn: CollectorFunctions) => CollectorRecord<I> & O;

export interface CollectorFunctions {
  get(): Type;
  assert(): AssertValue<Type>;
  constrain<D extends Type, E extends Type, N extends SchemaTypeName = never>(
    schema: SchemaOptions<any, D, E, N>
  ): CollectorDataCallback<Type, Response<Type, D, E, N>>;
  constrain<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName = never,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: SchemaOptions<any, D, E, N>
  ): CollectorDataCallback<Type, Response<Type, D, E, N, A>>;
  coerce<D extends Type, E extends Type, N extends SchemaTypeName>(
    schema: SchemaOptions<any, D, E, N>
  ): CollectorDataCallback<Type, Response<Type, D, E, N>>;
  coerce<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: SchemaOptions<any, D, E, N>
  ): CollectorDataCallback<Type, Response<Type, D, E, N, A>>;
  select<S extends Selector>(
    selector: Selector<BasicType, S>
  ): CollectorDataCallback<Type, Selection<S>>;
  select<S extends Selector, A extends boolean = false>(
    assert: A | EmptyType,
    selector: Selector<BasicType, S>
  ): CollectorDataCallback<Type, Selection<S, A>>;
  select<S extends Selector, G extends SelectStrategy = 'fallback'>(
    strategy: G | EmptyType,
    selector: Selector<BasicType, S>
  ): CollectorDataCallback<Type, Selection<S, false, G>>;
  select<
    S extends Selector,
    G extends SelectStrategy = 'fallback',
    A extends boolean = false
  >(
    assert: A | EmptyType,
    strategy: G | EmptyType,
    selector: Selector<BasicType, S>
  ): CollectorDataCallback<Type, Selection<S, A, G>>;
}

export type CollectorDataCallback<T extends Type, U> = (data: T) => U;

export type CollectorRecord<I extends Record<string, Type>> = {
  [P in keyof I]?: CollectorDataCallback<Type, any>;
};

export type CollectResponse<O extends Record<string, any>> = {
  [P in keyof O]: ReturnType<O[P]>;
};

const functions: CollectorFunctions = {
  get(): any {
    return (data: any) => data;
  },
  assert(): any {
    return (data: any) => assert(data);
  },
  constrain(a: any, b?: any): any {
    return (data: any) => constrain(data, a, b);
  },
  coerce(a: any, b?: any): any {
    return (data: any) => coerce(data, a, b);
  },
  select(a: any, b?: any, c?: any): any {
    return (data: any) => select(data, a, b, c);
  }
};

export function collect<
  I extends Record<string, Type>,
  O extends Record<string, any>
>(record: I, collector: Collector<I, O>): CollectResponse<O> {
  const callbacks = collector(functions);
  const results: Partial<CollectResponse<O>> = {};
  for (const key of Object.keys(callbacks) as Array<keyof O & keyof I>) {
    results[key] = callbacks[key](record[key]);
  }
  return results as CollectResponse<O>;
}
