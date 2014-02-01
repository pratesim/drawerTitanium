var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Alloy.Globals.PlacemarkImgs = {
    MY_LOCATION: "/male-2.png",
    MY_REPORT: "/radiation.png",
    REPORT: "/radiation-white.png"
};

Alloy.Globals.CustomEvents = {
    USER_REGISTERED: "userRegistered"
};

Alloy.Globals.Constants = {
    LOCAL_USER_DATA: "localUserData",
    FAKE_NICK: "ZmFrZU5pY2s=",
    FAKE_MAIL: "ZmFrZU1haWw="
};

var Georep = require("georep");

Ti.API.info("Creazione utente...");

var user = new Georep.User({
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

Alloy.Globals.query = {};

Alloy.Globals.query.userId = "";

Alloy.Globals.query.repoId = "";

Alloy.Globals.dataToString = function(milsToEPOC) {
    var d = new Date(milsToEPOC);
    return numberPadding(d.getDate(), 2) + "/" + numberPadding(d.getMonth() + 1, 2) + "/" + numberPadding(d.getFullYear(), 4) + " - " + numberPadding(d.getHours(), 2) + ":" + numberPadding(d.getMinutes(), 2) + ":" + numberPadding(d.getSeconds(), 2);
};

var numberPadding = function(n, width, padder) {
    padder = padder || "0";
    n += "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(padder) + n;
};

Alloy.createController("index");