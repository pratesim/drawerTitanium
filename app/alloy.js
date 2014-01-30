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
    name: 'MiBe',
    password: '1234',
    nick: 'MiBe',
    mail: 'mibe@mail.com'
});
Ti.API.info("Utente creato.");
Ti.API.debug("  user: " + JSON.stringify(user));

Ti.API.info("Creazione database...");
var db = new Georep.DB({
    proto: 'http',
    host: 'pram.homepc.it',
    port: 5984,
    name: 'testdb'
});
Ti.API.info("Database creato.");
Ti.API.debug("  db: " + JSON.stringify(db));

Alloy.Globals.Georep = new Georep.Georep({
    db: db,
    user: user
});