import { type Mock, describe, expect, test, vi } from 'vitest';

import {
  CollectError,
  assert,
  coerce,
  collect,
  ensure,
  select,
  take
} from '../../src/utils';

vi.mock('../../src/utils/assert');
vi.mock('../../src/utils/take');
vi.mock('../../src/utils/ensure');
vi.mock('../../src/utils/coerce');
vi.mock('../../src/utils/select');
const mocks = {
  assert: (assert as Mock).mockImplementation((assert) => ({ assert })),
  take: (take as Mock).mockImplementation((take) => ({ take })),
  ensure: (ensure as Mock).mockImplementation((ensure) => ({ ensure })),
  coerce: (coerce as Mock).mockImplementation((coerce) => ({ coerce })),
  select: (select as Mock).mockImplementation((select) => ({ select }))
};

describe(`CollectError`, () => {
  test(`succeeds`, () => {
    const errors = {
      foo: new Error(`foo error\nextra information`),
      bar: new Error(`bar error`),
      baz: new Error(`baz error`)
    };
    const error = new CollectError(errors);
    const fn = (): void => {
      throw error;
    };

    expect(error).toBeInstanceOf(Error);
    expect(error.errors).toBe(errors);
    expect(fn).toThrowErrorMatchingInlineSnapshot(`
      [Error: the following errors where found:
      	foo: foo error
      		extra information
      	bar: bar error
      	baz: baz error]
    `);
  });
});

describe(`collect`, () => {
  test(`calls utils and returns values`, () => {
    const result = collect(
      {
        a: 'foo',
        b: 'bar',
        c: 'baz',
        d: 'foobar',
        e: 'foobaz',
        f: 'barbaz'
      },
      ({ get, assert, take, ensure, coerce, select }) => ({
        a: get(),
        b: assert('b0arg' as any),
        c: take('c0arg' as any),
        d: ensure('d0arg' as any, 'd1arg' as any),
        e: coerce('e0arg' as any, 'e1arg' as any),
        f: select('f0arg' as any, 'f1arg' as any)
      })
    );

    expect(result).toEqual({
      a: 'foo',
      b: { assert: 'bar' },
      c: { take: 'baz' },
      d: { ensure: 'foobar' },
      e: { coerce: 'foobaz' },
      f: { select: 'barbaz' }
    });

    expect(mocks.assert).toHaveBeenCalledWith('bar', 'b0arg');
    expect(mocks.take).toHaveBeenCalledWith('baz', 'c0arg');
    expect(mocks.ensure).toHaveBeenCalledWith('foobar', 'd0arg', 'd1arg');
    expect(mocks.coerce).toHaveBeenCalledWith('foobaz', 'e0arg', 'e1arg');
    expect(mocks.select).toHaveBeenCalledWith('barbaz', 'f0arg', 'f1arg');
  });
  test(`fails with compact Error message`, () => {
    mocks.assert.mockImplementationOnce(() => {
      throw new Error(`a error`);
    });
    mocks.take.mockImplementationOnce(() => {
      throw new Error(`b error`);
    });

    const fn = (): void => {
      collect({ b: 'bar', c: 'baz' }, ({ assert, take }) => ({
        b: assert(),
        c: take('c0arg' as any)
      }));
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
      [Error: the following errors where found:
      	b: a error
      	c: b error]
    `);
  });
  test(`fails early`, () => {
    mocks.assert.mockImplementationOnce(() => {
      throw new Error(`a error`);
    });
    mocks.take.mockImplementationOnce(() => {
      throw new Error(`b error`);
    });

    const fn = (): void => {
      collect(
        { b: 'bar', c: 'baz' },
        ({ assert, take }) => ({
          b: assert(),
          c: take('c0arg' as any)
        }),
        { failEarly: true }
      );
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
      [Error: the following errors where found:
      	b: a error]
    `);
  });
});
