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
 * Possono essere ritornate più aree se la regione è a cavallo della linea del campio di data.
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

function report(evt) {
    Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid);
}

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

// API calls to the map module need to use the Alloy.Globals.Map reference
var mountainView = Alloy.Globals.Map.createAnnotation({
    latitude:37.390749,
    longitude:-122.081651,
    title:"Appcelerator Headquarters",
    subtitle:'Mountain View, CA',
    pincolor:Alloy.Globals.Map.ANNOTATION_RED,
    myid:1 // Custom property to uniquely identify this annotation.
});

$.map.region = {
    latitude:33.74511,
    longitude:-84.38993,
    latitudeDelta:0.01,
    longitudeDelta:0.01
};
$.map.addAnnotation(mountainView);