import * as getPositional from '~/helpers/get-positional';
import { ensure } from '~/utils/ensure';
import { Schema } from '~/types';

const mocks = {
  getPositionalAssertSchema: jest.spyOn(
    getPositional,
    'getPositionalAssertSchema'
  )
};

describe(`preconditions`, () => {
  test(`calls getPositionalAssertSchema`, () => {
    expect(() => ensure('', 1 as any, 2 as any)).toThrowError();
    expect(mocks.getPositionalAssertSchema).toHaveBeenLastCalledWith(1, 2);
  });
  test(`validates schema`, () => {
    expect(() =>
      ensure('foo', 'bar' as any)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Schema is not valid: data.type should be equal to one of the allowed values, data.type should be array, data.type should match some schema in anyOf"`
    );
  });
});

describe(`defined`, () => {
  test(`passes w/ type name`, () => {
    expect(ensure('foo', 'string')).toBe('foo');
    expect(ensure('foo', false, 'string')).toBe('foo');
    expect(ensure('foo', true, 'string')).toBe('foo');
  });
  test(`fails w/ type name`, () => {
    const data: any = 'foo';
    expect(() => ensure(data, 'number')).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should be number"`
    );
    expect(() => ensure(data, true, 'number')).toThrowError();
    expect(() => ensure(data, false, 'number')).toThrowError();
  });
  test(`passes w/ schema`, () => {
    expect(ensure('foo', { type: 'string' })).toBe('foo');
    expect(ensure('foo', true, { type: 'string' })).toBe('foo');
    expect(ensure('foo', false, { type: 'string' })).toBe('foo');
  });
  test(`fails w/ schema`, () => {
    const data: any = 'foo';
    expect(() =>
      ensure(data, { type: 'number' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should be number"`
    );
    expect(() => ensure(data, true, { type: 'number' })).toThrowError();
    expect(() => ensure(data, false, { type: 'number' })).toThrowError();
  });
  test(`maintains value w/ default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(ensure('foo', schema)).toBe('foo');
    expect(ensure('foo', true, schema)).toBe('foo');
    expect(ensure('foo', false, schema)).toBe('foo');
  });
});

describe(`not defined`, () => {
  test(`passes with type name`, () => {
    expect(ensure(undefined, 'string')).toBe(undefined);
    expect(ensure(undefined, false, 'string')).toBe(undefined);
  });
  test(`fails with type name`, () => {
    expect(() =>
      ensure(undefined, true, 'string')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should not be undefined"`
    );
  });
  test(`passes with schema`, () => {
    expect(ensure(undefined, { type: 'string' })).toBe(undefined);
    expect(ensure(undefined, false, { type: 'string' })).toBe(undefined);
  });
  test(`fails with schema`, () => {
    expect(() =>
      ensure(undefined, true, { type: 'string' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should not be undefined"`
    );
  });
  test(`sets default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(ensure(undefined, schema)).toBe('bar');
    expect(ensure(undefined, true, schema)).toBe('bar');
    expect(ensure(undefined, false, schema)).toBe('bar');
  });
});
