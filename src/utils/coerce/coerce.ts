import { Type, SchemaTypeName, EmptyType, Schema } from '../../types';
import { getPositionalAssertSchema } from '../../helpers/get-positional';
import { ensure } from '../ensure';
import { CoerceSchema, Coerce } from './types';
import { pipeInto as into } from 'ts-functional-pipe';

export function coerce<
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
>(data: Type, schema: CoerceSchema<D, E, N>): Coerce<D, E, N>;
export function coerce<
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
>(
  data: Type,
  assert: A | EmptyType,
  schema: CoerceSchema<D, E, N>
): Coerce<D, E, N, A>;

export function coerce(
  data: Type,
  a: boolean | EmptyType | Schema | SchemaTypeName,
  b?: Schema | SchemaTypeName
): Coerce<Type, Type, SchemaTypeName, boolean> {
  const { assert, schema } = getPositionalAssertSchema(a, b);

  return into(
    data,
    (data) => {
      if (typeof data !== 'object' || data === null) {
        return data;
      }

      if (Array.isArray(data)) {
        if (schema.type === 'array') return data;
        if (schema.type === 'object') return { ...data };
        throw Error(`Invalid coercion type for array: ${schema.type}`);
      } else {
        if (schema.type === 'array') return Object.values(data);
        if (schema.type === 'object') return data;
        throw Error(`Invalid coercion type for object: ${schema.type}`);
      }
    },
    (data) => {
      if (data === undefined) return data;

      switch (schema.type) {
        case 'string': {
          const value = String(data);
          return /^".*"$/.test(value) ? value.slice(1, -1) : value;
        }
        case 'integer':
        case 'number': {
          const value = Number(data);
          if (String(value) === 'NaN') {
            throw Error(`Data cannot be coerced to number: ${data}`);
          }
          return value;
        }
        case 'null':
        case 'boolean': {
          const falsy = ['', '""', '0', 'false', 'null', 'undefined', 'NaN'];
          return typeof data === 'string'
            ? !falsy.includes(data)
            : Boolean(data);
        }
        case 'array':
        case 'object': {
          if (typeof data === 'object' && data !== null) {
            return data;
          }
          if (typeof data === 'string') {
            let value: any;
            try {
              value = JSON.parse(data);
            } catch (err) {
              throw Error(`Invalid JSON data for ${schema.type}: ${data}`);
            }
            return value;
          }
          throw Error(`Data cannot be coerced to ${schema.type}: ${data}`);
        }
        default: {
          throw Error(`Invalid schema type: ${schema.type}`);
        }
      }
    },
    (data) => {
      if (schema.type === 'null') {
        if (data) throw Error(`Data cannot be coerced to null`);
        else data = null;
      }
      return ensure(data, assert, schema);
    }
  );
}
