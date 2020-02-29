import { NotDefinedType } from './types';

export type AssertValue<T, D extends boolean = false> = D extends true
  ? Exclude<T, NotDefinedType> extends Array<infer U>
    ? Array<Exclude<U, NotDefinedType>>
    : Exclude<T, NotDefinedType> extends Record<string, any>
    ? { [P in keyof T]: Exclude<T[P], NotDefinedType> }
    : Exclude<T, NotDefinedType>
  : Exclude<T, NotDefinedType>;

export function assert<T, D extends boolean = false>(
  data: T,
  deep?: D
): AssertValue<T, D> {
  if (data === undefined) throw Error(`Data is not defined`);

  if (deep && typeof data === 'object') {
    const items = Array.isArray(data) ? data : Object.values(data);
    for (const item of items) {
      if (item === undefined) {
        throw Error(`An inner value of data is not defined`);
      }
    }
  }

  return data as any;
}
