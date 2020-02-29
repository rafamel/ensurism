import * as getPositional from '~/helpers/get-positional';
import { constrain } from '~/utils/constrain';
import { Schema } from '~/types';

const mocks = {
  getPositionalAssertSchema: jest.spyOn(
    getPositional,
    'getPositionalAssertSchema'
  )
};

describe(`preconditions`, () => {
  test(`calls getPositionalAssertSchema`, () => {
    expect(() => constrain('', 1 as any, 2 as any)).toThrowError();
    expect(mocks.getPositionalAssertSchema).toHaveBeenLastCalledWith(1, 2);
  });
  test(`validates schema`, () => {
    expect(() =>
      constrain('foo', 'bar' as any)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Schema is not valid: data.type should be equal to one of the allowed values, data.type should be array, data.type should match some schema in anyOf"`
    );
  });
});

describe(`defined`, () => {
  test(`passes w/ type name`, () => {
    expect(constrain('foo', 'string')).toBe('foo');
    expect(constrain('foo', false, 'string')).toBe('foo');
    expect(constrain('foo', true, 'string')).toBe('foo');
  });
  test(`fails w/ type name`, () => {
    const data: any = 'foo';
    expect(() => constrain(data, 'number')).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should be number"`
    );
    expect(() => constrain(data, true, 'number')).toThrowError();
    expect(() => constrain(data, false, 'number')).toThrowError();
  });
  test(`passes w/ schema`, () => {
    expect(constrain('foo', { type: 'string' })).toBe('foo');
    expect(constrain('foo', true, { type: 'string' })).toBe('foo');
    expect(constrain('foo', false, { type: 'string' })).toBe('foo');
  });
  test(`fails w/ schema`, () => {
    const data: any = 'foo';
    expect(() =>
      constrain(data, { type: 'number' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should be number"`
    );
    expect(() => constrain(data, true, { type: 'number' })).toThrowError();
    expect(() => constrain(data, false, { type: 'number' })).toThrowError();
  });
  test(`maintains value w/ default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(constrain('foo', schema)).toBe('foo');
    expect(constrain('foo', true, schema)).toBe('foo');
    expect(constrain('foo', false, schema)).toBe('foo');
  });
});

describe(`not defined`, () => {
  test(`passes with type name`, () => {
    expect(constrain(undefined, 'string')).toBe(undefined);
    expect(constrain(undefined, false, 'string')).toBe(undefined);
  });
  test(`fails with type name`, () => {
    expect(() =>
      constrain(undefined, true, 'string')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should not be undefined"`
    );
  });
  test(`passes with schema`, () => {
    expect(constrain(undefined, { type: 'string' })).toBe(undefined);
    expect(constrain(undefined, false, { type: 'string' })).toBe(undefined);
  });
  test(`fails with schema`, () => {
    expect(() =>
      constrain(undefined, true, { type: 'string' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data is not valid: data should not be undefined"`
    );
  });
  test(`sets default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(constrain(undefined, schema)).toBe('bar');
    expect(constrain(undefined, true, schema)).toBe('bar');
    expect(constrain(undefined, false, schema)).toBe('bar');
  });
});
