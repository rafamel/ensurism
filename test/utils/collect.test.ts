import {
  assert,
  take,
  ensure,
  coerce,
  select,
  collect,
  CollectError
} from '../../src/utils';

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
      foo: Error(`foo error\nextra information`),
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
"the following errors where found:
	foo: foo error
		extra information
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
        a: get(),
        b: assert({ deep: true }),
        c: take({ assert: true }),
        d: ensure('schema' as any, { assert: true }),
        e: coerce('schema' as any, { assert: true }),
        f: select('selector' as any, { assert: true })
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

    expect(mocks.assert).toHaveBeenCalledWith('bar', { deep: true, name: 'b' });
    expect(mocks.take).toHaveBeenCalledWith('baz', { assert: true, name: 'c' });
    expect(mocks.ensure).toHaveBeenCalledWith('foobar', 'schema', {
      assert: true,
      name: 'd'
    });
    expect(mocks.coerce).toHaveBeenCalledWith('foobaz', 'schema', {
      assert: true,
      name: 'e'
    });
    expect(mocks.select).toHaveBeenCalledWith('barbaz', 'selector', {
      assert: true,
      name: 'f'
    });
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
        c: take('c0arg' as any)
      }));
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
"the following errors where found:
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
        ({ assert, take }) => ({
          b: assert(),
          c: take('c0arg' as any)
        }),
        { failEarly: true }
      );
    };

    expect(fn).toThrowErrorMatchingInlineSnapshot(`
"the following errors where found:
	b: a error"
`);
  });
});
