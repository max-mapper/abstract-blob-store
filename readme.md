# abstract-blob-store

A test suite and interface you can use to implement streaming file (blob) storage modules for various storage backends and platforms.

[![NPM](https://nodei.co/npm/abstract-blob-store.png)](https://nodei.co/npm/abstract-blob-store/)

The goal of this module is to define a de-facto standard streaming file storage/retrieval API. Inspired by the [abstract-leveldown](https://github.com/rvagg/abstract-leveldown) module, which has [a test suite that is usable as a module](https://github.com/rvagg/abstract-leveldown/tree/master/abstract).

Publishing a test suite as a module lets multiple modules all ensure compatibility since they use the same test suite. For example, [level.js uses abstract-leveldown](https://github.com/maxogden/level.js/blob/master/test/test.js), and so does [memdown](https://github.com/rvagg/memdown/blob/master/test.js) and [leveldown](https://github.com/rvagg/node-leveldown/blob/master/test/close-test.js) and others.

