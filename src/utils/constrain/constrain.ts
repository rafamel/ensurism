import Ajv from 'ajv';
import deep from 'lodash.clonedeep';
import { Type, SchemaTypeName, EmptyType, Schema } from '../../types';
import { getPositionalAssertSchema } from '../../helpers/get-positional';
import { ConstrainSchema, Constrain } from './types';

const ajv = new Ajv({ useDefaults: true });

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
  const { assert, schema } = getPositionalAssertSchema(a, b);

  const validate = ajv.compile({
    type: 'object',
    required: assert ? ['data'] : [],
    properties: { data: schema || {} }
  });
  const item = { data: deep(data) };
  const valid = validate(item);

  if (valid) return item.data as any;

  throw Error(
    validate.errors
      ? ajv.errorsText(
          validate.errors.map((error) => {
            return {
              ...error,
              dataPath: error.dataPath.replace(/^\.data/, ''),
              schemaPath: error.schemaPath.replace(
                /^#\/properties\/data/,
                '/#'
              ),
              message: error.message
                ? error.message.replace(
                    /should have required property '\.?data'/,
                    'should not be undefined'
                  )
                : 'is not valid'
            };
          })
        )
      : 'data is not valid'
  );
}
