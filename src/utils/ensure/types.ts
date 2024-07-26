import type { Serial } from 'type-core';

import type { Schema } from '../../definitions';

type Generalize<T extends Serial> =
  | T
  | (T extends boolean ? boolean : never)
  | (T extends number ? number : never)
  | (T extends string ? string : never)
  | (T extends Serial[] ? Serial[] : never)
  | (T extends object ? { [key: string]: Serial } : never);

export type EnsureResponse<
  T extends Serial,
  D extends Serial,
  E extends Serial,
  N extends Schema.TypeName,
  A extends boolean = false
> = Exclude<
  Schema.TypeName extends N
    ? Extract<T, EnsureResponse.Layer<T, D, E, N>>
    : EnsureResponse.Layer<T, D, E, N>,
  A extends true ? undefined : never
>;

declare namespace EnsureResponse {
  export type Layer<
    T extends Serial,
    D extends Serial,
    E extends Serial,
    N extends Schema.TypeName
  > = E extends Schema.Type
    ?
        | Extract<EnsureResponseExtract<T, D, N>, undefined>
        | Extract<E, EnsureResponseExtract<T, D, N>>
    : EnsureResponseExtract<T, D, N>;

  export type EnsureResponseExtract<
    T extends Serial,
    D extends Serial,
    N extends Schema.TypeName
  > = Extract<
    Serial extends T
      ? Schema.NameType<N> | undefined
      : Schema.NameType<N> | Generalize<T>,
    D extends Schema.Type ? Schema.NameType<N> : Schema.NameType<N> | undefined
  >;
}

export type EnsureSchema<
  T extends Serial,
  D extends Serial,
  E extends Serial,
  N extends Schema.TypeName
> = EnsureSchema.Record<T, D, E, N> | Schema<T> | EnsureSchema.Name<T, N>;

declare namespace EnsureSchema {
  export type Name<T extends Serial, N extends Schema.TypeName> =
    Exclude<Schema.TypeName, Schema.TypeName<T>> extends never
      ? Schema.TypeName & N
      : Schema.TypeName<Generalize<T>> & N;

  export type Record<
    T extends Serial,
    D extends Serial,
    E extends Serial,
    N extends Schema.TypeName
  > =
    Exclude<Schema.TypeName, Schema.TypeName<T>> extends never
      ? RecordComplete<Serial, D, E, N>
      : RecordComplete<Generalize<T>, D, E, N>;

  export type RecordComplete<
    T extends Serial,
    D extends Serial,
    E extends Serial,
    N extends Schema.TypeName
  > = RecordFragment<N, D, E> & Schema<T> & Schema<Schema.NameType<N>>;

  export interface RecordFragment<
    N extends Schema.TypeName,
    D extends Serial,
    E extends Serial
  > {
    type: N;
    default?: D;
    enum?: E[];
  }
}
