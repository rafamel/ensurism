import { assert, take, ensure, coerce, select, collect } from '~/utils';

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
