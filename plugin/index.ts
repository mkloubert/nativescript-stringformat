// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.


var _formatProviders = [];


/**
 * Describes a format provider context.
 */
export interface IFormatProviderContext {
    /**
     * The format expression.
     */
    expression: string;
    
    /**
     * Gets if the expression has been handled or not.
     */
    handled: boolean;
    
    /**
     * Gets the underlying value.
     */
    value: any;
}

class FormatProviderContext implements IFormatProviderContext {
    _expression: string;
    _value: any;
    
    constructor(expr: string, val: any) {
        this._expression = expr;
        this._value = val;
    }
    
    handled: boolean;
    
    public get expression(): string {
        return this._expression;
    }
    
    public get value(): any {
        return this._value;
    }
}


/**
 * Adds a format provider.
 * 
 * @function addFormatProvider
 * 
 * @param {Function} providerCallback The provider callback.
 */
export function addFormatProvider(providerCallback: (ctx: IFormatProviderContext) => any) {
    _formatProviders.push(providerCallback);
}

/**
 * Compares two strings.
 * 
 * @function compare
 * 
 * @param {String} x The left string.
 * @param {String} y The right string.
 * 
 * @return {Number} The compare value (0: are equal; 1: x is greater than y; 2: x is less than y)
 */
export function compare(x: string, y: string) : number {
    if (x < y) {
        return -1;
    }
    
    if (x > y) {
        return 1;
    }
    
    return 0;
}

/**
 * Joins items of one string.
 * 
 * @function concat
 * 
 * @param {Array} itemList The list of items.
 * 
 * @return {String} The joined string.
 */
export function concat(itemList: any[]) : string {
    return join("", itemList);
}

/**
 * Formats a string.
 * 
 * @function format
 * 
 * @param {String} formatStr The format string.
 * @param ...any args One or more argument for the format string.
 * 
 * @return {String} The formatted string.
 */
export function format(formatStr: string, ...args: any[]) : string {
    return formatArray(formatStr, args);
}

/**
 * Formats a string.
 * 
 * @function formatArray
 * 
 * @param {String} formatStr The format string.
 * @param {Array} args The list of arguments for the format string.
 * 
 * @return {String} The formatted string.
 */
export function formatArray(formatStr: string, args: any[]) : string {
    if (!formatStr) {
        return formatStr;
    }

    if (!args) {
        args = [];
    }
    
    return formatStr.replace(/{(\d+)(\:)?([^}]*)}/g, function(match, index, formatSeparator, formatExpr) {
        var resultValue = args[index];

        if (resultValue === undefined) {
            return match;
        }
        
        var funcDepth = 0;
        while (typeof resultValue === "function") {
            resultValue = resultValue(index, args, match, formatExpr, funcDepth++);
        }
        
        if (formatSeparator === ':') {
            // use format providers
            
            for (var i = 0; i < _formatProviders.length; i++) {
                var fp = _formatProviders[i];
                
                var fpCtx = new FormatProviderContext(formatExpr, resultValue);
                fpCtx.handled = false;
                
                var fpResult;
                try {
                    fpResult = fp(fpCtx);
                }
                catch (e) {
                    continue;
                }
                
                if (fpCtx.handled) {
                    // handled: first wins
                    
                    resultValue = fpResult;
                    break;
                }
            }
        }
        
        if (resultValue !== undefined) {
            return resultValue;
        }

        // not defined => return whole match string
        return match;
    });
}

/**
 * Checks if a string is (null), undefined or empty.
 * 
 * @function isEmpty
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined / empty or not.
 */
export function isEmpty(str: string) {
    return null === str ||
           undefined === str ||
           "" === str;
}

/**
 * Checks if a string is (null), undefined, empty or contains whitespaces only.
 * 
 * @function isEmptyOrWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined / empty / contains whitespaces only or not.
 */
export function isEmptyOrWhitespace(str: string) {
    return isEmpty(str) ||
           isWhitespace(str);
}

/**
 * Checks if a string is (null) or empty.
 * 
 * @function isNullOrEmpty
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / empty or not.
 */
export function isNullOrEmpty(str: string) : boolean {
    return null === str ||
           "" === str;
}

/**
 * Checks if a string is (null) or undefined.
 * 
 * @function isNullOrUndefined
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined or not.
 */
export function isNullOrUndefined(str: string) : boolean {
    return null === str ||
           undefined === str;
}

/**
 * Checks if a string is (null), empty or contains whitespaces only.
 * 
 * @function isNullOrWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / empty / contains whitespaces or not.
 */
export function isNullOrWhitespace(str: string) : boolean {
    if (null === str) {
        return true;
    }
    
    return isWhitespace(str);
}

/**
 * Checks if a string is empty or contains whitespaces only.
 * 
 * @function isWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is empty / contains whitespaces only or not.
 */
export function isWhitespace(str: string) : boolean {
    return !isNullOrUndefined(str) &&
           "" === str.trim();
}

/**
 * Joins items of one string.
 * 
 * @function join
 * 
 * @param {String} separator The separator.
 * @param {Array} itemList The list of items.
 * 
 * @return {String} The joined string.
 */
export function join(separator: string, itemList: any[]) : string {    
    var result = "";
    
    for (var i = 0; i < itemList.length; i++) {
        if (i > 0) {
            result += separator;
        }

        result += itemList[i];
    }
    
    return result;
}
