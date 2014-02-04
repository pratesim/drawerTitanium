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

Alloy.Globals.PlacemarkImgs = {
    MY_LOCATION: "/male-2.png",
    MY_REPORT: "/radiation.png",
    REPORT: "/radiation-white.png"
};

var Georep = require('georep');

Ti.API.info("Creazione utente...");
var user = new Georep.User({
	name: Ti.Platform.getId(),
	password: Ti.Platform.getId(),
	nick: "pratesim",
	mail: "pratesi.maurizio@gmail.com"
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

Alloy.Globals.decToSes = function(dec){
    var n = Math.abs(dec);
    var sgn = (dec >= 0) ? "" : "-";

    var g = Math.floor(n);
    var p = Math.floor((n-g)*60);
    var s = (((n-g)*60-p)*60).toFixed(3);

    return sgn + g + "° " + p + "\' " + s + "\"";
};

/* funzioni locali */
var numberPadding = function(n, width, padder){
        padder = padder || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(padder) + n;
};

