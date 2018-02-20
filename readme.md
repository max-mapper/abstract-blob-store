# abstract-blob-store

A test suite and interface you can use to implement streaming file ([blob](http://en.wikipedia.org/wiki/Binary_large_object)) storage modules for various storage backends and platforms.

[![NPM](https://nodei.co/npm/abstract-blob-store.png)](https://nodei.co/npm/abstract-blob-store/)

[![Build Status](http://img.shields.io/travis/maxogden/abstract-blob-store.svg?style=flat)](https://travis-ci.org/maxogden/abstract-blob-store)

The goal of this module is to define a de-facto standard streaming file storage/retrieval API. Inspired by the [abstract-leveldown](https://github.com/rvagg/abstract-leveldown) module, which has [a test suite that is usable as a module](https://github.com/rvagg/abstract-leveldown/tree/master/abstract).

Publishing a test suite as a module lets multiple modules all ensure compatibility since they use the same test suite. For example, [level.js uses abstract-leveldown](https://github.com/maxogden/level.js/blob/master/test/test.js), and so does [memdown](https://github.com/rvagg/memdown/blob/master/test.js) and [leveldown](https://github.com/rvagg/node-leveldown/blob/master/test/close-test.js) and others.

## some modules that use this

- [content-addressable-blob-store](https://github.com/mafintosh/content-addressable-blob-store)
- [fs-blob-store](https://github.com/mafintosh/fs-blob-store)
- [google-cloud-storage](https://github.com/maxogden/google-cloud-storage)
- [google-drive-blobs](https://github.com/maxogden/google-drive-blobs)
- [idb-blob-store](https://github.com/substack/idb-blob-store)
- [idb-content-addressable-blob-store](https://github.com/substack/idb-content-addressable-blob-store)
- [ipfs-blob-store](https://github.com/ipfs/ipfs-blob-store)
- [local-blob-store](https://github.com/maxogden/local-blob-store) (deprecated)
- [local-storage-blob-store](https://github.com/xicombd/local-storage-blob-store)
- [level-blob-store](https://github.com/diasdavid/level-blob-store)
- [level-blobs](https://github.com/mafintosh/level-blobs) (pre abstract-blob-store, but has the same interface)
- [manta-blob-store](https://github.com/klokoy/manta-blob-store)
- [meta-blob-store](https://github.com/bengl/meta-blob-store)
- [postgres-blob-store](https://github.com/finnp/postgres-blob-store)
- [s3-blob-store](https://github.com/jb55/s3-blob-store)
- [torrent-blob-store](https://github.com/mafintosh/torrent-blob-store)
- [azure-blob-store](https://github.com/svnlto/azure-blob-store)

send a PR adding yours if you write a new one

Also, add **abstract-blob-store** to your project topics. This helps people to see [compatible projects](https://github.com/topics/abstract-blob-store) in one list 

## badge

Include this badge in your readme if you make a new module that uses the `abstract-blob-store` API

[![blob-store-compatible](badge.png)](https://github.com/maxogden/abstract-blob-store)

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

If `opts` is a string it should be interpreted as a `key`.
Otherwise `opts` should be an object with any blob metadata you would like to store, e.g. `name`

the `metadata` passed to `cb` *must* have a `key` property that the user can pass to other methods to get the blob back again.

You can choose how to store the blob. The recommended way is to hash the contents of the incoming stream and store the blob using that hash as the key (this is known as 'content-addressed storage'). If this is not an option you can choose some other way to store the data. When calling the callback you should return an object that ideally has all of the relevant metadata on it, as this object will be used to later read the blob from the blob store.

In ths reference implementation the callback gets called with `{key: sha, size: contents.length, name: opts.name}`.

### store.createReadStream(opts)

This method should return a readable stream that emits blob data from the underlying blob store or emits an error if the blob does not exist or if there was some other error during the read.

If `opts` is a string it should be interpreted as a `key`.
Otherwise `opts` *must* be an object with a `key` property. The `key` is used to find and read the blob. It is recommended where possible to use the hash of the contents of the file as the `key` in order to avoid duplication or finding the wrong file.

### store.exists(opts, cb)

This checks if a blob exists in the store.

If `opts` is a string it should be interpreted as a `key`.
Otherwise `opts` *must* be an object with a `key` property (the same key that you got back from createReadStream). The `cb` should be called with `err, exists`, where `err` is an error if something went wrong during the exists check, and `exists` is a boolean.

### store.remove(opts, cb)

This method should remove a blob from the store.

If `opts` is a string is should be interpreted as a `key`.
Otherwise `opts` *must* be an object with a `key` property. If the `cb` is called without an error subsequent calls to `.exists` with the same opts should return `false`.

## Background

An `abstract-blob-store` is a general system for storing and retrieving binary files, utilizing different storage and addressing schemes. A blob is the set of binary data that makes up an entire binary file.  

Blobs are sometimes cut up into chunks so that they can be processed in various ways (see [rabin](https://github.com/maxogden/rabin)).  If you are dealing with chunks of individual blobs, you may be looking for [abstract-chunk-store](https://github.com/mafintosh/abstract-chunk-store).
