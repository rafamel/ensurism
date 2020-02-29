import { Schema, SchemaTypeName } from '../types';

export function getSchema(schema: Schema | SchemaTypeName | undefined): Schema {
  if (!schema) throw Error(`Schema was not provided`);
  if (typeof schema === 'string') schema = { type: schema };
  if (!schema.type) throw Error(`Schema must have a type`);
  if (Array.isArray(schema.type)) throw Error(`Schema type must be a string`);
  return schema;
}
