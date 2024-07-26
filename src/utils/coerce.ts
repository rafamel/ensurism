import type { Serial } from 'type-core';
import { into } from 'pipettes';

import type { Schema } from '../definitions';
import { getName } from '../helpers/get-name';
import { getSchema } from '../helpers/get-schema';
import { type Ensure, ensure } from './ensure';

export type Coerce<
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName,
  A extends boolean = false
> = Ensure<Serial.Type, D, E, N, A>;

export declare namespace Coerce {
  export interface Options<A extends boolean = boolean> {
    name?: string;
    assert?: A;
  }
  export type Schema<
    D extends Serial.Type,
    E extends Serial.Type,
    N extends Schema.TypeName
  > = Ensure.Schema<Serial.Type, D, E, N>;
}

export function coerce<
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName,
  A extends boolean = false
>(
  data: Serial.Type,
  schema: Coerce.Schema<D, E, N>,
  options?: Coerce.Options<A>
): Coerce<D, E, N, A> {
  const schemaObj = getSchema(schema, options);

  return into(
    data,
    (data) => {
      if (typeof data !== 'object' || data === null) {
        return data;
      }

      if (Array.isArray(data)) {
        if (schemaObj.type === 'array') return data;
        if (schemaObj.type === 'object') return { ...data };
        throw new Error(
          `invalid ${getName(options, schemaObj)}coercion type for array: ` +
            schemaObj.type
        );
      } else {
        if (schemaObj.type === 'array') return Object.values(data);
        if (schemaObj.type === 'object') return data;
        throw new Error(
          `invalid ${getName(options, schemaObj)}coercion type for object: ` +
            schemaObj.type
        );
      }
    },
    (data) => {
      if (data === undefined) return data;

      switch (schemaObj.type) {
        case 'string': {
          const value = String(data);
          return /^".*"$/.test(value) ? value.slice(1, -1) : value;
        }
        case 'integer':
        case 'number': {
          const value = Number(data);
          if (String(value) === 'NaN') {
            throw new Error(
              getName(options, schemaObj) +
                `data cannot be coerced to number: ${data}`
            );
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
            } catch (_: unknown) {
              throw new Error(
                `invalid ${getName(options, schemaObj)}JSON data for ` +
                  `${schemaObj.type}: ${data}`
              );
            }
            return value;
          }
          throw new Error(
            `${getName(options, schemaObj)}data cannot be coerced to ` +
              `${schemaObj.type}: ${data}`
          );
        }
        default: {
          throw new Error(
            `invalid ${getName(options, schemaObj)}schema type: ` +
              schemaObj.type
          );
        }
      }
    },
    (data) => {
      if (schemaObj.type === 'null') {
        if (data) {
          throw new Error(
            `${getName(options, schemaObj)}data cannot be coerced to null`
          );
        } else {
          data = null;
        }
      }
      return ensure(data, schemaObj, options) as any;
    }
  );
}
