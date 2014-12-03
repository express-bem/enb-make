
# express-bem-enb-make

[![Build Status](https://travis-ci.org/express-bem/enb-make.svg)](https://travis-ci.org/express-bem/enb-make) [![Dependency Status](https://david-dm.org/express-bem/enb-make.png)](https://david-dm.org/express-bem/enb-make)

[enb][] make middleware (plugin) for [express-bem][]

[enb]: https://github.com/enb-make/enb
[express-bem]: https://github.com/zxqfox/express-bem

## Dependencies

[enb][] v0.13.9+

### Peer

[express-bem][] v0.2.1+

## Why

To build bundles on each render.

## Installation

```sh
$ npm i express-bem-enb-make --save
```

## Usage

```js
var express = require('express');
var expressBem = require('express-bem');

var app = express();
var bem = expressBem({projectRoot: './path-to/bem-project'});

bem.bindTo(app);

if (process.env.NODE_ENV === 'development') {
  bem.use(require('express-bem-enb-make').middleware, {verbosity: 'debug'});
  // bem.usePlugin('tools-make', {verbosity: 'debug'});
}
```

## License

MIT [License][]

[License]: https://github.com/zxqfox/express-bem/blob/master/LICENSE
