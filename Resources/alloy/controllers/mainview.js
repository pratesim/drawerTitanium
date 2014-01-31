function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "mainview";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.mainView = Ti.UI.createView({
        layout: "vertical",
        backgroundColor: "#cacaca",
        id: "mainView"
    });
    $.__views.mainView && $.addTopLevelView($.__views.mainView);
    $.__views.mainTopBar = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "48dp",
        backgroundColor: "#333333",
        opacity: "0.8",
        layout: "horizontal",
        id: "mainTopBar"
    });
    $.__views.mainView.add($.__views.mainTopBar);
    $.__views.menuButton = Ti.UI.createView({
        width: "48dp",
        height: "48dp",
        backgroundColor: "#333333",
        id: "menuButton"
    });
    $.__views.mainTopBar.add($.__views.menuButton);
    $.__views.titleApp = Ti.UI.createLabel({
        color: "white",
        font: {
            fontSize: "20dp",
            fontFamily: "Roboto-Medium"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Degrado Ambientale",
        id: "titleApp"
    });
    $.__views.mainTopBar.add($.__views.titleApp);
    $.__views.littleBar = Ti.UI.createView({
        backgroundColor: "#3793B5",
        height: "3dp",
        width: Ti.UI.FILL,
        id: "littleBar"
    });
    $.__views.mainView.add($.__views.littleBar);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;