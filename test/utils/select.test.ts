import * as merge from 'merge-strategies';
import { EmptyType } from '~/types';
import { select, SelectStrategy } from '~/utils';

const mocks = {
  shallow: jest.spyOn(merge, 'shallow'),
  merge: jest.spyOn(merge, 'merge'),
  deep: jest.spyOn(merge, 'deep')
};
beforeEach(() => Object.values(mocks).map((mock) => mock.mockClear()));

const data = { foo: 'bar', bar: 'baz' };
const strategies: Array<SelectStrategy | EmptyType> = [
  undefined,
  null,
  'fallback',
  'shallow',
  'merge',
  'deep'
];

describe(`preconditions`, () => {
  test(`fais for invalid value`, () => {
    expect(() => select({} as any, data)).toThrowErrorMatchingInlineSnapshot(
      `"Selection value couldn't be stringified: [object Object]"`
    );
  });
  test(`fais for invalid strategy`, () => {
    expect(() =>
      select('bar', 'none' as any, data)
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid select strategy: none"`);
  });
});
describe(`wo/ assert`, () => {
  describe(`all strategies`, () => {
    test(`returns existing valid value`, () => {
      expect(select('bar', data)).toBe('baz');

      for (const strategy of strategies) {
        expect(select('bar', strategy, data)).toBe('baz');
        expect(select(0, strategy, { 0: 'baz' })).toBe('baz');
        expect(select(undefined, strategy, { undefined: 'baz' })).toBe('baz');
        expect(select(true, strategy, { true: 'baz' })).toBe('baz');
        expect(select(false, strategy, { false: 'baz' })).toBe('baz');
        expect(select(null, strategy, { null: 'baz' })).toBe('baz');
      }
    });
    test(`returns undefined on non existing value`, () => {
      expect(select('baz', data)).toBe(undefined);

      for (const strategy of strategies) {
        expect(select('baz', strategy, data)).toBe(undefined);
      }
    });
    test(`returns default on non existing value`, () => {
      expect(select('baz', { ...data, default: 'foo' })).toBe('foo');
      expect(select('baz', { ...data, bar: undefined, default: 'foo' })).toBe(
        'foo'
      );

      for (const strategy of strategies) {
        expect(select('baz', strategy, { ...data, default: 'foo' })).toBe(
          'foo'
        );
        expect(
          select('baz', strategy, { ...data, bar: undefined, default: 'foo' })
        ).toBe('foo');
      }
    });
  });
  describe(`specific strategies`, () => {
    test(`fallback: returns existing value w/ default`, () => {
      expect(select('bar', { ...data, default: 'foo' })).toBe('baz');
      expect(select('bar', 'fallback', { ...data, default: 'foo' })).toBe(
        'baz'
      );
      for (const mock of Object.values(mocks)) {
        expect(mock).not.toHaveBeenCalled();
      }
    });
    test(`shallow: adequately calls shallow and returns response`, () => {
      const response = {};
      mocks.shallow.mockImplementationOnce(() => response);

      expect(select('bar', 'shallow', { ...data, default: 'foo' })).toBe(
        response
      );
      expect(mocks.shallow).toHaveBeenCalledTimes(1);
      expect(mocks.shallow).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.merge).not.toHaveBeenCalled();
      expect(mocks.deep).not.toHaveBeenCalled();
    });
    test(`merge: adequately calls merge and returns response`, () => {
      const response = {};
      mocks.merge.mockImplementationOnce(() => response);

      expect(select('bar', 'merge', { ...data, default: 'foo' })).toBe(
        response
      );
      expect(mocks.merge).toHaveBeenCalledTimes(1);
      expect(mocks.merge).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.shallow).not.toHaveBeenCalled();
      expect(mocks.deep).not.toHaveBeenCalled();
    });
    test(`deep: adequately calls deep and returns response`, () => {
      const response = {};
      mocks.deep.mockImplementationOnce(() => response);

      expect(select('bar', 'deep', { ...data, default: 'foo' })).toBe(response);
      expect(mocks.deep).toHaveBeenCalledTimes(1);
      expect(mocks.deep).toHaveBeenLastCalledWith('foo', 'baz');
      expect(mocks.shallow).not.toHaveBeenCalled();
      expect(mocks.merge).not.toHaveBeenCalled();
    });
  });
});

describe(`w/ assert`, () => {
  test(`fails wo/ default`, () => {
    expect(() => select('baz', true, data)).toThrowError();

    for (const strategy of strategies) {
      expect(() => select('baz', true, strategy, data)).toThrowError();
    }
  });
  test(`succeeds w/ default`, () => {
    expect(select('baz', true, { ...data, default: null })).toBe(null);

    for (const strategy of strategies) {
      expect(select('baz', true, strategy, { ...data, default: 'baz' })).toBe(
        'baz'
      );
    }
  });
});
