function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.UPSIDE_PORTRAIT ],
        navBarHidden: true,
        exitOnClose: true,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.drawermenu = Alloy.createWidget("com.drawermenu.widget", "widget", {
        id: "drawermenu",
        __parentSymbol: $.__views.index
    });
    $.__views.drawermenu.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var controls = require("controls");
    Alloy.Globals.repodetail;
    var menuView = controls.getMenuView();
    var mainView = controls.getMainView();
    var viewIds = [];
    var switches = {};
    var getOn = function() {
        for (var p in switches) if (switches[p]) return p;
        return void 0;
    };
    var checkId = function(id) {
        var ok = false;
        for (var i in viewIds) ok = ok || viewIds[i] == id;
        return ok;
    };
    var initSwitcher = function(IDs) {
        var views = controls.getMainView().mainView.getChildren();
        var nViews = views.length;
        for (var i in IDs) viewIds[i] = IDs[i];
        for (var j in viewIds) {
            var isThere = false;
            for (var i = 0; nViews > i; i++) isThere = isThere || viewIds[j] == views[i];
            switches[viewIds[j]] = isThere;
        }
    };
    var switchTo = function(id) {
        Ti.API.info("Switching...");
        var currentViewId;
        if (!checkId(id)) throw id + " non è un ID valido per il modulo switcher.";
        currentViewId = getOn();
        Ti.API.info("    currentViewId: " + currentViewId);
        Ti.API.info("    nextViewId   : " + id);
        if (currentViewId != id) {
            if (currentViewId) {
                var childViews = mainView.mainView.getChildren();
                var currentView;
                for (var i in childViews) childViews[i].id == currentViewId && (currentView = childViews[i]);
                switches[currentViewId] = false;
                Ti.API.info("    switches." + currentViewId + " = " + switches[currentViewId]);
                mainView.mainView.remove(currentView);
                Ti.API.info("    controls.getMainView().mainView.remove(" + currentView + ")");
            }
            var nextView = Alloy.createController(id)[id];
            switches[id] = true;
            Ti.API.info("    switches." + id + " = " + switches[id]);
            mainView.mainView.add(nextView);
            Ti.API.info("    controls.getMainView().mainView.add(" + nextView + ")");
        }
    };
    initSwitcher([ "map", "last", "my" ]);
    menuView.menuTable.addEventListener("click", function(e) {
        $.drawermenu.showhidemenu();
        var rowId = e.rowData.id;
        "row1" == rowId ? switchTo("map") : "row2" == rowId ? switchTo("last") : "row3" == rowId ? switchTo("my") : "rowReporting" == rowId && Alloy.createController("reporting").winreporting.open();
    });
    $.drawermenu.drawermenuview.add(menuView.getView());
    mainView.menuButton.add(controls.getMenuButton({
        h: "60dp",
        w: "60dp"
    }));
    mainView.menuButton.addEventListener("click", $.drawermenu.showhidemenu);
    $.drawermenu.drawermainview.add(mainView.getView());
    $.index.open();
    switchTo("last");
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;