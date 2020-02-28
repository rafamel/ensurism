import { BasicType, Type, EmptyType, NotDefinedType } from './types';
import { shallow, merge, deep } from 'merge-strategies';
import { assert } from './assert';
import { pp as into } from 'ts-functional-pipe';

export type SelectStrategy = 'fallback' | 'shallow' | 'merge' | 'deep';

export type Selector<
  T extends BasicType = BasicType,
  S extends SelectorRecord = SelectorRecord
> = SelectorRecord<T> & S;

export type SelectorRecord<T extends BasicType = BasicType> = {
  [P in SelectorValue<T>]?: Type | SelectorCallback<Type>;
};

export type SelectorCallback<T> = () => T;

export type SelectorValue<T extends BasicType> =
  | (T extends string ? T : never)
  | (T extends undefined ? 'undefined' : never)
  | (T extends void ? 'undefined' : never)
  | (T extends null ? 'null' : never)
  | (T extends number ? string : never)
  | (T extends boolean ? 'true' | 'false' : never);

export type SelectorTypes<T extends Selector> = {
  [P in keyof T]: T[P] extends SelectorCallback<Type> ? ReturnType<T[P]> : T[P];
};

export type Selection<
  T extends Selector,
  A extends boolean = false,
  G extends SelectStrategy = 'fallback'
> = Exclude<
  unknown extends T['default']
    ? SelectorTypes<T>[keyof T] | undefined
    : G extends 'fallback'
    ? SelectorTypes<T>[keyof T]
    : SelectorTypes<T>[Exclude<keyof T, 'default'>] &
        SelectorTypes<T>['default'],
  A extends true ? NotDefinedType : never
>;

export function select<T extends BasicType, S extends Selector>(
  by: T,
  selector: Selector<T, S>
): Selection<S>;
export function select<
  T extends BasicType,
  S extends Selector,
  A extends boolean = false
>(by: T, assert: A | EmptyType, selector: Selector<T, S>): Selection<S, A>;
export function select<
  T extends BasicType,
  S extends Selector,
  G extends SelectStrategy = 'fallback'
>(
  by: T,
  strategy: G | EmptyType,
  selector: Selector<T, S>
): Selection<S, false, G>;
export function select<
  T extends BasicType,
  S extends Selector,
  G extends SelectStrategy = 'fallback',
  A extends boolean = false
>(
  by: T,
  assert: A | EmptyType,
  strategy: G | EmptyType,
  selector: Selector<T, S>
): Selection<S, A, G>;

export function select(
  by: BasicType,
  a: Selector | boolean | SelectStrategy | EmptyType,
  b?: Selector | SelectStrategy,
  c?: Selector
): Selection<Selector> {
  const { selector, asserts, strategy } = {
    selector: (c || b || a) as Selector,
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
      switch (typeof by) {
        case 'undefined': {
          return 'undefined';
        }
        case 'string':
        case 'number':
        case 'boolean': {
          return String(by);
        }
        case 'object': {
          if (by === 'null') return 'null';
        }
        // eslint-disable-next-line no-fallthrough
        default: {
          throw Error(`Selection value couldn't be stringified: ${by}`);
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
          throw Error(`Unknown strategy: ${strategy}`);
        }
      }
    },
    (value) => (asserts ? assert(value) : value)
  );
}
