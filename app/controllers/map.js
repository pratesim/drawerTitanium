/**
 * Id dell'annotazione da mantenere quando si sposta la mappa.
 * @type {string}
 */
var annotationToKeep = undefined;

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
 * @returns {{BLCorner: {lng: number, lat: number}, TRCorner: {lng: number, lat: number}}} i valori 'lat' possono
 * eccedere l'intervallo [-180,+180] nel caso la mappa sia a cavallo della linea del cambiamento di data.
 */
function getBox(region){
    var TRCy = region.latitude + mod(region.latitudeDelta,180)/2;
    var BLCy = region.latitude - mod(region.latitudeDelta,180)/2;
    var box = {
        BLCorner: {
            lng: region.longitude - mod(region.longitudeDelta,360)/2,
            lat: BLCy < -85 ? -85 : BLCy
        },
        TRCorner: {
            lng: region.longitude + mod(region.longitudeDelta,360)/2,
            lat: TRCy > 85 ? 85 : TRCy
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
 * @returns {[{BLCorner: {lng: number, lat: number}, TRCorner: {lng: number, lat: number}},...]} array di aree dove le
 * coordinate dei loro vertici rappresentativi sono sempre comprese nel sistema ([-180,180];[-90,90]).
 */
function getBoxes(region){
    var startBox = getBox(region); // area da eventualmente dividere in 2
    var boxes = [];
    Ti.API.debug("getBoxes()...");
    Ti.API.debug("  startBox");
    Ti.API.debug("    TRCorner");
    Ti.API.debug("      lng: " + startBox.TRCorner.lng);
    Ti.API.debug("      lat: " + startBox.TRCorner.lat);
    Ti.API.debug("    BLCorner");
    Ti.API.debug("      lng: " + startBox.BLCorner.lng);
    Ti.API.debug("      lat: " + startBox.BLCorner.lat);

    if (startBox.TRCorner.lng > 180){
    // In questo caso il centro della mappa è sulla sinistra della linea del cambio di data
    // e l'angolo in alto a destra la oltrepassa.
    // Bisogna tagliare l'area su tale linea e la parte eccedente (a destra della linea)
    // va "traslata" indietro di 360°.
        Ti.API.debug("  caso: startBox.TRCorner.lng > 180 (" + startBox.TRCorner.lng + ")");
        boxes.push({
            BLCorner: startBox.BLCorner,
            TRCorner:{
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
                lng: startBox.TRCorner.lng -360,
                lat: startBox.TRCorner.lat
            }
        });
    } else if (startBox.BLCorner.lng <= -180){
    // In questo caso il centro della mappa è sulla destra della linea del cambio di data
    // e l'angolo in basso a sinistra la oltrepassa.
    // Bisogna tagliare l'area su tale linea e la parte eccedente (alla sinistra della linea)
    // va "traslata" avanti di 360°.
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
 * @param {ModulesMapViewEvent} evt evento passato allo handler al momento della chiamata.
 */
function markerClick(evt) {
    Ti.API.info("markerClick(): Annotation " + evt.title + " clicked, id: " + evt.annotation.annotation_id);
    Ti.API.debug("  evt.clicksource: " + evt.clicksource);
    Ti.API.debug("  evt.annotation.annotation_id: " + evt.annotation.annotation_id);

    // se si clicca sul titolo del segnaposto apriamo la segnalazione
    // sempre che il segnaposto non sia la posizione corrente.
    if (evt.clicksource == "title"){
        if (evt.annotation.annotation_id != "myloc"){
            // aprire la view del dettaglio di questa segnalazione:
            // evt.annotation.annotation_id
        }
    }else if (evt.clicksource == "pin"){
        if (evt.annotation_id != "myloc"){
            annotationToKeep = evt.annotation.annotation_id;
        }else{
            annotationToKeep = undefined;
        }
    }
    Ti.API.debug("  annotationToKeep: " + annotationToKeep);
}

/**
 * Ritorna l'indice della segnalazione con un certo id
 * @param {string} id identificatore della segnalazione da cercare
 * @returns {*} indice della segnalazione o undefined.
 */
function getAnnotationIndex(id){
    var annotationArray = $.map.annotations;
    for(var index in annotationArray){
        if (annotationArray[index].annotation_id == id){
            return index;
        }
    }
    return undefined;
}

/**
 * Elimina tutti i segnaposto che sono sulla mappa ad eccezione di
 * quello il cui id è passato come parametro e aggiorna il segnaposto
 * per la posizione locale.
 * Se non è possibile ottenere la posizione, il segnaposto per la posizione
 * locale sarà eliminato.
 *
 * @param {string} annotationId id del segnaposto da mantenere.
 * @returns {string} id dell'annotazione risparmiata.
 */
function clearMap(annotationId){

    if(annotationId != undefined){
        var index = getAnnotationIndex(annotationId);
        var tmp1 = $.map.annotations.slice(0,index);
        var tmp2 = $.map.annotations.slice(index+1, $.map.annotations.length);
        var annToRemove = tmp1.concat(tmp2);

        $.map.removeAnnotations(annToRemove);
        Ti.API.info("clearMap(): rimossi tutti i segnaposto tranne che il segnaposto \"" + annotationId + "\"");
        Ti.API.debug("  index: " + index);
        annotationToKeep = undefined;
    }else{
        $.map.removeAllAnnotations();
        Ti.API.info("clearMap(): Rimossi tutti i segnaposto");
    }

    if (Ti.Geolocation.locationServicesEnabled) {
        // perform other operations with Ti.Geolocation
        Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
        Ti.Geolocation.getCurrentPosition(function(result){
            if(!result.success){
                Ti.API.info("clearMap(): Impossibile ottenere la posizione.");
                Ti.API.debug("clearMap(): Ti.Geolocation.getCurrentPosition()");
                Ti.API.debug("  code:  " + result.code);
                Ti.API.debug("  error: " + result.error);
            }else{
                Ti.API.info("clearMap(): Posizione attuale recuperata");
                for (var p in result){
                    Ti.API.debug("  " + p + ": " + JSON.stringify(result[p]));
                }

                var myLoc = Alloy.Globals.Map.createAnnotation({
                    latitude:      result.coords.latitude,
                    longitude:     result.coords.longitude,
                    title:         "Sei qui!",
                    annotation_id: "myloc",
                    image:         Alloy.Globals.PlacemarkImgs.MY_LOCATION
                });

                $.map.addAnnotation(myLoc);
                Ti.API.info("clearMap(): Aggiunto il segnaposto della posizione locale aggiornato.");
            }
        });
    } else {
        alert('Abilitare il servizio di localizzazione.');
        Ti.API.info("clearMap(): Servizio localizzazione non disponibile.");
    }
    return annotationId;
}

/**
 * Data una nuova regione da mostrare, la funzione aggiorna la mappa su tale
 * regione e chiede al server tutte le segnalazioni in quest'area.
 *
 * La mappa viene così aggiornata con i segnaposti per le segnalazioni
 * scaricate e per la posizione dell'utente aggiornata.
 *
 * Durante l'aggiornamento i segnaposti già presenti vengono rimossi tranne
 * quello memorizzato in 'annotationToKeep'. (vedi 'clearMap()')
 *
 * @param {{latitude: {number},longitude: {number},latitudeDelta: {number},longitudeDelta: {number},}} region nuova
 * regione da visualizzare nella mappa.
 */
function updateMap(region) {
    var boxes = getBoxes(region);
    var debugBox = function (box) {
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
    for (var i in boxes) {
        Alloy.Globals.Georep.getDocsInBox(boxes[i].BLCorner, boxes[i].TRCorner, function (err, data) {
            if (err) {
                Ti.API.info("getDocxInBox(): FAIL");
                Ti.API.debug("  err: " + JSON.stringify(err));
                queryOK = false;
            } else {
                Ti.API.info("getDocxInBox(): SUCCESS");
                queryOK = queryOK && true;

                var segnalazioni = data.rows;
                var localUserId = Alloy.Globals.Georep.getUserId();

                // tolgo le segnalazioni dalla mappa e aggiorno il segnaposto
                // per la posizione locale
                Ti.API.debug("moved(): annotationToKeep = " + annotationToKeep);
                var annDaNonAggiungere = clearMap(annotationToKeep);

                // aggiungo tutti i segnaposto alla mappa.
                for (var i in segnalazioni) {
                    var utenteSegnalazione = segnalazioni[i].value; // da sostituire con segnalazioni[i].value.userId appena modificata la view sul server
                    var titoloSegnalazione = segnalazioni[i].value; // da sostituire con segnalazioni[i].value.title  appena modificata la view sul server
                    var idSegnalazione = segnalazioni[i].id;

                    if (idSegnalazione != annDaNonAggiungere) {
                        var newAnnotationOpts = {
                            annotation_id: idSegnalazione,
                            latitude: segnalazioni[i].geometry.coordinates[1],
                            longitude: segnalazioni[i].geometry.coordinates[0],
                            title: titoloSegnalazione,
                            image: (utenteSegnalazione == localUserId) ? Alloy.Globals.PlacemarkImgs.MY_REPORT : Alloy.Globals.PlacemarkImgs.REPORT
                        };
                        var newAnnotation = Alloy.Globals.Map.createAnnotation(newAnnotationOpts);
                        $.map.addAnnotation(newAnnotation);
                    }
                }
            }
        });
    }
    if (!queryOK) {
        alert("Impossibile ottenere tutte le segnalazioni della zona");
        queryOK = true;
    }
}
/**
 * handler dell'evento associato allo spostamento e ridimensionamento della mappa.
 * @param {ModulesMapViewEvent} evt evento passato allo handler al momento della chiamata.
 */
function moved(evt) {
    var region = {
        latitude: evt.latitude,
        longitude: evt.longitude,
        latitudeDelta: evt.latitudeDelta,
        longitudeDelta: evt.longitudeDelta
    };
    updateMap(region);
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
    /* relativo segnaposto di default
    var myLocOptions = {
        latitude:      region.latitude,
        longitude:     region.longitude,
        title:         "Sei qui!",
        annotation_id: "myloc",
        image:         Alloy.Globals.PlacemarkImgs.MY_LOCATION
    };
    */

    if(!getCurrPosResult.success){
        Ti.API.info("Impostata regione DEFAULT per la mappa.");
        //Ti.API.info("Impostato segnaposto DEFAULT per la mappa.");

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

        /*
        myLocOptions.latitude      = getCurrPosResult.coords.latitude;
        myLocOptions.longitude     = getCurrPosResult.coords.longitude;
        myLocOptions.title         = "Sei qui!";
        myLocOptions.annotation_id = "myloc";
        myLocOptions.image         = Alloy.Globals.PlacemarkImgs.MY_LOCATION;
        */

        Ti.API.info("Impostata regione ATTUALE per la mappa.");
        //Ti.API.info("Impostato segnaposto ATTUALE per la mappa.");
    }

    $.map.setRegion(region);
    updateMap(region);
    /*
    var myLoc = Alloy.Globals.Map.createAnnotation(myLocOptions);


    $.map.addAnnotation(myLoc);
    */
}

/**
 * Handler dell'evento onComplete scatenato appena la mappa è pronta.
 *
 * Recupera la posizione corrente e una volta ottenuta inizializza
 * la mappa con quella posizione.
 *
 * @param {ModulesMapViewEvent} evt
 */
function mapCompleted(evt){
    if (Ti.Geolocation.locationServicesEnabled) {
        // perform other operations with Ti.Geolocation
        Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_LOW);
        Ti.Geolocation.getCurrentPosition(initMap);
    } else {
        //alert('Abilitare il servizio di localizzazione');
        initMap({success: false, error: "Servizio di localizzazione NON disponibile"});
    }
}