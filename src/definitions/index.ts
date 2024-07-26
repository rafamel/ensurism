import type { JSONSchema7, JSONSchema7Type } from 'json-schema';
import type { Serial } from 'type-core';

export interface Schema<T extends Serial = Serial> extends JSONSchema7 {
  type: Schema.TypeName<T>;
  default?: Schema.Type<T>;
  examples?: Schema.Type<T>;
  enum?: Array<Schema.Type<T>>;
  const?: Schema.Type<T>;
  format?: Schema.Format;
}

export declare namespace Schema {
  export type Format =
    | 'date'
    | 'time'
    | 'date-time'
    | 'duration'
    | 'uri'
    | 'uri-reference'
    | 'uri-template'
    | 'email'
    | 'hostname'
    | 'ipv4'
    | 'ipv6'
    | 'regex'
    | 'uuid'
    | 'json-pointer'
    | 'relative-json-pointer'
    | 'iri'
    | 'iri-reference'
    | 'idn-email'
    | 'idn-hostname';

  export type Type<T extends Serial = Serial> = JSONSchema7Type & T;

  export type TypeName<T extends Serial = Serial> =
    Type<T> extends undefined
      ?
          | 'null'
          | 'string'
          | 'number'
          | 'integer'
          | 'boolean'
          | 'array'
          | 'object'
      : Type<T> extends null
        ? 'null'
        : Type<T> extends string
          ? 'string'
          : Type<T> extends number
            ? 'number' | 'integer'
            : Type<T> extends boolean
              ? 'boolean'
              : Type<T> extends Array<Serial>
                ? 'array'
                : Type<T> extends { [key: string]: Serial }
                  ? 'object'
                  :
                      | 'null'
                      | 'string'
                      | 'number'
                      | 'integer'
                      | 'boolean'
                      | 'array'
                      | 'object';

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
              ? Array<Serial>
              : T extends 'object'
                ? { [key: string]: Serial }
                : never;
}
