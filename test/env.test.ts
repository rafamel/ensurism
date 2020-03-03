import { PureCollection } from '~/collection';
import { env } from '~/env';

test(`is a process.env PureCollection`, () => {
  expect(env).toBeInstanceOf(PureCollection);
  expect(env.all()).toBe(process.env);
});
