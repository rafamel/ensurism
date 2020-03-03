import { Collection, PureCollection } from '~/collection';

test(`Collection is PureCollection`, () => {
  const collection = new Collection({}, () => ({}));
  expect(collection).toBeInstanceOf(PureCollection);
});
test(`define callback takes in variable's PureCollection`, () => {
  const data = {};
  let arg: any = null;
  new Collection(data, (collection) => {
    arg = collection;
    return {};
  }).all();

  expect(arg).toBeInstanceOf(PureCollection);
  expect(arg.all()).toBe(data);
});
test(`define callback only executes once`, () => {
  const data = {};
  const fn = jest.fn().mockImplementation(() => data);
  const collection = new Collection({}, fn);

  expect(fn).toHaveBeenCalledTimes(0);
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`Collection.use`, () => {
  const fn = jest.fn().mockImplementation((use) => ({
    foobar: use.get('foo'),
    barbaz: use.get('bar')
  }));
  const collection = new Collection({ foo: 'bar', bar: 'baz' }, fn);

  expect(collection.get('foobar')).toBe('bar');
  expect(collection.get('barbaz')).toBe('baz');
  expect(fn).toHaveBeenCalledTimes(1);

  collection.use({ foo: 'foobar' });
  expect(collection.get('foobar')).toBe('foobar');
  expect(collection.get('barbaz')).toBe('baz');
  expect(fn).toHaveBeenCalledTimes(2);

  collection.use(undefined as any);
  expect(collection.get('foobar')).toBe('foobar');
  expect(collection.get('barbaz')).toBe('baz');
  expect(fn).toHaveBeenCalledTimes(3);
});
test(`Collection.create`, () => {
  const fn = jest.fn().mockImplementation((use) => ({
    foobar: use.get('foo'),
    barbaz: use.get('bar')
  }));
  const a = new Collection({ foo: 'bar', bar: 'baz' }, fn);
  const b = a.create();
  const c = b.create({ foo: 'foobar' });

  expect(b).not.toBe(a);
  expect(c).not.toBe(b);

  expect(a.get('foobar')).toBe('bar');
  expect(a.get('barbaz')).toBe('baz');

  expect(b.get('foobar')).toBe('bar');
  expect(b.get('barbaz')).toBe('baz');

  expect(c.get('foobar')).toBe('foobar');
  expect(c.get('barbaz')).toBe('baz');

  expect(fn).toHaveBeenCalledTimes(3);
});
