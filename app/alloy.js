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
var georep = require('georep');

var userConf = {
	name: Ti.Platform.getId(),
	password: Ti.Platform.getId(),
	nick: "pratesim",
	mail: "pratesi.maurizio@gmail.com"
};

var dbConf = {
	proto: "http",
	host: "pram.homepc.it",
	port: 5984,
	name: "testdb"
};

var georepConf = {
	user: new georep.User(userConf),
	db: new georep.DB(dbConf)
};

Alloy.Globals.service = new georep.Georep(georepConf);

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