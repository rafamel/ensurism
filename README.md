# ensurism

[![Version](https://img.shields.io/npm/v/ensurism.svg)](https://www.npmjs.com/package/ensurism)
[![Build Status](https://img.shields.io/travis/rafamel/ensurism/master.svg)](https://travis-ci.org/rafamel/ensurism)
[![Coverage](https://img.shields.io/coveralls/rafamel/ensurism/master.svg)](https://coveralls.io/github/rafamel/ensurism)
[![Dependencies](https://img.shields.io/david/rafamel/ensurism.svg)](https://david-dm.org/rafamel/ensurism)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/ensurism.svg)](https://snyk.io/test/npm/ensurism)
[![License](https://img.shields.io/github/license/rafamel/ensurism.svg)](https://github.com/rafamel/ensurism/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/ensurism.svg)](https://www.npmjs.com/package/ensurism)

> A validation and conditional assignment utility belt.

## Install

[`npm install ensurism`](https://www.npmjs.com/package/ensurism)

## Contents

* [Use Cases](#use-cases)
  * [Validation](#validation)
  * [Environment Variables](#environment-variables)
  * [Global Configuration](#global-configuration)
* [Utils](#utils)
  * [`assert`](#assert)
  * [`take`](#take)
  * [`ensure`](#ensure)
  * [`coerce`](#coerce)
  * [`select`](#select)
  * [`collect`](#collect)

## Use Cases

### Validation

The most general util for validation is [`ensure`](#ensure); however, be sure to take a look to all [`utils`](#utils) to best choose the best fits for your use cases.

### Environment Variables

```typescript
import { ensure, collect } from 'ensurism';

// Will always be 'development', 'production', or 'test'
const NODE_ENV = ensure(process.env.NODE_ENV, {
  type: 'string',
  enum: ['development', 'production', 'test'],
  default: 'development'
});

// Collecting -mapping- properties
const env = collect(process.env, ({ get, assert, ensure, coerce }) => ({
  FOO_VAR: get(),
  BAR_VAR: assert(),
  APP_URI: ensure({ type: 'string', format: 'uri' }),
  APP_PORT: coerce('number'),
  NODE_ENV: ensure({
    type: 'string',
    enum: ['development', 'production', 'test'],
    default: 'development'
  })
}));
```

### Global Configuration

You might want to create a configuration object that relies on certain values. In the example below, we [`collect`](#collect) environment variables, and later use [`select`](#select) to conditionally set the properties `bar` and `baz` for our final configuration object.

```typescript
import { into } from 'pipettes';
import { collect, select } from 'ensurism';

export const configuration = into(
  collect(process.env, ({ ensure }) => ({
    NODE_ENV: ensure({
      type: 'string',
      enum: ['development', 'production', 'test'],
      default: 'development'
    })
  })),
  ({ NODE_ENV }) => ({
    env: NODE_ENV,
    foo: 'foo',
    bar: select(NODE_ENV, {
      default: 1,
      production: 2,
      development: 3
    }),
    baz: select(NODE_ENV, {
      default: 1,
      production: 2,
      test: 4
    })
  })
);
```

## Utils

### `assert`

Throws if `data` is `undefined`.

* Signature: `assert(data, options)`
* Params:
  * `data`: the input data.
  * `options`: *optional* object with optional properties:
    * `deep`: if `true` and `data` is an array or a record, `assert` will also throw if any of their elements are `undefined`.
* Returns: the input `data`.

```typescript
import { assert } from 'ensurism';

// Succeed
assert('foo');
assert([undefined]);

// Fail
assert(undefined);
assert([undefined], { deep: true });
```

### `take`

Returns the input `data` for records and basic types; for arrays, however, one of multiple strategies can be applied:

* Signature: `take(data, options)`
* Params:
  * `data`: the input data.
  * `options`: *optional* object with optional properties:
    * `assert`: whether to assert the final output value is not `undefined`.
    * `strategy`: applies to `data` arrays; one of:
      * `"first"`: it will return the first array item, if any. This is the **default** strategy.
      * `"one"`: it will throw if the input array has more than one element, and return its first item, if any.
      * `"maybe"`: it will return the first **defined** array item, if any.
* Returns: the input `data` if it is a record or a basic type; if `data` is an array, it will return a `data` array value as per the specified `strategy`.

```typescript
import { take } from 'ensurism';

// Succeed
take(['foo'], { strategy: 'one' }); // 'foo'
take(['foo', 'bar'], { strategy: 'first' }); // 'foo'
take([undefined, 'foo'], { strategy: 'maybe' }); // 'foo'

// Fail
take(['foo', 'bar'], { strategy: 'one' });
take([undefined], { assert: true, strategy: 'first' });
```

### `ensure`

Throws if `data` doesn't conform to a given `schema`. If the `schema` has `default`s, they will be assigned to the returned data.

* Signature: `ensure(data, schema, options)`
* Params:
  * `data`: the input data.
  * `schema`: either a *JSON Schema object* with a `type` property, or a valid schema type, as a *string*.
  * `options`: *optional* object with optional properties:
    * `assert`: whether to assert the final output value is not `undefined`.
* Returns: a clone of the input `data` with, if it applies, the default values assigned as specified by `schema`.

```typescript
import { ensure } from 'ensurism';

// Succeed
ensure('foo', 'string'); // 'foo'
ensure(undefined, 'string'); // undefined
ensure(undefined, { type: 'string', default: 'foo' }, { assert: true }); // 'foo'

// Fail
ensure('foo', 'number');
ensure(undefined, 'string', { assert: true });
```

### `coerce`

Coerces `data` to a `schema` type, then validates the data against the `schema`, similarly to [`ensure`](#ensure).

* Signature: `coerce(data, schema, options)`
* Params:
  * `data`: the input data; `undefined` won't be coerced into the schema type.
  * `schema`: either a *JSON Schema object* with a `type` property, or a valid schema type, as a *string*.
  * `options`: *optional* object with optional properties:
    * `assert`: whether to assert the final output value is not `undefined`.
* Returns: a clone of the input `data` with, if it applies, the default values assigned as specified by `schema`.

The coercion rules from each `data` input type are as follows:

* *strings:*
  * `"string"`: returns the input string with quotes (`"`) removed, if within quotes.
  * `"number"`, `"integer"`: fails if `NaN`.
  * `"boolean"`: `false` for *falsy* value strings:
    * `""`
    * `"\"\""`
    * `"0"`
    * `"false"`
    * `"null"`
    * `"undefined"`
    * `"NaN"`
  * `"null"`: fails if not a *falsy* value string.
  * `"array"`, `"object"`: parses with `JSON.parse`; fails if not a *JSON* string.
* *numbers:*
  * `"string"`: a number string.
  * `"number"`, `"integer"`: a number.
  * `"boolean"`: `false` for `0`, `true` otherwise.
  * `"null"`: fails if not `0`.
  * `"array"`, `"object"`: it will fail.
* *boolean:*
  * `"string"`: `"true"` or `"false"`.
  * `"number"`, `"integer"`: `0` for `false`; `1` for `true`.
  * `"boolean"`: same as data source.
  * `"null"`: fails if not `false`.
  * `"array"`, `"object"`: it will fail.
* *null:*
  * `"string"`: `"null"`.
  * `"number"`, `"integer"`: `0`.
  * `"boolean"`: `false`.
  * `"null"`: `null`.
  * `"array"`, `"object"`: it will fail.
* *array:*
  * `"string"`, `"number"`, `"integer"`, `"boolean"`, `"null"`: it will fail.
  * `"array"`: same as data source.
  * `"object"`: an object with index numbers as keys.
* *object:*
  * `"string"`, `"number"`, `"integer"`, `"boolean"`, `"null"`: it will fail.
  * `"array"`: an array of object values.
  * `"object"`: same as data source.

```typescript
import { coerce } from 'ensurism';

// These will succeed
coerce('foo', 'string'); // 'foo'
coerce('"foo"', 'string'); // 'foo'
coerce('0', 'number'); // 0
coerce('foo', 'boolean'); // true
coerce('null', 'boolean'); // false
coerce('false', 'null'); // null
coerce('{ "foo": "bar" }', 'object'); // { foo: 'bar' }
coerce(10, 'boolean'); // true
coerce(0, 'null'); // null


// These will fail
coerce('foo', 'number');
coerce('foo', 'null');
coerce('1, 2, 3', 'array');
coerce(1, 'null');
```

### `select`

Given a value and a `selector` *object*, it will return the value of the `selector`'s property matching that value. If `selector` doesn't have such property but it does have a `default` key, it will return its value instead.

If a `strategy` other than `"fallback"` is specified, the selected value -if any- will be merged with the `default` value -if any- following the specified strategy.

* Signature: `select(data, selector, options)`
* Params:
  * `data`: property to select from `selector`.
  * `selector`: and object of values.
  * `options`: *optional* object with optional properties:
    * `assert`: whether to assert the final output value is not `undefined`.
    * `strategy`: applied when there's both a `selector.default` and data for `value` -see [merge strategies](https://github.com/rafamel/utils/tree/master/packages/merge-strategies); one of:
      * `"fallback"`: returns the data for `selector[value]` if available, otherwise returns `selector.default`. This is the **default** strategy.
      * `"shallow"`: produces a shallow merge clone of the data.
      * `"merge"`: produces a deep merge clone of the data, excluding *arrays*.
      * `"deep"`: produces a deep merge clone of the data, including *arrays*.

```typescript
import { select } from 'ensurism';

// These will succeed
select('foo', { foo: 'bar', bar: 'baz' }); // 'bar'
select('foo', { default: 'bar', bar: 'baz' }); // 'bar'
select('foo', { default: { bar: 'bar' }, foo: { baz: 'baz' } }, { strategy: 'shallow' }); // { bar: 'bar', baz: 'baz' }

// These will fail
select('foo', { bar: 'baz' }, { assert: true });
```

### `collect`

A conveniency function for when you want to use any of the previous utils for several keys in an object, and expect the response to contain similarly named properties.

* Signature:`collect(data, collection, options)`
* Params:
  * `data`: an object of values.
  * `collector`: a function, taking an object with methods `get`, `assert`, `take`, `ensure`, `coerce`, and `select` as an argument. These methods have the same signature as the similarly named functions but omitting their first `data` argument.
  * `options`: *optional* object with optional properties:
    * `failEarly`: *boolean*, whether to fail as soon as one of the values throw, otherwise compacting all errors in a single error. Default: `false`.
* Returns: an object as defined by `collector`.

```typescript
import { collect } from 'ensurism';

const result = collect(
  {
    a: 'foo',
    b: 'bar',
    c: ['baz', 'foobar'],
    d: 'foobaz',
    e: 'barfoo',
    f: 'barbaz'
  },
  ({ get, assert, take, ensure, coerce, select }) => ({
    a: get(),
    b: assert(),
    c: take('first'),
    d: ensure('string'),
    e: coerce('boolean'),
    f: select({
      default: true,
      barbaz: false
    })
  })
);

// `result` would be an object such as:
({
  a: 'foo',
  b: 'bar',
  c: 'baz',
  d: 'foobaz',
  e: true,
  f: false
});
```
