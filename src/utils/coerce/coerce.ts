import { Type, SchemaTypeName, EmptyType, Schema } from '../../types';
import { getPositionalAssertSchema } from '../../helpers/get-positional';
import { ensure } from '../ensure';
import { CoerceSchema, Coerce } from './types';

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
    return ensure(data, assert, schema);
  }

  if (typeof data !== 'string') {
    throw Error(`Data must be a string to be coerced`);
  }

  switch (schema.type) {
    case 'string': {
      return ensure(
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
      return ensure(value, assert, schema);
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
        return ensure(schema.type === 'null' ? null : false, assert, schema);
      }
      if (schema.type === 'null') {
        throw Error(`Data couldn't be coerced to null: ${data}`);
      }
      return ensure(true, assert, schema);
    }
    case 'array':
    case 'object': {
      let value: any;
      try {
        value = JSON.parse(data);
      } catch (err) {
        throw Error(`Invalid JSON data for ${schema.type}: ${data}`);
      }
      return ensure(value, assert, schema);
    }
    default: {
      throw Error(`Invalid schema type: ${schema.type}`);
    }
  }
}
