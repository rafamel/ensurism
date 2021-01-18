import { Members, NonDefined, TypeGuard } from 'type-core';

export type Assert<T, D extends boolean = false> = D extends true
  ? Exclude<T, NonDefined> extends Array<infer U>
    ? Array<Exclude<U, NonDefined>>
    : Exclude<T, NonDefined> extends Members
    ? { [P in keyof T]: Exclude<T[P], NonDefined> }
    : Exclude<T, NonDefined>
  : Exclude<T, NonDefined>;

export declare namespace Assert {
  export interface Options<D extends boolean = boolean> {
    deep?: D;
  }
}

export function assert<T, D extends boolean = false>(
  data: T,
  options?: Assert.Options<D>
): Assert<T, D> {
  if (data === undefined) {
    throw Error(`Expected data not to be undefined`);
  }

  if (options && options.deep && TypeGuard.isObject(data)) {
    const items = TypeGuard.isArray(data) ? data : Object.values(data);
    for (const item of items) {
      if (item === undefined) {
        throw Error(`An inner value of data is not defined`);
      }
    }
  }

  return data as Assert<T, D>;
}
