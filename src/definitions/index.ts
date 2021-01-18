import { JSONSchema7, JSONSchema7Type } from 'json-schema';
import { Serial } from 'type-core';

export interface Schema<T extends Serial.Type = Serial.Type>
  extends JSONSchema7 {
  type: Schema.TypeName<T>;
  default?: Schema.Type<T>;
  examples?: Schema.Type<T>;
  enum?: Array<Schema.Type<T>>;
  const?: Schema.Type<T>;
  format?: Schema.Format;
}

export declare namespace Schema {
  export type Format =
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

  export type Type<T extends Serial.Type = Serial.Type> = JSONSchema7Type & T;

  export type TypeName<T extends Serial.Type = Serial.Type> = Type<
    T
  > extends undefined
    ? 'null' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
    : Type<T> extends null
    ? 'null'
    : Type<T> extends string
    ? 'string'
    : Type<T> extends number
    ? 'number' | 'integer'
    : Type<T> extends boolean
    ? 'boolean'
    : Type<T> extends Serial.Array
    ? 'array'
    : Type<T> extends Serial.Object
    ? 'object'
    : 'null' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

  export type NameType<T extends TypeName> = T extends 'null'
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
    ? Serial.Array
    : T extends 'object'
    ? Serial.Object
    : never;
}
