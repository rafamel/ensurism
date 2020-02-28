import {
  SchemaOptions,
  Response,
  Type,
  SchemaTypeName,
  EmptyType,
  Schema
} from './types';
import { constrain } from './constrain';
import { coerce } from './coerce';
import { getArgs } from './helpers/get-args';
import { assert, AssertValue } from './assert';

export type Collector<
  I extends Record<string, Type>,
  O extends Record<string, any>
> = (fn: CollectorFunctions) => CollectorRecord<I> & O;

export interface CollectorFunctions {
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
}

export type CollectorDataCallback<T extends Type, U> = (data: T) => U;

export type CollectorRecord<I extends Record<string, Type>> = {
  [P in keyof I]?: CollectorDataCallback<Type, any>;
};

export type Collection<O extends Record<string, any>> = {
  [P in keyof O]: ReturnType<O[P]>;
};

export function collect<
  I extends Record<string, Type>,
  O extends Record<string, any>
>(record: I, collector: Collector<I, O>): Collection<O> {
  const functions: CollectorFunctions = {
    assert() {
      return (data: any) => assert(data);
    },
    constrain(
      a: boolean | EmptyType | Schema | SchemaTypeName,
      b?: Schema | SchemaTypeName
    ): any {
      const { assert, schema } = getArgs(a, b);
      return (data: any) => constrain(data, assert, schema);
    },
    coerce(
      a: boolean | EmptyType | Schema | SchemaTypeName,
      b?: Schema | SchemaTypeName
    ): any {
      const { assert, schema } = getArgs(a, b);
      return (data: any) => coerce(data, assert, schema);
    }
  };
  const callbacks = collector(functions);
  const results: Partial<Collection<O>> = {};
  for (const key of Object.keys(callbacks) as Array<keyof O & keyof I>) {
    results[key] = callbacks[key](record[key]);
  }

  return results as Collection<O>;
}
