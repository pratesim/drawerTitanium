function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "reporting";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.winreporting = Ti.UI.createWindow({
        id: "winreporting",
        fullscreen: "false"
    });
    $.__views.winreporting && $.addTopLevelView($.__views.winreporting);
    $.__views.progressIndicatorIndeterminant = Ti.UI.Android.createProgressIndicator({
        ns: Ti.UI.Android,
        id: "progressIndicatorIndeterminant",
        message: "Loading...",
        location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
        type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
    });
    $.__views.winreporting.add($.__views.progressIndicatorIndeterminant);
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
    $.__views.winreporting.add($.__views.scrollView);
    $.__views.__alloyId41 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId41"
    });
    $.__views.scrollView.add($.__views.__alloyId41);
    $.__views.__alloyId42 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "Titolo:",
        id: "__alloyId42"
    });
    $.__views.__alloyId41.add($.__views.__alloyId42);
    $.__views.__alloyId43 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId43"
    });
    $.__views.__alloyId41.add($.__views.__alloyId43);
    $.__views.titleinput = Ti.UI.createTextArea({
        top: "5dp",
        left: "0dp",
        color: "white",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.FILL,
        id: "titleinput"
    });
    $.__views.__alloyId41.add($.__views.titleinput);
    $.__views.__alloyId44 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId44"
    });
    $.__views.scrollView.add($.__views.__alloyId44);
    $.__views.__alloyId45 = Ti.UI.createLabel({
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        text: "Descrizione:",
        id: "__alloyId45"
    });
    $.__views.__alloyId44.add($.__views.__alloyId45);
    $.__views.__alloyId46 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId46"
    });
    $.__views.__alloyId44.add($.__views.__alloyId46);
    $.__views.mailInput = Ti.UI.createTextArea({
        top: "5dp",
        left: "0dp",
        color: "white",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.FILL,
        id: "mailInput"
    });
    $.__views.__alloyId44.add($.__views.mailInput);
    $.__views.__alloyId47 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId47"
    });
    $.__views.scrollView.add($.__views.__alloyId47);
    $.__views.__alloyId48 = Ti.UI.createLabel({
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
        id: "__alloyId48"
    });
    $.__views.__alloyId47.add($.__views.__alloyId48);
    $.__views.__alloyId49 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId49"
    });
    $.__views.__alloyId47.add($.__views.__alloyId49);
    $.__views.repoimage = Ti.UI.createImageView({
        top: "5dp",
        id: "repoimage",
        image: "/placeholder.png"
    });
    $.__views.__alloyId47.add($.__views.repoimage);
    $.__views.__alloyId50 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId50"
    });
    $.__views.scrollView.add($.__views.__alloyId50);
    $.__views.__alloyId51 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "transparent",
        id: "__alloyId51"
    });
    $.__views.__alloyId50.add($.__views.__alloyId51);
    $.__views.takephoto = Ti.UI.createButton({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: "50%",
        left: "0%",
        title: "Scatta Foto",
        id: "takephoto"
    });
    $.__views.__alloyId51.add($.__views.takephoto);
    $.__views.send = Ti.UI.createButton({
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: "50%",
        right: "0%",
        title: "Invia Segnalazione",
        id: "send"
    });
    $.__views.__alloyId51.add($.__views.send);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var win = $.winreporting;
    var actionBar;
    Alloy.Globals.Georep;
    win.addEventListener("open", function() {
        Ti.API.info('Window "dettagli segnalazione" aperta');
        if (win.activity) {
            actionBar = win.activity.actionBar;
            if (actionBar) {
                actionBar.icon = "/images/icon.png";
                actionBar.title = "Degrado Ambientale";
                actionBar.navigationMode = Ti.Android.NAVIGATION_MODE_STANDARD;
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    Ti.API.info("Home icon clicked!");
                    win.close();
                };
            }
        } else Ti.API.error("Can't access action bar on a lightweight window.");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;