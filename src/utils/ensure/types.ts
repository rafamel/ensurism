import { Serial, NonDefined } from 'type-core';
import { Schema } from '../../definitions';

export type EnsureResponse<
  T extends Serial.Type,
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName,
  A extends boolean = false
> = Exclude<
  Schema.TypeName extends N
    ? Extract<T, EnsureResponse.Layer<T, D, E, N>>
    : EnsureResponse.Layer<T, D, E, N>,
  A extends true ? NonDefined : never
>;

declare namespace EnsureResponse {
  export type Layer<
    T extends Serial.Type,
    D extends Serial.Type,
    E extends Serial.Type,
    N extends Schema.TypeName
  > = E extends Schema.Type
    ?
        | Extract<EnsureResponseExtract<T, D, N>, NonDefined>
        | Extract<E, EnsureResponseExtract<T, D, N>>
    : EnsureResponseExtract<T, D, N>;

  export type EnsureResponseExtract<
    T extends Serial.Type,
    D extends Serial.Type,
    N extends Schema.TypeName
  > = Extract<
    Serial.Type extends T
      ? Schema.NameType<N> | undefined
      : Schema.NameType<N> | Serial.Generalize<T>,
    D extends Schema.Type ? Schema.NameType<N> : Schema.NameType<N> | NonDefined
  >;
}

export type EnsureSchema<
  T extends Serial.Type,
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName
> = EnsureSchema.Record<T, D, E, N> | Schema<T> | EnsureSchema.Name<T, N>;

declare namespace EnsureSchema {
  export type Name<T extends Serial.Type, N extends Schema.TypeName> = Exclude<
    Schema.TypeName,
    Schema.TypeName<T>
  > extends never
    ? Schema.TypeName & N
    : Schema.TypeName<Serial.Generalize<T>> & N;

  export type Record<
    T extends Serial.Type,
    D extends Serial.Type,
    E extends Serial.Type,
    N extends Schema.TypeName
  > = Exclude<Schema.TypeName, Schema.TypeName<T>> extends never
    ? RecordComplete<Serial.Type, D, E, N>
    : RecordComplete<Serial.Generalize<T>, D, E, N>;

  export type RecordComplete<
    T extends Serial.Type,
    D extends Serial.Type,
    E extends Serial.Type,
    N extends Schema.TypeName
  > = RecordFragment<N, D, E> & Schema<T> & Schema<Schema.NameType<N>>;

  export interface RecordFragment<
    N extends Schema.TypeName,
    D extends Serial.Type,
    E extends Serial.Type
  > {
    type: N;
    default?: D;
    enum?: E[];
  }
}
