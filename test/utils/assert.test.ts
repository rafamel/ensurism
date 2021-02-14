import { assert } from '../../src/utils/assert';

test(`succeeds w/ defined data`, () => {
  expect(assert('')).toBe('');
  expect(assert(0)).toBe(0);
  expect(assert(false)).toBe(false);
  expect(assert(null)).toBe(null);
  expect(assert(Number.NaN)).not.toBe(undefined);
});
test(`fails w/ undefined data`, () => {
  expect(() => assert(undefined)).toThrowErrorMatchingInlineSnapshot(
    `"expected data not to be undefined"`
  );
  expect(() =>
    assert(undefined, { message: 'foo' })
  ).toThrowErrorMatchingInlineSnapshot(`"foo"`);
});
test(`Options.deep doesn't have an effect on basic types`, () => {
  expect(assert('', { deep: true })).toBe('');
  expect(assert(0, { deep: true })).toBe(0);
  expect(assert(false, { deep: true })).toBe(false);
  expect(assert(null, { deep: true })).toBe(null);
  expect(assert(Number.NaN, { deep: true })).not.toBe(undefined);
  expect(() =>
    assert(undefined, { deep: true })
  ).toThrowErrorMatchingInlineSnapshot(`"expected data not to be undefined"`);
  expect(() =>
    assert(undefined, { deep: true, message: 'foo' })
  ).toThrowErrorMatchingInlineSnapshot(`"foo"`);
});
test(`succeeds for undefined inner values wo/ deep`, () => {
  expect(assert({ a: undefined, b: 0 })).toEqual({ a: undefined, b: 0 });
  expect(assert({ a: undefined, b: 0 }, { deep: false })).toEqual({
    a: undefined,
    b: 0
  });
  expect(assert([undefined, 0])).toEqual([undefined, 0]);
  expect(assert([undefined, 0], { deep: false })).toEqual([undefined, 0]);
});
test(`succeeds for undefined inner values w/ deep`, () => {
  expect(assert({ a: false, b: 0 }, { deep: true })).toEqual({
    a: false,
    b: 0
  });
  expect(assert([false, 0], { deep: true })).toEqual([false, 0]);
});
test(`fails for undefined inner values w/ deep`, () => {
  expect(() =>
    assert({ a: undefined, b: 0 }, { deep: true })
  ).toThrowErrorMatchingInlineSnapshot(
    `"an inner value of data is not defined"`
  );
  expect(() =>
    assert({ a: undefined, b: 0 }, { deep: true, message: 'foo' })
  ).toThrowErrorMatchingInlineSnapshot(`"foo"`);
  expect(() =>
    assert([undefined, 0], { deep: true })
  ).toThrowErrorMatchingInlineSnapshot(
    `"an inner value of data is not defined"`
  );
  expect(() =>
    assert([undefined, 0], { deep: true, message: 'foo' })
  ).toThrowErrorMatchingInlineSnapshot(`"foo"`);
});
