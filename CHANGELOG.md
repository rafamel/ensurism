# [0.11.0](https://github.com/rafamel/slimconf/compare/v0.10.1...v0.11.0) (2019-08-04)


### Features

* **envs:** adds envs.bool ([b0c5cb2](https://github.com/rafamel/slimconf/commit/b0c5cb2))



## [0.10.1](https://github.com/rafamel/slimconf/compare/v0.10.0...v0.10.1) (2019-07-06)


### Bug Fixes

* updates riseup development dependencies (fixes esnext and module builds) ([c851c79](https://github.com/rafamel/slimconf/commit/c851c79))
* **deps:** updates dependencies ([3333cec](https://github.com/rafamel/slimconf/commit/3333cec))



# [0.10.0](https://github.com/rafamel/slimconf/compare/v0.9.1...v0.10.0) (2019-07-01)


### Code Refactoring

* changes default value keys from "defaults" to "default" ([be23c68](https://github.com/rafamel/slimconf/commit/be23c68))
* uses merge-strategies ([b89833c](https://github.com/rafamel/slimconf/commit/b89833c))


### BREAKING CHANGES

* Default values on IDefinition should now be in the "default" key instead of
"defaults"
* slimconf does no longer export merge strategies shallow, merge, and deep; TOn can
take one of them as a string ("shallow", "merge", or "deep"), or a TStrategyFn function.



## [0.9.1](https://github.com/rafamel/ts-project/compare/v0.9.0...v0.9.1) (2019-05-16)



# [0.9.0](https://github.com/rafamel/ts-project/compare/v0.8.0...v0.9.0) (2019-04-12)


### Features

* **slim:** supports string, number, boolean, and null types for IUse and TUseMap values ([d5b9589](https://github.com/rafamel/ts-project/commit/d5b9589))



# [0.8.0](https://github.com/rafamel/ts-project/compare/v0.7.1...v0.8.0) (2019-04-05)


### Features

* **get, set:** exports get and set to be used with any object ([3914e56](https://github.com/rafamel/ts-project/commit/3914e56))
* **slim:** config.get throws for undefined values by default ([6ca3326](https://github.com/rafamel/ts-project/commit/6ca3326))


### BREAKING CHANGES

* **slim:** `IBareConfig.get` and `IConfig.get` will now also throw for `undefined` values by
default -it only did when the key didn't exist before.



## [0.7.1](https://github.com/rafamel/ts-project/compare/v0.7.0...v0.7.1) (2019-04-05)


### Bug Fixes

* **slim:** fixes var value being 'defaults' for undefined variables ([0853109](https://github.com/rafamel/ts-project/commit/0853109))



# [0.7.0](https://github.com/rafamel/ts-project/compare/v0.6.0...v0.7.0) (2019-04-05)


### Code Refactoring

* **slim:** changes variable mapping api; renames type ISetup to IUse ([f2a6a42](https://github.com/rafamel/ts-project/commit/f2a6a42))
* **strategies:** renames rules to strategies; exports them as named exports ([07eaa3a](https://github.com/rafamel/ts-project/commit/07eaa3a))


### Features

* **envs:** adds envs: convenience utilities for environment variables ([78f7696](https://github.com/rafamel/ts-project/commit/78f7696))
* **fallback:** adds fallback ([aa4d71e](https://github.com/rafamel/ts-project/commit/aa4d71e))
* **strategies:** prevents mutations from having an effect over defaults ([c5d25f5](https://github.com/rafamel/ts-project/commit/c5d25f5))


### BREAKING CHANGES

* **envs:** `requireEnv` is now `envs.assert`
* **slim:** Mapping used to be done via an IEnvSetup object; the same result can no be achieved
by using a TUseMap array. Previous type ISetup has also been renamed to IUse.
* **strategies:** rules are now called strategies and are exported as named exports



# [0.6.0](https://github.com/rafamel/ts-project/compare/v0.5.0...v0.6.0) (2019-04-04)


### Code Refactoring

* **slim:** config callback w/ on as first argument and vars as second ([6029dd4](https://github.com/rafamel/ts-project/commit/6029dd4))
* **slim:** default values are now obtained from a defaults key (instead of default) ([efdfbf7](https://github.com/rafamel/ts-project/commit/efdfbf7))


### Features

* **slim:** adds merge rules ([cab1205](https://github.com/rafamel/ts-project/commit/cab1205))


### BREAKING CHANGES

* **slim:** for configs depending on environment variables, now TOn is sent as a first argument
to the callback and the environment variables values as a second argument.
* **slim:** default values, previously obtained from `IDefinition.default`, should now be in a
`defaults` key (note the final *s*). See `IDefinition`.
* **slim:** The default behavior doesn't shallow merges the value for an environment with the
default anymore. This can be now done via rules.



# [0.5.0](https://github.com/rafamel/ts-project/compare/v0.4.0...v0.5.0) (2019-04-02)


### Features

* adds web, node, and esnext specific builds ([8deb1e5](https://github.com/rafamel/ts-project/commit/8deb1e5))



# [0.4.0](https://github.com/rafamel/ts-project/compare/v0.3.0...v0.4.0) (2019-04-01)


### Code Refactoring

* exports config as default on entry point ([8d29e13](https://github.com/rafamel/ts-project/commit/8d29e13))


### Features

* **slim:** allows first argument as a configuration object (no setup) ([be53ecc](https://github.com/rafamel/ts-project/commit/be53ecc))
* **slim:** improves typings; uses object hash to id filters; splits up slim functions ([075cb3a](https://github.com/rafamel/ts-project/commit/075cb3a))
* renames IEnvSetup.default to IEnvSetup.from ([2790ad6](https://github.com/rafamel/ts-project/commit/2790ad6))


### BREAKING CHANGES

* environment variables were previously mapped via a IEnvSetup, which had a `default`
property. `IEnvSetup.default` has been renamed to `IEnvSetup.from`
* **slim:** You could previously pass `undefined` as a first argument to `slim()`, while the
second was always a configuration object returning function. Now, `slim()` takes either just one
argument (a configuration object), or a setup object as first and a configuration object returning
function as second argument.
* the previously named export `config` is now a default export



# [0.3.0](https://github.com/rafamel/ts-project/compare/v0.2.1...v0.3.0) (2019-01-11)



## [0.2.1](https://github.com/rafamel/ts-project/compare/v0.2.0...v0.2.1) (2019-01-10)



# [0.2.0](https://github.com/rafamel/ts-project/compare/v0.1.0...v0.2.0) (2019-01-10)



# [0.1.0](https://github.com/rafamel/ts-project/compare/v0.0.2...v0.1.0) (2018-12-08)



## [0.0.2](https://github.com/rafamel/ts-project/compare/v0.0.1...v0.0.2) (2018-12-07)



## 0.0.1 (2018-11-16)



