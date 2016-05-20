var application = require("application");
import StringFormat = require("nativescript-stringformat");

StringFormat.addFormatProvider(function(ctx) {    
    try {
        var toStringSafe = function() { return ctx.value ? ctx.value.toString() : ""; }
    
        if (ctx.expression === "upper") {
            console.log("StringFormat.addFormatProvider: UPPER");
            
            ctx.handled = true;
            return toStringSafe().toUpperCase();
        }
        
        if (ctx.expression === "lower") {
            console.log("StringFormat.addFormatProvider: LOWER");
            
            ctx.handled = true;
            return toStringSafe().toLowerCase();
        }
    }
    catch (e) {
        console.log("[ERROR] StringFormat.addFormatProvider: " + e);
    }
});

application.start({ moduleName: "main-page" });
