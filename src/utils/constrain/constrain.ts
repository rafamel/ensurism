import Ajv from 'ajv';
import deep from 'lodash.clonedeep';
import { Type, SchemaTypeName, EmptyType, Schema } from '../../types';
import { getPositionalAssertSchema } from '../../helpers/get-positional';
import { ConstrainSchema, Constrain } from './types';

export function constrain<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName
>(data: T, schema: ConstrainSchema<T, D, E, N>): Constrain<T, D, E, N>;
export function constrain<
  T extends Type,
  D extends Type,
  E extends Type,
  N extends SchemaTypeName,
  A extends boolean = false
>(
  data: T,
  assert: A | EmptyType,
  schema: ConstrainSchema<T, D, E, N>
): Constrain<T, D, E, N, A>;

export function constrain(
  data: Type,
  a: boolean | EmptyType | Schema | SchemaTypeName,
  b?: Schema | SchemaTypeName
): Constrain<Type, Type, Type, SchemaTypeName, boolean> {
  const ajv = new Ajv({ useDefaults: true });
  const { assert, schema } = getPositionalAssertSchema(a, b);

  if (!ajv.validateSchema(schema)) {
    /* istanbul ignore next */
    throw ajv.errors
      ? Error(`Schema is not valid: ` + ajv.errorsText(ajv.errors))
      : Error(`Schema is not valid`);
  }

  const item = { data: deep(data) };
  const valid = ajv.validate(
    {
      type: 'object',
      required: assert ? ['data'] : [],
      properties: { data: schema }
    },
    item
  );

  if (valid) return item.data as any;
  /* istanbul ignore next */
  if (!ajv.errors) throw Error(`Data is not valid`);
  const message = ajv.errorsText(
    ajv.errors.map((error) => {
      return {
        ...error,
        dataPath: error.dataPath.replace(/^\.data/, ''),
        schemaPath: error.schemaPath.replace(/^#\/properties\/data/, '/#'),
        message: (error.message || 'is not valid').replace(
          /should have required property '\.?data'/,
          'should not be undefined'
        )
      };
    })
  );
  throw Error(`Data is not valid: ` + message);
}
