import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import add2019Formats from 'ajv-formats-draft2019';
import deep from 'lodash.clonedeep';
import { into } from 'pipettes';
import type { Serial } from 'type-core';

import type { Schema } from '../../definitions';
import { getSchema } from '../../helpers/get-schema';
import { getName } from '../../helpers/get-name';
import type { EnsureResponse, EnsureSchema } from './types';

export type Ensure<
  T extends Serial,
  D extends Serial,
  E extends Serial,
  N extends Schema.TypeName,
  A extends boolean = false
> = EnsureResponse<T, D, E, N, A>;

export declare namespace Ensure {
  export interface Options<A extends boolean = boolean> {
    name?: string;
    assert?: A;
  }

  export type Schema<
    T extends Serial,
    D extends Serial,
    E extends Serial,
    N extends Schema.TypeName
  > = EnsureSchema<T, D, E, N>;
}

export function ensure<
  T extends Serial,
  D extends Serial,
  E extends Serial,
  N extends Schema.TypeName,
  A extends boolean = false
>(
  data: T,
  schema: Ensure.Schema<T, D, E, N>,
  options?: Ensure.Options<A>
): Ensure<T, D, E, N, A> {
  const ajv = into(new Ajv({ useDefaults: true }), addFormats, add2019Formats);
  const schemaObj = getSchema(schema, options);

  if (!ajv.validateSchema(schemaObj)) {
    /* istanbul ignore next */
    throw ajv.errors
      ? new Error(
          `${getName(options, schemaObj)}schema is not valid: ` +
            ajv.errorsText(ajv.errors)
        )
      : new Error(`${getName(options, schemaObj)}schema is not valid`);
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
    throw new Error(`${getName(options, schemaObj)}data is not valid`);
  }

  const message = ajv.errorsText(
    ajv.errors.map((error) => {
      return {
        ...error,
        instancePath: error.instancePath.replace(/^\/data/, ''),
        schemaPath: error.schemaPath.replace(/^#\/properties\/data/, '/#'),
        message: (error.message || 'is not valid').replace(
          /must have required property '\/?data'/,
          'must not be undefined'
        )
      };
    })
  );
  throw new Error(
    `${getName(options, schemaObj)}data is not valid: ` + message
  );
}
