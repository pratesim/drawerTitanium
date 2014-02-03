function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "repodetail";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.winrepodetail = Ti.UI.createWindow({
        id: "winrepodetail",
        fullscreen: "false"
    });
    $.__views.winrepodetail && $.addTopLevelView($.__views.winrepodetail);
    $.__views.scrollView = Ti.UI.createScrollView({
        top: "0dp",
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#050607",
                offset: 0
            }, {
                color: "#272D33",
                offset: 1
            } ]
        },
        id: "scrollView"
    });
    $.__views.winrepodetail.add($.__views.scrollView);
    $.__views.__alloyId17 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId17"
    });
    $.__views.scrollView.add($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "NICKNAME",
        id: "__alloyId18"
    });
    $.__views.__alloyId17.add($.__views.__alloyId18);
    $.__views.__alloyId19 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId19"
    });
    $.__views.__alloyId17.add($.__views.__alloyId19);
    $.__views.nicklabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "nicklabel"
    });
    $.__views.__alloyId17.add($.__views.nicklabel);
    $.__views.__alloyId20 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId20"
    });
    $.__views.scrollView.add($.__views.__alloyId20);
    $.__views.__alloyId21 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "E-MAIL",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    $.__views.__alloyId22 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId22"
    });
    $.__views.__alloyId20.add($.__views.__alloyId22);
    $.__views.maillabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "maillabel "
    });
    $.__views.__alloyId20.add($.__views.maillabel);
    $.__views.__alloyId23 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId23"
    });
    $.__views.scrollView.add($.__views.__alloyId23);
    $.__views.__alloyId24 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "DESCRIZIONE",
        id: "__alloyId24"
    });
    $.__views.__alloyId23.add($.__views.__alloyId24);
    $.__views.__alloyId25 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId25"
    });
    $.__views.__alloyId23.add($.__views.__alloyId25);
    $.__views.descriptionlabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "descriptionlabel "
    });
    $.__views.__alloyId23.add($.__views.descriptionlabel);
    $.__views.__alloyId26 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId26"
    });
    $.__views.scrollView.add($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "COORDINATE",
        id: "__alloyId27"
    });
    $.__views.__alloyId26.add($.__views.__alloyId27);
    $.__views.__alloyId28 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId28"
    });
    $.__views.__alloyId26.add($.__views.__alloyId28);
    $.__views.coordlatlabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "coordlatlabel "
    });
    $.__views.__alloyId26.add($.__views.coordlatlabel);
    $.__views.coordlonlabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "coordlonlabel "
    });
    $.__views.__alloyId26.add($.__views.coordlonlabel);
    $.__views.__alloyId29 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId29"
    });
    $.__views.scrollView.add($.__views.__alloyId29);
    $.__views.__alloyId30 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "NEI PRESSI DI",
        id: "__alloyId30"
    });
    $.__views.__alloyId29.add($.__views.__alloyId30);
    $.__views.__alloyId31 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId31"
    });
    $.__views.__alloyId29.add($.__views.__alloyId31);
    $.__views.addresslabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "addresslabel "
    });
    $.__views.__alloyId29.add($.__views.addresslabel);
    $.__views.__alloyId32 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId32"
    });
    $.__views.scrollView.add($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "SEGNALATO IL",
        id: "__alloyId33"
    });
    $.__views.__alloyId32.add($.__views.__alloyId33);
    $.__views.__alloyId34 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId34"
    });
    $.__views.__alloyId32.add($.__views.__alloyId34);
    $.__views.datalabel = Ti.UI.createLabel({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "datalabel "
    });
    $.__views.__alloyId32.add($.__views.datalabel);
    $.__views.__alloyId35 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId35"
    });
    $.__views.scrollView.add($.__views.__alloyId35);
    $.__views.__alloyId36 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "FOTO",
        id: "__alloyId36"
    });
    $.__views.__alloyId35.add($.__views.__alloyId36);
    $.__views.__alloyId37 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId37"
    });
    $.__views.__alloyId35.add($.__views.__alloyId37);
    $.__views.repoimage = Ti.UI.createImageView({
        top: "5dp",
        id: "repoimage",
        image: "/placeholder.png"
    });
    $.__views.__alloyId35.add($.__views.repoimage);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var win = $.winrepodetail;
    var actionBar;
    win.addEventListener("open", function() {
        Ti.API.info('Window "segnala" aperta');
        if ($.winrepodetail.activity) {
            actionBar = $.winrepodetail.activity.actionBar;
            if (actionBar) {
                actionBar.icon = "/images/icon.png";
                actionBar.title = "Degrado Ambientale";
                actionBar.navigationMode = Ti.Android.NAVIGATION_MODE_STANDARD;
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    Ti.API.info("Home icon clicked!");
                    $.winrepodetail.close();
                };
            }
        } else Ti.API.error("Can't access action bar on a lightweight window.");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;