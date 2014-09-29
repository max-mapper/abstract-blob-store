module.exports = function(test, common) {
  require('./read-write.js').all(test, common)
  require('./string-key.js').all(test, common)
}
