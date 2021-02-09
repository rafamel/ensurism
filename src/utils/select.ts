import { assert } from './assert';
import { Serial, Members, NonDefined } from 'type-core';
import { shallow, merge, deep } from 'merge-strategies';
import { into } from 'pipettes';
import { getName } from '~/helpers/get-name';

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
  A extends true ? NonDefined : never
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
    T extends Serial.Primitive = Serial.Primitive,
    S = Members<Serial.Type>
  > = S & { [P in Value<T>]?: Serial.Type };

  export type Value<T extends Serial.Primitive> =
    | (T extends string ? T : never)
    | (T extends undefined ? 'undefined' : never)
    | (T extends void ? 'undefined' : never)
    | (T extends null ? 'null' : never)
    | (T extends boolean ? 'true' | 'false' : never)
    | (T extends number ? string : never);
}

export function select<
  T extends Serial.Primitive,
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
          throw Error(
            `${getName(options)}selection data couldn't be stringified: ${data}`
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
          throw Error(
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
