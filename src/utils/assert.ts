import { type Dictionary, TypeGuard } from 'type-core';

import { getName } from '../helpers/get-name';

export type Assert<T, D extends boolean = false> = D extends true
  ? Exclude<T, undefined> extends Array<infer U>
    ? Array<Exclude<U, undefined>>
    : Exclude<T, undefined> extends Dictionary
      ? { [P in keyof T]: Exclude<T[P], undefined> }
      : Exclude<T, undefined>
  : Exclude<T, undefined>;

export declare namespace Assert {
  export interface Options<D extends boolean = boolean> {
    name?: string;
    message?: string;
    deep?: D;
  }
}

export function assert<T, D extends boolean = false>(
  data: T,
  options?: Assert.Options<D>
): Assert<T, D> {
  const msg = options && options.message;

  if (data === undefined) {
    throw new Error(
      msg || `expected ${getName(options)}data not to be undefined`
    );
  }

  if (options && options.deep && TypeGuard.isObject(data)) {
    const items = TypeGuard.isArray(data) ? data : Object.values(data as any);
    for (const item of items) {
      if (item === undefined) {
        throw new Error(
          msg || `an inner value of ${getName(options)}data is not defined`
        );
      }
    }
  }

  return data as Assert<T, D>;
}
