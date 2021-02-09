import * as merge from 'merge-strategies';
import { select, Select } from '../../src/utils';

const mocks = {
  shallow: jest.spyOn(merge, 'shallow'),
  merge: jest.spyOn(merge, 'merge'),
  deep: jest.spyOn(merge, 'deep')
};
beforeEach(() => Object.values(mocks).map((mock) => mock.mockClear()));

const selector = { foo: 'bar', bar: 'baz' };
const strategies: Array<Select.Strategy | undefined> = [
  undefined,
  'fallback',
  'shallow',
  'merge',
  'deep'
];

describe(`preconditions`, () => {
  test(`fais for invalid value`, () => {
    expect(() =>
      select({} as any, selector)
    ).toThrowErrorMatchingInlineSnapshot(
      `"selection data couldn't be stringified: [object Object]"`
    );
  });
  test(`fais for invalid strategy`, () => {
    expect(() =>
      select('bar', selector, { strategy: 'none' as any })
    ).toThrowErrorMatchingInlineSnapshot(`"invalid select strategy: none"`);
  });
});
describe(`wo/ assert`, () => {
  describe(`all strategies`, () => {
    test(`returns existing valid value`, () => {
      expect(select('bar', selector)).toBe('baz');

      for (const strategy of strategies) {
        expect(select('bar', selector, { strategy })).toBe('baz');
        expect(select(0, { 0: 'baz' }, { strategy })).toBe('baz');
        expect(select(undefined, { undefined: 'baz' }, { strategy })).toBe(
          'baz'
        );
        expect(select(true, { true: 'baz' }, { strategy })).toBe('baz');
        expect(select(false, { false: 'baz' }, { strategy })).toBe('baz');
        expect(select(null, { null: 'baz' }, { strategy })).toBe('baz');
      }
    });
    test(`returns undefined on non existing value`, () => {
      expect(select('baz', selector)).toBe(undefined);

      for (const strategy of strategies) {
        expect(select('baz', selector, { strategy })).toBe(undefined);
      }
    });
    test(`returns default on non existing value`, () => {
      expect(select('baz', { ...selector, default: 'foo' })).toBe('foo');
      expect(
        select('baz', { ...selector, bar: undefined, default: 'foo' })
      ).toBe('foo');

      for (const strategy of strategies) {
        expect(
          select('baz', { ...selector, default: 'foo' }, { strategy })
        ).toBe('foo');
        expect(
          select(
            'baz',
            { ...selector, bar: undefined, default: 'foo' },
            { strategy }
          )
        ).toBe('foo');
      }
    });
  });
  describe(`specific strategies`, () => {
    test(`fallback: returns existing value w/ default`, () => {
      expect(select('bar', { ...selector, default: 'foo' })).toBe('baz');
      expect(
        select('bar', { ...selector, default: 'foo' }, { strategy: 'fallback' })
      ).toBe('baz');
      for (const mock of Object.values(mocks)) {
        expect(mock).not.toHaveBeenCalled();
      }
    });
    test(`shallow: adequately calls shallow and returns response`, () => {
      const response = {};
      mocks.shallow.mockImplementationOnce(() => response);

      expect(
        select('bar', { ...selector, default: 'foo' }, { strategy: 'shallow' })
      ).toBe(response);
      expect(mocks.shallow).toHaveBeenCalledTimes(1);
      expect(mocks.shallow).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.merge).not.toHaveBeenCalled();
      expect(mocks.deep).not.toHaveBeenCalled();
    });
    test(`merge: adequately calls merge and returns response`, () => {
      const response = {};
      mocks.merge.mockImplementationOnce(() => response);

      expect(
        select('bar', { ...selector, default: 'foo' }, { strategy: 'merge' })
      ).toBe(response);
      expect(mocks.merge).toHaveBeenCalledTimes(1);
      expect(mocks.merge).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.shallow).not.toHaveBeenCalled();
      expect(mocks.deep).not.toHaveBeenCalled();
    });
    test(`deep: adequately calls deep and returns response`, () => {
      const response = {};
      mocks.deep.mockImplementationOnce(() => response);

      expect(
        select('bar', { ...selector, default: 'foo' }, { strategy: 'deep' })
      ).toBe(response);
      expect(mocks.deep).toHaveBeenCalledTimes(1);
      expect(mocks.deep).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.shallow).not.toHaveBeenCalled();
      expect(mocks.merge).not.toHaveBeenCalled();
    });
  });
});

describe(`w/ assert`, () => {
  test(`fails wo/ default`, () => {
    expect(() =>
      select('baz', selector, { name: 'foo', assert: true })
    ).toThrowErrorMatchingInlineSnapshot(
      `"expected \\"foo\\" data not to be undefined"`
    );

    for (const strategy of strategies) {
      expect(() =>
        select('baz', selector, { assert: true, strategy })
      ).toThrowError();
    }
  });
  test(`succeeds w/ default`, () => {
    expect(
      select('baz', { ...selector, default: null }, { assert: true })
    ).toBe(null);

    for (const strategy of strategies) {
      expect(
        select(
          'baz',
          { ...selector, default: 'baz' },
          { assert: true, strategy }
        )
      ).toBe('baz');
    }
  });
});
