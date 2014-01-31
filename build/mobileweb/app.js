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

Alloy.createController("index");