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

  export type Collector<T = any> = UnaryFn<Serial.Type, T>;

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
  get: () => (data) => data,
  assert: (...args) => (data: any) => assert(data, ...args),
  take: (...args) => (data: any) => take(data, ...args),
  ensure: (...args) => (data: any) => ensure(data, ...args) as any,
  coerce: (...args) => (data: any) => coerce(data, ...args) as any,
  select: (...args) => (data: any) => select(data, ...args)
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
      results[key] = fn(data[key]);
    } catch (err) {
      errors[key as string] = err;

      if (options && options.failEarly) break;
    }
  }

  if (Object.keys(errors).length) throw new CollectError(errors);
  return results as Collect<O>;
}
