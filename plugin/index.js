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
"use strict";
var TypeUtils = require("utils/types");
var _formatProviders = [];
var FormatProviderContext = (function () {
    function FormatProviderContext(expr, val) {
        this.handled = false;
        this._expression = expr;
        this._value = val;
    }
    Object.defineProperty(FormatProviderContext.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormatProviderContext.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return FormatProviderContext;
}());
/**
 * Adds a format provider.
 *
 * @function addFormatProvider
 *
 * @param {Function} providerCallback The provider callback.
 */
function addFormatProvider(providerCallback) {
    _formatProviders.push(providerCallback);
}
exports.addFormatProvider = addFormatProvider;
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
function compare(x, y) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
}
exports.compare = compare;
/**
 * Joins items of one string.
 *
 * @function concat
 *
 * @param {Array} itemList The list of items.
 *
 * @return {String} The joined string.
 */
function concat(itemList) {
    return join("", itemList);
}
exports.concat = concat;
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
function format(formatStr) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return formatArray(formatStr, args);
}
exports.format = format;
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
function formatArray(formatStr, args) {
    if (!formatStr) {
        return formatStr;
    }
    if (!args) {
        args = [];
    }
    return formatStr.replace(/{(\d+)(\:)?([^}]*)}/g, function (match, index, formatSeparator, formatExpr) {
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
exports.formatArray = formatArray;
/**
 * Checks if a string is (null), undefined or empty.
 *
 * @function isEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty or not.
 */
function isEmpty(str) {
    return null === str ||
        undefined === str ||
        "" === str;
}
exports.isEmpty = isEmpty;
/**
 * Checks if a string is (null), undefined, empty or contains whitespaces only.
 *
 * @function isEmptyOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty / contains whitespaces only or not.
 */
function isEmptyOrWhitespace(str) {
    return isEmpty(str) ||
        isWhitespace(str);
}
exports.isEmptyOrWhitespace = isEmptyOrWhitespace;
/**
 * Checks if a string is (null) or empty.
 *
 * @function isNullOrEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty or not.
 */
function isNullOrEmpty(str) {
    return null === str ||
        "" === str;
}
exports.isNullOrEmpty = isNullOrEmpty;
/**
 * Checks if a string is (null) or undefined.
 *
 * @function isNullOrUndefined
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined or not.
 */
function isNullOrUndefined(str) {
    return null === str ||
        undefined === str;
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks if a string is (null), empty or contains whitespaces only.
 *
 * @function isNullOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty / contains whitespaces or not.
 */
function isNullOrWhitespace(str) {
    if (null === str) {
        return true;
    }
    return isWhitespace(str);
}
exports.isNullOrWhitespace = isNullOrWhitespace;
/**
 * Checks if a string is empty or contains whitespaces only.
 *
 * @function isWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is empty / contains whitespaces only or not.
 */
function isWhitespace(str) {
    return !isNullOrUndefined(str) &&
        "" === str.trim();
}
exports.isWhitespace = isWhitespace;
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
function join(separator, itemList) {
    var result = "";
    for (var i = 0; i < itemList.length; i++) {
        if (i > 0) {
            result += separator;
        }
        result += itemList[i];
    }
    return result;
}
exports.join = join;
/**
 * Returns the similarity of strings.
 *
 * @function similarity
 *
 * @param {string} left The "left" string.
 * @param {string} right The "right" string.
 * @param {boolean} [ignoreCase] Compare case insensitive or not.
 * @param {boolean} [trim] Trim both strings before comparison or not.
 *
 * @return {Number} The similarity between 0 (0 %) and 1 (100 %).
 */
function similarity(left, right, ignoreCase, trim) {
    if (left === right) {
        return 1;
    }
    if (TypeUtils.isNullOrUndefined(left) ||
        TypeUtils.isNullOrUndefined(right)) {
        return 0;
    }
    if (arguments.length < 4) {
        if (arguments.length < 3) {
            ignoreCase = false;
        }
        trim = false;
    }
    if (ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
    }
    if (trim) {
        left = left.trim();
        right = right.trim();
    }
    var distance = 0;
    if (left !== right) {
        var matrix = new Array(left.length + 1);
        for (var i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(right.length + 1);
            for (var ii = 0; ii < matrix[i].length; ii++) {
                matrix[i][ii] = 0;
            }
        }
        for (var i = 0; i <= left.length; i++) {
            // delete
            matrix[i][0] = i;
        }
        for (var j = 0; j <= right.length; j++) {
            // insert
            matrix[0][j] = j;
        }
        for (var i = 0; i < left.length; i++) {
            for (var j = 0; j < right.length; j++) {
                if (left[i] === right[j]) {
                    matrix[i + 1][j + 1] = matrix[i][j];
                }
                else {
                    // delete or insert
                    matrix[i + 1][j + 1] = Math.min(matrix[i][j + 1] + 1, matrix[i + 1][j] + 1);
                    // substitution
                    matrix[i + 1][j + 1] = Math.min(matrix[i + 1][j + 1], matrix[i][j] + 1);
                }
            }
            distance = matrix[left.length][right.length];
        }
    }
    return 1.0 - distance / Math.max(left.length, right.length);
}
exports.similarity = similarity;
//# sourceMappingURL=index.js.map