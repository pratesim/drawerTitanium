function Controller() {
    function dataClick(e) {
        Ti.API.debug(JSON.stringify(e.itemId));
        Ti.API.debug(JSON.stringify(e));
        var itemClicked = e.section.items[e.itemIndex];
        Ti.API.info("Segnalazione selezionata: " + JSON.stringify(itemClicked));
        Alloy.Globals.query.repoId = e.itemId;
        Alloy.Globals.query.userId = itemClicked.userId;
        Ti.API.debug("RepoId: " + Alloy.Globals.query.repoId + "\n UserId: " + Alloy.Globals.query.userId);
    }
    function createOneItem(obj) {
        Ti.API.info("CreateOneItem chiamata");
        Ti.API.debug("Data in millisecondi: " + obj.key);
        Ti.API.debug("Data: " + Alloy.Globals.dataToString(obj.key));
        return {
            titolo: {
                text: obj.value.title
            },
            data: {
                text: Alloy.Globals.dataToString(obj.key)
            },
            properties: {
                itemId: obj.id
            },
            userId: obj.value.userId
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "last";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.progressIndicatorDeterminant = Ti.UI.Android.createProgressIndicator({
        ns: Ti.UI.Android,
        id: "progressIndicatorDeterminant",
        message: "Loading...",
        min: "0",
        location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
        type: Ti.UI.Android.PROGRESS_INDICATOR_DETERMINANT
    });
    $.__views.progressIndicatorDeterminant && $.addTopLevelView($.__views.progressIndicatorDeterminant);
    $.__views.progressIndicatorIndeterminant = Ti.UI.Android.createProgressIndicator({
        ns: Ti.UI.Android,
        id: "progressIndicatorIndeterminant",
        message: "Loading...",
        location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
        type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
    });
    $.__views.progressIndicatorIndeterminant && $.addTopLevelView($.__views.progressIndicatorIndeterminant);
    var __alloyId1 = {};
    var __alloyId4 = [];
    var __alloyId5 = {
        type: "Ti.UI.Label",
        bindId: "titolo",
        properties: {
            color: "black",
            font: {
                fontFamily: "Roboto-Bold",
                fontSize: "20dp"
            },
            bindId: "titolo"
        }
    };
    __alloyId4.push(__alloyId5);
    var __alloyId6 = {
        type: "Ti.UI.Label",
        bindId: "data",
        properties: {
            color: "black",
            font: {
                fontFamily: "Roboto-Thin",
                fontSize: "15dp"
            },
            top: "15dp",
            bindId: "data"
        }
    };
    __alloyId4.push(__alloyId6);
    var __alloyId3 = {
        properties: {
            layout: "vertical",
            height: "72dp",
            name: "template"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["template"] = __alloyId3;
    var __alloyId7 = [];
    $.__views.mylistsection = Ti.UI.createListSection({
        id: "mylistsection"
    });
    __alloyId7.push($.__views.mylistsection);
    $.__views.last = Ti.UI.createListView({
        sections: __alloyId7,
        templates: __alloyId1,
        id: "last",
        defaultItemTemplate: "template",
        allowsSelection: "true"
    });
    $.__views.last && $.addTopLevelView($.__views.last);
    dataClick ? $.__views.last.addEventListener("itemclick", dataClick) : __defers["$.__views.last!itemclick!dataClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.API.info("lastsection: ");
    var service = Alloy.Globals.Georep;
    var listSection = $.last.getSections()[0];
    var LASTLISTKEY = "lastlistrepo";
    var ndoc = 10;
    if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_NONE) {
        var items = Ti.App.Properties.getString(LASTLISTKEY, "null");
        "null" == items ? alert("Necessaria connessione alla rete...") : listSection.setItems(JSON.parse(items));
    } else try {
        $.progressIndicatorIndeterminant.show();
        service.getLastDocs(ndoc, function(err, data) {
            if (err) {
                $.progressIndicatorIndeterminant.hide();
                var items = Ti.App.Properties.getString(LASTLISTKEY, "null");
                "null" == items ? alert("Errore server...") : listSection.setItems(JSON.parse(items));
                Ti.API.info("getLastDocs fallita");
                Ti.API.debug(JSON.stringify(err));
            } else {
                $.progressIndicatorIndeterminant.hide();
                Ti.API.info("getLastDocs eseguita con successo");
                Ti.API.debug(JSON.stringify(data.rows));
                Ti.API.info("Scaricate " + data.rows.length + " segnalazioni");
                $.progressIndicatorDeterminant.setMax(data.rows.length);
                $.progressIndicatorDeterminant.show();
                Ti.API.info("Partita seconda animazione");
                for (var tmp in data.rows) {
                    var item = createOneItem(data.rows[tmp]);
                    Ti.API.debug(JSON.stringify(item));
                    listSection.appendItems([ item ]);
                    $.progressIndicatorDeterminant.value = tmp;
                }
                Ti.App.Properties.setString(LASTLISTKEY, JSON.stringify(listSection.getItems()));
                Ti.API.debug("Lista locale : " + Ti.App.Properties.getString(LASTLISTKEY));
                $.progressIndicatorDeterminant.hide();
                Ti.API.info("Items aggiunti alla lista");
            }
        });
    } catch (e) {
        Ti.API.debug(JSON.stringify(e));
    }
    __defers["$.__views.last!itemclick!dataClick"] && $.__views.last.addEventListener("itemclick", dataClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;