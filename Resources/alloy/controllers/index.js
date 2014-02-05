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
    Alloy.Globals.repodetail;
    var menuView = controls.getMenuView();
    var mainView = controls.getMainView();
    var viewIds = [];
    var switches = {};
    var buttons = {};
    var icons = {};
    var getOn = function() {
        for (var p in switches) if (switches[p]) return p;
        return void 0;
    };
    var checkId = function(id) {
        var ok = false;
        for (var i in viewIds) ok = ok || viewIds[i] == id;
        return ok;
    };
    var initSwitcher = function(IDs, rowIDs, iconObjs) {
        var views = controls.getMainView().mainView.getChildren();
        var rows = menuView.menuView.getChildren()[2].getSections()[0].getRows();
        var nViews = views.length;
        for (var i in IDs) viewIds[i] = IDs[i];
        for (var j in viewIds) {
            var isThere = false;
            for (var i = 0; nViews > i; i++) isThere = isThere || viewIds[j] == views[i];
            switches[viewIds[j]] = isThere;
        }
        for (var k in viewIds) for (var r in rows) rows[r].id == rowIDs[k] && (buttons[viewIds[k]] = rows[r]);
        for (var k in viewIds) icons[viewIds[k]] = iconObjs[k];
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
                buttons[currentViewId].setBackgroundColor("transparent");
                buttons[currentViewId].getChildren()[0].getChildren()[1].setColor("#59595C");
                buttons[currentViewId].getChildren()[0].getChildren()[0].setBackgroundImage(icons[currentViewId].dark);
                mainView.mainView.remove(currentView);
                Ti.API.info("    controls.getMainView().mainView.remove(" + currentView + ")");
            }
            var nextView = Alloy.createController(id)[id];
            switches[id] = true;
            Ti.API.info("    switches." + id + " = " + switches[id]);
            buttons[id].setBackgroundColor("#33B5E5");
            buttons[id].getChildren()[0].getChildren()[1].setColor("white");
            buttons[id].getChildren()[0].getChildren()[0].setBackgroundImage(icons[id].light);
            mainView.mainView.add(nextView);
            Ti.API.info("    controls.getMainView().mainView.add(" + nextView + ")");
        }
    };
    var switchableViewIDs = [ "map", "last", "my" ];
    var switchableRowIDs = [ "row1", "row2", "row3" ];
    var switchableIconIDs = [ {
        light: "/images/ic_action_map_white.png",
        dark: "/images/ic_action_map.png"
    }, {
        light: "/images/ic_action_time_white.png",
        dark: "/images/ic_action_time.png"
    }, {
        light: "/images/ic_action_view_as_list_white.png",
        dark: "/images/ic_action_view_as_list.png"
    } ];
    initSwitcher(switchableViewIDs, switchableRowIDs, switchableIconIDs);
    menuView.menuTable.addEventListener("click", function(e) {
        $.drawermenu.showhidemenu();
        var rowId = e.rowData.id;
        "row1" == rowId ? switchTo("map") : "row2" == rowId ? switchTo("last") : "row3" == rowId ? switchTo("my") : "row4" == rowId ? Alloy.createController("newUser").newUser.open() : "rowReporting" == rowId && Alloy.createController("reporting").winreporting.open();
    });
    $.drawermenu.drawermenuview.add(menuView.getView());
    mainView.menuButton.add(controls.getMenuButton({
        h: "60dp",
        w: "60dp"
    }));
    mainView.menuButton.addEventListener("click", $.drawermenu.showhidemenu);
    mainView.appIcon.addEventListener("click", $.drawermenu.showhidemenu);
    mainView.titleApp.addEventListener("click", $.drawermenu.showhidemenu);
    $.drawermenu.drawermainview.add(mainView.getView());
    Ti.App.addEventListener(Alloy.Globals.CustomEvents.USER_REGISTERED, function(evt) {
        Ti.UI.createNotification({
            message: "Benvenuto!\n" + evt.nick + " (" + evt.mail + ")",
            duration: Ti.UI.NOTIFICATION_DURATION_LONG
        }).show();
        $.index.open();
        switchTo("last");
    });
    var progress = Ti.UI.Android.createProgressIndicator({
        message: "Loading...",
        location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
        type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
        cancelable: false
    });
    var userLocalData = Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA, void 0);
    if (void 0 == userLocalData) {
        Ti.API.info("Controllo dati utente locali: FAIL");
        Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));
        if (Ti.Network.getOnline()) {
            Ti.API.info("getOnline(): TRUE");
            progress.setMessage("Login...");
            progress.show();
            Alloy.Globals.Georep.checkRemoteUser(function(err, data) {
                if (err) {
                    progress.hide();
                    var dialog = Ti.UI.createAlertDialog({
                        message: "Errore comunicazione con il server",
                        ok: "OK",
                        title: "Errore Di Rete"
                    });
                    dialog.addEventListener("click", function() {
                        Ti.Android.currentActivity.finish();
                    });
                    Ti.API.info("checkRemoteUser(): FAIL");
                    Ti.API.debug("  err: " + JSON.stringify(err));
                    dialog.show();
                } else {
                    Ti.API.info("checkRemoteUser(): SUCCESS");
                    Ti.API.debug("  data: " + JSON.stringify(data));
                    if (data.isRegistered) {
                        Ti.API.info("checkRemoteUser(): Utente GIA' registrato.");
                        Alloy.Globals.Georep.getRemoteUser(function(err, data) {
                            progress.hide();
                            if (err) {
                                var dialog = Ti.UI.createAlertDialog({
                                    message: "Errore comunicazione con il server",
                                    ok: "OK",
                                    title: "Errore Di Rete"
                                });
                                dialog.addEventListener("click", function() {
                                    Ti.Android.currentActivity.finish();
                                });
                                Ti.API.info("getRemoteUser(): FAIL");
                                Ti.API.debug("  err: " + JSON.stringify(err));
                                dialog.show();
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
                        progress.hide();
                        Ti.API.info("checkRemoteUser(): Utente NUOVO");
                        Alloy.createController("newUser").newUser.open();
                    }
                }
            });
        } else {
            var dialog = Ti.UI.createAlertDialog({
                message: "Nessuna connessione a Internet",
                ok: "OK",
                title: "Errore Di Rete"
            });
            dialog.addEventListener("click", function() {
                Ti.Android.currentActivity.finish();
            });
            dialog.show();
            Ti.API.info("getOnline(): FALSE");
        }
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