import { NonDefined } from 'type-core';
import { into } from 'pipettes';
import { assert } from './assert';

export type Take<T, A extends boolean = false> = Exclude<
  T extends Array<infer U> ? U | Exclude<T, any[]> : T,
  A extends true ? NonDefined : never
>;

export declare namespace Take {
  export interface Options<A extends boolean = boolean> {
    assert?: A;
    strategy?: Strategy;
  }
  export type Strategy = 'one' | 'first' | 'maybe';
}

export function take<T, A extends boolean = false>(
  data: T,
  options?: Take.Options<A>
): Take<T, A> {
  return into(
    null,
    () => {
      if (!Array.isArray(data)) return data;

      const strategy = (options && options.strategy) || 'first';
      switch (strategy) {
        case 'one': {
          if (data.length > 1) {
            throw Error(`Expected data to contain no more than one value`);
          }
          return data[0];
        }
        case 'first': {
          return data[0];
        }
        case 'maybe': {
          for (const value of data) {
            if (value !== undefined) return value;
          }
          return undefined;
        }
        default: {
          throw Error(`Invalid take strategy: ${strategy}`);
        }
      }
    },
    (value) => {
      return options && options.assert ? assert(value) : value;
    }
  );
}
