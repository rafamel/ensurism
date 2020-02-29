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
export type ObjectType = { [key: string]: Type };
