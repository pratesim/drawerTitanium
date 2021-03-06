var win = $.winrepodetail;
var actionBar; 
var service = Alloy.Globals.Georep;
var downloaded = []; //vettore necessario per capire se sono stati scaricati sia i dati del segnalatore sia la segnalazione
var repoCoords = {};

var segnalatoreLocale = {
	nick: "",
	mail: ""
};
var segnalazioneLocale = {
	indirizzo: "",
    _id: "",
    title: "",
    msg: "",
    img: "",
    date: "",
    loc: {
    	latitude: "",
    	longitude: ""
    }
};

function downloadImg(data) {
    var xhr = Titanium.Network.createHTTPClient({
        onload: function () {
            // first, grab a "handle" to the file where you'll store the downloaded data
            var d = new Date();
            var n = d.getTime();
            //new file name
            var newFileName = n + ".jpeg";

            Ti.API.info("Tipo blob: " + this.responseData.mimeType);

            var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, newFileName);
            var writeOk = f.write(this.responseData);

            writeOk == true ? Ti.API.info("file salvato correttamente nel path: " + f.nativePath) : Ti.API.info("file non salvato");
            Ti.API.info("Immagine scaricata");
            // tutta la segnalazione è stata scaricata correttamente allora la salvo in locale
            Ti.API.info("Segnalazione scaricata con successo: " + JSON.stringify(data));

            loadRepo(data, f.nativePath);
        },
        onerror: function (e) {
            Ti.API.info("impossibile scaricare l'immagine dal server");
            Ti.API.debug(JSON.stringify(e));
            loadRepo(data, "null");
            $.toast.show();
        }
    });

    var db = service.getDb();
    var uri = db.getProto() + "://" + db.getHost() + ":" + db.getPort() + "/" + db.getName() + "/" + Alloy.Globals.query.repoId + "/" + "img";
    Ti.API.debug("URI allegato: " + uri);
    xhr.setRequestHeader("Authorization", "Basic " + service.getUser().getBase64());
    xhr.open('GET', uri);
    xhr.send();
}

win.addEventListener("open", function() {
	Ti.API.info('Window "dettagli segnalazione" aperta');
    if (Ti.Platform.osname === "android") {
        if (! $.winrepodetail.activity) {
            Ti.API.error("Can't access action bar on a lightweight window.");
        } else {
            actionBar = $.winrepodetail.activity.actionBar;
            if (actionBar) {
                actionBar.icon = "/images/icon.png";
                actionBar.title = "Degrado Ambientale";
                actionBar.navigationMode = Ti.Android.NAVIGATION_MODE_STANDARD;
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    Ti.API.info("Home icon clicked!");
                    Alloy.Globals.mapCenter = undefined;
                    $.winrepodetail.close();
                };
            }
        }
    }
    $.repodetailpb.show();
    
    win.addEventListener("repoDownloaded", function(event){
		downloaded.push(event.downloaded);
		Ti.API.info("Evento repoDownloaded catturato.\n\tDati scaricati: " + downloaded);
		if (downloaded.length == 2){
			Ti.API.info("Scaricati sia dati segnalatore sia segnalazione. Terminare animazione caricamento");
			$.repodetailpb.hide();
			downloaded = [];
	    }
	});

	
	if(Titanium.Network.getOnline() == true){
		// se sono online provo a scaricare dati del segnalatore, in modo da avere la mail più aggiornata possibile
		service.getUserById(Alloy.Globals.query.userId, function (err, data){
			if (err){
				Ti.API.info("Impossibile scaricare dati segnalatore dal server");
				Ti.API.debug(JSON.stringify(err));
				// se non li scarico provo a caricarli da locale
				
				loadLocalReporter(Alloy.Globals.query.userId);
			}
			else{
				// se li scarico li salvo in locale
				Ti.API.info("Dati segnalatore scaricati correttamente");
				Ti.API.debug(JSON.stringify(data));
				segnalatoreLocale.nick = data.nick;
				segnalatoreLocale.mail = data.mail;
				$.nicklabel.setText(data.nick);
				$.maillabel.setText(data.mail);
				Ti.App.Properties.setString(Alloy.Globals.query.userId, JSON.stringify(segnalatoreLocale));
				Ti.API.info("Dati segnalatore salvati localmente");
				win.fireEvent("repoDownloaded", {downloaded: "reporter"});
			}
		});
	}
	else {
		// se sono offline provo direttamente a caricare i dati del segnalatore da locale
		loadLocalReporter(Alloy.Globals.query.userId);
	}
	
	// cerco segnalazione in locale
	var localRepo = Ti.App.Properties.getString(Alloy.Globals.query.repoId, "null");
	
	if (localRepo == "null"){
		Ti.API.info("Segnalazione con id: " + Alloy.Globals.query.repoId + " non presente in locale");
		//se non c'è provo a scaricarla dal server
		service.getDoc(Alloy.Globals.query.repoId, false, function(err, data){
			if(err){
				//se non la scarico con successo alert di errore
				$.repodetailpb.hide();
				Ti.API.debug("Errore Server: " + JSON.stringify(err));
				$.dialog.show();
			}
			else{
                repoCoords.latitude = data.loc.latitude;
                repoCoords.longitude = data.loc.longitude;
				//se la scarico con successo provo a scaricare l'immagine
				// scarico l'immagine della segnalazione e la salvo in un file
                downloadImg(data);
            }
		});
	}
	else {
		//se c'è la carico da locale
		Ti.API.info("Segnalazione con id: " + Alloy.Globals.query.repoId + " presente in locale");
		Ti.API.debug(localRepo);
		
		var jsonRepo = JSON.parse(localRepo);

        repoCoords.latitude = jsonRepo.loc.latitude;
        repoCoords.longitude = jsonRepo.loc.longitude;

        $.titlelabel.setText(jsonRepo.title);
        $.descriptionlabel.setText(jsonRepo.msg);
        $.coordlatlabel.setText(Alloy.Globals.decToSes(jsonRepo.loc.latitude) + " °N");
        $.coordlonlabel.setText(Alloy.Globals.decToSes(jsonRepo.loc.longitude) + " °E");
        $.datalabel.setText(Alloy.Globals.dataToString(jsonRepo.date));
        $.addresslabel.setText(jsonRepo.indirizzo);
		$.repoimage.image = jsonRepo.img;

        var imgClick = function(e){
            Ti.API.info('repoimage CLICK');
            $.repodetailpb.show();
            win.fireEvent("repoDownloaded", {downloaded: "reporter"});
            downloadImg(jsonRepo);
            $.repoimage.removeEventListener("click", imgClick);
        };

        if (jsonRepo.img == '/reloadPhoto.png'){
            $.repoimage.addEventListener("click", imgClick);
        }

		win.fireEvent("repoDownloaded", {downloaded: "repo"});
	}
});
	
/* funzione eseguita quando viene premuto il tasto ok sulla alert che conferma l'invio della segnalazione */
function alertconfsend (ev) {
  win.close();
}

/* carica la segnalazione data nella scrollView e la salva localmente
 * @data: oggetto contenente i dati della segnalazione da caricare
 * @fileImg: URL del file dove è stata salvata l'immagine della segnalazione.
 *           se fileImg == "null" la segnalazione verrà caricata con l'immagine di default /reloadPhoto.png
 */ 
function loadRepo(data, fileImg){
    if (fileImg == "null"){
        var imgClick = function (e){
            $.repodetailpb.show();
            win.fireEvent("repoDownloaded", {downloaded: "reporter"});
            downloadImg(data);
            $.repoimage.removeEventListener("click", imgClick);
        }
        $.repoimage.image = '/reloadPhoto.png';
        $.repoimage.addEventListener("click",imgClick);
    }
    else {
        $.repoimage.image = fileImg;
    }
	$.descriptionlabel.setText(data.msg);
	$.coordlatlabel.setText(Alloy.Globals.decToSes(data.loc.latitude) + " °N");
	$.coordlonlabel.setText(Alloy.Globals.decToSes(data.loc.longitude) + " °E");
	$.titlelabel.setText(data.title);
	$.datalabel.setText(Alloy.Globals.dataToString(data.date));
	
	Ti.Geolocation.reverseGeocoder(data.loc.latitude, data.loc.longitude, function (address){
		Ti.API.debug("traduzione coordinate: " + JSON.stringify(address));
		var indirizzo = address.success == true ? address.places[0].displayAddress : "Non disponibile";
		$.addresslabel.setText(indirizzo);
		
		// salvo in locale la segnalazione
		segnalazioneLocale._id = data._id;
		segnalazioneLocale.indirizzo = indirizzo;
		segnalazioneLocale.title = data.title;
		segnalazioneLocale.msg = data.msg;
		segnalazioneLocale.date = data.date;
		segnalazioneLocale.loc.latitude = data.loc.latitude;
		segnalazioneLocale.loc.longitude = data.loc.longitude;
		segnalazioneLocale.img = fileImg == "null" ? "/reloadPhoto.png" : fileImg;
		Ti.App.Properties.setString(data._id, JSON.stringify(segnalazioneLocale));
		
		var localeOk = Ti.App.Properties.getString(data._id, "null");
		localeOk != "null" ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");
		
		win.fireEvent("repoDownloaded", {downloaded: "repo"});
	});	
}

/* carica nella scrollview nick e mail del segnalatore salvati in locale se ci sono;
 * altrimenti setta nick e mail alla stringa "non disponibile"
 * @reporterId: identificatore del segnalatore di cui si vogliono caricare nick e mail
 */
function loadLocalReporter(reporterId){
	var localReporter = Ti.App.Properties.getString(reporterId, "null");
	if (localReporter == "null"){
		//  se non ci sono in locale errore
		$.nicklabel.setText("Non disponibile");
		$.maillabel.setText("Non disponibile");
		win.fireEvent("repoDownloaded", {downloaded: "reporter"});
	}
	else{
		// se ci sono in locale li mostro
		$.nicklabel.setText(JSON.parse(localReporter).nick);
		$.maillabel.setText(JSON.parse(localReporter).mail);
		win.fireEvent("repoDownloaded", {downloaded: "reporter"});
	}	
}

/*
 * gestore dell'evento click sul bottone nel menù della actionbar
 * dovrebbe chiudere questa finestra, settare nella variabile globale
 * Alloy.Globals.mapCenter le coordinate della segnalazione visualizzata e
 * far navigare il drawer sulla mappa.
 */
function goToMap(e){
    Ti.API.info("CLICK su \'Vedi sulla mappa\'.");
    Alloy.Globals.mapCenter = {
        latitude: repoCoords.latitude,
        longitude: repoCoords.longitude
    };
    Ti.API.debug("Nuovo centro globale: " + JSON.stringify(Alloy.Globals.mapCenter));

    // quando questa finestra viene chiusa, il focus torna a quella che contiene il drawer;
    // a quel punto viene catturato l'evento "focus" e se Alloy.Globals.mapCenter è settata
    // si navigherà direttamente alla mappa ricentrata.
    win.close();
}
