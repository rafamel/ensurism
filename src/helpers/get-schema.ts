import type { Schema } from '../definitions';
import { getName } from './get-name';

export function getSchema(
  schema: Schema | Schema.TypeName | undefined,
  options?: { name?: string }
): Schema {
  if (!schema) {
    throw new Error(`${getName(options)}schema was not provided`);
  }
  if (typeof schema === 'string') {
    schema = { type: schema };
  }

  if (!schema.type) {
    throw new Error(`${getName(options, schema)}schema must have a type`);
  }
  if (Array.isArray(schema.type)) {
    throw new TypeError(
      `${getName(options, schema)}schema type must be a string`
    );
  }

  return schema;
}
