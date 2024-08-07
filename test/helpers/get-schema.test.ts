import { expect, test } from 'vitest';

import { getSchema } from '../../src/helpers/get-schema';

test(`succeeds with type name`, () => {
  expect(getSchema('string')).toEqual({ type: 'string' });
});
test(`succeeds w/ valid schema`, () => {
  expect(getSchema({ type: 'string' })).toEqual({ type: 'string' });
});
test(`fails w/ no schema`, () => {
  expect(() => getSchema(undefined)).toThrowErrorMatchingInlineSnapshot(
    `[Error: schema was not provided]`
  );
});
test(`fails w/ no schema type`, () => {
  expect(() => getSchema({} as any)).toThrowErrorMatchingInlineSnapshot(
    `[Error: schema must have a type]`
  );
});
test(`fails w/ schema type array`, () => {
  expect(() =>
    getSchema({ type: ['string'] } as any)
  ).toThrowErrorMatchingInlineSnapshot(
    `[TypeError: schema type must be a string]`
  );
});
