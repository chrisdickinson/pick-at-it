# pick-at-it

Streamable color picker for browserify.

```javascript

var color = require('onecolor')
  , picker = require('pick-at-it')
  , domnode = require('domnode-dom')
  , through = require('through')

var e = document.getElementById('content')
  , o = document.getElementById('color')

var c = color('#FF00FF')
  , p = picker(e, c, 'hsl')
  , toHTML

toHTML = through(function(color) {
  this.emit('data', div(color))
})

// turn color objects into HTML
// then shove them into the DOM.
p.pipe(toHTML)
 .pipe(domnode.createWriteStream(o, 'text/html'))

```

**NB**: Any color library that provides the same interface as `onecolor` will
work -- and you **must** provide an initial color to the picker.

## API

### picker(element, color, 'hsl' | 'slh') -> p

Given a native DOM element, default color, and default mode,
initialize the color picker.

```html
<!-- example html

assuming that you pass document.getElementById('target') into
picker(), your html should look something like this:

 -->
<div id="target">
    <div name="primary"></div>
    <div name="secondary"></div>
</div>
``` 

Picker will use `el.querySelector` to search for two elements,
`[name=primary]` and `[name=secondary]`, and create a 
[fffield](https://github.com/chrisdickinson/fffield) instance for
each (which implies that it will create a new `div.cursor` element in
each matching element).

Picker is a **readable and writable** stream.

Picker will use CSS3 background gradients to create the desired color fields.


### p.set_mode('hsl' | 'slh') -> undefined

Set the displayed mode to 'hsl' or 'slh'.

## Testing

`npm test` will run the tests in a jsdom environment.

You may use [browservefy](https://github.com/chrisdickinson/browservefy) to
quickly test out changes to the code in a browser:

```bash
$ npm install -g browservefy
$ git clone <this repo>
$ cd <this repo>
$ browservefy test/example.js 8998 -- -d
# now open http://localhost:8998/test/index.html to play with
# the picker.

```

## License

MIT


