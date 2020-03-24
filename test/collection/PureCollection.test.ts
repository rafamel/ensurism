import { PureCollection } from '~/collection';
import * as utils from '~/utils';

jest.mock('~/utils');
const mocks = {
  collection: {
    all: jest.spyOn(PureCollection.prototype, 'all'),
    get: jest.spyOn(PureCollection.prototype, 'get')
  },
  utils: {
    assert: (utils.assert as jest.Mock).mockImplementation((assert) => ({
      assert
    })),
    take: (utils.take as jest.Mock).mockImplementation((take) => ({ take })),
    ensure: (utils.ensure as jest.Mock).mockImplementation((ensure) => ({
      ensure
    })),
    coerce: (utils.coerce as jest.Mock).mockImplementation((coerce) => ({
      coerce
    })),
    select: (utils.select as jest.Mock).mockImplementation((select) => ({
      select
    })),
    collect: (utils.collect as jest.Mock).mockImplementation(() => ({
      collect: true
    }))
  }
};
beforeEach(() =>
  Object.values(mocks).map((items) =>
    Object.values(items).map((mock) => mock.mockClear())
  )
);

test(`PureCollection.all gets data`, () => {
  const data = {};
  const a = new PureCollection(data);
  const b = new PureCollection(() => data);

  expect(a.all()).toBe(data);
  expect(b.all()).toBe(data);
});
test(`define callback only executes once`, () => {
  const data = {};
  const fn = jest.fn().mockImplementation(() => data);
  const collection = new PureCollection(fn);

  expect(fn).toHaveBeenCalledTimes(0);
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(1);
});
test(`PureCollection.clear`, () => {
  const data = {};
  const fn = jest.fn().mockImplementation(() => data);
  const collection = new PureCollection(fn);

  collection.clear();
  expect(fn).toHaveBeenCalledTimes(0);
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(1);
  collection.clear();
  expect(collection.all()).toBe(data);
  expect(fn).toHaveBeenCalledTimes(2);
});
test(`PureCollection.get`, () => {
  const data = { foo: 'bar' };
  mocks.collection.all.mockImplementationOnce(() => data);
  const collection = new PureCollection({ foo: 'baz' });

  expect(collection.get('foo')).toBe('bar');
  expect(mocks.collection.get).toHaveBeenCalledTimes(1);
});
test(`PureCollection.assert`, () => {
  mocks.collection.get.mockImplementationOnce(() => 'baz');
  const collection = new PureCollection({ foo: 'bar' });

  expect(collection.assert('foo', 'arg1' as any)).toEqual({
    assert: 'baz'
  });
  expect(mocks.collection.get).toHaveBeenCalledWith('foo');
  expect(mocks.utils.assert).toHaveBeenCalledWith('baz', 'arg1');
});
test(`PureCollection.take`, () => {
  mocks.collection.get.mockImplementationOnce(() => 'baz');
  const collection = new PureCollection({ foo: 'bar' });

  expect(collection.take('foo', 'arg1' as any, 'arg2' as any)).toEqual({
    take: 'baz'
  });
  expect(mocks.collection.get).toHaveBeenCalledWith('foo');
  expect(mocks.utils.take).toHaveBeenCalledWith('baz', 'arg1', 'arg2');
});
test(`PureCollection.ensure`, () => {
  mocks.collection.get.mockImplementationOnce(() => 'baz');
  const collection = new PureCollection({ foo: 'bar' });

  expect(collection.ensure('foo', 'arg1' as any, 'arg2' as any)).toEqual({
    ensure: 'baz'
  });
  expect(mocks.collection.get).toHaveBeenCalledWith('foo');
  expect(mocks.utils.ensure).toHaveBeenCalledWith('baz', 'arg1', 'arg2');
});
test(`PureCollection.coerce`, () => {
  mocks.collection.get.mockImplementationOnce(() => 'baz');
  const collection = new PureCollection({ foo: 'bar' });

  expect(collection.coerce('foo', 'arg1' as any, 'arg2' as any)).toEqual({
    coerce: 'baz'
  });
  expect(mocks.collection.get).toHaveBeenCalledWith('foo');
  expect(mocks.utils.coerce).toHaveBeenCalledWith('baz', 'arg1', 'arg2');
});
test(`PureCollection.select`, () => {
  mocks.collection.get.mockImplementationOnce(() => 'baz');
  const collection = new PureCollection({ foo: 'bar' });

  expect(
    collection.select('foo', 'arg1' as any, 'arg2' as any, 'arg3' as any)
  ).toEqual({
    select: 'baz'
  });
  expect(mocks.collection.get).toHaveBeenCalledWith('foo');
  expect(mocks.utils.select).toHaveBeenCalledWith(
    'baz',
    'arg1',
    'arg2',
    'arg3'
  );
});
test(`PureCollection.collect`, () => {
  const data = { foo: 'bar', bar: 'baz' };
  mocks.collection.all.mockImplementationOnce(() => ({
    ...data,
    baz: () => null
  }));
  const collection = new PureCollection({ foo: 'foo' });

  expect(collection.collect('arg0' as any, 'arg1' as any)).toEqual({
    collect: true
  });
  expect(mocks.collection.all).toHaveBeenCalled();
  expect(mocks.utils.collect).toHaveBeenCalledWith(data, 'arg0', 'arg1');
});
