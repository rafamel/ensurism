import type { Dictionary, Intersection, Primitive, Serial } from 'type-core';
import { deep, merge, shallow } from 'merge-strategies';
import { into } from 'pipettes';

import { getName } from '../helpers/get-name';
import { assert } from './assert';

export type Select<
  T extends Select.Selector,
  A extends boolean = false,
  G extends Select.Strategy = 'fallback'
> = Exclude<
  unknown extends T['default']
    ? T[keyof T] | undefined
    : G extends 'fallback'
      ? T[keyof T]
      : T[Exclude<keyof T, 'default'>] & T['default'],
  A extends true ? undefined : never
>;

export declare namespace Select {
  export interface Options<
    A extends boolean = boolean,
    G extends Strategy = Strategy
  > {
    name?: string;
    assert?: A;
    strategy?: G;
  }

  export type Strategy = 'fallback' | 'shallow' | 'merge' | 'deep';

  export type Selector<
    T extends Intersection<Primitive, Serial> = Intersection<Primitive, Serial>,
    S = Dictionary<Serial>
  > = S & { [P in Value<T>]?: Serial };

  export type Value<T extends Intersection<Primitive, Serial>> =
    | (T extends string ? T : never)
    | (T extends undefined ? 'undefined' : never)
    | (T extends void ? 'undefined' : never)
    | (T extends null ? 'null' : never)
    | (T extends boolean ? 'true' | 'false' : never)
    | (T extends number ? string : never);
}

export function select<
  T extends Intersection<Primitive, Serial>,
  S extends Select.Selector,
  A extends boolean = false,
  G extends Select.Strategy = 'fallback'
>(
  data: T,
  selector: Select.Selector<T, S>,
  options?: Select.Options<A, G>
): Select<S, A, G> {
  return into(
    null,
    () => {
      switch (typeof data) {
        case 'undefined': {
          return 'undefined';
        }
        case 'string':
        case 'number':
        case 'boolean': {
          return String(data);
        }
        case 'object': {
          if (data === null) return 'null';
        }
        // eslint-disable-next-line no-fallthrough
        default: {
          throw new Error(
            `${getName(options)}selection data couldn't be stringified: ${data as any}`
          );
        }
      }
    },
    (key) => {
      if (!Object.hasOwnProperty.call(selector, key)) {
        return [undefined, selector.default];
      }
      if (selector.default === undefined || key === 'default') {
        return [undefined, selector[key]];
      }
      return [selector.default, selector[key]];
    },
    ([a, b]) => {
      const strategy = (options && options.strategy) || 'fallback';
      switch (strategy) {
        case null:
        case undefined:
        case 'fallback': {
          return b;
        }
        case 'shallow': {
          return shallow(a, b);
        }
        case 'merge': {
          return merge(a, b);
        }
        case 'deep': {
          return deep(a, b);
        }
        default: {
          throw new Error(
            `invalid ${getName(options)}select strategy: ${strategy}`
          );
        }
      }
    },
    (value) =>
      options && options.assert
        ? assert(value, options.name ? { name: options.name } : undefined)
        : value
  ) as Select<S, A, G>;
}
