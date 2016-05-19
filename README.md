[![npm](https://img.shields.io/npm/v/nativescript-stringformat.svg)](https://www.npmjs.com/package/nativescript-stringformat)
[![npm](https://img.shields.io/npm/dt/nativescript-stringformat.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-stringformat)

# NativeScript StringFormat

A [NativeScript](https://nativescript.org/) module for formatting strings.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B9SPFN79E8BWE)

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-stringformat/master/LICENSE)

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
var newStr1 = StringFormat.format("{0} + {1}",
                                  "TM",  // {0}
                                  "MK");  // {1}
                                 
// the alternative:
var newStr2 = StringFormat.formatArray("{0} + {1}",
                                       ["TM", "MK"]);
```

### Custom order of arguments

```javascript
var StringFormat = require('nativescript-stringformat');

// "Marcel Kloubert"
var newStr = StringFormat.format("{1} {0}",
                                 "Kloubert",   // {0}
                                 "Marcel");  // {1}
```

### Functions as arguments

You can use functions that return the value that should be included into the target string:

```javascript
var StringFormat = require('nativescript-stringformat');

// "23091979 + 5091979 = 28183958"
var newStr = StringFormat.format("{0} + {1} = {2}",
                                 23091979,  // {0}
                                 5091979,  // {1}
                                 function (index, args) {  // {2}
                                     return args[0] + args[1];  // 28183958
                                 });
```

The full signature of a function:

```javascript
function (index, args, match, formatExpr, funcDepth) {
    return <THE-VALUE-TO-USE>;
}
```

| Name | Description |
| ---- | --------- |
| index | The index value of the argument. For `{7}` this will be `7` |
| args | The values that were passed to the underlying `format()` or `formatArray()` function. |
| match | The complete (unhandled) expression of the argument. |
| formatExpr | The optional format expression of the argument. For `{0:lower}` this will be `lower`.  |
| funcDepth | This value is `0` at the beginning. If you return a function in that function again, this will increase until you stop to return a function. |

### Format providers

Separated by a `:` an argument can contain a format expression at the right side.

So you can define custom logic to convert an argument value.

Lets say we want to define a format provider that converts values to upper and lower case strings:

```javascript
var StringFormat = require("nativescript-stringformat");

StringFormat.addFormatProvider(function(ctx) {    
    var toStringSafe = function() { 
        return ctx.value ? ctx.value.toString() : "";
    }
    
    if (ctx.expression === "upper") {
        // UPPER case
        ctx.handled = true;
        return toStringSafe().toUpperCase();
    }
    
    if (ctx.expression === "lower") {
        // LOWER case
        ctx.handled = true;
        return toStringSafe().toLowerCase();
    }
});
```

Now you can use the extended logic in your code:

```javascript
var StringFormat = require('nativescript-stringformat');

// MARCEL kloubert
var newStr = StringFormat.format("{0:upper} {1:lower}",
                                 "Marcel", "KlOUBERT");
```

The `ctx` object of a provider callback has the following structure:

| Name | Description |
| ---- | --------- |
| expression | The expression right to `:`. In that example `upper` and `lower`.  |
| handled | Defines if value was handled or not. Is `(false)` by default. |
| value | The value that should be parsed. In that example `Marcel` and `KlOUBERT`. |

The parsed value has to be returned and `ctx.handled` has to be set to `(true)`.

All upcoming format providers will be skipped if the value has been marked as "handled".
