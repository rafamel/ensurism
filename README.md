# slimconf

[![Version](https://img.shields.io/npm/v/slimconf.svg)](https://www.npmjs.com/package/slimconf)
[![Build Status](https://img.shields.io/travis/rafamel/slimconf/master.svg)](https://travis-ci.org/rafamel/slimconf)
[![Coverage](https://img.shields.io/coveralls/rafamel/slimconf/master.svg)](https://coveralls.io/github/rafamel/slimconf)
[![Dependencies](https://img.shields.io/david/rafamel/slimconf.svg)](https://david-dm.org/rafamel/slimconf)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/slimconf.svg)](https://snyk.io/test/npm/slimconf)
[![License](https://img.shields.io/github/license/rafamel/slimconf.svg)](https://github.com/rafamel/slimconf/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/slimconf.svg)](https://www.npmjs.com/package/slimconf)

<div align="center">
  <br />
  <br />
  <a href="https://www.npmjs.com/package/slimconf" target="_blank">
    <img alt="slimconf" width="350" src="https://raw.githubusercontent.com/rafamel/slimconf/master/assets/logo.png" />
  </a>
  <br />
  <br />
  <strong>A slim configuration util that fits both the thin and bulky</strong>
  <br />
  <br />
</div>

## Install

[`npm install slimconf`](https://www.npmjs.com/package/slimconf)

## Usage

[Documentation](https://rafamel.github.io/slimconf/globals.html)

* [`slim`:](#slim) core functionality.
  * [With no environment variables](#with-no-environment-variables)
  * [With environment variables](#with-environment-variables)
* [Utils:](#utils) a set of helpful utilities.
  * [`envs`:](#envs) convenience utilities for environment variables.
    * `assert`: requires any number of environment variables to be defined.
    * `constrain`: requires a variable to be defined or for its value to be in a set of allowed values.
    * `get`: same as `constrain` while also returning the variable value.
    * `bool`: evaluates an environment variable as a boolean.
  * [`fallback`:](#fallback) fall back to a default if a value is not defined or is not in a set of allowed values.
  * [`get`:](#get) get a value for a path while failing early.
  * [`set`:](#set) set a value for a path while failing early.

### `slim`

`slim` is the default function exported by `slimconf` -[see docs.](https://rafamel.github.io/slimconf/globals.html#slim)

#### With no environment variables

When the configuration doesn't depend on environment variables, it's possible to just call `slim` as follows:

```javascript
import slim from 'slimconf';

const config = slim({ foo: 'bar', baz: 'foobar', barbaz: { foobaz: 'slim' } });

// Get a path safely -will throw if non existent
config.get('barbaz.foobaz'); // 'slim'

// Set a value for a path
config.set('foo', { bar: 'baz' }); // { bar: 'baz' }
config.get('foo.bar'); // 'baz'

// Get the configuration object with no methods
config.pure(); // { foo: { bar: 'baz' }, baz: 'foobar', barbaz: { foobaz: 'slim' } }
```

#### With environment variables

When a configuration depends on environment variables, `slim` has the signature `slim(use: IUse, fn: TFn): TConfig`.

* `use` passes up the environment variables the configuration depends on -[see docs.](https://rafamel.github.io/slimconf/interfaces/iuse.html)
* `fn` should be a configuration object returning function -[see docs.](https://rafamel.github.io/slimconf/globals.html#tfn)

##### Fundamentals

If our configuration depended on `process.env.NODE_ENV` and `process.env.FOO_ENV`, we'd use `slim` as follows:

```javascript
import slim from 'slimconf';

const config = slim(
  {
    env: process.env.NODE_ENV,
    fooenv: process.env.FOO_ENV
  },
  (on, vars) => ({
    vars, // contains the current values for `env` and `fooenv`
    foo: 'bar',
    baz: on.env({
      default: 1,
      production: 2,
      development: 3,
      test: 4
    }),
    foobar: on.fooenv({
      default: 1,
      lorem: 2,
      ipsum: 3
    })
  })
);

// Get a path
config.get('baz'); // 1, 2, 3, or 4

// Set a value for a path
config.set('baz', { bar: 'baz' }); // { bar: 'baz' }
config.get('baz.bar'); // 'baz'

// Get the configuration object with no methods
config.pure();

// Get the configuration for a different set of environment variables values
const specific = config.environment({ env: 'test', fooenv: 'lorem' });

// You can use all methods as usual
specific.pure(); // { foo: 'bar', baz: 4, foobar: 2 }
specific.get('vars'); // { env: 'test', fooenv: 'lorem' }
```

##### Using merge strategies

When defining the values for each environment, you can set up custom strategies to merge with the `default` -see docs for [`TOn`](https://rafamel.github.io/slimconf/globals.html#ton) and [`TDefineFn`](https://rafamel.github.io/slimconf/globals.html#tdefinefn).

`slimconf` has a set of common strategies that can be used -see [`TStrategy`](https://rafamel.github.io/slimconf/globals.html#tstrategy)- or you can pass your own as a function -see [`TStrategyFn`.](https://rafamel.github.io/slimconf/globals.html#tstrategyfn)

```javascript
import slim from 'slimconf';

const config = slim(
  { env: process.env.NODE_ENV },
  (on, vars) => ({
    // Shallow merge
    foo: on.env('shallow', {
      default: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80],
        transports: { console: true, file: true }
      }
    }),
    // Deep merge
    bar: on.env('merge', {
      default: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80], // Will be: [80]
        transports: { file: true } // Will be: { console: true, file: false }
      }
    }),
    // Deep merge with concatenated arrays
    baz: on.env('deep', {
      default: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80], // Will be: [3000, 80]
        transports: { file: true } // Will be: { console: true, file: false }
      }
    })
  })
);
```

##### Mapping environment variables

When mapping environment variables, it is beneficial to use the built in api for it, as it will allow for the map to also apply when using `TConfig.environment()` -see [`TConfig`](https://rafamel.github.io/slimconf/globals.html#tconfig) and [`IConfig`.](https://rafamel.github.io/slimconf/interfaces/iconfig.html)

As an example, the following setup object maps to `'development'` whenever the `NODE_ENV` variable is not `'production'` or `'test'`. `slimconf` also exports the [`fallback`](#fallback) function for precisely this use case.

```javascript
import slim, { fallback } from 'slimconf';

const use = {
  nodeEnv: [
    process.env.NODE_ENV,
    (use) => use === 'production' || use === 'test' ? use : 'development'
  ],
  // 'nodeEnv' and 'env' are equivalent
  env: [
    process.env.NODE_ENV,
    fallback('development', ['production', 'test'])
  ]
};
const config = slim(use, (on, vars) => ({
  bar: on.node({
    default: 1,
    production: 2,
    development: 3,
    test: 4
  }),
  baz: on.env({
    default: 1,
    production: 2,
    development: 3,
    test: 4
  })
}));

config
  .environment({ env: null, fooenv: 'ipsum' })
  .pure(); // { foo: 'bar', baz: 3, foobar: 3 }
```

### Utils

#### `envs`

A set of convenience utilities for environment variables. [See docs.](https://rafamel.github.io/slimconf/interfaces/ienvs.html)

* **`assert`:** requires any number of environment variables to be defined; throws otherwise. [See docs.](https://rafamel.github.io/slimconf/interfaces/ienvs.html#assert)
* **`constrain`:** requires an environment variable to be defined, throwing otherwise. If an array of allowed values are passed the value will be checked against them, throwing if its not contained in the array. [See docs.](https://rafamel.github.io/slimconf/interfaces/ienvs.html#constrain)
* **`get`:** same as `constrain`, but it returns the environment variable value. [See docs.](https://rafamel.github.io/slimconf/interfaces/ienvs.html#get)
* **`bool`:** it will obtain the environment variable `src` and return `false` if it's `undefined`, an empty string, `'0'`, or `'false'` (case insensitive); `true` otherwise. [See docs.](https://rafamel.github.io/slimconf/interfaces/ienvs.html#bool)

```javascript
import { envs } from 'slimconf';

// Throws if undefined
envs.assert('NODE_ENV', 'PUBLIC_URL');

// Throws if undefined
envs.constrain('NODE_ENV');

// Throws if not 'production', 'development', or 'test'
envs.constrain('NODE_ENV', ['production', 'development', 'test']);

// Throws if undefined and assigns value
const nodeEnv = envs.get('NODE_ENV');

// Treated as boolean
const isActive = envs.bool('IS_ACTIVE');
```

#### `fallback`

Returns a function that will return a fallback if a given value is `undefined` or, in its case, if it doesn't match a set of allowed values. It can be used [with `slim` for environment variables mapping](#mapping-environment-variables) or independently. [See docs.](https://rafamel.github.io/slimconf/globals.html#fallback)

```javascript
import { fallback } from 'slimconf';

// Sets 'development' as fallback if value is not defined
const fb = fallback('development');
fb(); // development
fb('foo') // foo

// Sets 'development' as fallback if value is not 'production' or 'test'
const fba = fallback('development', ['production', 'test']);

fba(); // development
fba('foo'); // development
fba('production'); // production
```

#### `get`

Returns the value at a path for an object, if it exists and it's defined -otherwise it will throw. [See docs.](https://rafamel.github.io/slimconf/globals.html#get)

```javascript
import { get } from 'slimconf';

const obj = { foo: { bar: 'baz', foobar: undefined } };

get(obj, 'foo.bar'); // baz
get(obj, 'foo.foobar'); // Error
```

#### `set`

Sets and returns a value at a path for an object, if it exists -otherwise it will throw. [See docs.](https://rafamel.github.io/slimconf/globals.html#set)

```javascript
import { set } from 'slimconf';

const obj = { foo: { bar: 'baz' } };

set(obj, 'foo.bar', 'foobar'); // foobar
obj.foo.bar; // foobar
```
