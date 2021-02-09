import Ajv from 'ajv';
import deep from 'lodash.clonedeep';
import { Serial } from 'type-core';
import { getSchema } from '../../helpers/get-schema';
import { Schema } from '../../definitions';
import { EnsureResponse, EnsureSchema } from './types';
import { getName } from '~/helpers/get-name';

export type Ensure<
  T extends Serial.Type,
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName,
  A extends boolean = false
> = EnsureResponse<T, D, E, N, A>;

export declare namespace Ensure {
  export interface Options<A extends boolean = boolean> {
    name?: string;
    assert?: A;
  }

  export type Schema<
    T extends Serial.Type,
    D extends Serial.Type,
    E extends Serial.Type,
    N extends Schema.TypeName
  > = EnsureSchema<T, D, E, N>;
}

export function ensure<
  T extends Serial.Type,
  D extends Serial.Type,
  E extends Serial.Type,
  N extends Schema.TypeName,
  A extends boolean = false
>(
  data: T,
  schema: Ensure.Schema<T, D, E, N>,
  options?: Ensure.Options<A>
): Ensure<T, D, E, N, A> {
  const ajv = new Ajv({ useDefaults: true });
  const schemaObj = getSchema(schema, options);

  if (!ajv.validateSchema(schemaObj)) {
    /* istanbul ignore next */
    throw ajv.errors
      ? Error(
          `${getName(options, schemaObj)}schema is not valid: ` +
            ajv.errorsText(ajv.errors)
        )
      : Error(`${getName(options, schemaObj)}schema is not valid`);
  }

  const item = { data: deep(data) };
  const valid = ajv.validate(
    {
      type: 'object',
      required: options && options.assert ? ['data'] : [],
      properties: { data: schemaObj }
    },
    item
  );

  if (valid) return item.data as any;
  /* istanbul ignore next */
  if (!ajv.errors) {
    throw Error(`${getName(options, schemaObj)}data is not valid`);
  }

  const message = ajv.errorsText(
    ajv.errors.map((error) => {
      return {
        ...error,
        dataPath: error.dataPath.replace(/^\/data/, ''),
        schemaPath: error.schemaPath.replace(/^#\/properties\/data/, '/#'),
        message: (error.message || 'is not valid').replace(
          /should have required property '\/?data'/,
          'should not be undefined'
        )
      };
    })
  );
  throw Error(`${getName(options, schemaObj)}data is not valid: ` + message);
}
