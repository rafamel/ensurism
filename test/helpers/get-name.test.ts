import { getName } from '../../src/helpers/get-name';

test(`succeeds wo/ options, schema`, () => {
  expect(getName()).toBe('');
});
test(`succeeds wo/ name, title`, () => {
  expect(getName({}, {})).toBe('');
});
test(`succeeds w/ name, wo/ title`, () => {
  expect(getName({ name: '' })).toBe('');
  expect(getName({ name: ' ' }, undefined)).toBe('');
  expect(getName({ name: 'foo' }, {})).toBe('"foo" ');
  expect(getName({ name: ' foo ' })).toBe('"foo" ');
  expect(getName({ name: 'foo bar' }, undefined)).toBe('"foo bar" ');
  expect(getName({ name: ' foo bar ' }, {})).toBe('"foo bar" ');
});
test(`succeeds wo/ name, w/ title`, () => {
  expect(getName(undefined, { title: '' })).toBe('');
  expect(getName({}, { title: ' ' })).toBe('');
  expect(getName(undefined, { title: 'foo' })).toBe('"foo" ');
  expect(getName({}, { title: ' foo ' })).toBe('"foo" ');
  expect(getName(undefined, { title: 'foo bar' })).toBe('"foo bar" ');
  expect(getName({}, { title: ' foo bar ' })).toBe('"foo bar" ');
});
test(`succeeds w/ name, w/ title`, () => {
  expect(getName({ name: '' }, { title: '' })).toBe('');
  expect(getName({ name: ' ' }, { title: ' ' })).toBe('');
  expect(getName({ name: 'foo' }, { title: ' ' })).toBe('"foo" ');
  expect(getName({ name: ' ' }, { title: 'foo' })).toBe('"foo" ');
  expect(getName({ name: 'foo' }, { title: 'bar' })).toBe('"foo" ');
});
