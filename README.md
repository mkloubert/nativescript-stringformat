[![npm](https://img.shields.io/npm/v/nativescript-stringformat.svg)](https://www.npmjs.com/package/nativescript-stringformat)
[![npm](https://img.shields.io/npm/dt/nativescript-stringformat.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-stringformat)

# NativeScript StringFormat

A [NativeScript](https://nativescript.org/) module for formatting strings.

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-applist/master/LICENSE)

## Platforms

* Android
* iOS

## Installation

Run

```bash
tns plugin add nativescript-stringformat
```

inside your app project to install the module.

## Demo

For quick start have a look at the [demo/app/main-view-model.js](https://github.com/mkloubert/nativescript-stringformat/blob/master/demo/app/main-view-model.js) file of the [demo app](https://github.com/mkloubert/nativescript-stringformat/tree/master/demo) to learn how it works.

Otherwise ...

## Examples

### Simple example

```javascript
var StringFormat = require('nativescript-stringformat');

// "TM + MK"
var newStr = StringFormat.format("{0} + {1}", "TM", "MK");
```


