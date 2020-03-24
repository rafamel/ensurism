import { Type, SchemaTypeName, EmptyType, BasicType } from '../../types';
import { Assert } from '../assert';
import { SelectSelector, Select, SelectStrategy } from '../select';
import { Ensure, EnsureSchema } from '../ensure';
import { CoerceSchema, Coerce } from '../coerce';
import { TakeStrategy, Take } from '../take';

/* Output */
export type Collect<O extends Record<string, any>> = {
  [P in keyof O]: O[P] extends Type ? O[P] : ReturnType<O[P]>;
};

/* Input */
export interface CollectOptions {
  failEarly: boolean;
}

export type CollectCollector<O> = (fn: CollectorFunctions) => O;

export type CollectCollectorCallback<T extends Type, U> = (data: T) => U;

export interface CollectorFunctions {
  get(): Type;
  assert(): Assert<Type>;
  take(strategy: TakeStrategy): Take<Type>;
  take<A extends boolean = false>(
    assert: A,
    strategy: TakeStrategy
  ): Take<Type, A>;
  ensure<D extends Type, E extends Type, N extends SchemaTypeName = never>(
    schema: EnsureSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Ensure<Type, D, E, N>>;
  ensure<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName = never,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: EnsureSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Ensure<Type, D, E, N, A>>;
  coerce<D extends Type, E extends Type, N extends SchemaTypeName>(
    schema: CoerceSchema<D, E, N>
  ): CollectCollectorCallback<Type, Coerce<D, E, N>>;
  coerce<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: CoerceSchema<D, E, N>
  ): CollectCollectorCallback<Type, Coerce<D, E, N, A>>;
  select<S extends SelectSelector>(
    selector: SelectSelector<BasicType, S>
  ): CollectCollectorCallback<Type, Select<S>>;
  select<S extends SelectSelector, A extends boolean = false>(
    assert: A | EmptyType,
    selector: SelectSelector<BasicType, S>
  ): CollectCollectorCallback<Type, Select<S, A>>;
  select<S extends SelectSelector, G extends SelectStrategy = 'fallback'>(
    strategy: G | EmptyType,
    selector: SelectSelector<BasicType, S>
  ): CollectCollectorCallback<Type, Select<S, false, G>>;
  select<
    S extends SelectSelector,
    G extends SelectStrategy = 'fallback',
    A extends boolean = false
  >(
    assert: A | EmptyType,
    strategy: G | EmptyType,
    selector: SelectSelector<BasicType, S>
  ): CollectCollectorCallback<Type, Select<S, A, G>>;
}
