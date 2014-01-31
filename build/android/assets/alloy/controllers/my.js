function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "my";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId4 = {};
    var __alloyId7 = [];
    var __alloyId8 = {
        type: "Ti.UI.Label",
        bindId: "info",
        properties: {
            color: "black",
            font: {
                fontFamily: "Arial",
                fontSize: "20dp",
                fontWeight: "bold"
            },
            left: "60dp",
            top: 0,
            bindId: "info"
        }
    };
    __alloyId7.push(__alloyId8);
    var __alloyId9 = {
        type: "Ti.UI.Label",
        bindId: "es_info",
        properties: {
            color: "gray",
            font: {
                fontFamily: "Arial",
                fontSize: "14dp"
            },
            left: "60dp",
            top: "25dp",
            bindId: "es_info"
        }
    };
    __alloyId7.push(__alloyId9);
    var __alloyId6 = {
        properties: {
            name: "template"
        },
        childTemplates: __alloyId7
    };
    __alloyId4["template"] = __alloyId6;
    var __alloyId10 = [];
    $.__views.mylistsection = Ti.UI.createListSection({
        id: "mylistsection",
        headerTitle: "Mie segnalazioni"
    });
    __alloyId10.push($.__views.mylistsection);
    $.__views.my = Ti.UI.createListView({
        sections: __alloyId10,
        templates: __alloyId4,
        id: "my",
        defaultItemTemplate: "template"
    });
    $.__views.my && $.addTopLevelView($.__views.my);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.API.info("Mysection: ");
    Ti.API.info($.my.sections);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;