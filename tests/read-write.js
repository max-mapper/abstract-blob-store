var from = require('from2-array')
var concat = require('concat-stream')

module.exports.blobWriteStream = function(test, common) {
  test('piping a blob into a blob write stream', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      var ws = store.createWriteStream({name: 'test.js'}, function(err, obj) {
        t.notOk(err, 'no blob write err')
        t.ok(obj.size, 'blob has size')
        t.ok(obj.hash, 'blob has hash')
        common.teardown(test, function(err) {
          t.end()
        })
      })
      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.blobReadStream = function(test, common) {
  test('getting a blob read stream by row key + name', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      
      var ws = store.createWriteStream({name: 'test.js'}, function(err, blob) {
        t.notOk(err, 'no blob write err')
        
        var rs = store.createReadStream({name: 'test.js'})

        rs.on('error', function(e) {
          t.false(e, 'no read stream err')
          done()
        })

        rs.pipe(concat(function(file) {
          t.equal(file.length, blob.size, 'blob size is correct')
          common.teardown(test, function(err) {
            t.end()
          })
        }))
      })
      
      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.all = function (test, common) {
  module.exports.blobWriteStream(test, common)
  module.exports.blobReadStream(test, common)
}
