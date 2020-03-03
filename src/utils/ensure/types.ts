import {
  Type,
  SchemaTypeName,
  Schema,
  GeneralizeType,
  SchemaNameType,
  NotDefinedType,
  SchemaType
} from '../../types';

/* Output */
export type Ensure<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = Exclude<
  SchemaTypeName extends N
    ? Extract<T, EnsureResponse<T, D, E, N>>
    : EnsureResponse<T, D, E, N>,
  A extends true ? NotDefinedType : never
>;

type EnsureResponse<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = E extends SchemaType
  ?
      | Extract<EnsureResponseExtract<T, D, N>, NotDefinedType>
      | Extract<E, EnsureResponseExtract<T, D, N>>
  : EnsureResponseExtract<T, D, N>;

export type EnsureResponseExtract<
  T extends Type,
  D extends Type,
  N extends SchemaTypeName
> = Extract<
  Type extends T
    ? SchemaNameType<N> | undefined
    : SchemaNameType<N> | GeneralizeType<T>,
  D extends SchemaType ? SchemaNameType<N> : SchemaNameType<N> | NotDefinedType
>;

/* Input */
export type EnsureSchema<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = EnsureSchemaRecord<T, D, E, N> | Schema<T> | EnsureSchemaName<T, N>;

export type EnsureSchemaName<
  T extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? SchemaTypeName & N
  : SchemaTypeName<GeneralizeType<T>> & N;

export type EnsureSchemaRecord<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? EnsureSchemaRecordComplete<Type, D, E, N>
  : EnsureSchemaRecordComplete<GeneralizeType<T>, D, E, N>;

type EnsureSchemaRecordComplete<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = EnsureSchemaRecordFragment<N, D, E> & Schema<T> & Schema<SchemaNameType<N>>;

interface EnsureSchemaRecordFragment<
  N extends SchemaTypeName,
  D extends Type,
  E extends Type
> {
  type: N;
  default?: D;
  enum?: E[];
}
