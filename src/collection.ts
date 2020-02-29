/* eslint-disable no-dupe-class-members */
import { shallow } from 'merge-strategies';
import { AssertValue, assert } from './assert';
import {
  BasicType,
  EmptyType,
  Type,
  SchemaTypeName,
  SchemaOptions,
  Response,
  EmptyConditional,
  SchemaType,
  FilterByType,
  FilterRecordByType
} from './types';
import { constrain } from './constrain';
import { coerce } from './coerce';
import { Selector, Selection, SelectStrategy, select } from './select';
import { Collector, CollectResponse, collect } from './collect';
import { isType } from './helpers/is-type';

const PURE_COLLECTION = Symbol('PureCollection');
const COLLECTION = Symbol('Collection');

export type CollectionType<
  T extends PureCollection<any>
> = T extends PureCollection<infer U> ? U : never;

export type PureCollectionDefine<T> = () => T;
export type CollectionDefine<T, V> = (variables: PureCollection<V>) => T;

export class PureCollection<T extends Record<string, any>> {
  private [PURE_COLLECTION]: { define: PureCollectionDefine<T>; value?: T };
  public constructor(define: T | PureCollectionDefine<T>) {
    this[PURE_COLLECTION] = {
      define: (typeof define === 'function'
        ? define
        : (): T => define) as PureCollectionDefine<T>
    };
  }
  public clear(): this {
    if (Object.hasOwnProperty.call(this[PURE_COLLECTION], 'value')) {
      delete this[PURE_COLLECTION].value;
    }
    return this;
  }
  public all(): T {
    if (Object.hasOwnProperty.call(this[PURE_COLLECTION], 'value')) {
      return this[PURE_COLLECTION].value as T;
    }

    const value = this[PURE_COLLECTION].define();
    this[PURE_COLLECTION].value = value;
    return value;
  }
  public get<K extends keyof T>(property: K): T[K] {
    return this.all()[property];
  }
  public assert<K extends keyof T, D extends boolean = false>(
    property: K,
    deep?: D
  ): AssertValue<T[K], D> {
    return assert(this.get(property), deep);
  }
  public constrain<
    K extends keyof FilterRecordByType<T, Type>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName
  >(property: K, schema: SchemaOptions<T[K], D, E, N>): Response<T[K], D, E, N>;
  public constrain<
    K extends keyof FilterRecordByType<T, Type>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    schema: SchemaOptions<T[K], D, E, N>
  ): Response<T[K], D, E, N, A>;
  public constrain<K extends keyof T>(property: K, a: any, b?: any): any {
    return constrain(this.get(property), a, b);
  }
  public coerce<
    K extends keyof FilterRecordByType<T, string | EmptyType>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName
  >(
    property: K,
    schema: SchemaOptions<EmptyConditional<T[K], SchemaType, Type>, D, E, N>
  ): Response<EmptyConditional<T[K], SchemaType, Type>, D, E, N>;
  public coerce<
    K extends keyof FilterRecordByType<T, string | EmptyType>,
    D extends Type,
    E extends Type,
    N extends SchemaTypeName,
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    schema: SchemaOptions<EmptyConditional<T[K], SchemaType, Type>, D, E, N>
  ): Response<EmptyConditional<T[K], SchemaType, Type>, D, E, N, A>;
  public coerce<K extends keyof T>(property: K, a: any, b?: any): any {
    return coerce(this.get(property) as any, a, b);
  }
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends Selector
  >(
    property: K,
    selector: Selector<FilterByType<T[K], BasicType>, S>
  ): Selection<S>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends Selector,
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    selector: Selector<FilterByType<T[K], BasicType>, S>
  ): Selection<S, A>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends Selector,
    G extends SelectStrategy = 'fallback'
  >(
    property: K,
    strategy: G | EmptyType,
    selector: Selector<FilterByType<T[K], BasicType>, S>
  ): Selection<S, false, G>;
  public select<
    K extends keyof FilterRecordByType<T, BasicType>,
    S extends Selector,
    G extends SelectStrategy = 'fallback',
    A extends boolean = false
  >(
    property: K,
    assert: A | EmptyType,
    strategy: G | EmptyType,
    selector: Selector<FilterByType<T[K], BasicType>, S>
  ): Selection<S, A, G>;
  public select<K extends keyof T>(property: K, a: any, b?: any, c?: any): any {
    return select(this.get(property) as any, a, b, c);
  }
  public collect<O extends Record<string, any>>(
    collector: Collector<FilterRecordByType<T, Type>, O>
  ): CollectResponse<O> {
    return collect(
      Object.entries(this.all()).reduce((acc, [key, value]) => {
        return isType(value) ? Object.assign(acc, { [key]: value }) : value;
      }, {}),
      collector
    );
  }
}

export class Collection<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends PureCollection<T> {
  private [COLLECTION]: { variables: V; define: CollectionDefine<T, V> };
  public constructor(variables: V, define: CollectionDefine<T, V>) {
    super(() => define(new PureCollection(() => this[COLLECTION].variables)));
    this[COLLECTION] = { variables, define };
  }
  public create(variables?: Partial<V> | EmptyType): Collection<T, V> {
    const instance = new Collection(
      this[COLLECTION].variables,
      this[COLLECTION].define
    );
    return variables ? instance.use(variables) : instance;
  }
  public use(variables: Partial<V>): this {
    if (variables) {
      this[COLLECTION].variables = shallow(
        this[COLLECTION].variables,
        variables
      ) as V;
    }

    return this.clear();
  }
}
