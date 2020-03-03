import { JSONSchema7 } from 'json-schema';
import { Type, ObjectType } from './type';
import { ExcludeNotDefined } from './utils';

/** A JSON Schema with a required `type` property */
export interface Schema<T extends Type = Type> extends JSONSchema7 {
  type: SchemaTypeName<T>;
  default?: SchemaType<T>;
  examples?: SchemaType<T>;
  enum?: Array<SchemaType<T>>;
  const?: SchemaType<T>;
  format?: SchemaFormat;
}

export type SchemaFormat =
  | 'date-time'
  | 'time'
  | 'date'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'iri-reference';

export type SchemaType<T extends Type = Type> = ExcludeNotDefined<
  ExcludeNotDefined<T> extends never ? Type : T
>;

export type SchemaTypeName<T extends Type = Type> = SchemaType<T> extends null
  ? 'null'
  : SchemaType<T> extends string
  ? 'string'
  : SchemaType<T> extends number
  ? 'number' | 'integer'
  : SchemaType<T> extends boolean
  ? 'boolean'
  : SchemaType<T> extends Type[]
  ? 'array'
  : SchemaType<T> extends ObjectType
  ? 'object'
  : 'null' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

export type SchemaNameType<T extends SchemaTypeName> = T extends 'null'
  ? null
  : T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'integer'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'array'
  ? Type[]
  : T extends 'object'
  ? ObjectType
  : never;
