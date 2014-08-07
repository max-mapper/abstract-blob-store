var tape = require('tape')
var blobs = require('../')
var tests = require('./')

var common = {
  setup: function(t, cb) {
    // make a new blobs instance on every test
    cb(null, blobs())
  },
  teardown: function(t, store, cb) {
    delete store.data
    cb()
  }
}

tests(tape, common)
