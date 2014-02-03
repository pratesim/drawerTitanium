/**
<p>Fornisce gli oggetti per poter utilizzare un db remoto couchdb esteso con geocouch.</p>
<p>
	Sul database è possibile immagazzinare record geo-referenziati che contengono le
	seguenti informazioni:
	<ul>
		<li><b><code>title</code></b> - <i>string</i>:
			Titolo per la segnalazione.
		</li>
		<li><b><code>msg</code></b> - <i>string</i>:
			Descrizione più dettagliata per la segnalazione.
		</li>
		<li><b><code>img</code></b> - <i>object</i>:
			Immagine allegata per documentare la segnalazione.
			<ul>
				<li><b><code>content_type</code></b> - <i>string</i>:
					Tipo di contenuto, per esempio <code>"image/jpg"</code>.
				</li>
				<li><b><code>data</code></b> - <i>string</i>:
					Codifica <code>base64</code> del documento allegato.
				</li>
			</ul>
		</li>
		<li><b><code>loc</code></b> - <i>object</i>:
			Posizione geografica della segnalazione.
			<ul>
				<li><b><code>latitude</code></b> - <i>number</i>:
					Latitudine Nord.
				</li>
				<li><b><code>longitude</code></b> - <i>number</i>:
					Longitudine Est.
				</li>
			</ul>
		</li>
	</ul>
</p>

@module georep
**/


// -- USER ---------------------------------------------------------------------

/**
<h3>User</h3>
<p>
	Definisce l'utente locale che utilizzerà il database remoto.<br>
	Tutte le segnalazioni creare e inviate al server saranno associate a questo utente.
</p>
<p>
	Ogni utente è identificato sul server da una coppia <i>username</i> e <i>password</i>
	ed è personalizzato da un <i>nickname</i> e da un contatto <i>e-mail</i> visibili
	agli altri utenti.
</p>
<p>
	Per istanziare un nuovo utente bisogna definire prima un oggetto <b><code>userConf</code></b>
	che specifichi tutte le sue informazioni; tale oggetto deve avere le seguenti properties:
	<ul>
		<li><b><code>name</code></b> - <i>string</i>: user name utilizzato per il login
		<li><b><code>password</code></b> - <i>string</i>: password utilizzata per il login
		<li><b><code>nick</code></b> - <i>string</i>: nome personalizzato per l'utente
		<li><b><code>mail</code></b> - <i>string</i>: contatto e-mail dell'utente
	</ul>
</p>
<h3>Esempio:</h3>

	var userConf = {
		name: "username",
		password: "1234",
		nick: "userNick",
		mail: "myemail@mail.com"
	};
	
	var usr = new User( userConf );

@class User
@constructor
@param {object} userConf specifica tutte le informazioni del nuovo utente.
*/
var User = function (userConf) {
	if (userConfValidator(userConf)){
		/**
		 * Username utilizzato per il login dell'utente sul server
		 * @attribute name
		 * @type string
		 * @readOnly
		 */
		this.name = userConf.name;
		/**
		 * Password utilizzata per il login dell'utente sul server
		 * @attribute password
		 * @type string
		 * @readOnly
		 */
		this.password = userConf.password;
		/**
		 * Nick name usato dall'utente
		 * @attribute nick
		 * @type string
		 * @readOnly
		 */
		this.nick = userConf.nick;
		/**
		 * Contatto e-mail usato dell'utente
		 * @attribute mail
		 * @type string
		 * @readOnly
		 */
		this.mail = userConf.mail;
		/**
		 * Codifica <code>base64</code> della stringa 'User.name:User.password'
		 * utilizzata nell'autenticazione via <code>HTTP</code>
		 * @attribute base64
		 * @type string
		 * @readOnly
		 */
		this.base64 = Ti.Utils.base64encode(userConf.name + ':' + userConf.password).text;
	}
};

/**
 * Aggiorna la configurazione dell'utente locale.
 * @method update
 * @param {object} newUserConf nuove caratteristiche dell'utente.
 * @return {object} un oggetto di tipo <code>userConf</code> con le vecchie configurazioni.
 */
User.prototype.update = function(newUserConf){
	var oldUserConf = {
		name: this.getName(),
		password: this.getPassword(),
		nick: this.getNick(),
		mail: this.getMail()
	};
	if (userConfValidator(newUserConf)){
		this.name = newUserConf.name;
		this.password = newUserConf.password;
		this.nick = newUserConf.nick;
		this.mail = newUserConf.mail;
		this.base64 = Ti.Utils.base64encode(newUserConf.name + ':' + newUserConf.password).text;
		return oldUserConf;
	}
};

/**
 * Ritorna il nome dell'utente usato per il login
 * @method getName
 * @return {string} nome dell'utente.
 */
User.prototype.getName = function(){
	return this.name;
};

/**
 * Ritorna la password di login dell'utente
 * @method getPassword
 * @return {string} password
 */
User.prototype.getPassword = function(){
	return this.password;
};

/**
 * Ritorna il nickname usato dell'utente
 * @method getNick
 * @return {string} nickname
 */
User.prototype.getNick = function(){
	return this.nick;
};

/**
 * Ritorna il contatto e-mail usato dall'utente
 * @method getMail
 * @return {string} indirizzo e-mail
 */
User.prototype.getMail = function(){
	return this.mail;
};

/**
 * Ritorna la codifica in <code>base64</code> delle credenziali di autenticazione.
 * @method getBase64
 * @return {string} 'name:password' in <code>base64</code>
 */
User.prototype.getBase64 = function(){
	return this.base64;
};

exports.User = User;

// -- Funzioni ausiliare per USER

/**
 * Controlla che un oggetto <code>userConf</code> sia corretto.
 * @private
 * @method userConfValidator
 * @param {object} uc oggetto <code>userConf</code> da controllare
 * @return {boolean} <code>true</code> se l'oggetto è valido,
 *                   <code>false</code> altrimenti.
 */
var userConfValidator = function (uc) {
	if (!uc)
		throw {
			error: 'a userConf object is required',
			userConf: uc
		};
	else if (!uc.name     || typeof uc.name     != 'string' ||
	         !uc.password || typeof uc.password != 'string' ||
	         !uc.nick     || typeof uc.nick     != 'string' ||
	         !uc.mail     || typeof uc.mail     != 'string'   )
		throw {
			error: 'some userConf properties are invalid',
			userConf: uc
		};
	else
		return true;
};




// -- DB -----------------------------------------------------------------------


/**
<h3>DB</h3>
<p>
	Definisce il database remoto con il quale ci si vuole interfacciare.
</p>
<p>
	Per poter comunicare con il database remoto bisogna specificare il protocollo
	impiegato, l'indirizzo IP o hostname del macchina che ospita il servizio, il
	numero di porta sulla quale il server è in ascolto in attesa di connessioni e
	il nome del database sul quale di vuole operare;
</p>
<p>
	Per istanziare un nuovo database bisogna definire prima un oggetto <b><code>dbConf</code></b>
	che specifichi tutte le sue informazioni; tale oggetto deve avere le seguenti properties:
	<ul>
		<li><b><code>proto</code></b> - <i>string</i>: protocollo di comunicazione (per il momento solo <b><code>http</code></b>)
		<li><b><code>host</code></b> - <i>string</i>: IP o hostname della macchina remota
		<li><b><code>port</code></b> - <i>number</i>: numero della porta remota in ascolto
		<li><b><code>name</code></b> - <i>string</i>: nome del database remoto
	</ul>
</p>
<h3>Esempio:</h3>

	var dbConf = {
		proto: "http",
		host: "127.0.0.1",
		port: 5984,
		name: "posts"
	};
	
	var db = new DB( dbConf );

@class DB
@constructor
@param {object} dbConf specifica tutte le informazioni del nuovo database.
*/
var DB = function (dbConf) {
	if (dbConfValidator(dbConf)){
		/**
		 * Nome database remoto
		 * @attribute name
		 * @readonly
		 * @type string
		 */
		this.name  = dbConf.name;
		/**
		 * Indirizzo IP o hostname del server remoto
		 * @attribute host
		 * @readonly
		 * @type string
		 */
		this.host  = dbConf.host;
		/**
		 * Porta in ascolto del server remoto
		 * @attribute port
		 * @readonly
		 * @type number
		 */
		this.port  = dbConf.port;
		/**
		 * Protocollo di comunicazione usato
		 * @attribute proto
		 * @readonly
		 * @type string
		 */
		this.proto = dbConf.proto;
	}
};

/**
 * Ritorna il protocollo di comunicazione usato
 * @method getProto
 * @return {string} protocollo 
 */
DB.prototype.getProto = function() {
	return this.proto;
};

/**
 * Ritorna lo hostname o l'indirizzo IP dell'host remoto
 * @method getHost
 * @return {string} hostname o indirizzo IP 
 */
DB.prototype.getHost = function() {
	return this.host;
};

/**
 * Ritorna il numero di porta usata nell'invio delle richieste
 * @method getPort
 * @return {number} porta remota 
 */
DB.prototype.getPort = function() {
	return this.port;
};

/**
 * Ritorna il nome del database remoto utilizzato
 * @method getName
 * @return {string} nome del database remoto 
 */
DB.prototype.getName = function() {
	return this.name;
};

/**
 * Costruisce l'URL completo per raggiungere il server remoto.
 *
 * @method getURLServer
 * @return {string} l'URL che punta al server remoto che gestisce i database
 * @example
 *     "http://127.0.0.1:5984"
 */
DB.prototype.getURLServer = function(){
	return this.getProto() + '://' + this.getHost() + ':' + this.getPort();
};

/**
 * Costruisce l'URL completo per raggiungere il database sul server remoto.
 *
 * @method getURLDB
 * @return {string} l'URL che punta al database sul server remoto
 * @example
 *     "http://127.0.0.1:5984/posts"
 */
DB.prototype.getURLDB = function(){
	return this.getProto() + '://' + this.getHost() + ':' + this.getPort() + '/' + this.getName();
};

exports.DB = DB;

// -- Funzioni ausiliare per DB


/**
 * Controlla che un oggetto <code>dbConf</code> sia corretto.
 * @private
 * @method dbConfValidator
 * @param {object} dbc oggetto <code>dbConf</code> da controllare
 * @return {boolean} <code>true</code> se l'oggetto è valido,
 *                   <code>false</code> altrimenti.
 */
var dbConfValidator = function (dbc) {
	if (!dbc)
		throw {
			error: 'a dbConf object is required',
			dbConf: dbc
		};
	else if (!dbc.name  || typeof dbc.name  != 'string'   ||
	         !dbc.host  || typeof dbc.host  != 'string'   ||
	         !dbc.proto || typeof dbc.proto != 'string'   ||
	         !dbc.port  || typeof dbc.port  != 'number'   || dbc.port <= 0 || dbc.port >= 65536)
		throw {
			error: 'some dbConf properties are invalid',
			dbConf: dbc
		};
	else
		return true;
};





// -- GEOREP -------------------------------------------------------------------


/**
<h3>Georep</h3>
<p>
	Definisce un interfaccia per utilizzare i servizi offerti dal database couchdb
	remoto.
</p>
<p>
	Per poter comunicare con il database e inviare query è necessario specificare
	il database remoto e il nostro utente per permettere che il server ci autentifichi e,
	nel caso non fossimo un utente già registrato dobbiamo provvedere anche a questo. 
</p>
<p>
	Per inizializzare una nuova interfaccia dobbiamo prima definire un oggetto <b><code>georepConf</code></b>
	che specifichi tutte le sue informazioni; tale oggetto deve avere le seguenti properties:
	<ul>
		<li><b><code>user</code></b> - <i>User</i>: un istanza di un oggetto {{#crossLink "User"}}{{/crossLink}}
		<li><b><code>db</code></b> - <i>DB</i>: un istanza di un oggetto {{#crossLink "DB"}}{{/crossLink}}
	</ul>
</p>
<h3>Esempio:</h3>

	var georepConf = {
		user: new User( userConf ),
		db: new DB( dbConf )
	};
	
	var service = new Georep( georepConf );

<p>
	I metodi che interagiscono con il server sono asincroni e quindi necessitano
	di una funzione di <b>callback</b> che verrà eseguita al termine dell'interazione
	con il server che avrà la funzione di elaborare i dati restituiti dal server
	o gestire eventuali errori.
</p>
<p>
	La funzione di callback deve ammettere 2 parametri che al momento della
	chiamata verranno utilizzati in questo modo:
	<ul>
		<li>
			se si è verificato un errore, il <b>primo</b> parametro conterrà le informazioni
			relative mentre il <b>secondo</b> sarà settato ad <code>undefined</code>;
		</li>
		<li>
			se la query è andata a buon fine allora il <b>primo</b> parametro sarà
			<code>undefined</code> e il <b>secondo</b> conterrà la risposta inviata dal
			server.
		</li>
	</ul>
</p>
<h3>Esempio:</h3>
<p>Una callback valida potrebbe essere:</p>

	var callback = function (err, data) {
		if(!err) {
			// nessun errore, posso lavorare con 'data'...
		} else {
			// si è verificato un errore descritto in 'err'.
		}
	};

@class Georep
@constructor
@param {object} georepConf specifica tutte le informazioni della nuova interfaccia.
*/
var Georep = function (georepConf) {
	if (georepConfValidator(georepConf)){
		/**
		 * Database remoto
		 * @attribute db
		 * @readOnly
		 * @type DB
		 */
		this.db = georepConf.db;
		/**
		 * Insieme di informazioni sull'utente che utilizza il servizio.<br>
		 * Sono organizzate in un oggetto con le seguenti properies:
		 * <ul>
		 *     <li><b><code>localData</code></b> - <i>User</i>: informazioni locali dell'utente.</li>
		 *     <li><b><code>remoteData</code></b> - <i>object</i>: informazioni remote dell'utente che utilizza il servizio.<br>
		 *         Sono organizzate in un oggetto con le seguenti properies:
		 *         <ul>
		 *             <li><b><code>_id</code></b> - <i>string</i>: stringa con cui il server identifica l'utente locale</li>
		 *             <li><b><code>type</code></b> - <i>string</i>: tipologia dell'utente</li>
		 *             <li><b><code>roles</code></b> - <i>array</i>: ruoli di questo utente sul database</li>
		 *         </ul>
		 *     </li>
		 * </ul>
		 * @attribute user
		 * @readOnly
		 * @type object
		 */
		this.user = {
			localData:  georepConf.user,
			remoteData: {
				_id: 'org.couchdb.user:' + georepConf.user.getName(),
				type: 'user',
				roles: []
			}
		};
	}
};

/**
 * Ritorna l'utente locale usato
 * @method getUser
 * @return {User} utente locale
 */
Georep.prototype.getUser = function() {
	return this.user.localData;
};

/**
 * Ritorna il database remoto utilizzato
 * @method getDb
 * @return {DB} database remoto
 */
Georep.prototype.getDb = function() {
	return this.db;
};

/**
 * Ritorna identificatore unico dell'utente locale usato nel server
 *
 * @method getUserId
 * @return {string} ID dell'utente.
 */
Georep.prototype.getUserId = function(){
	return this.user.remoteData._id;
};

/**
 * Chiede un particolare documento al database attraverso il suo identificatore
 * unico interno al database.
 *
 * @method getDoc
 * @param {string} docId identificatore unico del documento nel database
 * @param {boolean} attachments se <code>true</code> viene scaricato anche l'allegato.
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */ 
Georep.prototype.getDoc = function(docId, attachments, callback){
	if( arguments.length < 2 )
		throw {
			error: 'getDoc() richiede almeno 2 argomenti: docId (string), attachment (boolean).',
			args: arguments
		};
	else if (!docId || typeof docId != 'string' || typeof attachments != 'boolean')
		throw {
			error: 'Uno o piu\' parametri non validi.',
			args: arguments
		};
	else if (callback && typeof callback != 'function'){
		throw {
			error: 'callback deve essere una funzione.',
			args: arguments
		};
	} else {
		var attach = (attachments)?'?attachments=true':'?attachments=false';
		var url = this.db.getURLDB() + '/' + docId + attach;

		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					// this.responseText contiene la risposta di tipo json
					callback(undefined,JSON.parse(this.responseText));
			},
			onerror: function(e){
				if(callback)
					callback(JSON.parse(this.responseText),undefined);
			}
		});
		
		client.open("GET", url);
		client.setRequestHeader("Authorization", "Basic " + this.getUser().getBase64());
		
		// mi assicura che la risposta arrivi con l'allegato in base64
		// invece che in binario in un oggetto MIME a contenuti multipli
		client.setRequestHeader("Accept", "application/json");
		client.send();
	}
};

/**
 * Chiede tutti i documenti che sono relativi ad una certa area geografica rettangolare
 * definita dalle coordinate dei vertici in basso a sinistra e in alto a destra.
 *
 * Un vertice quindi è un punto sulla mappa che deve essere rappresentato da un oggetto
 * che deve avere 2 properties:
 * <ul>
 *     <li><b><code>lat</code></b> - <i>number</i>: compreso tra -90 e 90 che indica la latitudine <b>nord</b>
 *     <li><b><code>lng</code></b> - <i>number</i>: compreso tra -180 e 180 che indica la longitudine <b>est</b>
 * </ul>
 * Per esempio:

	var mapPoint = {
		lat: 43.720736,
		lng: 10.408392
	}

 * @method getDocsInBox
 * @param {object} bl_corner vertice in basso a sinistra dell'area della mappa interessata
 * @param {object} tr_corner vertice in alto a destra dell'area della mappa interessate
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.getDocsInBox = function(bl_corner, tr_corner, callback){
	if (arguments.length < 2)
		throw {
			error: 'getDocsInBox() richiede due argomenti: bl_corner (object), tr_corner (object).',
			args: arguments
		};
	else if (!mapPointValidator(bl_corner) || !mapPointValidator(tr_corner))
		throw {
			error: 'Uno o piu\' parametri non validi.',
			args: arguments
		};
	else if (arguments.length > 2 && typeof callback != 'function')
		throw {
			error: 'Parametro opzionale non valido: callback.',
			args: arguments
		};
	else {
		var viewPath = constants.designDocs[0].name + '/' +
		               constants.designDocs[0].handlers[1].name + '/' +
		               constants.designDocs[0].handlers[1].views[0];
		var queryOpts = '?bbox=' +
		                bl_corner.lng + ',' + bl_corner.lat + ',' +
		                tr_corner.lng + ',' + tr_corner.lat;
		                
		var url = this.getDb().getURLDB() + '/_design/' + viewPath + queryOpts;
		
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					callback(undefined, JSON.parse(this.responseText));
			},
			onerror: function(e){
				if(callback)
					callback(JSON.parse(this.responseText),undefined);
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.setRequestHeader("Accept", 'application/json');
		client.send();
	}
};

/**
 * Chiede al server le ultime nDocs segnalazioni inviate al server.
 *
 * @method getLastDocs
 * @param {number} nDocs numero di segnalazioni da chiedere
 * @param {function} callback funzione chiamata al termine della
 *     richiesta al server. In caso di errore, 'err' contiene un oggetto
 *     che descrive l'errore altrimenti 'data' contiene il risultato
 *     della query.
 */
Georep.prototype.getLastDocs = function(nDocs, callback){

    var viewPath = constants.designDocs[0].name + '/' +
                   constants.designDocs[0].handlers[0].name + '/' +
                   constants.designDocs[0].handlers[0].views[1];

    var queryOpts = '?limit=' + nDocs + '&descending=true';

    if (arguments.length < 1)
        throw {
            error: 'getLastDocs() richiede almeno un argomento: nDocs (number).',
            args: arguments
        };

    else if (!nDocs || typeof nDocs != 'number' || nDocs <= 0)
        throw {
            error: 'parametro non valido: nDocs deve essere un numero maggiore di 0.',
            args: arguments
        };

    else if (arguments.length > 1 && typeof callback != 'function')
        throw {
            error: 'parametro opzionale non valido: callback deve essere una funzione.',
            args: arguments
        };

    else {
        var url = this.getDb().getURLDB() + '/_design/' + viewPath + queryOpts;
        var client = Ti.Network.createHTTPClient({
            onload: function(data){
                if(callback)
                    callback(undefined, JSON.parse(this.responseText));
            },
            onerror: function(e){
                if(callback)
                    callback(JSON.parse(this.responseText),undefined);
            }
        });
        client.open("GET", url);
        client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
        client.setRequestHeader("Accept", 'application/json');
        client.send();
    }
};

/**
 * Chiede al database tutti i documenti creati da un determinato utente indicando
 * il suo identificatore unico.
 *
 * @method getUserDocs
 * @param {string} userId identificatore unico dell'utente sul server
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.getUserDocs = function(userId, callback){
	var viewPath = constants.designDocs[0].name + '/' +
		           constants.designDocs[0].handlers[0].name + '/' +
		           constants.designDocs[0].handlers[0].views[0];
	var queryOpts = '?key="' + userId + '"';
	
	if (arguments.length < 1)
		throw {
			error: 'getUserDocs() richiede almeno un argomento: userId (string).',
			args: arguments
		};
	else if (!userId || typeof userId != 'string')
		throw {
			error: 'parametro non valido: userId deve essere una stringa non vuota.',
			args: arguments
		};
	else if (arguments.length > 1 && typeof callback != 'function')
		throw {
			error: 'parametro opzionale non valido: callback deve essere una funzione.',
			args: arguments
		};
	else {
		var url = this.getDb().getURLDB() + '/_design/' + viewPath + queryOpts;
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					callback(undefined, JSON.parse(this.responseText));
			},
			onerror: function(e){
				if(callback)
					callback(JSON.parse(this.responseText),undefined);
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.setRequestHeader("Accept", 'application/json');
		client.send();
	}
};

/**
 * Invia al server un nuovo documento
 * @method postDoc
 * @param {object} doc nuovo documento da inviare al server
 * @param {boolean} attach
 * <b>true</b>: invia al server anche l'allegato (<code>img: { ...</code> );<br>
 * <b>false</b>: ignora la property 'img' e invia al server un documento privo di allegato.
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.postDoc = function(doc, attach, callback){
	if( arguments.length < 2 ){
        throw {
            error: 'postDoc() richiede almeno 2 argomento: doc (object), attach (boolean).',
            args: arguments
        };
	} else if ( typeof attach != 'boolean' ){
        throw {
            error: 'Parametro "attach" non valido.',
            args: arguments
        };
    } else if ( typeof doc != 'object' ||
        !doc.title || typeof doc.title != 'string' ||
        !doc.msg   || typeof doc.msg   != 'string' ||
        attach && (
            !doc.img   || typeof doc.img   != 'object' ||
                !doc.img.content_type || typeof doc.img.content_type != 'string' ||
                !doc.img.data         || typeof doc.img.data         != 'string'
            ) ||
        !doc.loc || typeof doc.loc != 'object' ||
        !doc.loc.latitude  || typeof doc.loc.latitude  != 'number' || doc.loc.latitude  >  90 || doc.loc.latitude  <  -90 ||
        !doc.loc.longitude || typeof doc.loc.longitude != 'number' || doc.loc.longitude > 180 || doc.loc.longitude < -180 ){
			throw {
				error: 'Parametro "doc" non valido.',
				args: arguments
			};
	} else if (typeof callback != 'function'){
        throw {
            error: 'Il parametro opzionale deve essere una funzione',
            args: arguments
        };
	} else {
        var newDoc = {};
        newDoc.userId = this.getUserId();
        newDoc.title = doc.title;
        newDoc.date = (new Date()).getTime();
        newDoc.msg = doc.msg;
        newDoc.loc = doc.loc;
        if (attach) {
            newDoc._attachments = {
                img: doc.img
            };
        }

        var url = this.getDb().getURLDB();
        var client = Ti.Network.createHTTPClient({
            onload: function(data){
                if(callback)
                    callback(undefined,JSON.parse(this.responseText));
            },
            error: function(e){
                if(callback)
                    callback(JSON.parse(this.responseText),undefined);
            }
        });
        client.open("POST", url);

        client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
        client.setRequestHeader("Content-Type", "application/json");

        client.send(JSON.stringify(newDoc));
    }
};

/**
 * Verifica se l'utente locale è già registrato sul server.
 * @method checkRemoteUser
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.checkRemoteUser = function(callback){
	// callback è obbligatorio perché checkUser() esegue una richiesta asincrona
	if( arguments.length != 1 || typeof callback != 'function'){
		throw {
			error: 'checkUser() richiede un argomento: callback (function(err, data)).',
			args: arguments
		};	
	} else {
		// richiedo info sul db, usando come credenziali di accesso quelle dell'utente locale, 
		// se l'accesso al db viene negato, significa che l'utente non è registrato
		var url = this.getDb().getURLServer();
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				callback(undefined, {isRegistered: true});
			},
			onerror: function(e){
				if (e.error == "Unauthorized") {
					callback(undefined, {isRegistered: false});
				} else {
					callback(JSON.parse(this.responseText), undefined);
				}
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.send();
	}
};

/**
 * Richiede al server di registrare l'utente locale
 * @method signupRemoteUser
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.signupRemoteUser = function(callback){
	if( arguments.length == 1 && typeof callback != 'function' ) {
					throw {
						error: 'Il parametro opzionale deve essere una funzione',
						args: arguments
					};
	} else {
	
		var url = makeSignupUrlRequest(this);
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				// console.log("Utente registrato con successo! " +data);
				if (callback) {
					callback(undefined, JSON.parse(this.responseText));
				}
			},
			onerror: function(e){
				// console.log("Utente NON registrato! " + e.err);
				if (callback){
					callback(JSON.parse(this.responseText), undefined);
				}
			}
		});
		
		client.open('POST', url);
		
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.setRequestHeader("Content-Type", "application/json");
		
		var usersignup = {
			_id: this.getUserId(),
			 name: this.getUser().getName(),
			 password: this.getUser().getPassword(),
			 nick: this.getUser().getNick(),
			 mail: this.getUser().getMail(),
			 type: 'user',
			 roles: []
		};
		client.send(JSON.stringify(usersignup));
		
	}
};

/**
 * Chiede al server di aggiornare la e-mail dell'utente locale con
 * un nuovo valore. Se l'operazione riesce, viene aggiornato anche il valore locale.
 * @method updateRemoteUser
 * @param {object} userConf oggetto <code>userConf</code> con il nuovo valore per
 *                 <b><code>mail</code></b>. Le altre properties vengono ignorate
 *                 e possono essere anche omesse in questo caso.
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.updateRemoteUser = function(userConf, callback){
	if (arguments.length < 1){
		throw {
			error: 'update() richiede un argomento: user (object).',
			args: arguments
		};
	} else if (typeof userConf != 'object') {
		throw {
			error: 'Impossibile aggiornare l\'utente, parametro non valido.',
			args: arguments
		};
	} else if (!userConf.mail || typeof userConf.mail != 'string' ){
		throw {
			error: 'Impossibile settare "user", uno o piu\' properties non valide.',
			args: arguments
		};
	} else if (arguments.length > 1 && typeof callback != 'function') {
		throw {
			error: 'Il parametro opzionale deve essere una funzione',
			args: arguments
		};
	} else {
		var tmpService = this; // serve perché dentro la funzione di callback this è window anziché Georep
		this.getRemoteUser(function(err,data){					
			if(!err){
				var rev = JSON.parse(data)._rev;
				var url = tmpService.getDb().getURLServer() + '/_users/' + tmpService.getUserId() +
					  '?rev=' + rev;
					  
				var newLocalUser = {
					name: tmpService.getUser().getName(),
					password: tmpService.getUser().getPassword(),
					nick: tmpService.getUser().getNick(),
					mail: userConf.mail
				};
				var newRemoteUser = newLocalUser;
				newRemoteUser.type = 'user';
				newRemoteUser.roles = [];
				newRemoteUser._id = tmpService.getUserId();

				var client = Ti.Network.createHTTPClient({
					onload: function(data){
						tmpService.getUser().update(newLocalUser);
						if (callback) {
							callback(undefined, JSON.parse(this.responseText));
						}
					},
					onerror: function(e){
						if (callback){
							callback(JSON.parse(this.responseText), undefined);
						}
					}
				});
				client.open("PUT", url);
		
				client.setRequestHeader("Authorization", 'Basic ' + tmpService.getDb().getAdmin().getBase64());
				client.setRequestHeader("Content-Type", "application/json");
				
				client.send(JSON.stringify(newRemoteUser));
			}else{
				if (callback){
					callback(err, undefined);
				}
			}
		});
	}
};

/**
 * Chiede al server tutte le informazioni sull'utente locale
 * @method getRemoteUser
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.getRemoteUser = function(callback){
		// callback è obbligatorio perché getRemote usa una funzione asincrona
	if( arguments.length != 1){
		throw {
			error: 'getRemote() richiede un argomento: callback (function(err, data)).'
		};	
	} else if (typeof callback != 'function'){
		throw {
			error: 'Parametro non valido: callback deve essere \'function\'.',
			args: arguments
		};
	} else {
		var url = this.getDb().getURLServer() + '/_users/' + this.getUserId();
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				callback(undefined, JSON.parse(this.responseText));
			},
			onerror: function(e){
				callback(JSON.parse(this.responseText), undefined);
			}
		});
		client.open("GET", url);
		
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.setRequestHeader("Accept", 'application/json');
		
		client.send();
	}
};

/**
 * Chiede al server le informazioni dell'utente con un certo id
 * @method getRemoteUser
 * @param {string} id identificatore univoco che identifica un utente sul server
 * @param {function} callback funzione che viene eseguita al termine dell'interazione con il server.
 */
Georep.prototype.getUserById = function(id, callback){
	// callback è obbligatorio perché getRemote usa una funzione asincrona
	if( arguments.length != 2){
		throw {
			error: 'getRemote() richiede due argomenti: id, callback (function(err, data)).'
		};	
	} else if (typeof callback != 'function'){
		throw {
			error: 'Parametro non valido: callback deve essere \'function\'.',
			args: arguments
		};
	} else if (typeof id != 'string'){
		throw {
			error: 'Parametro non valido: id deve essere \'string\'.',
			args: arguments
		};
	} else {
		var url = this.getDb().getURLServer() + '/_users/' + id;
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				callback(undefined, JSON.parse(this.responseText));
			},
			onerror: function(e){
				callback(JSON.parse(this.responseText), undefined);
			}
		});
		client.open("GET", url);
		
		client.setRequestHeader("Authorization", 'Basic ' + this.getUser().getBase64());
		client.setRequestHeader("Accept", 'application/json');
		
		client.send();
	}
};

exports.Georep = Georep;

// -- Funzioni ausiliare per GEOREP


/**
 * Controlla che un oggetto <code>georepConf</code> sia corretto.
 * @private
 * @method georepConfValidator
 * @param {object} gc oggetto <code>georepConf</code> da controllare
 * @return {boolean} <code>true</code> se l'oggetto è valido,
 *                   <code>false</code> altrimenti.
 */
var georepConfValidator = function (gc) {
	if (!gc)
		throw {
			error: 'a georepConf object is required',
			georepConf: gc
		};
	else if (!gc.db   || !(gc.db   instanceof DB)   ||
	         !gc.user || !(gc.user instanceof User)  )
		throw {
			error: 'some georepConf properties are invalid',
			georepConf: gc
		};
	else
		return true;
};

/**
 * Controlla che un oggetto che rappresenta un punto sulla mappa sia corretto.
 * @private
 * @method mapPointValidator
 * @param {object} point oggetto da controllare
 * @return {boolean} <code>true</code> se l'oggetto è valido,
 *                   <code>false</code> altrimenti.
 */
var mapPointValidator = function (point) {
	return !(typeof point != 'object' ||
	!point.lng || typeof point.lng != 'number'|| point.lng < -180 || point.lng > 180 ||
	!point.lat || typeof point.lat != 'number'|| point.lat <  -90 || point.lat >  90  );
};

/**
 * Prepara il giusto url da usare per l'invio di una richiesta di registrazione dell'utente locale.
 * Per comporre l'URL usa le informazioni sul server NodeJS specificate nelle costanti.
 * @private
 * @method makeSignupUrlRequest
 * @param {Object} georepObj istanza dell'oggetto Georep che usa la funzione.
 * @return {String} URL al quale inviare la richiesta.
 */
var makeSignupUrlRequest = function (georepObj) {
	return constants.nodeJsServer.proto + '://' +
		   (constants.nodeJsServer.ip ? constants.nodeJsServer.ip : georepObj.getDb().getHost()) + ':' +
		   constants.nodeJsServer.port + '/_users';
};

// -- COSTANTI utilizzate nel resto del codice ---------------------------------

var constants = {
	// vettore contenente l'elenco dei designDoc usati
	designDocs: [
		{
			name: 'queries', // nome di questo design document
			handlers: [ // vettore dei gestori delle diverse views
				{
					name: '_view', // gestore delle views map-reduce
					views: ['allDocsByUser','allDocsByDate'] // elenco delle views gestite da questo gestore
				},
				{
					name: '_spatial', // gestore delle views spaziali di geocouch
					views: ['allDocsByLoc'] // elenco delle views spaziali
				}
			]
		}
	],
	// queste info sono utilizzate per comporre l'URL utilizzato nell'invio
	// delle richieste di signup 
	nodeJsServer: {
		proto: 'http',
		// se ip == undefined viene usato l'ip specificato nell'istanza di DB usata nell'istanza di georep
		ip: undefined,
		port: 1337
	}
};

