import { Type, GeneralType } from './type';
import { SchemaTypeName, Schema, SchemaNameType } from './schema';

export type SchemaOptions<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = SchemaOptionsRecord<T, D, E, N> | Schema<T> | SchemaOptionsName<T, N>;

export type SchemaOptionsName<
  T extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? SchemaTypeName & N
  : SchemaTypeName<GeneralType<T>> & N;

export type SchemaOptionsRecord<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = Exclude<SchemaTypeName, SchemaTypeName<T>> extends never
  ? SchemaOptionsRecordComplete<Type, D, E, N>
  : SchemaOptionsRecordComplete<GeneralType<T>, D, E, N>;

export type SchemaOptionsRecordComplete<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = SchemaOptionsRecordFragment<N, D, E> &
  Schema<T> &
  Schema<SchemaNameType<N>>;

export interface SchemaOptionsRecordFragment<
  N extends SchemaTypeName,
  D extends Type,
  E extends Type
> {
  type: N;
  default?: D;
  enum?: E[];
}
