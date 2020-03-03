import { BasicType, EmptyType } from '../../types';
import { shallow, merge, deep } from 'merge-strategies';
import { pipeInto as into } from 'ts-functional-pipe';
import { assert } from '../assert';
import { SelectSelector, Select, SelectStrategy } from './types';

export function select<T extends BasicType, S extends SelectSelector>(
  value: T,
  selector: SelectSelector<T, S>
): Select<S>;
export function select<
  T extends BasicType,
  S extends SelectSelector,
  A extends boolean = false
>(
  value: T,
  assert: A | EmptyType,
  selector: SelectSelector<T, S>
): Select<S, A>;
export function select<
  T extends BasicType,
  S extends SelectSelector,
  G extends SelectStrategy = 'fallback'
>(
  value: T,
  strategy: G | EmptyType,
  selector: SelectSelector<T, S>
): Select<S, false, G>;
export function select<
  T extends BasicType,
  S extends SelectSelector,
  G extends SelectStrategy = 'fallback',
  A extends boolean = false
>(
  value: T,
  assert: A | EmptyType,
  strategy: G | EmptyType,
  selector: SelectSelector<T, S>
): Select<S, A, G>;

export function select(
  value: BasicType,
  a: SelectSelector | boolean | SelectStrategy | EmptyType,
  b?: SelectSelector | SelectStrategy,
  c?: SelectSelector
): Select<SelectSelector> {
  const { selector, asserts, strategy } = {
    selector: (c || b || a) as SelectSelector,
    asserts: ((c || b) && typeof a === 'boolean' ? a : false) as
      | boolean
      | EmptyType,
    strategy: (c && typeof b === 'string'
      ? b
      : b && typeof a === 'string'
      ? a
      : 'fallback') as SelectStrategy | EmptyType
  };

  return into(
    null,
    () => {
      switch (typeof value) {
        case 'undefined': {
          return 'undefined';
        }
        case 'string':
        case 'number':
        case 'boolean': {
          return String(value);
        }
        case 'object': {
          if (value === null) return 'null';
        }
        // eslint-disable-next-line no-fallthrough
        default: {
          throw Error(`Selection value couldn't be stringified: ${value}`);
        }
      }
    },
    (key) => {
      if (!Object.hasOwnProperty.call(selector, key)) {
        return selector.default;
      }
      if (selector.default === undefined || key === 'default') {
        return selector[key];
      }
      switch (strategy) {
        case null:
        case undefined:
        case 'fallback': {
          return selector[key];
        }
        case 'shallow': {
          return shallow(selector.default, selector[key]);
        }
        case 'merge': {
          return merge(selector.default, selector[key]);
        }
        case 'deep': {
          return deep(selector.default, selector[key]);
        }
        default: {
          throw Error(`Invalid select strategy: ${strategy}`);
        }
      }
    },
    (value) => (asserts ? assert(value) : value)
  );
}
