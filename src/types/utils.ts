import { EmptyType, NotDefinedType } from './type';

export type FilterByType<T, U> = T extends U ? T : never;

export type FilterRecordByType<T extends Record<string, any>, U> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends U ? K : never }[keyof T]
>;

export type GeneralizeType<T> = T | T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

export type ExcludeEmpty<T> = Exclude<T, EmptyType>;

export type ExcludeNotDefined<T> = Exclude<T, NotDefinedType>;
