function Controller() {
    function mod(n, m) {
        var sgn = n >= 0 ? 1 : -1;
        var x = Math.abs(n);
        var y = x % m;
        return sgn > 0 ? y : m - y;
    }
    function getBox(region) {
        var TRCy = region.latitude + mod(region.latitudeDelta, 180) / 2;
        var BLCy = region.latitude - mod(region.latitudeDelta, 180) / 2;
        var box = {
            BLCorner: {
                lng: region.longitude - mod(region.longitudeDelta, 360) / 2,
                lat: -85 > BLCy ? -85 : BLCy
            },
            TRCorner: {
                lng: region.longitude + mod(region.longitudeDelta, 360) / 2,
                lat: TRCy > 85 ? 85 : TRCy
            }
        };
        return box;
    }
    function getBoxes(region) {
        var startBox = getBox(region);
        var boxes = [];
        Ti.API.debug("getBoxes()...");
        Ti.API.debug("  startBox");
        Ti.API.debug("    TRCorner");
        Ti.API.debug("      lng: " + startBox.TRCorner.lng);
        Ti.API.debug("      lat: " + startBox.TRCorner.lat);
        Ti.API.debug("    BLCorner");
        Ti.API.debug("      lng: " + startBox.BLCorner.lng);
        Ti.API.debug("      lat: " + startBox.BLCorner.lat);
        if (startBox.TRCorner.lng > 180) {
            Ti.API.debug("  caso: startBox.TRCorner.lng > 180 (" + startBox.TRCorner.lng + ")");
            boxes.push({
                BLCorner: startBox.BLCorner,
                TRCorner: {
                    lng: 180,
                    lat: startBox.TRCorner.lat
                }
            });
            boxes.push({
                BLCorner: {
                    lng: -180,
                    lat: startBox.BLCorner.lat
                },
                TRCorner: {
                    lng: startBox.TRCorner.lng - 360,
                    lat: startBox.TRCorner.lat
                }
            });
        } else if (-180 >= startBox.BLCorner.lng) {
            Ti.API.debug("  caso: startBox.BLCorner.lng LESS= 180 (" + startBox.BLCorner.lng + ")");
            boxes.push({
                BLCorner: {
                    lng: -180,
                    lat: startBox.BLCorner.lat
                },
                TRCorner: startBox.TRCorner
            });
            boxes.push({
                BLCorner: {
                    lng: startBox.BLCorner.lng + 360,
                    lat: startBox.BLCorner.lat
                },
                TRCorner: {
                    lng: 180,
                    lat: startBox.TRCorner.lat
                }
            });
        } else boxes.push(startBox);
        return boxes;
    }
    function markerClick(evt) {
        Ti.API.info("markerClick(): Annotation " + evt.title + " clicked, id: " + evt.annotation.annotation_id);
        Ti.API.debug("  evt.clicksource: " + evt.clicksource);
        Ti.API.debug("  evt.annotation.annotation_id: " + evt.annotation.annotation_id);
        "title" == evt.clicksource ? "myloc" != evt.annotation.annotation_id : "pin" == evt.clicksource && (annotationToKeep = "myloc" != evt.annotation_id ? evt.annotation.annotation_id : void 0);
        Ti.API.debug("  annotationToKeep: " + annotationToKeep);
    }
    function getAnnotationIndex(id) {
        var annotationArray = $.map.annotations;
        for (var index in annotationArray) if (annotationArray[index].annotation_id == id) return index;
        return void 0;
    }
    function clearMap(annotationId) {
        if (void 0 != annotationId) {
            var index = getAnnotationIndex(annotationId);
            var tmp1 = $.map.annotations.slice(0, index);
            var tmp2 = $.map.annotations.slice(index + 1, $.map.annotations.length);
            var annToRemove = tmp1.concat(tmp2);
            $.map.removeAnnotations(annToRemove);
            Ti.API.info('clearMap(): rimossi tutti i segnaposto tranne che il segnaposto "' + annotationId + '"');
            Ti.API.debug("  index: " + index);
            annotationToKeep = void 0;
        } else {
            $.map.removeAllAnnotations();
            Ti.API.info("clearMap(): Rimossi tutti i segnaposto");
        }
        if (Ti.Geolocation.locationServicesEnabled) {
            Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
            Ti.Geolocation.getCurrentPosition(function(result) {
                if (result.success) {
                    Ti.API.info("clearMap(): Posizione attuale recuperata");
                    for (var p in result) Ti.API.debug("  " + p + ": " + JSON.stringify(result[p]));
                    var myLoc = Alloy.Globals.Map.createAnnotation({
                        latitude: result.coords.latitude,
                        longitude: result.coords.longitude,
                        title: "Sei qui!",
                        annotation_id: "myloc",
                        image: Alloy.Globals.PlacemarkImgs.MY_LOCATION
                    });
                    $.map.addAnnotation(myLoc);
                    Ti.API.info("clearMap(): Aggiunto il segnaposto della posizione locale aggiornato.");
                } else {
                    Ti.API.info("clearMap(): Impossibile ottenere la posizione.");
                    Ti.API.debug("clearMap(): Ti.Geolocation.getCurrentPosition()");
                    Ti.API.debug("  code:  " + result.code);
                    Ti.API.debug("  error: " + result.error);
                }
            });
        } else {
            alert("Abilitare il servizio di localizzazione.");
            Ti.API.info("clearMap(): Servizio localizzazione non disponibile.");
        }
        return annotationId;
    }
    function updateMap(region) {
        var boxes = getBoxes(region);
        var debugBox = function(box) {
            Ti.API.debug("        Top Right Corner");
            Ti.API.debug("            lng: " + box.TRCorner.lng);
            Ti.API.debug("            lat: " + box.TRCorner.lat);
            Ti.API.debug("        Bottom Left Corner");
            Ti.API.debug("            lng: " + box.BLCorner.lng);
            Ti.API.debug("            lat: " + box.BLCorner.lat);
        };
        Ti.API.info("Mappa spostata! (onRegionchanged event fired)");
        Ti.API.debug("    NEW REGION");
        Ti.API.debug("        newLat:      " + region.latitude);
        Ti.API.debug("        newLng:      " + region.longitude);
        Ti.API.debug("        newLatDelta: " + region.latitudeDelta);
        Ti.API.debug("        newLngDelta: " + region.longitudeDelta);
        for (var b in boxes) {
            Ti.API.debug("    ACTUAL BOX [" + b + "]");
            debugBox(boxes[b]);
        }
        var queryOK = true;
        for (var i in boxes) Alloy.Globals.Georep.getDocsInBox(boxes[i].BLCorner, boxes[i].TRCorner, function(err, data) {
            if (err) {
                Ti.API.info("getDocxInBox(): FAIL");
                Ti.API.debug("  err: " + JSON.stringify(err));
                queryOK = false;
            } else {
                Ti.API.info("getDocxInBox(): SUCCESS");
                queryOK = queryOK && true;
                var segnalazioni = data.rows;
                var localUserId = Alloy.Globals.Georep.getUserId();
                Ti.API.debug("moved(): annotationToKeep = " + annotationToKeep);
                var annDaNonAggiungere = clearMap(annotationToKeep);
                for (var i in segnalazioni) {
                    var utenteSegnalazione = segnalazioni[i].value;
                    var titoloSegnalazione = segnalazioni[i].value;
                    var idSegnalazione = segnalazioni[i].id;
                    if (idSegnalazione != annDaNonAggiungere) {
                        var newAnnotationOpts = {
                            annotation_id: idSegnalazione,
                            latitude: segnalazioni[i].geometry.coordinates[1],
                            longitude: segnalazioni[i].geometry.coordinates[0],
                            title: titoloSegnalazione,
                            image: utenteSegnalazione == localUserId ? Alloy.Globals.PlacemarkImgs.MY_REPORT : Alloy.Globals.PlacemarkImgs.REPORT
                        };
                        var newAnnotation = Alloy.Globals.Map.createAnnotation(newAnnotationOpts);
                        $.map.addAnnotation(newAnnotation);
                    }
                }
            }
        });
        if (!queryOK) {
            alert("Impossibile ottenere tutte le segnalazioni della zona");
            queryOK = true;
        }
    }
    function moved(evt) {
        var region = {
            latitude: evt.latitude,
            longitude: evt.longitude,
            latitudeDelta: evt.latitudeDelta,
            longitudeDelta: evt.longitudeDelta
        };
        updateMap(region);
    }
    function initMap(getCurrPosResult) {
        var region = {
            latitude: 43.720653,
            longitude: 10.408407,
            latitudeDelta: .01,
            longitudeDelta: .01
        };
        if (getCurrPosResult.success) {
            Ti.API.info("Posizione attuale recuperata");
            for (var p in getCurrPosResult) Ti.API.debug("  " + p + ": " + JSON.stringify(getCurrPosResult[p]));
            region.latitude = getCurrPosResult.coords.latitude;
            region.longitude = getCurrPosResult.coords.longitude;
            region.latitudeDelta = .06;
            region.longitudeDelta = .06;
            Ti.API.info("Impostata regione ATTUALE per la mappa.");
        } else {
            Ti.API.info("Impostata regione DEFAULT per la mappa.");
            Ti.API.debug("Ti.Geolocation.getCurrentPosition()");
            Ti.API.debug("  code:  " + getCurrPosResult.code);
            Ti.API.debug("  error: " + getCurrPosResult.error);
        }
        $.map.setRegion(region);
        updateMap(region);
    }
    function mapCompleted() {
        if (Ti.Geolocation.locationServicesEnabled) {
            Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
            Ti.Geolocation.getCurrentPosition(initMap);
        } else initMap({
            success: false,
            error: "Servizio di localizzazione NON disponibile"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "map";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.map = Alloy.Globals.Map.createView({
        id: "map",
        ns: "Alloy.Globals.Map",
        regionFit: "true"
    });
    $.__views.map && $.addTopLevelView($.__views.map);
    markerClick ? $.__views.map.addEventListener("click", markerClick) : __defers["$.__views.map!click!markerClick"] = true;
    moved ? $.__views.map.addEventListener("regionchanged", moved) : __defers["$.__views.map!regionchanged!moved"] = true;
    mapCompleted ? $.__views.map.addEventListener("complete", mapCompleted) : __defers["$.__views.map!complete!mapCompleted"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var annotationToKeep = void 0;
    if (!Ti.Network.getOnline()) {
        Ti.API.info("map.js: getOnline() = FALSE");
        var dialog = Ti.UI.createAlertDialog({
            message: "Connessione Internet assente.\nLa mappa potrebbe non funzionare correttamente.",
            ok: "OK",
            title: "Errore Di Rete"
        });
        dialog.show();
    }
    __defers["$.__views.map!click!markerClick"] && $.__views.map.addEventListener("click", markerClick);
    __defers["$.__views.map!regionchanged!moved"] && $.__views.map.addEventListener("regionchanged", moved);
    __defers["$.__views.map!complete!mapCompleted"] && $.__views.map.addEventListener("complete", mapCompleted);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;