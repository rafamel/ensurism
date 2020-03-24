/* eslint-disable no-dupe-class-members */
import {
  BasicType,
  EmptyType,
  Type,
  SchemaTypeName,
  FilterByType,
  FilterRecordByType
} from '../types';
import { isType } from '../helpers/is-type';
import {
  Assert,
  assert,
  ensure,
  coerce,
  SelectSelector,
  Select,
  SelectStrategy,
  select,
  collect,
  EnsureSchema,
  Ensure,
  CoerceSchema,
  Coerce,
  TakeStrategy,
  Take,
  take,
  CollectCollector,
  Collect,
  CollectOptions
} from '../utils';
import { PureCollectionInitial } from './types';

const internal = Symbol('PureCollection');

export class PureCollection<T extends Record<string, any>> {
  private [internal]: { initial: PureCollectionInitial<T>; value?: T };
  public constructor(initial: T | PureCollectionInitial<T>) {
    this[internal] = {
      initial: (typeof initial === 'function'
        ? initial
        : () => initial) as PureCollectionInitial<T>
    };
  }
  public clear(): this {
    if (Object.hasOwnProperty.call(this[internal], 'value')) {
      delete this[internal].value;
    }
    return this;
  }
  public all(): T {
    if (Object.hasOwnProperty.call(this[internal], 'value')) {
      return this[internal].value as T;
    }

    const value = this[internal].initial();
    this[internal].value = value;
    return value;
  }
  public get<K extends keyof T>(property: K): T[K] {
    return this.all()[property];
  }
  public assert<K extends keyof T, D extends boolean = false>(
    property: K,
    deep?: D
  ): Assert<T[K], D> {
    return assert(this.get(property), deep);
  }
  public take<K extends keyof T>(
    property: K,
    strategy: TakeStrategy
  ): Take<T[K]>;
  public take<K extends keyof T, A extends boolean = false>(
    property: K,
    assert: A,
    strategy: TakeStrategy
  ): Take<T[K], A>;
  public take(property: keyof T, a: any, b?: any): any {
    return take(this.get(property), a, b);
  }
  public ensure<
    K extends keyof FilterRecordByType<T, Type>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName
  >(property: K, schema: EnsureSchema<T[K], D, E, N>): Ensure<T[K], D, E, N>;
  public ensure<
    K extends keyof FilterRecordByType<T, Type>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    schema: EnsureSchema<T[K], D, E, N>
  ): Ensure<T[K], D, E, N, A>;
  public ensure(property: keyof T, a: any, b?: any): any {
    return ensure(this.get(property), a, b);
  }
  public coerce<D extends Type, E extends Type, N extends SchemaTypeName>(
    property: keyof FilterRecordByType<T, Type>,
    schema: CoerceSchema<D, E, N>
  ): Coerce<D, E, N>;
  public coerce<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: keyof FilterRecordByType<T, Type>,
    assert: A | EmptyType,
    schema: CoerceSchema<D, E, N>
  ): Coerce<D, E, N, A>;
  public coerce(property: keyof T, a: any, b?: any): any {
    return coerce(this.get(property) as any, a, b);
  }
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends SelectSelector
  >(
    property: K,
    selector: SelectSelector<FilterByType<T[K], BasicType>, S>
  ): Select<S>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends SelectSelector,
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    selector: SelectSelector<FilterByType<T[K], BasicType>, S>
  ): Select<S, A>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends SelectSelector,
    G extends SelectStrategy = 'fallback'
  >(
    property: K,
    strategy: G | EmptyType,
    selector: SelectSelector<FilterByType<T[K], BasicType>, S>
  ): Select<S, false, G>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends SelectSelector,
    G extends SelectStrategy = 'fallback',
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    strategy: G | EmptyType,
    selector: SelectSelector<FilterByType<T[K], BasicType>, S>
  ): Select<S, A, G>;
  public select(property: keyof T, a: any, b?: any, c?: any): any {
    return select(this.get(property) as any, a, b, c);
  }
  public collect<O>(collector: CollectCollector<O>): Collect<O>;
  public collect<O>(
    options: CollectOptions,
    collector: CollectCollector<O>
  ): Collect<O>;
  public collect(a: any, b?: any): any {
    return collect(
      Object.entries(this.all()).reduce((acc, [key, value]) => {
        return isType(value) ? Object.assign(acc, { [key]: value }) : acc;
      }, {}),
      a,
      b
    );
  }
}
