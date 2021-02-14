import { ensure } from '../../src/utils/ensure';
import { Schema } from '../../src/definitions';

describe(`preconditions`, () => {
  test(`validates schema`, () => {
    expect(() =>
      ensure('foo', 'bar' as any)
    ).toThrowErrorMatchingInlineSnapshot(
      `"schema is not valid: data/type should be equal to one of the allowed values, data/type should be array, data/type should match some schema in anyOf"`
    );
  });
});

describe(`defined`, () => {
  test(`passes w/ type name`, () => {
    expect(ensure('foo', 'string')).toBe('foo');
    expect(ensure('foo', 'string', { assert: false })).toBe('foo');
    expect(ensure('foo', 'string', { assert: true })).toBe('foo');
  });
  test(`fails w/ type name`, () => {
    const data: any = 'foo';
    expect(() => ensure(data, 'number')).toThrowErrorMatchingInlineSnapshot(
      `"data is not valid: data should be number"`
    );
    expect(() => ensure(data, 'number', { assert: true })).toThrowError();
    expect(() => ensure(data, 'number', { assert: false })).toThrowError();
  });
  test(`passes w/ schema`, () => {
    expect(ensure('foo', { type: 'string' })).toBe('foo');
    expect(ensure('foo', { type: 'string' }, { assert: true })).toBe('foo');
    expect(ensure('foo', { type: 'string' }, { assert: false })).toBe('foo');
  });
  test(`fails w/ schema`, () => {
    const data: any = 'foo';
    expect(() =>
      ensure(data, { type: 'number' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"data is not valid: data should be number"`
    );
    expect(() =>
      ensure(data, { type: 'number' }, { assert: true })
    ).toThrowError();
    expect(() =>
      ensure(data, { type: 'number' }, { assert: false })
    ).toThrowError();
  });
  test(`maintains value w/ default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(ensure('foo', schema)).toBe('foo');
    expect(ensure('foo', schema, { assert: true })).toBe('foo');
    expect(ensure('foo', schema, { assert: false })).toBe('foo');
  });
});

describe(`not defined`, () => {
  test(`passes with type name`, () => {
    expect(ensure(undefined, 'string')).toBe(undefined);
    expect(ensure(undefined, 'string', { assert: false })).toBe(undefined);
  });
  test(`fails with type name`, () => {
    expect(() =>
      ensure(undefined, 'string', { assert: true })
    ).toThrowErrorMatchingInlineSnapshot(
      `"data is not valid: data should not be undefined"`
    );
  });
  test(`passes with schema`, () => {
    expect(ensure(undefined, { type: 'string' })).toBe(undefined);
    expect(ensure(undefined, { type: 'string' }, { assert: false })).toBe(
      undefined
    );
  });
  test(`fails with schema`, () => {
    expect(() =>
      ensure(undefined, { type: 'string' }, { assert: true })
    ).toThrowErrorMatchingInlineSnapshot(
      `"data is not valid: data should not be undefined"`
    );
  });
  test(`sets default value`, () => {
    const schema: Schema = { type: 'string', default: 'bar' };
    expect(ensure(undefined, schema)).toBe('bar');
    expect(ensure(undefined, schema, { assert: true })).toBe('bar');
    expect(ensure(undefined, schema, { assert: false })).toBe('bar');
  });
});

describe(`formats`, () => {
  test(`uri`, () => {
    expect(() =>
      ensure('http://example.com', { type: 'string', format: 'uri' })
    ).not.toThrow();
    expect(() =>
      ensure('example', { type: 'string', format: 'uri' })
    ).toThrowError();
  });
  test(`email`, () => {
    expect(() =>
      ensure('foo@example.com', { type: 'string', format: 'email' })
    ).not.toThrow();
    expect(() =>
      ensure('example.com', { type: 'string', format: 'email' })
    ).toThrowError();
    expect(() =>
      ensure('квіточка@пошта.укр', { type: 'string', format: 'email' })
    ).toThrowError();
  });
  test(`idn-email`, () => {
    expect(() =>
      ensure('квіточка@пошта.укр', { type: 'string', format: 'idn-email' })
    ).not.toThrow();
    expect(() =>
      ensure('example.com', { type: 'string', format: 'idn-email' })
    ).toThrowError();
  });
});
