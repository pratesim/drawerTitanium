var User = function(userConf) {
    if (userConfValidator(userConf)) {
        this.name = userConf.name;
        this.password = userConf.password;
        this.nick = userConf.nick;
        this.mail = userConf.mail;
        this.base64 = Ti.Utils.base64encode(userConf.name + ":" + userConf.password).text;
    }
};

User.prototype.update = function(newUserConf) {
    var oldUserConf = {
        name: this.getName(),
        password: this.getPassword(),
        nick: this.getNick(),
        mail: this.getMail()
    };
    if (userConfValidator(newUserConf)) {
        this.name = newUserConf.name;
        this.password = newUserConf.password;
        this.nick = newUserConf.nick;
        this.mail = newUserConf.mail;
        this.base64 = Ti.Utils.base64encode(newUserConf.name + ":" + newUserConf.password).text;
        return oldUserConf;
    }
};

User.prototype.getName = function() {
    return this.name;
};

User.prototype.getPassword = function() {
    return this.password;
};

User.prototype.getNick = function() {
    return this.nick;
};

User.prototype.getMail = function() {
    return this.mail;
};

User.prototype.getBase64 = function() {
    return this.base64;
};

exports.User = User;

var userConfValidator = function(uc) {
    if (uc) {
        if (uc.name && "string" == typeof uc.name && uc.password && "string" == typeof uc.password && uc.nick && "string" == typeof uc.nick && uc.mail && "string" == typeof uc.mail) return true;
        throw {
            error: "some userConf properties are invalid",
            userConf: uc
        };
    }
    throw {
        error: "a userConf object is required",
        userConf: uc
    };
};

var DB = function(dbConf) {
    if (dbConfValidator(dbConf)) {
        this.name = dbConf.name;
        this.host = dbConf.host;
        this.port = dbConf.port;
        this.proto = dbConf.proto;
    }
};

DB.prototype.getProto = function() {
    return this.proto;
};

DB.prototype.getHost = function() {
    return this.host;
};

DB.prototype.getPort = function() {
    return this.port;
};

DB.prototype.getName = function() {
    return this.name;
};

DB.prototype.getURLServer = function() {
    return this.getProto() + "://" + this.getHost() + ":" + this.getPort();
};

DB.prototype.getURLDB = function() {
    return this.getProto() + "://" + this.getHost() + ":" + this.getPort() + "/" + this.getName();
};

exports.DB = DB;

var dbConfValidator = function(dbc) {
    if (dbc) {
        if (!dbc.name || "string" != typeof dbc.name || !dbc.host || "string" != typeof dbc.host || !dbc.proto || "string" != typeof dbc.proto || !dbc.port || "number" != typeof dbc.port || 0 >= dbc.port || dbc.port >= 65536) throw {
            error: "some dbConf properties are invalid",
            dbConf: dbc
        };
        return true;
    }
    throw {
        error: "a dbConf object is required",
        dbConf: dbc
    };
};

var Georep = function(georepConf) {
    if (georepConfValidator(georepConf)) {
        this.db = georepConf.db;
        this.user = {
            localData: georepConf.user,
            remoteData: {
                _id: "org.couchdb.user:" + georepConf.user.getName(),
                type: "user",
                roles: []
            }
        };
    }
};

Georep.prototype.getUser = function() {
    return this.user.localData;
};

Georep.prototype.getDb = function() {
    return this.db;
};

Georep.prototype.getUserId = function() {
    return this.user.remoteData._id;
};

Georep.prototype.getDoc = function(docId, attachments, callback) {
    if (2 > arguments.length) throw {
        error: "getDoc() richiede almeno 2 argomenti: docId (string), attachment (boolean).",
        args: arguments
    };
    if (!docId || "string" != typeof docId || "boolean" != typeof attachments) throw {
        error: "Uno o piu' parametri non validi.",
        args: arguments
    };
    if (callback && "function" != typeof callback) throw {
        error: "callback deve essere una funzione.",
        args: arguments
    };
    var attach = attachments ? "?attachments=true" : "?attachments=false";
    var url = this.db.getURLDB() + "/" + docId + attach;
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Accept", "application/json");
    client.send();
};

Georep.prototype.getDocsInBox = function(bl_corner, tr_corner, callback) {
    if (2 > arguments.length) throw {
        error: "getDocsInBox() richiede due argomenti: bl_corner (object), tr_corner (object).",
        args: arguments
    };
    if (!mapPointValidator(bl_corner) || !mapPointValidator(tr_corner)) throw {
        error: "Uno o piu' parametri non validi.",
        args: arguments
    };
    if (arguments.length > 2 && "function" != typeof callback) throw {
        error: "Parametro opzionale non valido: callback.",
        args: arguments
    };
    var viewPath = constants.designDocs[0].name + "/" + constants.designDocs[0].handlers[1].name + "/" + constants.designDocs[0].handlers[1].views[0];
    var queryOpts = "?bbox=" + bl_corner.lng + "," + bl_corner.lat + "," + tr_corner.lng + "," + tr_corner.lat;
    var url = this.getDb().getURLDB() + "/_design/" + viewPath + queryOpts;
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Accept", "application/json");
    client.send();
};

Georep.prototype.getLastDocs = function(nDocs, callback) {
    var viewPath = constants.designDocs[0].name + "/" + constants.designDocs[0].handlers[0].name + "/" + constants.designDocs[0].handlers[0].views[1];
    var queryOpts = "?limit=" + nDocs + "&descending=true";
    if (1 > arguments.length) throw {
        error: "getLastDocs() richiede almeno un argomento: nDocs (number).",
        args: arguments
    };
    if (!nDocs || "number" != typeof nDocs || 0 >= nDocs) throw {
        error: "parametro non valido: nDocs deve essere un numero maggiore di 0.",
        args: arguments
    };
    if (arguments.length > 1 && "function" != typeof callback) throw {
        error: "parametro opzionale non valido: callback deve essere una funzione.",
        args: arguments
    };
    var url = this.getDb().getURLDB() + "/_design/" + viewPath + queryOpts;
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Accept", "application/json");
    client.send();
};

Georep.prototype.getUserDocs = function(userId, callback) {
    var viewPath = constants.designDocs[0].name + "/" + constants.designDocs[0].handlers[0].name + "/" + constants.designDocs[0].handlers[0].views[0];
    var queryOpts = '?key="' + userId + '"';
    if (1 > arguments.length) throw {
        error: "getUserDocs() richiede almeno un argomento: userId (string).",
        args: arguments
    };
    if (!userId || "string" != typeof userId) throw {
        error: "parametro non valido: userId deve essere una stringa non vuota.",
        args: arguments
    };
    if (arguments.length > 1 && "function" != typeof callback) throw {
        error: "parametro opzionale non valido: callback deve essere una funzione.",
        args: arguments
    };
    var url = this.getDb().getURLDB() + "/_design/" + viewPath + queryOpts;
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Accept", "application/json");
    client.send();
};

Georep.prototype.postDoc = function(doc, attach, callback) {
    if (2 > arguments.length) throw {
        error: "postDoc() richiede almeno 2 argomento: doc (object), attach (boolean).",
        args: arguments
    };
    if ("boolean" != typeof attach) throw {
        error: 'Parametro "attach" non valido.',
        args: arguments
    };
    if ("object" != typeof doc || !doc.title || "string" != typeof doc.title || !doc.msg || "string" != typeof doc.msg || attach && (!doc.img || "object" != typeof doc.img || !doc.img.content_type || "string" != typeof doc.img.content_type || !doc.img.data || "string" != typeof doc.img.data) || !doc.loc || "object" != typeof doc.loc || !doc.loc.latitude || "number" != typeof doc.loc.latitude || doc.loc.latitude > 90 || -90 > doc.loc.latitude || !doc.loc.longitude || "number" != typeof doc.loc.longitude || doc.loc.longitude > 180 || -180 > doc.loc.longitude) throw {
        error: 'Parametro "doc" non valido.',
        args: arguments
    };
    if ("function" != typeof callback) throw {
        error: "Il parametro opzionale deve essere una funzione",
        args: arguments
    };
    var newDoc = {};
    newDoc.userId = this.getUserId();
    newDoc.title = doc.title;
    newDoc.date = new Date().getTime();
    newDoc.msg = doc.msg;
    newDoc.loc = doc.loc;
    attach && (newDoc._attachments = {
        img: doc.img
    });
    var url = this.getDb().getURLDB();
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        error: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("POST", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Content-Type", "application/json");
    client.send(JSON.stringify(newDoc));
};

Georep.prototype.checkRemoteUser = function(callback) {
    if (1 != arguments.length || "function" != typeof callback) throw {
        error: "checkUser() richiede un argomento: callback (function(err, data)).",
        args: arguments
    };
    var url = this.getDb().getURLServer();
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback(void 0, {
                isRegistered: true
            });
        },
        onerror: function(e) {
            "401" == e.error ? callback(void 0, {
                isRegistered: false
            }) : callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.send();
};

Georep.prototype.signupRemoteUser = function(callback) {
    if (1 == arguments.length && "function" != typeof callback) throw {
        error: "Il parametro opzionale deve essere una funzione",
        args: arguments
    };
    var url = makeSignupUrlRequest(this);
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback && callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback && callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("POST", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Content-Type", "application/json");
    var usersignup = {
        _id: this.getUserId(),
        name: this.getUser().getName(),
        password: this.getUser().getPassword(),
        nick: this.getUser().getNick(),
        mail: this.getUser().getMail(),
        type: "user",
        roles: []
    };
    client.send(JSON.stringify(usersignup));
};

Georep.prototype.updateRemoteUser = function(userConf, callback) {
    if (1 > arguments.length) throw {
        error: "update() richiede un argomento: user (object).",
        args: arguments
    };
    if ("object" != typeof userConf) throw {
        error: "Impossibile aggiornare l'utente, parametro non valido.",
        args: arguments
    };
    if (!userConf.mail || "string" != typeof userConf.mail) throw {
        error: 'Impossibile settare "user", uno o piu\' properties non valide.',
        args: arguments
    };
    if (arguments.length > 1 && "function" != typeof callback) throw {
        error: "Il parametro opzionale deve essere una funzione",
        args: arguments
    };
    var tmpService = this;
    this.getRemoteUser(function(err, data) {
        if (err) callback && callback(err, void 0); else {
            var rev = JSON.parse(data)._rev;
            var url = tmpService.getDb().getURLServer() + "/_users/" + tmpService.getUserId() + "?rev=" + rev;
            var newLocalUser = {
                name: tmpService.getUser().getName(),
                password: tmpService.getUser().getPassword(),
                nick: tmpService.getUser().getNick(),
                mail: userConf.mail
            };
            var newRemoteUser = newLocalUser;
            newRemoteUser.type = "user";
            newRemoteUser.roles = [];
            newRemoteUser._id = tmpService.getUserId();
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    tmpService.getUser().update(newLocalUser);
                    callback && callback(void 0, JSON.parse(this.responseText));
                },
                onerror: function() {
                    callback && callback(JSON.parse(this.responseText), void 0);
                }
            });
            client.open("PUT", url);
            client.setRequestHeader("Authorization", "Basic " + tmpService.getDb().getAdmin().getBase64());
            client.setRequestHeader("Content-Type", "application/json");
            client.send(JSON.stringify(newRemoteUser));
        }
    });
};

Georep.prototype.getRemoteUser = function(callback) {
    if (1 != arguments.length) throw {
        error: "getRemote() richiede un argomento: callback (function(err, data))."
    };
    if ("function" != typeof callback) throw {
        error: "Parametro non valido: callback deve essere 'function'.",
        args: arguments
    };
    var url = this.getDb().getURLServer() + "/_users/" + this.getUserId();
    var client = Ti.Network.createHTTPClient({
        onload: function() {
            callback(void 0, JSON.parse(this.responseText));
        },
        onerror: function() {
            callback(JSON.parse(this.responseText), void 0);
        }
    });
    client.open("GET", url);
    client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
    client.setRequestHeader("Accept", "application/json");
    client.send();
};

exports.Georep = Georep;

var georepConfValidator = function(gc) {
    if (gc) {
        if (gc.db && gc.db instanceof DB && gc.user && gc.user instanceof User) return true;
        throw {
            error: "some georepConf properties are invalid",
            georepConf: gc
        };
    }
    throw {
        error: "a georepConf object is required",
        georepConf: gc
    };
};

var mapPointValidator = function(point) {
    return !("object" != typeof point || !point.lng || "number" != typeof point.lng || -180 > point.lng || point.lng > 180 || !point.lat || "number" != typeof point.lat || -90 > point.lat || point.lat > 90);
};

var makeSignupUrlRequest = function(georepObj) {
    return constants.nodeJsServer.proto + "://" + (constants.nodeJsServer.ip ? constants.nodeJsServer.ip : georepObj.getDb().getHost()) + ":" + constants.nodeJsServer.port + "/_users";
};

var constants = {
    designDocs: [ {
        name: "queries",
        handlers: [ {
            name: "_view",
            views: [ "allDocsByUser", "allDocsByDate" ]
        }, {
            name: "_spatial",
            views: [ "allDocsByLoc" ]
        } ]
    } ],
    nodeJsServer: {
        proto: "http",
        ip: void 0,
        port: 1337
    }
};