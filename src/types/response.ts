import { Type, GeneralType, NotDefinedType } from './type';
import { SchemaTypeName, SchemaNameType, SchemaType } from './schema';

export type Response<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = SchemaTypeName extends N
  ? Extract<T, ResponseAssert<T, D, E, N, A>>
  : ResponseAssert<T, D, E, N, A>;

export type ResponseAssert<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = A extends true
  ? Exclude<ResponseEnum<T, D, E, N>, NotDefinedType>
  : ResponseEnum<T, D, E, N>;

export type ResponseEnum<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = E extends SchemaType
  ?
      | Extract<ResponseExtract<T, D, N>, NotDefinedType>
      | Extract<E, ResponseExtract<T, D, N>>
  : ResponseExtract<T, D, N>;

export type ResponseExtract<
  T extends Type,
  D extends Type,
  N extends SchemaTypeName
> = Extract<
  Type extends T
    ? SchemaNameType<N> | undefined
    : SchemaNameType<N> | GeneralType<T>,
  ResponseDefault<D, N>
>;

export type ResponseDefault<
  D extends Type,
  N extends SchemaTypeName
> = D extends SchemaType
  ? SchemaNameType<N>
  : SchemaNameType<N> | NotDefinedType;
