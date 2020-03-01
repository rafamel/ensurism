import { assert } from '~/utils/assert';

test(`succeeds w/ defined data`, () => {
  expect(assert('')).toBe('');
  expect(assert(0)).toBe(0);
  expect(assert(false)).toBe(false);
  expect(assert(null)).toBe(null);
  expect(assert(Number.NaN)).not.toBe(undefined);
});
test(`fails w/ undefined data`, () => {
  expect(() => assert(undefined)).toThrowErrorMatchingInlineSnapshot(
    `"Expected data not to be undefined"`
  );
});
test(`deeps doesn't have an effect on basic types`, () => {
  expect(assert('', true)).toBe('');
  expect(assert(0, true)).toBe(0);
  expect(assert(false, true)).toBe(false);
  expect(assert(null, true)).toBe(null);
  expect(assert(Number.NaN, true)).not.toBe(undefined);
  expect(() => assert(undefined, true)).toThrowError();
});
test(`succeeds for undefined inner values wo/ deep`, () => {
  expect(assert({ a: undefined, b: 0 })).toEqual({ a: undefined, b: 0 });
  expect(assert({ a: undefined, b: 0 }, false)).toEqual({ a: undefined, b: 0 });
  expect(assert([undefined, 0])).toEqual([undefined, 0]);
  expect(assert([undefined, 0], false)).toEqual([undefined, 0]);
});
test(`succeeds for undefined inner values w/ deep`, () => {
  expect(assert({ a: false, b: 0 }, true)).toEqual({ a: false, b: 0 });
  expect(assert([false, 0], true)).toEqual([false, 0]);
});
test(`fails for undefined inner values w/ deep`, () => {
  expect(() =>
    assert({ a: undefined, b: 0 }, true)
  ).toThrowErrorMatchingInlineSnapshot(
    `"An inner value of data is not defined"`
  );
  expect(() => assert([undefined, 0], true)).toThrowError();
});
