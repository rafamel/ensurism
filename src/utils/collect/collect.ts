import { Schema } from '../../definitions';
import { assert, Assert } from '../assert';
import { take, Take } from '../take';
import { ensure, Ensure } from '../ensure';
import { coerce, Coerce } from '../coerce';
import { select, Select } from '../select';
import { CollectError } from './CollectError';
import { Serial, Members, UnaryFn } from 'type-core';

export type Collect<O> = {
  [P in keyof O]: O[P] extends Collect.Collector ? ReturnType<O[P]> : never;
};

export declare namespace Collect {
  export interface Options {
    failEarly: boolean;
  }

  export type Collection<O extends Members<Collector>> = UnaryFn<Actions, O>;

  export type Collector<T = any> = (data: Serial.Type, name?: string) => T;

  export interface Actions {
    get(): Collector<Serial.Type>;

    assert<D extends boolean = false>(
      options?: Assert.Options
    ): Collector<Assert<Serial.Type, D>>;

    take<A extends boolean = false>(
      options?: Take.Options<A>
    ): Collector<Take<Serial.Type, A>>;

    ensure<
      D extends Serial.Type,
      E extends Serial.Type,
      N extends Schema.TypeName = never,
      A extends boolean = false
    >(
      schema: Ensure.Schema<any, D, E, N>,
      options?: Ensure.Options<A>
    ): Collector<Ensure<Serial.Type, D, E, N, A>>;

    coerce<
      D extends Serial.Type,
      E extends Serial.Type,
      N extends Schema.TypeName,
      A extends boolean = false
    >(
      schema: Coerce.Schema<D, E, N>,
      options?: Coerce.Options<A>
    ): Collector<Coerce<D, E, N, A>>;

    select<
      S extends Select.Selector,
      G extends Select.Strategy = 'fallback',
      A extends boolean = false
    >(
      selector: Select.Selector<Serial.Primitive, S>,
      options?: Select.Options<A, G>
    ): Collector<Select<S, A, G>>;
  }
}

const actions: Collect.Actions = {
  get() {
    return (data) => data;
  },
  assert(options?: Assert.Options) {
    return (data: any, name?: string) => {
      return assert(data, Object.assign({ name }, options));
    };
  },
  take(options?: Take.Options) {
    return (data: any, name?: string) => {
      return take(data, Object.assign({ name }, options));
    };
  },
  ensure(schema: any, options?: Ensure.Options) {
    return (data: any, name?: string) => {
      return ensure(data, schema, Object.assign({ name }, options)) as any;
    };
  },
  coerce(schema: any, options?: Coerce.Options) {
    return (data: any, name?: string) => {
      return coerce(data, schema, Object.assign({ name }, options)) as any;
    };
  },
  select(selector: any, options?: Select.Options) {
    return (data: any, name?: string) => {
      return select(data, selector, Object.assign({ name }, options)) as any;
    };
  }
};

export function collect<
  I extends Members<Serial.Type>,
  O extends Members<Collect.Collector>
>(
  data: I,
  collection: Collect.Collection<O>,
  options?: Collect.Options
): Collect<O> {
  const response = collection(actions);
  const results: Partial<Collect<O>> = {};
  const errors: Members<Error> = {};

  for (const key of Object.keys(response) as Array<keyof O & keyof I>) {
    const fn = response[key];
    try {
      results[key] = fn(data[key], key as string);
    } catch (err) {
      errors[key as string] = err;

      if (options && options.failEarly) break;
    }
  }

  if (Object.keys(errors).length) throw new CollectError(errors);
  return results as Collect<O>;
}
