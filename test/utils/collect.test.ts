import {
  assert,
  take,
  ensure,
  coerce,
  select,
  collect,
  CollectError
} from '~/utils';

jest.mock('~/utils/assert');
jest.mock('~/utils/take');
jest.mock('~/utils/ensure');
jest.mock('~/utils/coerce');
jest.mock('~/utils/select');
const mocks = {
  assert: (assert as jest.Mock).mockImplementation((assert) => ({ assert })),
  take: (take as jest.Mock).mockImplementation((take) => ({ take })),
  ensure: (ensure as jest.Mock).mockImplementation((ensure) => ({ ensure })),
  coerce: (coerce as jest.Mock).mockImplementation((coerce) => ({ coerce })),
  select: (select as jest.Mock).mockImplementation((select) => ({ select }))
};
beforeEach(() => Object.values(mocks).map((mock) => mock.mockClear()));

describe(`CollectError`, () => {
  test(`succeeds`, () => {
    const errors = {
      foo: Error(`foo error\nExtra information`),
      bar: Error(`bar error`),
      baz: Error(`baz error`)
    };
    const error = new CollectError(errors);
    const fn = (): void => {
      throw error;
    };

    expect(error).toBeInstanceOf(Error);
    expect(error.errors).toBe(errors);
    expect(fn).toThrowErrorMatchingInlineSnapshot(`
"The following errors where found:
	foo: foo error
		Extra information
	bar: bar error
	baz: baz error"
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
        item: 'value',
        a: get(),
        b: assert(),
        c: take('c0arg' as any, 'c1arg' as any),
        d: ensure('d0arg' as any, 'd1arg' as any),
        e: coerce('e0arg' as any, 'e1arg' as any),
        f: select('f0arg' as any, 'f1arg' as any, 'f2arg' as any)
      })
    );

    expect(result).toEqual({
      item: 'value',
      a: 'foo',
      b: { assert: 'bar' },
      c: { take: 'baz' },
      d: { ensure: 'foobar' },
      e: { coerce: 'foobaz' },
      f: { select: 'barbaz' }
    });

    expect(mocks.assert).toHaveBeenCalledWith('bar');
    expect(mocks.take).toHaveBeenCalledWith('baz', 'c0arg', 'c1arg');
    expect(mocks.ensure).toHaveBeenCalledWith('foobar', 'd0arg', 'd1arg');
    expect(mocks.coerce).toHaveBeenCalledWith('foobaz', 'e0arg', 'e1arg');
    expect(mocks.select).toHaveBeenCalledWith(
      'barbaz',
      'f0arg',
      'f1arg',
      'f2arg'
    );
  });
  test(`fails with compact Error message`, () => {
    mocks.assert.mockImplementationOnce(() => {
      throw Error(`a error`);
    });
    mocks.take.mockImplementationOnce(() => {
      throw Error(`b error`);
    });

    const fn = (): void => {
      collect({ b: 'bar', c: 'baz' }, ({ assert, take }) => ({
        b: assert(),
        c: take('c0arg' as any, 'c1arg' as any)
      }));
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
"The following errors where found:
	b: a error
	c: b error"
`);
  });
  test(`fails early`, () => {
    mocks.assert.mockImplementationOnce(() => {
      throw Error(`a error`);
    });
    mocks.take.mockImplementationOnce(() => {
      throw Error(`b error`);
    });

    const fn = (): void => {
      collect(
        { b: 'bar', c: 'baz' },
        { failEarly: true },
        ({ assert, take }) => ({
          b: assert(),
          c: take('c0arg' as any, 'c1arg' as any)
        })
      );
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
"The following errors where found:
	b: a error"
`);
  });
});
