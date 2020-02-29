import { isType, isBasicType } from '~/helpers/is-type';

test(`undefined`, () => {
  expect(isType(undefined)).toBe(true);
  expect(isBasicType(undefined)).toBe(true);
});
test(`null`, () => {
  expect(isType(null)).toBe(true);
  expect(isBasicType(null)).toBe(true);
});
test(`string`, () => {
  expect(isType('')).toBe(true);
  expect(isBasicType('')).toBe(true);
});
test(`number`, () => {
  expect(isType(0)).toBe(true);
  expect(isBasicType(0)).toBe(true);
});
test(`boolean`, () => {
  expect(isType(true)).toBe(true);
  expect(isType(false)).toBe(true);
  expect(isBasicType(true)).toBe(true);
  expect(isBasicType(false)).toBe(true);
});
test(`array`, () => {
  expect(isType([])).toBe(true);
  expect(isBasicType([])).toBe(false);
});
test(`object`, () => {
  expect(isType({})).toBe(true);
  expect(isBasicType({})).toBe(false);
});
test(`function`, () => {
  expect(isType(() => null)).toBe(false);
  expect(isBasicType(() => null)).toBe(false);
});
