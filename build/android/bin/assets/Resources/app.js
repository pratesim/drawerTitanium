var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var georep = require("georep");

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