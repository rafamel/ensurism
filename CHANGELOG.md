# [0.6.0](https://github.com/rafamel/ensurism/compare/v0.5.1...v0.6.0) (2021-02-14)


### Bug Fixes

* **deps:** updates dependencies ([61d0a9c](https://github.com/rafamel/ensurism/commit/61d0a9c7081c9fe8029a650dd21d6ace00ff34b6))
* **utils:** fixes ensure/coerce string format validation ([0b3cbf0](https://github.com/rafamel/ensurism/commit/0b3cbf0d313592dc3b67ec22f076541300708e71)), closes [#3](https://github.com/rafamel/ensurism/issues/3)


### Features

* **utils:** assert takes an optional error message ([dc8102c](https://github.com/rafamel/ensurism/commit/dc8102ca5374363e19e746914eec1829b16db44b))



## [0.5.1](https://github.com/rafamel/ensurism/compare/v0.5.0...v0.5.1) (2021-02-10)



# [0.5.0](https://github.com/rafamel/ensurism/compare/v0.4.0...v0.5.0) (2021-02-09)


### Bug Fixes

* **deps:** updates dependencies ([61fb94d](https://github.com/rafamel/ensurism/commit/61fb94d134bcd8dcee948573d3fe93871e5aff7e))


### Features

* identifies data by name in error messages ([68bbb6f](https://github.com/rafamel/ensurism/commit/68bbb6f33cdfef21092858085f2b141932087352))



# [0.4.0](https://github.com/rafamel/ensurism/compare/v0.3.1...v0.4.0) (2021-01-18)


### Bug Fixes

* **deps:** updates dependencies ([a575cda](https://github.com/rafamel/ensurism/commit/a575cdad5d33ba85393e26065aac90816b42e4ee))
* updates dependencies ([8a57955](https://github.com/rafamel/ensurism/commit/8a579554e27f020cc2dd57c68333aac6044633fc))


### improvement

* refactors utils, removes Collection, PureCollection ([a50ae95](https://github.com/rafamel/ensurism/commit/a50ae950e6ba96400e4123d88ee20d1cc973c3f0))


### BREAKING CHANGES

* Collection and PureCollection are no longer provided. Signatures for util functions
have changed.



## [0.3.1](https://github.com/rafamel/ensurism/compare/v0.3.0...v0.3.1) (2020-04-09)


### Bug Fixes

* fixes objects causing type errors due to narrow definitions ([015fb51](https://github.com/rafamel/ensurism/commit/015fb51b24186c62906472b740a7edc8a66afb8c))
* **deps:** updates dependencies ([4996644](https://github.com/rafamel/ensurism/commit/4996644fde94d6c1d9384b89a05318228fd1472a))



# [0.3.0](https://github.com/rafamel/ensurism/compare/v0.2.2...v0.3.0) (2020-03-24)


### Features

* collect fails with all error messages and information about their key ([48a519c](https://github.com/rafamel/ensurism/commit/48a519cb0bb122fa403db121a54eb32983eafc58))



## [0.2.2](https://github.com/rafamel/ensurism/compare/v0.2.1...v0.2.2) (2020-03-05)



## [0.2.1](https://github.com/rafamel/ensurism/compare/v0.2.0...v0.2.1) (2020-03-05)


### Bug Fixes

* **utils:** fixes collect implementation and types ([7c7fd44](https://github.com/rafamel/ensurism/commit/7c7fd4498078fbec9e8ad0c385d0943f054183a1))



# [0.2.0](https://github.com/rafamel/ensurism/compare/v0.1.0...v0.2.0) (2020-03-05)


### Features

* coerce takes Type as data ([22c9611](https://github.com/rafamel/ensurism/commit/22c9611ae988a06fe42107ee0b660639a73ebe87))



# 0.1.0 (2020-03-04)


### Bug Fixes

* **collection:** fixes PureCollection.collect ([923fbf4](https://github.com/rafamel/ensurism/commit/923fbf4b296296643f0b1a4903253e0622ff3aac))
* **utils:** fixes collect CollectorFunctions definition ([2a9cef8](https://github.com/rafamel/ensurism/commit/2a9cef8b4ab3008e238aab24c29bfe32e825e010))
* **utils:** fixes select for null value ([b738a33](https://github.com/rafamel/ensurism/commit/b738a330c13f0962cc24ef6145cad1e75ec7d8d2))
* **utils:** fixes take maybe strategy ([61e6990](https://github.com/rafamel/ensurism/commit/61e6990ca54dfeb231ac4f4b36b9540f6647627c))
* fixes env when process is not defined ([e6e6642](https://github.com/rafamel/ensurism/commit/e6e6642473368937fcf732cbfb324b6c771b8604))
* **utils:** fixes and improves coerce ([8d94048](https://github.com/rafamel/ensurism/commit/8d9404878fb84ccd17a3ec5e3ba2b6eb503b4a8b))
* **utils:** fixes assert for null data ([2d611fd](https://github.com/rafamel/ensurism/commit/2d611fd6518f35411b8917a79107f08bc072974f))


### Features

* adds assert function ([7e20b46](https://github.com/rafamel/ensurism/commit/7e20b4695681873f5a9aa8f1051f199fa76c98ff))
* adds coerce function ([0a0b40b](https://github.com/rafamel/ensurism/commit/0a0b40bbd6c503ed614f873169c272e5303c5425))
* adds collect function ([00059f3](https://github.com/rafamel/ensurism/commit/00059f30237f4d4b1dedf3745d0f0605281fd0ba))
* adds Collection and PureCollection ([e330b53](https://github.com/rafamel/ensurism/commit/e330b534c73699545d734a0cf961c9386170d626))
* adds constrain function ([3d76d75](https://github.com/rafamel/ensurism/commit/3d76d75c6174b81ead64efab0a5474678868c25b))
* adds env shorthand ([63fa97f](https://github.com/rafamel/ensurism/commit/63fa97fb032c8228367096cd15692705d3fbe72d))
* adds schema and common types ([dc5b77c](https://github.com/rafamel/ensurism/commit/dc5b77c0e0d2fc6ee153898f1b7dc2531e5e81b2))
* adds select ([7f9873c](https://github.com/rafamel/ensurism/commit/7f9873ca62cf3e242296416a05a01eed0408d7ce))
* adds take function ([95a8117](https://github.com/rafamel/ensurism/commit/95a8117f9ba11d25f7b9c89179fb3864ec0f035b))



