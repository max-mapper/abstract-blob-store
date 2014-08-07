var tape = require('tape')
var Blobs = require('../')
var tests = require('./')

var common = {
  setup: function(t, cb) {
    var blobs = new Blobs()
    cb(null, blobs)
  },
  teardown: function(t, cb) {
    cb()
  }
}

tests(tape, common)
