import { take, Take } from '../../src/utils';

describe(`no strategy`, () => {
  test(`fails w/ invalid strategy`, () => {
    expect(() =>
      take([], { strategy: 'none' as any })
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid take strategy: none"`);
  });
});

describe(`all strategies`, () => {
  test(`succeeds w/ undefined wo/ assert`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as Take.Strategy[]) {
      expect(take(undefined, { strategy })).toBe(undefined);
      expect(take(undefined, { assert: false, strategy })).toBe(undefined);
    }
  });
  test(`fails w/ undefined wo/ assert`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as Take.Strategy[]) {
      expect(() => take(undefined, { assert: true, strategy })).toThrowError();
    }
  });
  test(`succeeds for basic type`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as Take.Strategy[]) {
      for (const assert of [true, false]) {
        expect(take('foo', { assert, strategy })).toBe('foo');
        expect(take('', { assert, strategy })).toBe('');
        expect(take(0, { assert, strategy })).toBe(0);
        expect(take(null, { assert, strategy })).toBe(null);
      }
    }
  });
  test(`succeeds for object`, () => {
    const data = { foo: 'foo' };
    for (const strategy of ['one', 'first', 'maybe'] as Take.Strategy[]) {
      for (const assert of [true, false]) {
        expect(take(data, { assert, strategy })).toBe(data);
      }
    }
  });
});

describe(`one`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([], { strategy: 'one' })).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(take([undefined], { assert: false, strategy: 'one' })).toBe(
        undefined
      );
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], { strategy: 'one' })).toBe(data);
      expect(take(['foo'], { assert: false, strategy: 'one' })).toBe('foo');
    });
    test(`fails for array w/ more than 1 element`, () => {
      expect(() => take(['foo', 'bar'], { strategy: 'one' })).toThrowError();
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() => take([], { assert: true, strategy: 'one' })).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() =>
        take([undefined], { assert: true, strategy: 'one' })
      ).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], { assert: true, strategy: 'one' })).toBe(data);
      expect(take(['foo'], { assert: true, strategy: 'one' })).toBe('foo');
    });
    test(`fails for array w/ more than 1 element`, () => {
      expect(() =>
        take(['foo', 'bar'], { assert: true, strategy: 'one' })
      ).toThrowError();
    });
  });
});

describe(`first (default)`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([])).toBe(undefined);
      expect(take([], { strategy: 'first' })).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(take([undefined, 'foo'], { assert: false })).toBe(undefined);
      expect(
        take([undefined, 'foo'], { assert: false, strategy: 'first' })
      ).toBe(undefined);
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };

      expect(take([data])).toBe(data);
      expect(take(['foo'], { assert: false })).toBe('foo');

      expect(take([data], { strategy: 'first' })).toBe(data);
      expect(take(['foo'], { assert: false, strategy: 'first' })).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };

      expect(take([data, 'foo'])).toBe(data);
      expect(take(['foo', 'bar'])).toBe('foo');

      expect(take([data, 'foo'], { strategy: 'first' })).toBe(data);
      expect(take(['foo', 'bar'], { strategy: 'first' })).toBe('foo');
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() => take([], { assert: true })).toThrowError();
      expect(() =>
        take([], { assert: true, strategy: 'first' })
      ).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() => take([undefined, 'foo'], { assert: true })).toThrowError();
      expect(() =>
        take([undefined, 'foo'], { assert: true, strategy: 'first' })
      ).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };

      expect(take([data], { assert: true })).toBe(data);
      expect(take(['foo'], { assert: true })).toBe('foo');

      expect(take([data], { assert: true, strategy: 'first' })).toBe(data);
      expect(take(['foo'], { assert: true, strategy: 'first' })).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };

      expect(take([data, 'foo'])).toBe(data);
      expect(take(['foo', 'bar'])).toBe('foo');

      expect(take([data, 'foo'], { strategy: 'first' })).toBe(data);
      expect(take(['foo', 'bar'], { strategy: 'first' })).toBe('foo');
    });
  });
});

describe(`maybe`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([], { strategy: 'maybe' })).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(
        take([undefined, undefined], { assert: false, strategy: 'maybe' })
      ).toBe(undefined);
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([undefined, data, undefined], { strategy: 'maybe' })).toBe(
        data
      );
      expect(
        take([undefined, undefined, 'foo'], {
          assert: false,
          strategy: 'maybe'
        })
      ).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(
        take([undefined, data, 'foo', undefined], { strategy: 'maybe' })
      ).toBe(data);
      expect(
        take([undefined, undefined, 'foo', data], {
          assert: false,
          strategy: 'maybe'
        })
      ).toBe('foo');
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() =>
        take([], { assert: true, strategy: 'maybe' })
      ).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() =>
        take([undefined, undefined], { assert: true, strategy: 'maybe' })
      ).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(
        take([undefined, data, undefined], { assert: true, strategy: 'maybe' })
      ).toBe(data);
      expect(
        take([undefined, undefined, 'foo'], { assert: true, strategy: 'maybe' })
      ).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(
        take([undefined, data, 'foo', undefined], {
          assert: true,
          strategy: 'maybe'
        })
      ).toBe(data);
      expect(
        take([undefined, undefined, 'foo', data], {
          assert: true,
          strategy: 'maybe'
        })
      ).toBe('foo');
    });
  });
});
