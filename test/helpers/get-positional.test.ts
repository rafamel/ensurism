import { getPositionalAssertSchema } from '~/helpers/get-positional';
import { getSchema } from '~/helpers/get-schema';

jest.mock('~/helpers/get-schema');
const mocks = { getSchema: getSchema as jest.Mock };
mocks.getSchema.mockImplementation(() => 'foo');

describe(`getPositionalAssertSchema`, () => {
  test(`calls getSchema`, () => {
    getPositionalAssertSchema(undefined, undefined);
    expect(mocks.getSchema).toHaveBeenLastCalledWith(undefined);

    getPositionalAssertSchema(null, undefined);
    expect(mocks.getSchema).toHaveBeenLastCalledWith(undefined);

    getPositionalAssertSchema('string', undefined);
    expect(mocks.getSchema).toHaveBeenLastCalledWith('string');

    getPositionalAssertSchema({ type: 'string' }, undefined);
    expect(mocks.getSchema).toHaveBeenLastCalledWith({ type: 'string' });

    for (const arg of [null, true, false, undefined]) {
      getPositionalAssertSchema(arg, undefined);
      expect(mocks.getSchema).toHaveBeenLastCalledWith(undefined);

      getPositionalAssertSchema(arg, null as any);
      expect(mocks.getSchema).toHaveBeenLastCalledWith(null);

      getPositionalAssertSchema(arg, 'string');
      expect(mocks.getSchema).toHaveBeenLastCalledWith('string');

      getPositionalAssertSchema(arg, { type: 'string' });
      expect(mocks.getSchema).toHaveBeenLastCalledWith({ type: 'string' });
    }
  });
  test(`succeeds w/ schema as first arugment`, () => {
    const response = { assert: false, schema: 'foo' };
    expect(getPositionalAssertSchema('string', undefined)).toEqual(response);
    expect(getPositionalAssertSchema({ type: 'string' }, undefined)).toEqual(
      response
    );
  });
  test(`succeeds w/ falsy`, () => {
    const response = { assert: false, schema: 'foo' };
    expect(getPositionalAssertSchema(false, 'string')).toEqual(response);
    expect(getPositionalAssertSchema(false, { type: 'string' })).toEqual(
      response
    );

    expect(getPositionalAssertSchema(undefined, 'string')).toEqual(response);
    expect(getPositionalAssertSchema(undefined, { type: 'string' })).toEqual(
      response
    );
    expect(getPositionalAssertSchema(null, 'string')).toEqual(response);
    expect(getPositionalAssertSchema(null, { type: 'string' })).toEqual(
      response
    );
  });
  test(`succeeds w/ true`, () => {
    const response = { assert: true, schema: 'foo' };
    expect(getPositionalAssertSchema(true, 'string')).toEqual(response);
    expect(getPositionalAssertSchema(true, { type: 'string' })).toEqual(
      response
    );
  });
});
