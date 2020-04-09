import { into } from 'pipettes';
import { assert } from '../assert';
import { TakeStrategy, Take } from './types';
import { EmptyType } from '../../types';

export function take<T>(data: T, strategy: TakeStrategy): Take<T>;
export function take<T, A extends boolean = false>(
  data: T,
  assert: A | EmptyType,
  strategy: TakeStrategy
): Take<T, A>;

export function take(
  data: any,
  a: TakeStrategy | boolean | EmptyType,
  b?: TakeStrategy
): Take<any> {
  const args = {
    assert: b ? (a as boolean | EmptyType) : false,
    strategy: (b || a) as TakeStrategy
  };

  return into(
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
    (fn) => {
      const value = fn();
      return args.assert ? assert(value) : value;
    }
  );
}
