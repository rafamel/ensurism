import { Type, SchemaTypeName, EmptyType, BasicType } from '../../types';
import { Assert } from '../assert';
import { SelectSelector, Select, SelectStrategy } from '../select';
import { Constrain, ConstrainSchema } from '../constrain';
import { CoerceSchema, Coerce } from '../coerce';

/* Output */
export type Collect<O extends Record<string, any>> = {
  [P in keyof O]: O[P] extends Type ? O[P] : ReturnType<O[P]>;
};

/* Input */
export type CollectCollector<I extends Record<string, Type>, O = any> = (
  fn: CollectorFunctions
) => O & { [P in keyof I]?: Type | CollectCollectorCallback<Type, any> };

export type CollectCollectorCallback<T extends Type, U> = (data: T) => U;

export interface CollectorFunctions {
  get(): Type;
  assert(): Assert<Type>;
  constrain<D extends Type, E extends Type, N extends SchemaTypeName = never>(
    schema: ConstrainSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Constrain<Type, D, E, N>>;
  constrain<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName = never,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: ConstrainSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Constrain<Type, D, E, N, A>>;
  coerce<D extends Type, E extends Type, N extends SchemaTypeName>(
    schema: CoerceSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Coerce<string | EmptyType, D, E, N>>;
  coerce<
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    assert: A | EmptyType,
    schema: CoerceSchema<any, D, E, N>
  ): CollectCollectorCallback<Type, Coerce<string | EmptyType, D, E, N, A>>;
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
