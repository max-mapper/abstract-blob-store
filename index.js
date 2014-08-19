var from = require('from2-array')
var concat = require('concat-stream')
var crypto = require('crypto')

module.exports = MemBlobs

function MemBlobs() {
  if (!(this instanceof MemBlobs)) return new MemBlobs()
  this.data = {}
}

MemBlobs.prototype.createWriteStream = function(opts, cb) {
  var self = this
  return concat(done)
  
  function done(contents) {
    var key = opts.key || crypto.createHash('sha1').update(contents).digest('hex')
    self.data[key] = contents
    cb(null, {key: key, size: contents.length, name: opts.name})
  }
}

MemBlobs.prototype.createReadStream = function(opts) {
  var buff = this.data[opts.key]
  var stream
  if (!buff) {
    stream = from([])
    stream.destroy(new Error('Blob not found'))
  } else {
    stream = from([buff])
  }
  return stream
}

MemBlobs.prototype.exists = function(opts, cb) {
  cb(null, !!this.data[opts.key])
}
