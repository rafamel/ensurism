import { assert } from './assert';
import {
  SchemaOptions,
  Type,
  SchemaTypeName,
  Response,
  EmptyType,
  Schema
} from './types';
import { constrain } from './constrain';
import { coerce } from './coerce';
import { Collector, Collection, collect } from './collect';
import { getArgs } from './helpers/get-args';

export interface Env {
  assert<T extends string | string[]>(
    properties: T
  ): T extends string[] ? string[] : string;
  constrain<D extends Type, E extends Type, N extends SchemaTypeName>(
    property: string,
    schema: SchemaOptions<string | undefined, D, E, N>
  ): Response<string | undefined, D, E, N>;
  constrain<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: string,
    assert: A | EmptyType,
    schema: SchemaOptions<string | undefined, D, E, N>
  ): Response<string | undefined, D, E, N, A>;
  coerce<D extends Type, E extends Type, N extends SchemaTypeName>(
    property: string,
    schema: SchemaOptions<Type, D, E, N>
  ): Response<Type, D, E, N>;
  coerce<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: string,
    assert: A | EmptyType,
    schema: SchemaOptions<Type, D, E, N>
  ): Response<Type, D, E, N, A>;
  collect<O extends Record<string, any>>(
    collector: Collector<NodeJS.ProcessEnv, O>
  ): Collection<O>;
}

export const env: Env = {
  assert(properties: string | string[]): any {
    return Array.isArray(properties)
      ? assert(
          properties.map((key) => process.env[key]),
          true
        )
      : assert(process.env[properties as string]);
  },
  constrain(
    property: string,
    a: boolean | EmptyType | Schema | SchemaTypeName,
    b?: Schema | SchemaTypeName
  ): any {
    const { assert, schema } = getArgs(a, b);
    return constrain(process.env[property], assert, schema);
  },
  coerce(
    property: string,
    a: boolean | EmptyType | Schema | SchemaTypeName,
    b?: Schema | SchemaTypeName
  ): any {
    const { assert, schema } = getArgs(a, b);
    return coerce(process.env[property], assert, schema);
  },
  collect<O extends Record<string, any>>(
    collector: Collector<NodeJS.ProcessEnv, O>
  ): Collection<O> {
    return collect(process.env, collector);
  }
};
