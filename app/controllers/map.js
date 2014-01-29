/**
 * Operatore modulo
 * @param {number} n
 * @param {number} m modulo
 * @returns {number} n modulo m sempre maggiore di 0.
 */
function mod(n,m){
    var sgn = (n>=0)?1:-1;
    var x = Math.abs(n);
    var y = x%m;
    return (sgn > 0)?y:(m-y);
}

/**
 * Data la regione rappresentata sulla mappa, ritorna le coordinate dei angoli
 * in basso a sinistra (BLCorner) e in altro a destra (TRCorner).
 *
 * @param {MapRegionType} region regione raffigurata nella mappa.
 * @returns {{BLCorner: {x: number, y: number}, TRCorner: {x: number, y: number}}} i valori 'y' possono
 * eccedere l'intervallo [-180,+180] nel caso la mappa sia a cavallo della linea del cambiamento di data.
 */
function getBox(region){
    var TRCy = region.latitude + mod(region.latitudeDelta,180)/2;
    var BLCy = region.latitude - mod(region.latitudeDelta,180)/2;
    var box = {
        BLCorner: {
            x: region.longitude - mod(region.longitudeDelta,360)/2,
            y: BLCy < -85 ? -85 : BLCy
        },
        TRCorner: {
            x: region.longitude + mod(region.longitudeDelta,360)/2,
            y: TRCy > 85 ? 85 : TRCy
        }
    };
    return box;
}

/**
 * Data la regione visualizzata sulla mappa, ritorna un array contenente le aree visualizzate nella regione
 * rappresentate dalle coordinate dei loro angoli in basso a sinistra e in alto a destra.
 *
 * Possono essere ritornate più aree se la regione è a cavallo della linea del cambio di data.
 *
 * @param {MapRegionType} region regione della mappa raffigurata.
 * @returns {[{BLCorner: {x: number, y: number}, TRCorner: {x: number, y: number}},...]} array di aree dove le
 * coordinate dei loro vertici rappresentativi sono sempre comprese nel sistema ([-180,180];[-90,90]).
 */
function getBoxes(region){
    var startBox = getBox(region); // area da eventualmente dividere in 2
    var boxes = [];
    Ti.API.debug("getBoxes()...");
    Ti.API.debug("  startBox");
    Ti.API.debug("    TRCorner");
    Ti.API.debug("      x: " + startBox.TRCorner.x);
    Ti.API.debug("      y: " + startBox.TRCorner.y);
    Ti.API.debug("    BLCorner");
    Ti.API.debug("      x: " + startBox.BLCorner.x);
    Ti.API.debug("      y: " + startBox.BLCorner.y);

    if (startBox.TRCorner.x > 180){
    // In questo caso il centro della mappa è sulla sinistra della linea del cambio di data
    // e l'angolo in alto a destra la oltrepassa.
    // Bisogna tagliare l'area su tale linea e la parte eccedente (a destra della linea)
    // va "traslata" indietro di 360°.
        Ti.API.debug("  caso: startBox.TRCorner.x > 180 (" + startBox.TRCorner.x + ")");
        boxes.push({
            BLCorner: startBox.BLCorner,
            TRCorner:{
                x: 180,
                y: startBox.TRCorner.y
            }
        });
        boxes.push({
            BLCorner: {
                x: -180,
                y: startBox.BLCorner.y
            },
            TRCorner: {
                x: startBox.TRCorner.x -360,
                y: startBox.TRCorner.y
            }
        });
    } else if (startBox.BLCorner.x <= -180){
    // In questo caso il centro della mappa è sulla destra della linea del cambio di data
    // e l'angolo in basso a sinistra la oltrepassa.
    // Bisogna tagliare l'area su tale linea e la parte eccedente (alla sinistra della linea)
    // va "traslata" avanti di 360°.
        Ti.API.debug("  caso: startBox.BLCorner.x LESS= 180 (" + startBox.BLCorner.x + ")");
        boxes.push({
            BLCorner: {
                x: -180,
                y: startBox.BLCorner.y
            },
            TRCorner: startBox.TRCorner
        });
        boxes.push({
            BLCorner: {
                x: startBox.BLCorner.x + 360,
                y: startBox.BLCorner.y
            },
            TRCorner: {
                x: 180,
                y: startBox.TRCorner.y
            }
        });
    } else {
    // In questo caso non c'è nessuna sovrapposizione con la line di cambio di data quindi non c'è
    // necessità di dividere l'area iniziale.
        boxes.push(startBox);
    }
    return boxes;
}

function chechGpsService(){
    if (Ti.Geolocation.locationServicesEnabled) {
        // perform other operations with Ti.Geolocation
        Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
        return true;
    } else {
        alert('Please enable location services');
        return false;
    }
}

/**
 * Handler del click su un segnaposto della mappa.
 * @param evt evento passato allo handler al momento della chiamata.
 */
function markerClick(evt) {
    Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.annotation_id);
    for (var p in evt){
        Ti.API.debug("  " + p + ": " + JSON.stringify(evt[p]));
    }

    // se si clicca sul titolo del segnaposto apriamo la segnalazione
    // sempre che il segnaposto non sia la posizione corrente.
    if (evt.clicksource == "title"){
        if (evt.annotation.annotation_id != "myloc"){
            // aprire la view del dettaglio di questa segnalazione:
            // evt.annotation.annotation_id
        }
    }
}

/**
 * handler dell'evento associato allo spostamento e ridimensionamento della mappa.
 * @param evt evento passato allo handler al momento della chiamata.
 */
function moved(evt) {
    var region = {
        latitude: evt.latitude,
        longitude: evt.longitude,
        latitudeDelta: evt.latitudeDelta,
        longitudeDelta: evt.longitudeDelta
    };
    var boxes = getBoxes(region);
    var debugBox = function(box){
        Ti.API.debug("        Top Right Corner");
        Ti.API.debug("            x: " + box.TRCorner.x);
        Ti.API.debug("            y: " + box.TRCorner.y);
        Ti.API.debug("        Bottom Left Corner");
        Ti.API.debug("            x: " + box.BLCorner.x);
        Ti.API.debug("            y: " + box.BLCorner.y);
    };

    Ti.API.info("Mappa spostata! (onRegionchanged event fired)");
    Ti.API.debug("    NEW REGION");
    Ti.API.debug("        newLat:      " + region.latitude);
    Ti.API.debug("        newLng:      " + region.longitude);
    Ti.API.debug("        newLatDelta: " + region.latitudeDelta);
    Ti.API.debug("        newLngDelta: " + region.longitudeDelta);
    for (var b in boxes){
        Ti.API.debug("    ACTUAL BOX [" + b + "]");
        debugBox(boxes[b]);
    }

}

/**
 * Funzione di callback per la Ti.Geolocation.getCurrentPosition.
 * Inizializza la mappa ad impostazioni di default o con quelle ottenute dalla richiesta della
 * posizione corrente.
 * @param getCurrPosResult oggetto passato dalla suddetta funzione al momento della chiamata
 */
function initMap(getCurrPosResult){
    // regione mappa di default
    var region = {
        latitude:       43.720653,
        longitude:      10.408407,
        latitudeDelta:  0.01,
        longitudeDelta: 0.01
    };
    // relativo segnaposto di default
    var myLocOptions = {
        latitude:      region.latitude,
        longitude:     region.longitude,
        title:         "Sei qui!",
        annotation_id: "myloc",
        image:         Alloy.Globals.PlacemarkImgs.MY_LOCATION
    };

    if(!getCurrPosResult.success){
        Ti.API.info("Impostata regione DEFAULT per la mappa.");
        Ti.API.info("Impostato segnaposto DEFAULT per la mappa.");

        Ti.API.debug("Ti.Geolocation.getCurrentPosition()");
        Ti.API.debug("  code:  " + getCurrPosResult.code);
        Ti.API.debug("  error: " + getCurrPosResult.error);
        // mappa inizializzata con la regione e segnaposto di default
    }else{
        Ti.API.info("Posizione attuale recuperata");
        for (var p in getCurrPosResult){
            Ti.API.debug("  " + p + ": " + JSON.stringify(getCurrPosResult[p]));
        }

        region.latitude       = getCurrPosResult.coords.latitude;
        region.longitude      = getCurrPosResult.coords.longitude;
        region.latitudeDelta  = 0.06;
        region.longitudeDelta = 0.06;

        myLocOptions.latitude      = getCurrPosResult.coords.latitude;
        myLocOptions.longitude     = getCurrPosResult.coords.longitude;
        myLocOptions.title         = "Sei qui!";
        myLocOptions.annotation_id = "myloc";
        myLocOptions.image         = Alloy.Globals.PlacemarkImgs.MY_LOCATION;

        Ti.API.info("Impostata regione ATTUALE per la mappa.");
        Ti.API.info("Impostato segnaposto ATTUALE per la mappa.");
    }

    var myLoc = Alloy.Globals.Map.createAnnotation(myLocOptions);

    $.map.setRegion(region);
    $.map.addAnnotation(myLoc);
}

// Recupera la posizione corrente e una volta ottenuta inizializza
// la mappa con quella posizione a piazza un segnaposto per la posizione
// corrente.
if (Ti.Geolocation.locationServicesEnabled) {
    // perform other operations with Ti.Geolocation
    Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
    Ti.Geolocation.getCurrentPosition(initMap);
} else {
    alert('Abilitare il servizio di localizzazione');
    initMap({success: false, error: "Servizio di localizzazione NON disponibile"});
}
