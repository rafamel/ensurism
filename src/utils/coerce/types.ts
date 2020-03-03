import { Type, SchemaTypeName, SchemaType, EmptyType } from '../../types';
import { EnsureSchema, Ensure } from '../ensure';

export type Coerce<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = Ensure<T extends EmptyType ? SchemaType : Type, D, E, N, A>;

export type CoerceSchema<
  T extends string | EmptyType,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = EnsureSchema<T extends EmptyType ? SchemaType : Type, D, E, N>;
