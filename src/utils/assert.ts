import { ExcludeNotDefined } from '../types';

export type Assert<T, D extends boolean = false> = D extends true
  ? ExcludeNotDefined<T> extends Array<infer U>
    ? Array<ExcludeNotDefined<U>>
    : ExcludeNotDefined<T> extends Record<string, any>
    ? { [P in keyof T]: ExcludeNotDefined<T[P]> }
    : ExcludeNotDefined<T>
  : ExcludeNotDefined<T>;

export function assert<T, D extends boolean = false>(
  data: T,
  deep?: D
): Assert<T, D> {
  if (data === undefined) throw Error(`Data should not be undefined`);

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
