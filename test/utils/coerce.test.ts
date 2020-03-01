import * as getPositional from '~/helpers/get-positional';
import { constrain } from '~/utils/constrain';
import { coerce } from '~/utils/coerce';
import { Schema } from '~/types';

jest.mock('~/utils/constrain');
const response = {};
const mocks = {
  constrain: (constrain as jest.Mock).mockImplementation(() => response),
  getPositionalAssertSchema: jest.spyOn(
    getPositional,
    'getPositionalAssertSchema'
  )
};

describe(`preconditions`, () => {
  test(`calls getPositionalAssertSchema`, () => {
    mocks.getPositionalAssertSchema.mockImplementationOnce(() => ({
      assert: true,
      schema: { type: 'string' }
    }));
    coerce('', 1 as any, 2 as any);
    expect(mocks.getPositionalAssertSchema).toHaveBeenLastCalledWith(1, 2);
  });
  test(`succeeds constrain w/ undefined data`, () => {
    coerce(undefined, 'string');
    expect(mocks.constrain).toHaveBeenLastCalledWith(undefined, false, {
      type: 'string'
    });
    coerce(undefined, true, 'string');
    expect(mocks.constrain).toHaveBeenLastCalledWith(undefined, true, {
      type: 'string'
    });
  });
  test(`fails w/ non string data`, () => {
    expect(() => coerce(null, 'string')).toThrowErrorMatchingInlineSnapshot(
      `"Data must be a string to be coerced"`
    );
    expect(() => coerce(0 as any, 'string')).toThrowError();
    expect(() => coerce(false as any, 'string')).toThrowError();
    expect(() => coerce({} as any, 'string')).toThrowError();
    expect(() => coerce(Number.NaN as any, 'string')).toThrowError();
  });
  test(`fails w/ invalid schema type`, () => {
    expect(() =>
      coerce('foo', 'bar' as any)
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid schema type: bar"`);
  });
});

describe(`string`, () => {
  test(`succeeds`, () => {
    const schema: Schema = { type: 'string' };
    coerce('foo', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith('foo', false, schema);
  });
  test(`succeeds for stringified value`, () => {
    const schema: Schema = { type: 'string' };
    coerce(JSON.stringify('foo'), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith('foo', false, schema);
  });
  test(`calls constrain with all arguments`, () => {
    const schema: Schema = { type: 'string' };
    coerce('foo', false, schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith('foo', false, schema);
    coerce('foo', true, schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith('foo', true, schema);
  });
});

describe(`integer, number`, () => {
  test(`succeeds`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];
    for (const schema of schemas) {
      coerce('-1', schema);
      expect(mocks.constrain).toHaveBeenLastCalledWith(-1, false, schema);
      coerce('0.2', schema);
      expect(mocks.constrain).toHaveBeenLastCalledWith(0.2, false, schema);
    }
  });
  test(`succeeds for stringified value`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];
    for (const schema of schemas) {
      coerce(JSON.stringify(-1), schema);
      expect(mocks.constrain).toHaveBeenLastCalledWith(-1, false, schema);
      coerce(JSON.stringify(0.2), schema);
      expect(mocks.constrain).toHaveBeenLastCalledWith(0.2, false, schema);
    }
  });
  test(`fails for NaN`, () => {
    expect(() =>
      coerce('foo', { type: 'integer' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Data couldn't be coerced to number: foo"`
    );
    expect(() => coerce('foo', { type: 'number' })).toThrowError();
  });
  test(`calls constrain with all arguments`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];

    for (const schema of schemas) {
      expect(coerce('0', schema)).toBe(response);
      expect(mocks.constrain).toHaveBeenLastCalledWith(0, false, schema);
      expect(coerce('0', false, schema)).toBe(response);
      expect(mocks.constrain).toHaveBeenLastCalledWith(0, false, schema);
      expect(coerce('0', true, schema)).toBe(response);
      expect(mocks.constrain).toHaveBeenLastCalledWith(0, true, schema);
    }
  });
});

describe(`boolean`, () => {
  test(`succeeds for falsy values`, () => {
    const schema: Schema = { type: 'boolean' };
    coerce('0', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('""', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('false', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('null', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('undefined', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce('NaN', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
  });
  test(`succeeds for truthy values`, () => {
    const schema: Schema = { type: 'boolean' };
    coerce('1', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    coerce('-1', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    coerce('foo', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    coerce('true', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
  });
  test(`succeeds for stringified values`, () => {
    const schema: Schema = { type: 'boolean' };
    coerce(JSON.stringify(true), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    coerce(JSON.stringify(false), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce(JSON.stringify(0), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce(JSON.stringify(''), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce(JSON.stringify(null), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
    coerce(JSON.stringify(Number.NaN), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(false, false, schema);
  });
  test(`calls constrain with all arguments`, () => {
    const schema: Schema = { type: 'boolean' };
    expect(coerce('true', schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    expect(coerce('true', false, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, false, schema);
    expect(coerce('true', true, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(true, true, schema);
  });
});

describe(`null`, () => {
  test(`succeeds for falsy values`, () => {
    const schema: Schema = { type: 'null' };
    coerce('0', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('""', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('false', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('null', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('undefined', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce('NaN', schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
  });
  test(`fails for truthy values`, () => {
    const schema: Schema = { type: 'null' };
    expect(() => coerce('1', schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data couldn't be coerced to null: 1"`
    );
    expect(() => coerce('-1', schema)).toThrowError();
    expect(() => coerce('foo', schema)).toThrowError();
    expect(() => coerce('true', schema)).toThrowError();
  });
  test(`succeeds for stringified values`, () => {
    const schema: Schema = { type: 'null' };
    coerce(JSON.stringify(false), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce(JSON.stringify(0), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce(JSON.stringify(''), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce(JSON.stringify(null), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    coerce(JSON.stringify(Number.NaN), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
  });
  test(`calls constrain with all arguments`, () => {
    const schema: Schema = { type: 'null' };
    expect(coerce('null', schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    expect(coerce('null', false, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, false, schema);
    expect(coerce('null', true, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(null, true, schema);
  });
});

describe(`array`, () => {
  test(`succeeds`, () => {
    const item = ['foo', 'bar'];
    const schema: Schema = { type: 'array' };
    coerce(JSON.stringify(item), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
  });
  test(`fails for malformed data`, () => {
    expect(() =>
      coerce('1,2,3', { type: 'array' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid JSON data for array: 1,2,3"`
    );
  });
  test(`calls constrain with all arguments`, () => {
    const item = ['foo', 'bar'];
    const schema: Schema = { type: 'array' };
    expect(coerce(JSON.stringify(item), schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
    expect(coerce(JSON.stringify(item), false, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
    expect(coerce(JSON.stringify(item), true, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, true, schema);
  });
});

describe(`object`, () => {
  test(`succeeds`, () => {
    const item = { foo: 'foo', bar: 'bar' };
    const schema: Schema = { type: 'object' };
    coerce(JSON.stringify(item), schema);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
  });
  test(`fails for malformed data`, () => {
    expect(() =>
      coerce('foo: "foo"', { type: 'object' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid JSON data for object: foo: \\"foo\\""`
    );
  });
  test(`calls constrain with all arguments`, () => {
    const item = { foo: 'foo', bar: 'bar' };
    const schema: Schema = { type: 'object' };
    expect(coerce(JSON.stringify(item), schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
    expect(coerce(JSON.stringify(item), false, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, false, schema);
    expect(coerce(JSON.stringify(item), true, schema)).toBe(response);
    expect(mocks.constrain).toHaveBeenLastCalledWith(item, true, schema);
  });
});
