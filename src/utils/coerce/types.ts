import { Type, SchemaTypeName } from '../../types';
import { EnsureSchema, Ensure } from '../ensure';

export type Coerce<
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
> = Ensure<Type, D, E, N, A>;

export type CoerceSchema<
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
> = EnsureSchema<Type, D, E, N>;
