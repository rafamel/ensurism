import { Type } from '../../types';
import { constrain } from '../constrain';
import { coerce } from '../coerce';
import { assert } from '../assert';
import { select } from '../select';
import { CollectorFunctions, Collect, CollectCollector } from './types';

const functions: CollectorFunctions = {
  get(): any {
    return (data: any) => data;
  },
  assert(): any {
    return (data: any) => assert(data);
  },
  constrain(a: any, b?: any): any {
    return (data: any) => constrain(data, a, b);
  },
  coerce(a: any, b?: any): any {
    return (data: any) => coerce(data, a, b);
  },
  select(a: any, b?: any, c?: any): any {
    return (data: any) => select(data, a, b, c);
  }
};

export function collect<
  I extends Record<string, Type>,
  O extends Record<string, any>
>(record: I, collector: CollectCollector<I, O>): Collect<O> {
  const callbacks = collector(functions);
  const results: Partial<Collect<O>> = {};
  for (const key of Object.keys(callbacks) as Array<keyof O & keyof I>) {
    results[key] = callbacks[key](record[key]);
  }
  return results as Collect<O>;
}
