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

- [Use Cases](#use-cases)
  - [Validation](#validation)
  - [Environment Variables](#environment-variables)
  - [Global Configuration](#global-configuration)
- [Utils](#utils)
  - [`assert`](#assert)
  - [`take`](#take)
  - [`ensure`](#ensure)
  - [`coerce`](#coerce)
  - [`select`](#select)
  - [`collect`](#collect)
- [Collections](#collections)
  - [`PureCollection`](#purecollection)
  - [`Collection`](#collection)

## Use Cases

### Validation

The most general util for validation is [`ensure`](#ensure); however, be sure to take a look to all [`utils`](#utils) to best choose the best fits for your use cases.

### Environment Variables

The library exports a [`PureCollection`](#PureCollection) instantiated with `process.env`, for conveniency:

```javascript
import { env } from 'ensurism';

// Will always be 'development', 'production', or 'test'
const nodeEnv = env.ensure('NODE_ENV', {
  type: 'string',
  enum: ['development', 'production', 'test'],
  default: 'development'
});

// Collecting -mapping- properties
const environment = env.collect(({ get, assert, ensure, coerce }) => ({
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

You might want to create a configuration object that relies on certain values. In the example below, we instantiate a [`Collection`](#collection) that uses an object with an `nodeEnv` property, while providing its default value through `process.env.NODE_ENV`. Depending on the value of this property, we're using [`select`](#select) to conditionally set the properties `bar` and `baz` for our final configuration object.

```javascript
import { env, Collection } from 'ensurism';

export const collection = new Collection(
  {
    nodeEnv: env.ensure('NODE_ENV', {
      type: 'string',
      enum: ['development', 'production', 'test'],
      default: 'development'
    })
  },
  (vars) => ({
    env: vars.get('nodeEnv'),
    foo: 'foo',
    bar: vars.select('nodeEnv', {
      default: 1,
      production: 2,
      development: 3
    }),
    baz: vars.select('nodeEnv', {
      default: 1,
      production: 2,
      test: 4
    })
  })
);

export const config = collection.all();
```

## Utils

### `assert`

Throws if `data` is `undefined`.

- Signatures:
  - `assert(data: any, deep?: boolean)`
- Params:
  - `data`: the input data.
  - `deep`: if it is `true` and data is an array or a record, `assert` will also throw if any of their elements are `undefined`.
- Returns: the input `data`.

```javascript
import { assert } from 'ensurism';

// These will succeed
assert('foo');
assert(['foo'], true);

// These will fail
assert(undefined);
assert([undefined], true);
```

### `take`

Returns the input `data` for records and basic types; for arrays, however, one of multiple strategies can be applied:

- Signatures:
  - `take(data: any, strategy: string)`
  - `take(data: any, assert: boolean | null, strategy: string)`
- Params:
  - `data`: the input data.
  - `assert`: whether to assert the final output value is not `undefined`.
  - `strategy`: applied to `data` arrays; one of:
    - `"one"`: it will throw if the input array has more than one element, and return its first item, if any.
    - `"first"`: it will return the first array item, if any.
    - `"maybe"`: it will return the first **defined** array item, if any.
- Returns: the input `data` if it is a record or a basic type; if `data` is an array, it will return a `data` array value as per the specified `strategy`.

```javascript
import { take } from 'ensurism';

// These will succeed
take(['foo'], 'one'); // 'foo'
take(['foo', 'bar'], 'first'); // 'foo'
take([undefined, 'foo'], 'maybe'); // 'foo'

// These will fail
take(['foo', 'bar'], 'one');
take([undefined], true, 'first');
```

### `ensure`

Throws if `data` doesn't conform to a given `schema`. If the `schema` has `default`s, they will be assigned to the returned data.

- Signatures:
  - `ensure(data: any, schema: string | object)`
  - `ensure(data: any, assert: boolean | null, schema: string | object)`
- Params:
  - `data`: the input data.
  - `assert`: whether to assert the final output value is not `undefined`.
  - `schema`: either a *JSON Schema* with a `type` property, or a valid schema type, as a string.
- Returns: a clone of the input `data` with, if it applies, the default values assigned as specified by `schema`.

```javascript
import { ensure } from 'ensurism';

// These will succeed
ensure('foo', 'string'); // 'foo'
ensure(undefined, 'string'); // undefined
ensure(undefined, true, { type: 'string', default: 'foo' }); // 'foo'

// These will fail
ensure('foo', 'number');
ensure(undefined, true, 'string');
```

### `coerce`

Coerces `data` to a `schema` type, then validates the data against the `schema`, similarly to [`ensure`](#ensure).

- Signatures:
  - `coerce(data: any, schema: string | object)`
  - `coerce(data: any, assert: boolean | null, schema: string | object)`
- Params:
  - `data`: the input data.
  - `assert`: whether to assert the final output value is not `undefined`.
  - `schema`: either a *JSON Schema* with a `type` property, or a valid schema type, as a string.
- Returns: a clone of the input `data` with, if it applies, the default values assigned as specified by `schema`.

The coercion rules from each `data` source types are as follows:

- *strings:*
  - `"string"`: returns the input string with quotes (`"`) removed, if within quotes.
  - `"number"`, `"integer"`: fails if not a number string.
  - `"boolean"`: `false` for *falsy* value strings:
    - `""`
    - `"\"\""`
    - `"0"`
    - `"false"`
    - `"null"`
    - `"undefined"`
    - `"NaN"`
  - `"null"`: fails if not a *falsy* value string.
  - `"array"`, `"object"`: parses with `JSON.parse`; fails if not a *JSON* string.
- *numbers:*
  - `"string"`: a number string.
  - `"number"`, `"integer"`: a number.
  - `"boolean"`: `false` for `0`, `true` otherwise.
  - `"null"`: fails if not `0`.
  - `"array"`, `"object"`: it will fail.
- *boolean:*
  - `"string"`: `"true"` or `"false"`.
  - `"number"`, `"integer"`: `0` for `false`; `1` for `true`.
  - `"boolean"`: same as data source.
  - `"null"`: fails if not `false`.
  - `"array"`, `"object"`: it will fail.
- *null:*
  - `"string"`: `"null"`.
  - `"number"`, `"integer"`: `0`.
  - `"boolean"`: `false`.
  - `"null"`: `null`.
  - `"array"`, `"object"`: it will fail.
- *array:*
  - `"string"`, `"number"`, `"integer"`, `"boolean"`, `"null"`: it will fail.
  - `"array"`: same as data source.
  - `"object"`: an object with index numbers as keys.
- *object:*
  - `"string"`, `"number"`, `"integer"`, `"boolean"`, `"null"`: it will fail.
  - `"array"`: an array of object values.
  - `"object"`: same as data source.

```javascript
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

Given a `value` and a `selector` *object*, it will return the value of the `selector`'s property matching `value`. If `selector` doesn't have such property but it does have a `default` key, it will return its value instead.

If a `strategy` other than `"fallback"` is specified, the selected value -if any- will be merged with the `default` value -if any- following the specified strategy.

- Signatures:
  - `select(value: string | number | boolean | null | undefined, selector: object)`
  - `select(value: string | number | boolean | null | undefined, assert: boolean | null, selector: object)`
  - `select(value: string | number | boolean | null | undefined, strategy: string | null, selector: object)`
  - `select(value: string | number | boolean | null | undefined, assert: boolean | null, strategy: string | null, selector: object)`
- Params:
  - `value`: property to select from `selector`.
  - `assert`: whether to assert the final output value is not `undefined`.
  - `strategy`: applied when there's both a `selector.default` and data for `value` -see [merge strategies](https://github.com/rafamel/utils/tree/master/packages/merge-strategies); one of:
    - `"fallback"`: returns the data for `selector[value]` if available, otherwise returns `selector.default`; applied by default if no `strategy` is specified.
    - `"shallow"`: produces a shallow merge clone of the data.
    - `"merge"`: produces a deep merge clone of the data, excluding *arrays*.
    - `"deep"`: produces a deep merge clone of the data, including *arrays*.
  - `selector`: and object of values.

```javascript
import { select } from 'ensurism';

// These will succeed
select('foo', { foo: 'bar', bar: 'baz' }); // 'bar'
select('foo', { default: 'bar', bar: 'baz' }); // 'bar'
select('foo', 'shallow', { default: { bar: 'bar' }, foo: { baz: 'baz' } }); // { bar: 'bar', baz: 'baz' }

// These will fail
select('foo', true, { bar: 'baz' });
```

### `collect`

A conveniency function for when want to use any of the previous utils for several keys in an object, and expect the response to contain similarly named properties.

- Signatures:
  - `collect(data: object, collector: (functions: object) => object)`
  - `collect(data: object, options: object, collector: (functions: object) => object)`
- Params:
  - `data`: an object of values.
  - `options`: an options object, with keys:
    - `failEarly`: *boolean*, whether to fail as soon as one of the values throw, otherwise compacting all errors in a single error. Default: `false`.
  - `collector`: a function taking in `functions`, and object with methods: `get`, `assert`, `take`, `ensure`, `coerce`, and `select`, with similar signatures as the exported utils, but omitting their first `data` param.
- Returns: an object as defined by `collector`.

```javascript
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

## Collections

### `PureCollection`

A `PureCollection` is simply a conveniency class for running [`utils`](#utils) over an object's properties.

Optionally, it can take an object returning function, which will run once only after some or all properties are accessed.

```javascript
import { PureCollection } from 'ensurism';

new PureCollection({ foo: 'bar', bar: 'baz' });

new PureCollection(() => ({ foo: 'bar', bar: 'baz' }));
```

#### `PureCollection.clear`

Clears the result of the initialization function call, so it will be called again on the next property access. If the `PureCollection` was instantiated with an object, it won't have any effect.

```javascript
import { PureCollection } from 'ensurism';

const collection = new PureCollection(() => {
  console.log('RUN');
  return { foo: 'bar', bar: 'baz' };
});

collection.get('foo');
collection.all(); // RUN
collection.clear();
collection.all(); // RUN
```

#### `PureCollection.all`

Retrieves the data object.

```javascript
import { PureCollection } from 'ensurism';

// Returns: { foo: 'bar', bar: 'baz' }
new PureCollection({ foo: 'bar', bar: 'baz' })..all();
```

#### `PureCollection.get`

Retrieves the data object.

```javascript
import { PureCollection } from 'ensurism';

// Returns: 'bar'
new PureCollection({ foo: 'bar', bar: 'baz' }).get('foo');
```

#### `PureCollection.assert`

Similar to [`assert`](#assert), but taking in a collection's property key as the first argument instead of the data.

```javascript
import { PureCollection } from 'ensurism';

// Returns: 'bar'
new PureCollection({ foo: 'bar', bar: 'baz' }).assert('foo');
```

#### `PureCollection.take`

Similar to [`take`](#take), but taking a collection's property key as the first argument instead of the data.

```javascript
import { PureCollection } from 'ensurism';

// Returns: 'bar'
new PureCollection({ foo: ['bar'], bar: 'baz' }).take('foo', 'one');
```

#### `PureCollection.ensure`

Similar to [`ensure`](#ensure), but taking a collection's property key as the first argument instead of the data.

```javascript
import { PureCollection } from 'ensurism';

// Returns: 'bar'
new PureCollection({ foo: 'bar', bar: 'baz' }).ensure('foo', 'string');
```

#### `PureCollection.coerce`

Similar to [`coerce`](#coerce), but taking a collection's property key as the first argument instead of the data.

```javascript
import { PureCollection } from 'ensurism';

// Returns: true
new PureCollection({ foo: 'bar', bar: 'baz' }).coerce('foo', 'boolean');
```

#### `PureCollection.select`

Similar to [`select`](#select), but taking a collection's property key as the first argument instead of the data.

```javascript
import { PureCollection } from 'ensurism';

// Returns: 'barbaz'
new PureCollection({ foo: 'bar', bar: 'baz' }).select('foo', {
  foo: 'foobar',
  bar: 'barbaz'
});
```

#### `PureCollection.collect`

Similar to [`collect`](#collect), but without its first `data` argument.

```javascript
import { PureCollection } from 'ensurism';

// Returns: { foo: 'bar' }
new PureCollection({ foo: 'bar', bar: 'baz' }).collect(({ assert }) => ({
  foo: assert(),
}));
```

### `Collection`

Inherits from [`PureCollection`,](#purecollection) but takes in an additional object of variables that the initialization function will take in as a `PureCollection`.

```javascript
import { Collection } from 'ensurism';

const collection = new Collection({
  foo: 'bar',
  bar: 'baz'
}, (vars) => ({
  foobar: vars.get('foo') === 'bar' ? 'foobar' : 'foobaz',
  foobaz: vars.ensure('bar', 'string')
}));

// Returns: { foobar: 'foobar', foobaz: 'baz' }
collection.all()
```

#### `Collection.create`

Will instantiate a new `Collection` with the same initialization function, but different variable values.

```javascript
import { Collection } from 'ensurism';

const collection =
  new Collection({ foo: 'bar', bar: 'baz' }, (vars) => ({
    foobar: vars.get('foo') === 'bar' ? 'foobar' : 'foobaz',
    foobaz: vars.ensure('bar', 'string')
  }))
  .create({ foo: 'foo' })

// Returns: { foobar: 'foobaz', foobaz: 'baz' }
collection.all()
```

#### `Collection.use`

Will reassign the variables values to the current collection, and force the collection's initialization function to be run again upon the next property access.

```javascript
import { Collection } from 'ensurism';

const collection = new Collection({
  foo: 'bar',
  bar: 'baz'
}, (vars) => ({
  foobar: vars.get('foo') === 'bar' ? 'foobar' : 'foobaz',
  foobaz: vars.ensure('bar', { type: 'string', enum: ['bar', 'baz'] })
}));

// Returns: { foobar: 'foobar', foobaz: 'baz' }
collection.all()
collection.use({ foo: 'foo' });

// Returns: { foobar: 'foobaz', foobaz: 'baz' }
collection.all()

collection.use({ bar: 'foo' });
// Fails
collection.all();
```
