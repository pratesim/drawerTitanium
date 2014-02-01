function Controller() {
    function updateGeorepUser() {
        var georepUser = Alloy.Globals.Georep.getUser();
        try {
            georepUser.update({
                name: georepUser.getName(),
                password: georepUser.getPassword(),
                nick: Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA).nick,
                mail: Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA).mail
            });
        } catch (e) {
            Ti.API.debug("Errore aggiornamento utente georep\n" + JSON.stringify(e));
        }
        Ti.API.info("updateGeorepUser(): Utente Georep aggiornato dai dati locali");
        Ti.API.debug("  Georep.getUser(): " + JSON.stringify(Alloy.Globals.Georep.getUser()));
    }
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
        "row1" == rowId ? switchTo("map") : "row2" == rowId ? switchTo("last") : "row3" == rowId && switchTo("my");
    });
    $.drawermenu.drawermenuview.add(menuView.getView());
    mainView.menuButton.add(controls.getMenuButton({
        h: "60dp",
        w: "60dp"
    }));
    mainView.menuButton.addEventListener("click", $.drawermenu.showhidemenu);
    $.drawermenu.drawermainview.add(mainView.getView());
    Ti.App.addEventListener(Alloy.Globals.CustomEvents.USER_REGISTERED, function() {
        $.index.open();
        switchTo("last");
    });
    var userLocalData = Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA, void 0);
    if (void 0 == userLocalData) {
        Ti.API.info("Controllo dati utente locali: FAIL");
        Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));
        Alloy.Globals.Georep.checkRemoteUser(function(err, data) {
            if (err) {
                alert("Errore comunicazione con il server");
                Ti.API.info("checkRemoteUser(): FAIL");
                Ti.API.debug("  err: " + JSON.stringify(err));
            } else {
                Ti.API.info("checkRemoteUser(): SUCCESS");
                Ti.API.debug("  data: " + JSON.stringify(data));
                if (data.isRegistered) {
                    Ti.API.info("checkRemoteUser(): Utente GIA' registrato.");
                    Alloy.Globals.Georep.getRemoteUser(function(err, data) {
                        if (err) {
                            alert("Errore comunicazione con il server");
                            Ti.API.info("getRemoteUser(): FAIL");
                            Ti.API.debug("  err: " + JSON.stringify(err));
                        } else {
                            Ti.API.info("getRemoteUser(): SUCCESS");
                            Ti.API.debug("  data: " + JSON.stringify(data));
                            var uld = {
                                nick: data.nick,
                                mail: data.mail
                            };
                            Ti.App.Properties.setObject(Alloy.Globals.Constants.LOCAL_USER_DATA, uld);
                            Ti.API.info("getRemoteUser(): dati utente scaricati e salvati");
                            Ti.API.debug("  userLocalData: " + JSON.stringify(uld));
                            updateGeorepUser();
                            Ti.App.fireEvent(Alloy.Globals.CustomEvents.USER_REGISTERED, uld);
                        }
                    });
                } else {
                    Ti.API.info("checkRemoteUser(): Utente NUOVO");
                    var siginController = Alloy.createController("sigin");
                    Ti.API.debug("siginController: " + JSON.stringify(siginController));
                    siginController.open();
                }
            }
        });
    } else {
        Ti.API.info("Controllo dati utente locali: SUCCESS");
        Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));
        updateGeorepUser();
        Ti.App.fireEvent(Alloy.Globals.CustomEvents.USER_REGISTERED, userLocalData);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;