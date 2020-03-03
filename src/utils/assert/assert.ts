import { Assert } from './types';

export function assert<T, D extends boolean = false>(
  data: T,
  deep?: D
): Assert<T, D> {
  if (data === undefined) throw Error(`Expected data not to be undefined`);

  if (deep && typeof data === 'object' && data !== null) {
    const items = Array.isArray(data) ? data : Object.values(data);
    for (const item of items) {
      if (item === undefined) {
        throw Error(`An inner value of data is not defined`);
      }
    }
  }

  return data as any;
}
