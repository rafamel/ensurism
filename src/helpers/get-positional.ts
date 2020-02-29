import { Schema, SchemaTypeName, EmptyType } from '../types';
import { getSchema } from './get-schema';

export interface PositionalAssertSchema {
  assert: boolean;
  schema: Schema;
}

export function getPositionalAssertSchema(
  a: boolean | EmptyType | Schema | SchemaTypeName,
  b: Schema | SchemaTypeName | undefined
): PositionalAssertSchema {
  if (typeof a === 'boolean') return { assert: a, schema: getSchema(b) };
  if (!a) return { assert: false, schema: getSchema(b) };
  return { assert: false, schema: getSchema(a) };
}
