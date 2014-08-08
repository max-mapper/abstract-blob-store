# abstract-blob-store

A test suite and interface you can use to implement streaming file (blob) storage modules for various storage backends and platforms.

[![NPM](https://nodei.co/npm/abstract-blob-store.png)](https://nodei.co/npm/abstract-blob-store/)

[![Build Status](http://img.shields.io/travis/maxogden/abstract-blob-store.svg?style=flat)](https://travis-ci.org/maxogden/abstract-blob-store)

The goal of this module is to define a de-facto standard streaming file storage/retrieval API. Inspired by the [abstract-leveldown](https://github.com/rvagg/abstract-leveldown) module, which has [a test suite that is usable as a module](https://github.com/rvagg/abstract-leveldown/tree/master/abstract).

Publishing a test suite as a module lets multiple modules all ensure compatibility since they use the same test suite. For example, [level.js uses abstract-leveldown](https://github.com/maxogden/level.js/blob/master/test/test.js), and so does [memdown](https://github.com/rvagg/memdown/blob/master/test.js) and [leveldown](https://github.com/rvagg/node-leveldown/blob/master/test/close-test.js) and others.

## how to use

To use the test suite from this module you can `require('abstract-blob-store/tests')`

An example of this can be found in the [google-drive-blobs](https://github.com/maxogden/google-drive-blobs/blob/master/test.js) test suite. There is also an example in `tests/run.js` in this repo.

You have to implement a setup and teardown function:

```js
var common = {
  setup: function(t, cb) {
    // setup takes a tap/tape compatible test instance in and a callback
    // this method should construct a new blob store instance and pass it to the callback:
    var store = createMyBlobStore()
    cb(null, store)
  },
  teardown: function(t, store, blob, cb) {
    // teardown takes in the test instance, as well as the store instance and blob metadata
    // you can use the store/blob objects to clean up blobs from your blob backend, e.g.
    if (blob) store.remove(blob, cb)
    else cb()
    // be sure to call cb() when you are done with teardown
  }
}
```

To run the tests simply pass your test module (`tap` or `tape` or any other compatible modules are supported) and your `common` methods in:

```js
var abstractBlobTests = require('abstract-blob-store/tests')
abstractBlobTests(test, common)
```

## API

A valid blob store should implement the following APIs. There is a reference in-memory implementation available at `index.js` in this repo.

### store.createWriteStream(opts, cb)

This method should return a writable stream, and call `cb` with `err, metadata` when it finishes writing the data to the underlying blob store.

`opts` should be an object with at least a `name` property.

You can choose how to store the blob. The recommended way is to hash the contents of the incoming stream and store the blob using that hash as the key (this is known as 'content-addressed storage'). If this is not an option you can choose some other way to store the data. When calling the callback you should return an object that ideally has all of the relevant metadata on it, as this object will be used to later read the blob from the blob store.

In ths reference implementation the callback gets called with `{hash: sha, size: contents.length, name: opts.name}`.

### store.createReadStream(opts)

This method should return a readable stream that emits blob data from the underlying blob store or emits an error if the blob does not exist or if there was some other error during the read.

`opts` should be an object that has metadata that can be used to find and read the blob. In the reference implementation the `name` field is used to find the file, but it is recommended to use the `hash` value from `opts` to find the file to avoid duplication or finding the wrong file.

### store.exists(opts, cb)

This checks if a blob exists in the store. `opts` should be the same as it is in `createReadStream`. The `cb` should be called with `err, exists`, where `err` is an error if something went wrong during the exists check, and `exists` is a boolean.
