export type Type = BasicType | Type[] | object;

export type BasicType = undefined | void | null | string | number | boolean;

export type NotDefinedType = undefined | void;

export type EmptyType = undefined | void | null;

export type GeneralType<T extends Type> = T | T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T;

export type NeverConditional<T, A, B> = T extends never ? A : B;

export type EmptyConditional<T, A, B> = NeverConditional<
  Extract<T, EmptyType>,
  A,
  B
>;
