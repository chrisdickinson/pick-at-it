var assert = require('assert')
  , picker = require('../index')
  , onecolor = require('onecolor')

var tests = [
    test_modify_hsl
  , test_modify_slh
  , test_set_hsl
  , test_set_slh
  , test_set_mode
  , test_change_triggers
  , test_initialization 
]

start()

function setup() {

}

// integration tests because reasons.

function test_modify_hsl() {
  var primary = pathed('el.style.background', '')
    , secondary = pathed('el.style.background', '')

  var color = onecolor('#000000')
      .red(Math.random())
      .green(Math.random())
      .blue(Math.random()) 

  var white = color.lightness() * 2 - 1
    , black = color.lightness() * -2 + 1

  picker.prototype.modify_hsl.call({
      field_primary: primary
    , field_secondary: secondary
    , vendor: function() { return '' }
    , color: color
  }) 

  assert.ok(primary.el.style.background)

  assert.ok(primary.el.style.background.indexOf(
    'linear-gradient(top, rgba(255, 255, 255, '+white+'), '
  ) > -1)

  assert.ok(primary.el.style.background.indexOf(
    'linear-gradient(top, rgba(0, 0, 0, '+black+'), '
  ) > -1)

  assert.ok(secondary.el.style.background.indexOf(
    'linear-gradient(top, #FFF, #000)'
  ) > -1)

}

function test_modify_slh() {
  var primary = pathed('el.style.background', '')
    , secondary = pathed('el.style.background', '')

  var color = onecolor('#000000')
      .red(Math.random())
      .green(Math.random())
      .blue(Math.random()) 

  var white = color.lightness() * 2 - 1
    , black = color.lightness() * -2 + 1

  picker.prototype.modify_slh.call({
      field_primary: primary
    , field_secondary: secondary
    , vendor: function() { return '' }
    , color: color
  }) 

  assert.ok(primary.el.style.background)  
  assert.ok(primary.el.style.backgroundColor)
  assert.ok(secondary.el.style.background)
}

function test_set_hsl() {
  
}

function test_set_slh() {
  
}

function test_set_mode() {
  
}

function test_change_triggers() {
  
}

function test_initialization() {
  
} 

// utils

function out(what) {
  process.stdout.write(what)
}

// test runner

function start() {
  Function.prototype.before = function(fn) {
    var self = this
    return function ret() {
      var args = [].slice.call(arguments)

      fn.call(ret, args)

      return self.apply(this, args)
    }
  }

  if(typeof window !== 'undefined') {
    out = function(s) {
      out.buf = (out.buf || '') + s
      if(!!~s.indexOf('\n')) {
        console.log(out.buf)
        out.buf = ''
      }
    }
  }
  run()
}

function run() {
  if(!tests.length)
    return out('\n')

  var test = tests.shift()
    , now = Date.now()

  setup()

  out(test.name+' - ')
  test.length ? test(done) : (test(), done())

  function done() {
    out(''+(Date.now() - now)+'ms\n')
    run()
  }
}

function pathed(path, value) {
  var root = {}
    , obj = root
    , bits = path.split('.')

  while(bits.length > 1) {
    (obj = obj[bits.shift()] = {})
  }

  obj[bits.shift()] = value
  return root
}
