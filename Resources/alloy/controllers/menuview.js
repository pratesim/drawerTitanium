function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "menuview";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.menuView = Ti.UI.createView({
        layout: "vertical",
        backgroundColor: "#3D3D3D",
        id: "menuView"
    });
    $.__views.menuView && $.addTopLevelView($.__views.menuView);
    $.__views.menuTopBar = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "48dp",
        backgroundColor: "#DDDDDD",
        opacity: "1",
        layout: "horizontal",
        id: "menuTopBar"
    });
    $.__views.menuView.add($.__views.menuTopBar);
    $.__views.menuLabel = Ti.UI.createLabel({
        top: 4,
        left: 10,
        height: "40dp",
        font: {
            fontSize: "22dp"
        },
        color: "#000000",
        text: "Menù",
        id: "menuLabel"
    });
    $.__views.menuTopBar.add($.__views.menuLabel);
    $.__views.menuLittleTopBar = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "3dp",
        backgroundColor: "#DCDCDC",
        id: "menuLittleTopBar"
    });
    $.__views.menuView.add($.__views.menuLittleTopBar);
    $.__views.row1 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "row1"
    });
    var __alloyId9 = [];
    __alloyId9.push($.__views.row1);
    $.__views.rowContainer = Ti.UI.createView({
        height: "40dp",
        layout: "horizontal",
        id: "rowContainer"
    });
    $.__views.row1.add($.__views.rowContainer);
    $.__views.rowGear = Ti.UI.createView({
        left: 5,
        top: 0,
        width: "40dp",
        height: "40dp",
        backgroundImage: "/images/ic_action_map.png",
        id: "rowGear"
    });
    $.__views.rowContainer.add($.__views.rowGear);
    $.__views.rowLabel = Ti.UI.createLabel({
        top: 0,
        left: 10,
        height: "40dp",
        font: {
            fontSize: "18dp"
        },
        color: "#59595C",
        text: "Mappa",
        id: "rowLabel"
    });
    $.__views.rowContainer.add($.__views.rowLabel);
    $.__views.row2 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "row2"
    });
    __alloyId9.push($.__views.row2);
    $.__views.rowContainer = Ti.UI.createView({
        height: "40dp",
        layout: "horizontal",
        id: "rowContainer"
    });
    $.__views.row2.add($.__views.rowContainer);
    $.__views.rowSkull = Ti.UI.createView({
        left: 5,
        top: 0,
        width: "40dp",
        height: "40dp",
        backgroundImage: "/images/ic_action_view_as_list.png",
        id: "rowSkull"
    });
    $.__views.rowContainer.add($.__views.rowSkull);
    $.__views.rowLabel = Ti.UI.createLabel({
        top: 0,
        left: 10,
        height: "40dp",
        font: {
            fontSize: "18dp"
        },
        color: "#59595C",
        text: "Ultime Segnalazioni",
        id: "rowLabel"
    });
    $.__views.rowContainer.add($.__views.rowLabel);
    $.__views.row3 = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "row3"
    });
    __alloyId9.push($.__views.row3);
    $.__views.rowContainer = Ti.UI.createView({
        height: "40dp",
        layout: "horizontal",
        id: "rowContainer"
    });
    $.__views.row3.add($.__views.rowContainer);
    $.__views.rowPicFrame = Ti.UI.createView({
        left: 5,
        top: 0,
        width: "40dp",
        height: "40dp",
        backgroundImage: "/images/ic_action_time.png",
        id: "rowPicFrame"
    });
    $.__views.rowContainer.add($.__views.rowPicFrame);
    $.__views.rowLabel = Ti.UI.createLabel({
        top: 0,
        left: 10,
        height: "40dp",
        font: {
            fontSize: "18dp"
        },
        color: "#59595C",
        text: "Le Mie Segnalazioni",
        id: "rowLabel"
    });
    $.__views.rowContainer.add($.__views.rowLabel);
    $.__views.rowReporting = Ti.UI.createTableViewRow({
        height: "50dp",
        id: "rowReporting"
    });
    __alloyId9.push($.__views.rowReporting);
    $.__views.rowContainer = Ti.UI.createView({
        height: "40dp",
        layout: "horizontal",
        id: "rowContainer"
    });
    $.__views.rowReporting.add($.__views.rowContainer);
    $.__views.rowPicFrame = Ti.UI.createView({
        left: 5,
        top: 0,
        width: "40dp",
        height: "40dp",
        backgroundImage: "/images/ic_action_time.png",
        id: "rowPicFrame"
    });
    $.__views.rowContainer.add($.__views.rowPicFrame);
    $.__views.rowLabel = Ti.UI.createLabel({
        top: 0,
        left: 10,
        height: "40dp",
        font: {
            fontSize: "18dp"
        },
        color: "#59595C",
        text: "Segnala",
        id: "rowLabel"
    });
    $.__views.rowContainer.add($.__views.rowLabel);
    $.__views.menuTable = Ti.UI.createTableView({
        separatorStyle: "SINGLE_LINE",
        separatorColor: "#E5E5E5",
        backgroundColor: "#EEEEEE",
        data: __alloyId9,
        id: "menuTable"
    });
    $.__views.menuView.add($.__views.menuTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;