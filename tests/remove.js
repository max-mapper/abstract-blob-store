var from = require('from2-array')
var concat = require('concat-stream')

module.exports.remove = function(test, common) {
  test('blobs can be removed', function(t) {
    common.setup(test, function(err, store) {
      t.notOk(err, 'no setup err')
      var ws = store.createWriteStream({key: 'test.js'}, function(err, obj) {
        t.error(err)
        store.remove({key: obj.key}, function(err) {
          t.error(err)
          store.exists({key: obj.key}, function(err, exists) {
            t.error(err)
            t.notOk(exists, 'blob is removed')
            t.end()
          })
        })
      })
      from([new Buffer('foo'), new Buffer('bar')]).pipe(ws)
    })
  })
}

module.exports.all = function (test, common) {
  module.exports.remove(test, common)
}
