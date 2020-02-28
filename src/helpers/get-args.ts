import { Schema, SchemaTypeName, EmptyType } from '../types';
import { validSchema } from './valid-schema';

export interface Args {
  assert: boolean;
  schema: Schema;
}

export function getArgs(
  a: boolean | EmptyType | Schema | SchemaTypeName,
  b: Schema | SchemaTypeName | undefined
): Args {
  if (typeof a === 'boolean') {
    return { assert: a, schema: validSchema(b) };
  }
  if (!a) {
    return { assert: false, schema: validSchema(b) };
  }
  return { assert: false, schema: validSchema(a) };
}
