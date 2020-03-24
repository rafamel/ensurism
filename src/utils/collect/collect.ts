import { Type, EmptyType } from '../../types';
import { assert } from '../assert';
import { take } from '../take';
import { ensure } from '../ensure';
import { coerce } from '../coerce';
import { select } from '../select';
import {
  CollectorFunctions,
  Collect,
  CollectCollector,
  CollectOptions
} from './types';
import { CollectError } from './CollectError';

const functions: CollectorFunctions = {
  get(): any {
    return (data: any) => data;
  },
  assert(): any {
    return (data: any) => assert(data);
  },
  take(a: any, b?: any): any {
    return (data: any) => take(data, a, b);
  },
  ensure(a: any, b?: any): any {
    return (data: any) => ensure(data, a, b);
  },
  coerce(a: any, b?: any): any {
    return (data: any) => coerce(data, a, b);
  },
  select(a: any, b?: any, c?: any): any {
    return (data: any) => select(data, a, b, c);
  }
};

export function collect<I extends Record<string, Type>, O>(
  data: I,
  collector: CollectCollector<O>
): Collect<O>;
export function collect<I extends Record<string, Type>, O>(
  data: I,
  options: CollectOptions | EmptyType,
  collector: CollectCollector<O>
): Collect<O>;

export function collect<I extends Record<string, Type>, O>(
  data: I,
  a: CollectCollector<O> | CollectOptions | EmptyType,
  b?: CollectCollector<O>
): Collect<O> {
  const collector = (b || a) as CollectCollector<O>;
  const options = Object.assign(
    { failEarly: false },
    b ? (a as CollectOptions | EmptyType) : {}
  );

  const response = collector(functions);
  const results: Partial<Collect<O>> = {};
  const errors: Record<string, Error> = {};

  for (const key of Object.keys(response) as Array<keyof O & keyof I>) {
    const value = response[key];
    try {
      results[key] = typeof value === 'function' ? value(data[key]) : value;
    } catch (err) {
      errors[key as string] = err;
      if (options.failEarly) break;
    }
  }

  if (Object.keys(errors).length) throw new CollectError(errors);
  return results as Collect<O>;
}
