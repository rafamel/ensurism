import { BasicType, Type, NotDefinedType } from '../../types';

/* Output */
export type Select<
  T extends SelectSelector,
  A extends boolean = false,
  G extends SelectStrategy = 'fallback'
> = Exclude<
  unknown extends T['default']
    ? SelectSelectorTypes<T>[keyof T] | undefined
    : G extends 'fallback'
    ? SelectSelectorTypes<T>[keyof T]
    : SelectSelectorTypes<T>[Exclude<keyof T, 'default'>] &
        SelectSelectorTypes<T>['default'],
  A extends true ? NotDefinedType : never
>;

/* Input */
export type SelectStrategy = 'fallback' | 'shallow' | 'merge' | 'deep';

export type SelectSelector<T extends BasicType = BasicType, S = any> = S &
  { [P in SelectSelectorValue<T>]?: Type | SelectSelectorCallback<Type> };

export type SelectSelectorCallback<T> = () => T;

export type SelectSelectorValue<T extends BasicType> =
  | (T extends string ? T : never)
  | (T extends undefined ? 'undefined' : never)
  | (T extends void ? 'undefined' : never)
  | (T extends null ? 'null' : never)
  | (T extends number ? string : never)
  | (T extends boolean ? 'true' | 'false' : never);

export type SelectSelectorTypes<T extends SelectSelector> = {
  [P in keyof T]: T[P] extends SelectSelectorCallback<Type>
    ? ReturnType<T[P]>
    : T[P];
};
