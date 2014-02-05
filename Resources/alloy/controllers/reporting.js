function Controller() {
    function getPhoto() {
        Ti.Media.showCamera({
            success: function(event) {
                Ti.API.debug("Foto scattata con successo");
                pictureBlob = event.media;
                pictureBase64 = Ti.Utils.base64encode(event.media);
                $.repoimage.setImage(event.media);
            },
            cancel: function() {
                Ti.API.info("Foto scartata: premuto il tasto cancel");
            },
            error: function(error) {
                var a = Titanium.UI.createAlertDialog({
                    title: "Camera"
                });
                error.code == Titanium.Media.NO_CAMERA ? a.setMessage("Il dispositivo non disponde di una fotocamera") : a.setMessage("Errore inatteso: " + error.code);
                a.show();
            },
            autohide: true,
            saveToPhotoGallery: false,
            allowEditing: false,
            mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ]
        });
    }
    function sendRepo() {
        var title = $.titleinput.getValue();
        var descr = $.descriptioninput.getValue();
        var segnalazione = {
            title: "",
            msg: "",
            img: {
                content_type: "",
                data: ""
            },
            loc: {
                latitude: "",
                longitude: ""
            }
        };
        var segnalazioneLocale = {
            _id: "",
            title: "",
            msg: "",
            data: "",
            img: "",
            indirizzo: "",
            loc: {
                latitude: "",
                longitude: ""
            }
        };
        Ti.API.info("Titolo: " + title + "\nDescrizione: " + descr);
        Ti.API.debug("Foto Base64: " + pictureBase64);
        if ("" == title || "" == descr || "" == pictureBase64) alert("Completare tutti i campi e scattare una foto prima di inviare la segnalazione!"); else {
            $.progressIndicatorIndeterminant.show();
            Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_HIGH);
            Ti.Geolocation.getCurrentPosition(function(location) {
                if (false == location.success) {
                    $.progressIndicatorIndeterminant.hide();
                    alert("Impossibile ottenere la posizione: " + location.error);
                    Ti.API.debug("Impossibile ottenere la posizione. error code: " + location.code);
                } else {
                    Ti.API.info("Posizione letta correttamente: " + JSON.stringify(location));
                    segnalazione.title = title;
                    segnalazione.msg = descr;
                    segnalazione.img.content_type = "image/jpeg";
                    segnalazione.img.data = pictureBase64.text;
                    segnalazione.loc.latitude = location.coords.latitude;
                    segnalazione.loc.longitude = location.coords.longitude;
                    try {
                        service.postDoc(segnalazione, true, function(err, data) {
                            if (err) {
                                $.progressIndicatorIndeterminant.hide();
                                Ti.API.debug("postDoc fallita: " + JSON.stringify(err));
                                alert("Invio segnalazione fallito!...Prova di nuovo");
                            } else {
                                Ti.API.info("Segnalazione Inviata correttamente: " + JSON.stringify(data));
                                var n = new Date().getTime();
                                var newFileName = n + ".jpeg";
                                var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, newFileName);
                                var writeOk = f.write(pictureBlob);
                                true == writeOk ? Ti.API.info("file salvato correttamente nel path: " + f.nativePath) : Ti.API.info("file non salvato");
                                Ti.Geolocation.reverseGeocoder(location.coords.latitude, location.coords.longitude, function(address) {
                                    Ti.API.debug("traduzione coordinate: " + JSON.stringify(address));
                                    var indirizzo = true == address.success ? address.places[0].displayAddress : "Non disponibile";
                                    segnalazioneLocale._id = data._id;
                                    segnalazioneLocale.title = title;
                                    segnalazioneLocale.msg = descr;
                                    segnalazioneLocale.data = new Date().getTime();
                                    segnalazioneLocale.img = f.nativePath;
                                    segnalazioneLocale.indirizzo = indirizzo;
                                    segnalazioneLocale.loc.latitude = location.coords.latitude;
                                    segnalazioneLocale.loc.longitude = location.coords.longitude;
                                    Ti.App.Properties.setString(data._id, JSON.stringify(segnalazioneLocale));
                                    var localeOk = Ti.App.Properties.getString(data._id, "null");
                                    "null" != localeOk ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");
                                    $.progressIndicatorIndeterminant.hide();
                                    $.dialog.show();
                                });
                            }
                        });
                    } catch (e) {
                        Ti.API.debug(JSON.stringify(e));
                    }
                }
            });
        }
    }
    function alertconfsend() {
        win.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "reporting";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
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
    var __alloyId42 = [];
    __alloyId42.push("OK");
    $.__views.dialog = Ti.UI.createAlertDialog({
        buttonNames: __alloyId42,
        id: "dialog",
        title: "Stato segnalazione",
        message: "Invio segnalazione riuscito!"
    });
    alertconfsend ? $.__views.dialog.addEventListener("click", alertconfsend) : __defers["$.__views.dialog!click!alertconfsend"] = true;
    $.__views.scrollView = Ti.UI.createScrollView({
        top: "0dp",
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "scrollView"
    });
    $.__views.winreporting.add($.__views.scrollView);
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
        text: "Titolo:",
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
    $.__views.titleinput = Ti.UI.createTextArea({
        top: "5dp",
        left: "0dp",
        color: "white",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.FILL,
        id: "titleinput"
    });
    $.__views.__alloyId44.add($.__views.titleinput);
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
        text: "Descrizione:",
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
    $.__views.descriptioninput = Ti.UI.createTextArea({
        top: "5dp",
        left: "0dp",
        color: "white",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.FILL,
        id: "descriptioninput"
    });
    $.__views.__alloyId47.add($.__views.descriptioninput);
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
    $.__views.__alloyId51 = Ti.UI.createLabel({
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
        id: "__alloyId51"
    });
    $.__views.__alloyId50.add($.__views.__alloyId51);
    $.__views.__alloyId52 = Ti.UI.createView({
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp",
        id: "__alloyId52"
    });
    $.__views.__alloyId50.add($.__views.__alloyId52);
    $.__views.repoimage = Ti.UI.createImageView({
        top: "5dp",
        width: Ti.UI.FILL,
        id: "repoimage",
        image: "/placeholder.png"
    });
    $.__views.__alloyId50.add($.__views.repoimage);
    $.__views.__alloyId53 = Ti.UI.createView({
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId53"
    });
    $.__views.scrollView.add($.__views.__alloyId53);
    $.__views.__alloyId54 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "transparent",
        id: "__alloyId54"
    });
    $.__views.__alloyId53.add($.__views.__alloyId54);
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
    $.__views.__alloyId54.add($.__views.takephoto);
    getPhoto ? $.__views.takephoto.addEventListener("click", getPhoto) : __defers["$.__views.takephoto!click!getPhoto"] = true;
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
    $.__views.__alloyId54.add($.__views.send);
    sendRepo ? $.__views.send.addEventListener("click", sendRepo) : __defers["$.__views.send!click!sendRepo"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var win = $.winreporting;
    var actionBar;
    var service = Alloy.Globals.Georep;
    var pictureBlob;
    var pictureBase64 = "";
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
    __defers["$.__views.dialog!click!alertconfsend"] && $.__views.dialog.addEventListener("click", alertconfsend);
    __defers["$.__views.takephoto!click!getPhoto"] && $.__views.takephoto.addEventListener("click", getPhoto);
    __defers["$.__views.send!click!sendRepo"] && $.__views.send.addEventListener("click", sendRepo);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;