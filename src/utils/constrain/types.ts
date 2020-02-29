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
export type Constrain<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = Exclude<
  SchemaTypeName extends N
    ? Extract<T, ConstrainResponse<T, D, E, N>>
    : ConstrainResponse<T, D, E, N>,
  A extends true ? NotDefinedType : never
>;

type ConstrainResponse<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = E extends SchemaType
  ?
      | Extract<ConstrainResponseExtract<T, D, N>, NotDefinedType>
      | Extract<E, ConstrainResponseExtract<T, D, N>>
  : ConstrainResponseExtract<T, D, N>;

export type ConstrainResponseExtract<
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
export type ConstrainSchema<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = ConstrainSchemaRecord<T, D, E, N> | Schema<T> | ConstrainSchemaName<T, N>;

export type ConstrainSchemaName<
  T extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? SchemaTypeName & N
  : SchemaTypeName<GeneralizeType<T>> & N;

export type ConstrainSchemaRecord<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? ConstrainSchemaRecordComplete<Type, D, E, N>
  : ConstrainSchemaRecordComplete<GeneralizeType<T>, D, E, N>;

type ConstrainSchemaRecordComplete<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = ConstrainSchemaRecordFragment<N, D, E> &
  Schema<T> &
  Schema<SchemaNameType<N>>;

interface ConstrainSchemaRecordFragment<
  N extends SchemaTypeName,
  D extends Type,
  E extends Type
> {
  type: N;
  default?: D;
  enum?: E[];
}
