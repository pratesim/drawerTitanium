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

var Georep = require('georep');

Ti.API.info("Creazione utente...");
var user = new Georep.User({
	//name: Ti.Platform.getId(),
    name: "provaNuovaView",
	password: Ti.Platform.getId(),
	nick: Alloy.Globals.Constants.FAKE_NICK,
	mail: Alloy.Globals.Constants.FAKE_MAIL
});
Ti.API.info("Utente creato.");
Ti.API.debug("  user: " + JSON.stringify(user));

Ti.API.info("Creazione database...");
var db = new Georep.DB({
	proto: "http",
	host: "pram.homepc.it",
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

/* funzioni locali */
var numberPadding = function(n, width, padder){
        padder = padder || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(padder) + n;
};
