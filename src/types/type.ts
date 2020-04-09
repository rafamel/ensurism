/** A serializable type. */
export type Type = BasicType | Type[] | ObjectType;

export type EmptyType = NotDefinedType | null;

/* Basic */
export type BasicType = BasicDefinedType | NotDefinedType;
export type BasicDefinedType = string | number | boolean | null;

/* Not Defined */
export type NotDefinedType = undefined | void;

/* Defined */
export type DefinedType = BasicDefinedType | Type[] | ObjectType;

/* Elements */
// Object is defined broadly as otherwise it
// will cause type errors on correct types.
export type ObjectType = object;
