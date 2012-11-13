var color = require('onecolor')
  , picker = require('../index')
  , domnode = require('domnode-dom')
  , through = require('through')

var e = document.getElementById('content')
  , o = document.getElementById('color')
  , s = document.getElementById('mode')
  , c = color('#FF00FF')
  , p = picker(e, c, s.value)
  , toHTML

toHTML = through(function(color) {
  this.emit('data', div(color))
})

// yay piping!
domnode
  .createReadStream(s, 'change', false)
  .on('data', function(v) { p.set_mode(v) })    

p.pipe(toHTML)
 .pipe(domnode.createWriteStream(o, 'text/html'))

// prime the color output.
toHTML.write(c)

function div(color) {
  return '<div style="width:100%; height:100%; background:'+color.hex()+'"></div>'
}
