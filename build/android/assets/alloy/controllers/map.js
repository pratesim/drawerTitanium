function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "map";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.map = Ti.UI.createView({
        id: "map",
        backgroundColor: "black"
    });
    $.__views.map && $.addTopLevelView($.__views.map);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "La Mappa!.",
        id: "__alloyId2"
    });
    $.__views.map.add($.__views.__alloyId2);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;