export type FilterByType<T, U> = T extends U ? T : never;

export type FilterRecordByType<T extends Record<string, any>, U> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends U ? K : never }[keyof T]
>;
