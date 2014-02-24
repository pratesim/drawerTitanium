// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Loads the map module, which can be referenced by Alloy.Globals.Map
Alloy.Globals.Map = require('ti.map');

// Definisce le costanti da usare per le immagini dei segnaposti
Alloy.Globals.PlacemarkImgs = {
    MY_LOCATION: "/male-2.png",    // segnaposto per la posizione attuale
    MY_REPORT: "/radiation.png",   // segnaposto per le mie segnalazioni
    REPORT: "/radiation-white.png" // segnaposto per le segnalazioni altrui
};

// Dofinisce un dizionario di nomi di eventi personalizzati
Alloy.Globals.CustomEvents = {
    USER_REGISTERED: "userRegistered" // segnala che l'utene locale è registrato sul server.
};

// Definisce un dizionario di nomi di uso generico usati nella app
Alloy.Globals.Constants = {
    LOCAL_USER_DATA: "localUserData", // nome dell'oggetto che contiene i dati locali dell'utente persistenti.
    FAKE_NICK: "ZmFrZU5pY2s=",
    FAKE_MAIL: "ZmFrZU1haWw="
};

// Definisce un dizionionario per le icone di notifica
Alloy.Globals.NotificationIcon = {
    UPLOAD_START:    '/images/notification_uploading.png',
    UPLOAD_COMPLETE: '/images/notification_complete.png',
    UPLOAD_ERROR:    '/images/notification_error.png'
}

var Georep = require('georep');

Ti.API.info("Creazione utente...");
var user = new Georep.User({
	name: Ti.Platform.getId(),
    //name: "provaNuovaView",
	password: Ti.Platform.getId(),
	nick: Alloy.Globals.Constants.FAKE_NICK,
	mail: Alloy.Globals.Constants.FAKE_MAIL
});
Ti.API.info("Utente creato.");
Ti.API.debug("  user: " + JSON.stringify(user));

Ti.API.info("Creazione database...");
var db = new Georep.DB({
	proto: "http",
	host: "cai.di.unipi.it",
	port: 5984,
	name: "testdb"
});
Ti.API.info("Database creato.");
Ti.API.debug("  db: " + JSON.stringify(db));

Alloy.Globals.Georep = new Georep.Georep({
    db: db,
    user: user
});

/* variabile globale contenente l'userId del segnalatore della segnalazione scelta di cui si vuole vedere il dettaglio */
Alloy.Globals.query = {};
Alloy.Globals.query.userId = "";
Alloy.Globals.query.repoId = "";

/* ogni volta che viene scattata la foto, viene salvato qui il riferimento
 * all'oggetto binario che la rappresenta
 */
Alloy.Globals.photoBlob = undefined;

/* funzioni globali */
Alloy.Globals.dataToString = function(milsToEPOC){
	var d = new Date(milsToEPOC);
	return numberPadding( d.getDate(), 2) + '/' +
 	numberPadding( d.getMonth() + 1, 2) + '/' +
 	numberPadding( d.getFullYear(), 4) + ' - ' +
 	numberPadding( d.getHours(), 2) + ':' +
 	numberPadding( d.getMinutes(), 2) + ':' +
 	numberPadding( d.getSeconds(), 2) ;
};

Alloy.Globals.decToSes = function(dec){
    var n = Math.abs(dec);
    var sgn = (dec >= 0) ? "" : "-";

    var g = Math.floor(n);
    var p = Math.floor((n-g)*60);
    var s = (((n-g)*60-p)*60).toFixed(3);

    return sgn + g + "° " + p + "\' " + s + "\"";
};
/**
 * Ridimensiona un'immagine in modo che rientri sempre in un
 * quadrato di 2048x2048 pixel.
 *
 * @param {Titanium.Blob} imgBlob immagine in formato blob
 * @returns {Titanium.Blob} blob di un immagine con dimensioni minori o uguali di 2048px.
 */
Alloy.Globals.resizePhoto = function(imgBlob){
    Ti.API.info("resizePhoto(): blob mimetype is \'" + imgBlob.getMimeType() + "\'");
    var limit = 2048;
    var aspectRatio = imgBlob.getWidth()/imgBlob.getHeight();
    var orientation = (aspectRatio >= 1) ? "landscape" : "portrait";
    var img;
    var height, width;

    if (imgBlob.getWidth() > limit || imgBlob.getHeight() > limit){
        Ti.API.info("resizePhoto(): immagine da ridimensionare.");
        Ti.API.debug("resizePhoto():   " + imgBlob.getWidth() + "x" + imgBlob.getHeight() + " (max " + limit + "x" + limit +")");

        if (orientation == "portrait"){
            height = limit;
            width = Math.round(limit * aspectRatio);
        }else{
            height = Math.round(limit / aspectRatio);
            width = limit;
        }
        Ti.API.debug("resizePhoto(): immagine ridimensionata.");
        Ti.API.debug("resizePhoto():   " + width + "x" + height + " (rapporto " + aspectRatio + ")");

        // ridimensiono l'immagine assicurandomi che sia larga/alta almeno 1px.
        img = imgBlob.imageAsResized((width > 0)?width:1, (height > 0)?height:1);
    }else{
        Ti.API.info("resizePhoto(): ridimensionamento non necessario");
        Ti.API.debug("resizePhoto():   " + imgBlob.getWidth() + "x" + imgBlob.getHeight() + " (max " + limit + "x" + limit +")");
        img = imgBlob;
    }
    return img;
};

/* funzioni locali */
var numberPadding = function(n, width, padder){
        padder = padder || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(padder) + n;
};

