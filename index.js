module.exports = Picker

var Stream = require('stream')

var Field = require('fffield')

function Picker(el, color, mode) {
  if(this.constructor !== Picker)
    return new Picker(el, color, mode)

  this.color = color
  this.el = el
  this.mode = mode
  this._vendor = null

  this.field_primary = this.field_class(
      this.el.querySelector('[name=primary]') 
    , this.primary_coords().x
    , this.primary_coords().y
  )

  this.field_secondary = this.field_class(
      this.el.querySelector('[name=secondary]')
    , 0
    , this.secondary_coords().y
  )

  this.writable =
  this.readable = true

  this.field_secondary.cursor.x_free = 0

  this.field_primary.on('data', this.change_primary.bind(this))
  this.field_secondary.on('data', this.change_secondary.bind(this))

  this['modify_'+this.mode]()
  Stream.call(this)
}

var cons = Picker
  , proto = cons.prototype = new Stream

proto.constructor = cons

proto.field_class = Field

proto.mode_to_coords = {
  hsl: ['hue', 'saturation', 'lightness']
, slh: ['saturation', 'lightness', 'hue']
}

proto.primary_coords = function() {
  return {
      x: this.color[this.mode_to_coords[this.mode][0]]()
    , y: this.color[this.mode_to_coords[this.mode][1]]()
  }
}

proto.secondary_coords = function() {
  return {
      x: 0
    , y: this.color[this.mode_to_coords[this.mode][2]]()
  }
}

proto.change_primary = function(data) {
  this['set_primary_'+this.mode](data)
  this['modify_'+this.mode]()

  this.emit('data', this.color)
}

proto.change_secondary = function(data) {
  this['set_secondary_'+this.mode](data)
  this['modify_'+this.mode]()

  this.emit('data', this.color)
}

proto.set_mode = function(mode) {
  this.mode = mode

  var primary = this.primary_coords()
    , secondary = this.secondary_coords()

  this.field_primary.set(primary.x, primary.y)
  this.field_secondary.set(0, primary.y)
  this['modify_'+this.mode]()
}

proto.set_primary_hsl = function(data) {
  this.color = this.color.hue(data.x).saturation(data.y)
}

proto.set_primary_slh = function(data) {
  var dark = data.y
    , light = 1.0 - data.x
    , color
    , hue

  this.color = this.color.lightness(0.5).saturation(1.0)
  hue = this.color.hue()

  color = [
      (this.color.red() * data.y + light)
    , (this.color.green() * data.y + light)
    , (this.color.blue() * data.y + light)
  ]

  this.color = this.color.red(color[0]).green(color[1]).blue(color[2]).hue(hue)
}

proto.set_secondary_hsl = function(data) {
  this.color = this.color.lightness(data.y)
}

proto.set_secondary_slh = function(data) {
  this.color = this.color.hue(data.y)
}

proto.write = function(color) {
  this.color = color

  var primary = this.primary_coords()
    , secondary = this.secondary_coords()

  this.field_primary.set(primary.x, primary.y)
  this.field_secondary.set(0, primary.y)
}

proto.modify_hsl = function() {
  var black = -2 * this.color.lightness() + 1
    , white = 2 * this.color.lightness() - 1

  this.field_primary.el.style.background = (
      '{vendor}linear-gradient(top, rgba(255, 255, 255, '+white+'), '
    + 'rgba(255, 255, 255, '+white+')), '
    + '{vendor}linear-gradient(top, rgba(0, 0, 0, '+black+'), '
    + 'rgba(0, 0, 0, '+black+')), '
    + '{vendor}linear-gradient(top, '
    + 'rgba(255, 255, 255, 0.0), '
    + 'rgba(255, 255, 255, 1.0)), '
    + '{vendor}linear-gradient(left, '
    + '#FF0000 0%, '
    + '#FFFF00 16.666666666666664%, '
    + '#00FF00 33.33333333333333%, '
    + '#00FFFF 49.99999999999999%, '
    + '#0000FF 66.66666666666666%, '
    + '#FF00FF 83.33333333333331%, '
    + '#FF0000 100%)'
  ).replace(/\{vendor\}/g, this.vendor())

  this.field_secondary.el.style.background =
   '{vendor}linear-gradient(top, #FFF, #000)'
    .replace(/\{vendor\}/g, this.vendor())

}

proto.modify_slh = function() {
  this.field_primary.el.style.background = (
    '{vendor}linear-gradient(top, '
  + '  rgba(0, 0, 0, 0.0), '
  + '  rgba(0, 0, 0, 1.0)), '
  + '{vendor}linear-gradient(left, '
  + '  rgba(255, 255, 255, 1.0), '
  + '  rgba(255, 255, 255, 0.0)) '
  ).replace(/\{vendor\}/g, this.vendor())

  this.field_primary.el.style.backgroundColor = this.color.lightness(0.5).saturation(1.0).hex()

  this.field_secondary.el.style.background = (
      '{vendor}linear-gradient(bottom, '
    + '#FF0000 0%, '
    + '#FFFF00 16.666666666666664%, '
    + '#00FF00 33.33333333333333%, '
    + '#00FFFF 49.99999999999999%, '
    + '#0000FF 66.66666666666666%, '
    + '#FF00FF 83.33333333333331%, '
    + '#FF0000 100%)'
  ).replace(/\{vendor\}/g, this.vendor())
}

proto.vendor = function() {
  if(this._vendor !== null) {
    return this._vendor
  }

  var tests = ['-webkit-', '-moz-', '-ms-', '-o-', '']
    , full = 'linear-gradient(left, #000, #FFF)'
    , el = this.el.ownerDocument.createElement('div')

  for(var i = 0, len = tests.length; i < len; ++i) {
    el.style.background = tests[i]+full
    if(el.style.background !== '')
      return this._vendor = tests[i] 
  }

  return ''
}
