import { pipeInto as into } from 'ts-functional-pipe';
import { NotDefinedType } from '../types';
import { assert } from './assert';

export type TakeStrategy = 'one' | 'first' | 'maybe';

export type Take<T, A extends boolean = false> = Exclude<
  T extends Array<infer U> ? U | Exclude<T, any[]> : T,
  A extends true ? NotDefinedType : never
>;

export function take<T>(data: T, strategy: TakeStrategy): Take<T>;
export function take<T, A extends boolean = false>(
  data: T,
  assert: A,
  strategy: TakeStrategy
): Take<T, A>;

export function take(
  data: any,
  a: TakeStrategy | boolean,
  b?: TakeStrategy
): Take<any> {
  const args = {
    assert: typeof a === 'boolean' ? a : false,
    strategy: typeof a === 'boolean' ? b : a
  };

  return into(
    null,
    () => {
      if (!Array.isArray(data)) return data;

      switch (args.strategy) {
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
          throw Error(`Invalid take strategy: ${args.strategy}`);
        }
      }
    },
    (value) => (args.assert ? assert(value) : value)
  );
}
