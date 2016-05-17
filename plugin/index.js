// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var _formatProviders = [];


// addFormatProvider()
function addFormatProvider(providerCallback) {
    _formatProviders.push(providerCallback);
};
exports.addFormatProvider = addFormatProvider;

// format()
function format(formatStr) {
    var args = [];
    if (arguments.length > 1) {
        args = arguments.slice(1);
    }
    
    return formatArray(formatStr, args);
};
exports.format = format;

// formatArray()
function formatArray(formatStr, args) {
    if (!formatStr) {
        return;
    }
    
    if (!args) {
        args = [];
    }
    
    return this.replace(/{(\d+)(\:)?([^}]*)}/g, function(match, index, formatSeparator, formatExpr) {
        var resultValue = args[index];
        
        if (resultValue === undefined) {
            return match;
        }
        
        if (formatExpr) {
            // use format providers
            
            for (var i = 0; i < _formatProviders.length; i++) {
                var fb = _formatProviders[i];
                if (!fb) {
                    continue;
                }
                
                var fbCtx = {
                    expression: formatExpr,
                    handled: false,
                    value: resultValue    
                };
                
                try {
                    fb(fbCtx);
                }
                catch (e) {
                    continue;
                }
                
                if (fbCtx.handled) {
                    // handled: first wins
                    
                    resultValue = fbCtx.value;
                    break;
                }
            }
        }
        
        if (resultValue !== undefined) {
            return resultValue;
        }

        // not defined => return whole match string
        return resultValue;
    });
};
exports.formatArray = formatArray;
