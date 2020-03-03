import { take, TakeStrategy } from '~/utils';

describe(`no strategy`, () => {
  test(`fails wo/ strategy`, () => {
    expect(() => take([], undefined as any)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid take strategy: undefined"`
    );
  });
  test(`fails w/ invalid strategy`, () => {
    expect(() => take([], 'none' as any)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid take strategy: none"`
    );
  });
});

describe(`all strategies`, () => {
  test(`succeeds w/ undefined wo/ assert`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as TakeStrategy[]) {
      expect(take(undefined, strategy)).toBe(undefined);
      expect(take(undefined, false, strategy)).toBe(undefined);
    }
  });
  test(`fails w/ undefined wo/ assert`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as TakeStrategy[]) {
      expect(() => take(undefined, true, strategy)).toThrowError();
    }
  });
  test(`succeeds for basic type`, () => {
    for (const strategy of ['one', 'first', 'maybe'] as TakeStrategy[]) {
      for (const assert of [true, false]) {
        expect(take('foo', assert, strategy)).toBe('foo');
        expect(take('', assert, strategy)).toBe('');
        expect(take(0, assert, strategy)).toBe(0);
        expect(take(null, assert, strategy)).toBe(null);
      }
    }
  });
  test(`succeeds for object`, () => {
    const data = { foo: 'foo' };
    for (const strategy of ['one', 'first', 'maybe'] as TakeStrategy[]) {
      for (const assert of [true, false]) {
        expect(take(data, assert, strategy)).toBe(data);
      }
    }
  });
});

describe(`one`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([], 'one')).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(take([undefined], false, 'one')).toBe(undefined);
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], 'one')).toBe(data);
      expect(take(['foo'], false, 'one')).toBe('foo');
    });
    test(`fails for array w/ more than 1 element`, () => {
      expect(() => take(['foo', 'bar'], 'one')).toThrowError();
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() => take([], true, 'one')).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() => take([undefined], true, 'one')).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], true, 'one')).toBe(data);
      expect(take(['foo'], true, 'one')).toBe('foo');
    });
    test(`fails for array w/ more than 1 element`, () => {
      expect(() => take(['foo', 'bar'], true, 'one')).toThrowError();
    });
  });
});

describe(`first`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([], 'first')).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(take([undefined, 'foo'], false, 'first')).toBe(undefined);
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], 'first')).toBe(data);
      expect(take(['foo'], false, 'first')).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data, 'foo'], 'first')).toBe(data);
      expect(take(['foo', 'bar'], 'first')).toBe('foo');
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() => take([], true, 'first')).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() => take([undefined, 'foo'], true, 'first')).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data], true, 'first')).toBe(data);
      expect(take(['foo'], true, 'first')).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([data, 'foo'], 'first')).toBe(data);
      expect(take(['foo', 'bar'], 'first')).toBe('foo');
    });
  });
});

describe(`maybe`, () => {
  describe(`wo/ assert`, () => {
    test(`succeeds for empty array`, () => {
      expect(take([], 'maybe')).toBe(undefined);
    });
    test(`succeeds for array w/ undefined`, () => {
      expect(take([undefined, undefined], false, 'maybe')).toBe(undefined);
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([undefined, data, undefined], 'maybe')).toBe(data);
      expect(take([undefined, undefined, 'foo'], false, 'maybe')).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([undefined, data, 'foo', undefined], 'maybe')).toBe(data);
      expect(take([undefined, undefined, 'foo', data], false, 'maybe')).toBe(
        'foo'
      );
    });
  });
  describe(`w/ assert`, () => {
    test(`fails for empty array`, () => {
      expect(() => take([], true, 'maybe')).toThrowError();
    });
    test(`fails for array w/ undefined`, () => {
      expect(() => take([undefined, undefined], true, 'maybe')).toThrowError();
    });
    test(`succeeds for array w/ 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([undefined, data, undefined], true, 'maybe')).toBe(data);
      expect(take([undefined, undefined, 'foo'], true, 'maybe')).toBe('foo');
    });
    test(`succeeds for array w/ more than 1 element`, () => {
      const data = { foo: 'foo' };
      expect(take([undefined, data, 'foo', undefined], true, 'maybe')).toBe(
        data
      );
      expect(take([undefined, undefined, 'foo', data], true, 'maybe')).toBe(
        'foo'
      );
    });
  });
});
