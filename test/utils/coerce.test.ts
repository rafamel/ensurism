import * as getPositional from '~/helpers/get-positional';
import { ensure } from '~/utils/ensure';
import { coerce } from '~/utils/coerce';
import { Schema } from '~/types';

jest.mock('~/utils/ensure');
const response = {};
const mocks = {
  ensure: (ensure as jest.Mock).mockImplementation(() => response),
  getPositionalAssertSchema: jest.spyOn(
    getPositional,
    'getPositionalAssertSchema'
  )
};

beforeEach(() => Object.values(mocks).map((mock) => mock.mockClear()));

describe(`preconditions`, () => {
  test(`calls getPositionalAssertSchema`, () => {
    mocks.getPositionalAssertSchema.mockImplementationOnce(() => ({
      assert: true,
      schema: { type: 'string' }
    }));
    coerce('', 1 as any, 2 as any);
    expect(mocks.getPositionalAssertSchema).toHaveBeenLastCalledWith(1, 2);
  });
  test(`succeeds ensure w/ undefined data`, () => {
    coerce(undefined, 'string');
    expect(mocks.ensure).toHaveBeenLastCalledWith(undefined, false, {
      type: 'string'
    });
    coerce(undefined, true, 'string');
    expect(mocks.ensure).toHaveBeenLastCalledWith(undefined, true, {
      type: 'string'
    });
  });
  test(`fails w/ invalid schema type`, () => {
    expect(() =>
      coerce('foo', 'bar' as any)
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid schema type: bar"`);
  });
  test(`calls ensure with all arguments`, () => {
    const schema: Schema = { type: 'string' };

    coerce('foo', schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    coerce('foo', 'string');
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    coerce('foo', false, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    coerce('foo', false, 'string');
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    coerce('foo', true, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', true, schema);
    coerce('foo', true, 'string');
    expect(mocks.ensure).toHaveBeenLastCalledWith('foo', true, schema);
    expect(mocks.ensure).toHaveBeenCalledTimes(6);
  });
});

describe(`from string`, () => {
  describe(`to string`, () => {
    test(`succeeds`, () => {
      const schema: Schema = { type: 'string' };
      coerce('foo', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    });
    test(`succeeds for stringified value`, () => {
      const schema: Schema = { type: 'string' };
      coerce(JSON.stringify('foo'), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith('foo', false, schema);
    });
  });
  describe(`to integer, number`, () => {
    test(`succeeds`, () => {
      const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];
      for (const schema of schemas) {
        coerce('-1', schema);
        expect(mocks.ensure).toHaveBeenLastCalledWith(-1, false, schema);
        coerce('0.2', schema);
        expect(mocks.ensure).toHaveBeenLastCalledWith(0.2, false, schema);
      }
    });
    test(`succeeds for stringified value`, () => {
      const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];
      for (const schema of schemas) {
        coerce(JSON.stringify(-1), schema);
        expect(mocks.ensure).toHaveBeenLastCalledWith(-1, false, schema);
        coerce(JSON.stringify(0.2), schema);
        expect(mocks.ensure).toHaveBeenLastCalledWith(0.2, false, schema);
      }
    });
    test(`fails for NaN`, () => {
      expect(() =>
        coerce('foo', { type: 'integer' })
      ).toThrowErrorMatchingInlineSnapshot(
        `"Data cannot be coerced to number: foo"`
      );
      expect(() => coerce('foo', { type: 'number' })).toThrowError();
    });
  });
  describe(`to boolean`, () => {
    test(`succeeds for falsy values`, () => {
      const schema: Schema = { type: 'boolean' };
      coerce('0', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('""', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('false', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('null', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('undefined', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce('NaN', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
    });
    test(`succeeds for truthy values`, () => {
      const schema: Schema = { type: 'boolean' };
      coerce('1', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
      coerce('-1', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
      coerce('foo', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
      coerce('true', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
    });
    test(`succeeds for stringified values`, () => {
      const schema: Schema = { type: 'boolean' };
      coerce(JSON.stringify(true), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
      coerce(JSON.stringify(false), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce(JSON.stringify(0), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce(JSON.stringify(''), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce(JSON.stringify(null), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
      coerce(JSON.stringify(Number.NaN), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
    });
  });
  describe(`to null`, () => {
    test(`succeeds for falsy values`, () => {
      const schema: Schema = { type: 'null' };
      coerce('0', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('""', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('false', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('null', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('undefined', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce('NaN', schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
    });
    test(`fails for truthy values`, () => {
      const schema: Schema = { type: 'null' };
      expect(() => coerce('1', schema)).toThrowErrorMatchingInlineSnapshot(
        `"Data cannot be coerced to null"`
      );
      expect(() => coerce('-1', schema)).toThrowError();
      expect(() => coerce('foo', schema)).toThrowError();
      expect(() => coerce('true', schema)).toThrowError();
    });
    test(`succeeds for stringified values`, () => {
      const schema: Schema = { type: 'null' };
      coerce(JSON.stringify(false), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce(JSON.stringify(0), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce(JSON.stringify(''), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce(JSON.stringify(null), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
      coerce(JSON.stringify(Number.NaN), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
    });
  });
  describe(`to array`, () => {
    test(`succeeds`, () => {
      const item = ['foo', 'bar'];
      const schema: Schema = { type: 'array' };
      coerce(JSON.stringify(item), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(item, false, schema);
    });
    test(`fails for malformed data`, () => {
      expect(() =>
        coerce('1,2,3', { type: 'array' })
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid JSON data for array: 1,2,3"`
      );
    });
  });
  describe(`to object`, () => {
    test(`succeeds`, () => {
      const item = { foo: 'foo', bar: 'bar' };
      const schema: Schema = { type: 'object' };
      coerce(JSON.stringify(item), schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(item, false, schema);
    });
    test(`fails for malformed data`, () => {
      expect(() =>
        coerce('foo: "foo"', { type: 'object' })
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid JSON data for object: foo: \\"foo\\""`
      );
    });
  });
});

describe(`from number`, () => {
  test(`to string`, () => {
    const schema: Schema = { type: 'string' };

    coerce(0, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('0', false, schema);
    coerce(-1.5, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('-1.5', false, schema);
  });
  test(`to integer, number`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];

    for (const schema of schemas) {
      coerce(0, schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(0, false, schema);
      coerce(-1.5, schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(-1.5, false, schema);
    }
  });
  test(`to boolean`, () => {
    const schema: Schema = { type: 'boolean' };

    coerce(0, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
    coerce(1, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
    coerce(-1, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
  });
  test(`to null`, () => {
    const schema: Schema = { type: 'null' };

    coerce(0, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);

    expect(() => coerce(1, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to null"`
    );
    expect(() => coerce(-1, schema)).toThrowError();
  });
  test(`to array`, () => {
    const schema: Schema = { type: 'array' };
    expect(() => coerce(1, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to array: 1"`
    );
  });
  test(`to object`, () => {
    const schema: Schema = { type: 'object' };
    expect(() => coerce(1, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to object: 1"`
    );
  });
});

describe(`from boolean`, () => {
  test(`to string`, () => {
    const schema: Schema = { type: 'string' };

    coerce(true, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('true', false, schema);
    coerce(false, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('false', false, schema);
  });
  test(`to integer, number`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];

    for (const schema of schemas) {
      coerce(true, schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(1, false, schema);
      coerce(false, schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(0, false, schema);
    }
  });
  test(`to boolean`, () => {
    const schema: Schema = { type: 'boolean' };

    coerce(true, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(true, false, schema);
    coerce(false, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
  });
  test(`to null`, () => {
    const schema: Schema = { type: 'null' };

    coerce(false, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);

    expect(() => coerce(true, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to null"`
    );
  });
  test(`to array`, () => {
    const schema: Schema = { type: 'array' };

    expect(() => coerce(true, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to array: true"`
    );
    expect(() => coerce(false, schema)).toThrowError();
  });
  test(`to object`, () => {
    const schema: Schema = { type: 'object' };

    expect(() => coerce(true, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to object: true"`
    );
    expect(() => coerce(false, schema)).toThrowError();
  });
});

describe(`from null`, () => {
  test(`to string`, () => {
    const schema: Schema = { type: 'string' };

    coerce(null, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith('null', false, schema);
  });
  test(`to integer, number`, () => {
    const schemas: Schema[] = [{ type: 'integer' }, { type: 'number' }];

    for (const schema of schemas) {
      coerce(null, schema);
      expect(mocks.ensure).toHaveBeenLastCalledWith(0, false, schema);
    }
  });
  test(`to boolean`, () => {
    const schema: Schema = { type: 'boolean' };

    coerce(null, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(false, false, schema);
  });
  test(`to null`, () => {
    const schema: Schema = { type: 'null' };

    coerce(null, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(null, false, schema);
  });
  test(`to array`, () => {
    const schema: Schema = { type: 'array' };
    expect(() => coerce(null, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to array: null"`
    );
  });
  test(`to object`, () => {
    const schema: Schema = { type: 'object' };
    expect(() => coerce(null, schema)).toThrowErrorMatchingInlineSnapshot(
      `"Data cannot be coerced to object: null"`
    );
  });
});

describe(`from array`, () => {
  test(`to string, integer, number, boolean, null`, () => {
    expect(() => coerce(['foo'], 'string')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for array: string"`
    );
    expect(() => coerce([1], 'integer')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for array: integer"`
    );
    expect(() => coerce([1], 'number')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for array: number"`
    );
    expect(() => coerce([true], 'boolean')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for array: boolean"`
    );
    expect(() => coerce([null], 'null')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for array: null"`
    );
  });
  test(`to array`, () => {
    const schema: Schema = { type: 'array' };
    const data = ['foo', 'bar'];

    coerce(data, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(data, false, schema);
  });
  test(`to object`, () => {
    const schema: Schema = { type: 'object' };
    const data = ['foo', 'bar'];

    coerce(data, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(
      { 0: 'foo', 1: 'bar' },
      false,
      schema
    );
  });
});

describe(`from object`, () => {
  test(`to string, integer, number, boolean, null`, () => {
    expect(() =>
      coerce({ foo: 'foo' }, 'string')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for object: string"`
    );
    expect(() =>
      coerce({ foo: 1 }, 'integer')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for object: integer"`
    );
    expect(() =>
      coerce({ foo: 1 }, 'number')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for object: number"`
    );
    expect(() =>
      coerce({ foo: true }, 'boolean')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for object: boolean"`
    );
    expect(() =>
      coerce({ foo: null }, 'null')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid coercion type for object: null"`
    );
  });
  test(`to array`, () => {
    const schema: Schema = { type: 'array' };
    const data = { foo: 'foo', bar: 'bar' };

    coerce(data, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(
      ['foo', 'bar'],
      false,
      schema
    );
  });
  test(`to object`, () => {
    const schema: Schema = { type: 'object' };
    const data = { foo: 'foo', bar: 'bar' };

    coerce(data, schema);
    expect(mocks.ensure).toHaveBeenLastCalledWith(data, false, schema);
  });
});
