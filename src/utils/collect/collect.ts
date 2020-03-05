import { Type } from '../../types';
import { assert } from '../assert';
import { take } from '../take';
import { ensure } from '../ensure';
import { coerce } from '../coerce';
import { select } from '../select';
import { CollectorFunctions, Collect, CollectCollector } from './types';

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
): Collect<O> {
  const response = collector(functions);
  const results: Partial<Collect<O>> = {};
  for (const key of Object.keys(response) as Array<keyof O & keyof I>) {
    const value = response[key];
    results[key] = typeof value === 'function' ? value(data[key]) : value;
  }
  return results as Collect<O>;
}
