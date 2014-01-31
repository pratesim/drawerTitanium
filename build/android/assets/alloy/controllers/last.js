function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "last";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.last = Ti.UI.createView({
        id: "last",
        backgroundColor: "black"
    });
    $.__views.last && $.addTopLevelView($.__views.last);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Lista Ultime Segnalazioni.",
        id: "__alloyId1"
    });
    $.__views.last.add($.__views.__alloyId1);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;