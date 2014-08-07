var from = require('from2-array')
var concat = require('concat-stream')
var duplexify = require('duplexify')
var crypto = require('crypto')

module.exports = MemBlobs

function MemBlobs() {
  this.data = {}
}

MemBlobs.prototype.createWriteStream = function(opts, cb) {
  var self = this
  return concat(done)
  
  function done(contents) {
    var sha = crypto.createHash('sha1').update(contents).digest('hex')
    self.data[opts.name] = contents
    cb(null, {hash: sha, size: contents.length})
  }
}

MemBlobs.prototype.createReadStream = function(opts) {
  var buff = this.data[opts.name]
  var stream = duplexify()
  if (!buff) stream.destroy(new Error('not found'))
  else stream.setReadable(from([buff]))
  return stream
}