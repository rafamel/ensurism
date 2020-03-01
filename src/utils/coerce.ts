import { Type, SchemaTypeName, SchemaType, EmptyType, Schema } from '../types';
import { constrain, ConstrainSchema, Constrain } from './constrain';
import { getPositionalAssertSchema } from '../helpers/get-positional';

export type Coerce<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = Constrain<T extends EmptyType ? SchemaType : Type, D, E, N, A>;

export type CoerceSchema<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = ConstrainSchema<T extends EmptyType ? SchemaType : Type, D, E, N>;

export function coerce<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
>(data: T, schema: CoerceSchema<T, D, E, N>): Coerce<T, D, E, N>;
export function coerce<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
>(
  data: T,
  assert: A | EmptyType,
  schema: CoerceSchema<T, D, E, N>
): Coerce<T, D, E, N, A>;

export function coerce(
  data: string | EmptyType,
  a: boolean | EmptyType | Schema | SchemaTypeName,
  b?: Schema | SchemaTypeName
): Coerce<string | EmptyType, Type, Type, SchemaTypeName, boolean> {
  const { assert, schema } = getPositionalAssertSchema(a, b);

  if (data === undefined) {
    return constrain(data, assert, schema);
  }

  if (typeof data !== 'string') {
    throw Error(`Data must be a string to be coerced`);
  }

  switch (schema.type) {
    case 'string': {
      return constrain(
        /^".*"$/.test(data) ? data.slice(1, -1) : data,
        assert,
        schema
      );
    }
    case 'integer':
    case 'number': {
      const value = Number(data);
      if (String(value) === 'NaN') {
        throw Error(`Data couldn't be coerced to number: ${data}`);
      }
      return constrain(value, assert, schema);
    }
    case 'boolean':
    case 'null': {
      if (
        data === '0' ||
        data === '' ||
        data === '""' ||
        data === 'false' ||
        data === 'null' ||
        data === 'undefined' ||
        data === 'NaN'
      ) {
        return constrain(schema.type === 'null' ? null : false, assert, schema);
      }
      if (schema.type === 'null') {
        throw Error(`Data couldn't be coerced to null: ${data}`);
      }
      return constrain(true, assert, schema);
    }
    case 'array':
    case 'object': {
      let value: any;
      try {
        value = JSON.parse(data);
      } catch (err) {
        throw Error(`Invalid JSON data for ${schema.type}: ${data}`);
      }
      return constrain(value, assert, schema);
    }
    default: {
      throw Error(`Invalid schema type: ${schema.type}`);
    }
  }
}
