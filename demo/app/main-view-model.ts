var StringFormat = require("nativescript-stringformat");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

function createViewModel() {
    var viewModel = new Observable();
    viewModel.items = new ObservableArray();
    
    var items = viewModel.items;
    
    // simple example
    items.push({
        expr: "{0} AND {1}",
        args: ["TM", "MK"]
    });
    
    // reverse order of placeholders
    items.push({
        expr: "{1} NOT {0}",
        args: ["MK", "PZ"]
    });
    
    items.push({
        expr: "{0:upper} {1:lower}",
        args: ["Marcel", "KLOUBERT"]
    });
    
    items.push({
        expr: "The value {0} is random.",
        description: "A random value between 0 and 23091979:",
        args: [function() { return Math.random() * 23091979; }]
    });
    
    for (var i = 0; i < 10; i++) {
        var a = Math.floor(Math.random() * 1000);
        var b = Math.floor(Math.random() * 1000);
        
        items.push({
            expr: "{0} + {1} = {2}",
            description: "Sum of random integers #" + (i + 1) + ":",
            args: [a, b, function(index, args) {
                            return args[0] + args[1];
                        }]
        });    
    }
    
    for (var i = 0; i < items.length; i++) {
        var item = items.getItem(i);
        
        if (!item.description) {
            item.description = item.expr;
        }
        
        item.result = StringFormat.formatArray(item.expr,
                                               item.args);
    }

    var builder = new StringFormat.StringBuilder();
    for (var i = 0; i < 5; i++) {
        builder.appendFormat("Line #{1}: {0}", i, i + 1)
               .appendLine();
    }

    viewModel.stringBuilderResult = '' + builder;

    return viewModel;
}
exports.createViewModel = createViewModel;
