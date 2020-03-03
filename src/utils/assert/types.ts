import { ExcludeNotDefined } from '../../types';

export type Assert<T, D extends boolean = false> = D extends true
  ? ExcludeNotDefined<T> extends Array<infer U>
    ? Array<ExcludeNotDefined<U>>
    : ExcludeNotDefined<T> extends Record<string, any>
    ? { [P in keyof T]: ExcludeNotDefined<T[P]> }
    : ExcludeNotDefined<T>
  : ExcludeNotDefined<T>;
