var from = require('from2-array')
var concat = require('concat-stream')

module.exports.blobWriteStream = function(test, common) {
  test('piping a blob into a blob write stream with string key', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      var ws = store.createWriteStream('hello-world.txt', function(err, obj) {
        t.error(err)
        t.ok(obj.key, 'blob has key')
        common.teardown(test, store, obj, function(err) {
          t.error(err)
          t.end()
        })
      })
      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.blobWriteStreamSubFolder = function(test, common) {
  test('piping a blob into a blob write stream with string key in nonexisting subfolder', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      var ws = store.createWriteStream('folder/hello-world.txt', function(err, obj) {
        t.error(err)
        t.ok(obj.key, 'blob has key')
        common.teardown(test, store, obj, function(err) {
          t.error(err)
          t.end()
        })
      })
      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.blobReadStream = function(test, common) {
  test('reading a blob as a stream with string key', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')

      var ws = store.createWriteStream('hello-world.txt', function(err, blob) {
        t.notOk(err, 'no blob write err')
        t.ok(blob.key, 'blob has key')

        var rs = store.createReadStream(blob.key)

        rs.on('error', function(e) {
          t.false(e, 'no read stream err')
          t.end()
        })

        rs.pipe(concat(function(file) {
          t.equal(file.length, 6, 'blob length is correct')
          common.teardown(test, store, blob, function(err) {
            t.error(err)
            t.end()
          })
        }))
      })

      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.blobReadError = function(test, common) {
  test('reading a blob that does not exist with string key', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')

      var rs = store.createReadStream('foobarbaz.txt')

      rs.on('error', function(e) {
        t.ok(e, 'got a read stream err')
        common.teardown(test, store, undefined, function(err) {
          t.error(err)
          t.end()
        })
      })
    })

  })
}

module.exports.blobExists = function(test, common) {
  test('check if a blob exists with string key', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      store.exists('hello-world.txt', function(err, exists) {
        t.error(err)
        t.notOk(exists, 'does not exist')

        var ws = store.createWriteStream('hello-world.txt', function(err, obj) {
          t.notOk(err, 'no blob write err')
          t.ok(obj.key, 'blob has key')

          // on this .exists call use the metadata from the writeStream
          store.exists(obj.key, function(err, exists) {
            t.error(err)
            t.ok(exists, 'exists')
            common.teardown(test, store, obj, function(err) {
              t.error(err)
              t.end()
            })
          })
        })

        from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
      })

    })
  })
}

module.exports.all = function (test, common) {
  module.exports.blobWriteStream(test, common)
  module.exports.blobWriteStreamSubFolder(test, common)
  module.exports.blobReadStream(test, common)
  module.exports.blobReadError(test, common)
  module.exports.blobExists(test, common)
}
