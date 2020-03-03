import { NotDefinedType } from '../../types';

export type TakeStrategy = 'one' | 'first' | 'maybe';

export type Take<T, A extends boolean = false> = Exclude<
  T extends Array<infer U> ? U | Exclude<T, any[]> : T,
  A extends true ? NotDefinedType : never
>;
