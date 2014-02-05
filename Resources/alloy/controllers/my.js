function Controller() {
    function dataClick(e) {
        Ti.API.debug(JSON.stringify(e.itemId));
        Ti.API.debug(JSON.stringify(e));
        var itemClicked = e.section.items[e.itemIndex];
        Ti.API.info("Segnalazione selezionata: " + JSON.stringify(itemClicked));
        Alloy.Globals.query.repoId = e.itemId;
        Alloy.Globals.query.userId = itemClicked.userId;
        Ti.API.debug("RepoId: " + Alloy.Globals.query.repoId + "\n UserId: " + Alloy.Globals.query.userId);
        Alloy.createController("repodetail").winrepodetail.open();
    }
    function createOneItem(obj) {
        Ti.API.info("CreateOneItem chiamata");
        return {
            titolo: {
                text: obj.value
            },
            properties: {
                itemId: obj.id
            },
            userId: obj.key
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "my";
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
    var __alloyId10 = {};
    var __alloyId13 = [];
    var __alloyId14 = {
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
    __alloyId13.push(__alloyId14);
    var __alloyId12 = {
        properties: {
            height: "72dp",
            name: "template"
        },
        childTemplates: __alloyId13
    };
    __alloyId10["template"] = __alloyId12;
    var __alloyId15 = [];
    $.__views.mylistsection = Ti.UI.createListSection({
        id: "mylistsection"
    });
    __alloyId15.push($.__views.mylistsection);
    $.__views.my = Ti.UI.createListView({
        sections: __alloyId15,
        templates: __alloyId10,
        id: "my",
        defaultItemTemplate: "template",
        allowsSelection: "true"
    });
    $.__views.my && $.addTopLevelView($.__views.my);
    dataClick ? $.__views.my.addEventListener("itemclick", dataClick) : __defers["$.__views.my!itemclick!dataClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.API.info("Mysection: ");
    var service = Alloy.Globals.Georep;
    var listSection = $.my.getSections()[0];
    var MYLISTKEY = "mylistrepo";
    if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_NONE) {
        var items = Ti.App.Properties.getString(MYLISTKEY, "null");
        "null" == items ? alert("Necessaria connessione alla rete...") : listSection.setItems(JSON.parse(items));
    } else try {
        Ti.API.info("Avviata animazione indeterminata!");
        $.progressIndicatorIndeterminant.show();
        service.getUserDocs(service.getUserId(), function(err, data) {
            Ti.API.info("funzione di callback getUserDocs chiamata");
            if (err) {
                $.progressIndicatorIndeterminant.hide();
                var items = Ti.App.Properties.getString(MYLISTKEY, "null");
                "null" == items ? alert("Errore server...") : listSection.setItems(JSON.parse(items));
                Ti.API.info("getUserDocs fallita");
                Ti.API.debug(JSON.stringify(err));
            } else {
                $.progressIndicatorIndeterminant.hide();
                Ti.API.info("getUserDocs eseguita con successo");
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
                Ti.App.Properties.setString(MYLISTKEY, JSON.stringify(listSection.getItems()));
                Ti.API.debug("Lista locale : " + Ti.App.Properties.getString(MYLISTKEY));
                $.progressIndicatorDeterminant.hide();
                Ti.API.info("Items aggiunti alla lista");
            }
        });
    } catch (e) {
        Ti.API.debug(JSON.stringify(e));
    }
    __defers["$.__views.my!itemclick!dataClick"] && $.__views.my.addEventListener("itemclick", dataClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;