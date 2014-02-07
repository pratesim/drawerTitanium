var win = $.winrepodetail;
var actionBar; 
var service = Alloy.Globals.Georep;
var downloaded = []; //vettore necessario per capire se sono stati scaricati sia i dati del segnalatore sia la segnalazione

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
    data: "",
    loc: {
    	latitude: "",
    	longitude: ""
    }
};

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


	// provo a scaricare dati del segnalatore
	service.getUserById(Alloy.Globals.query.userId, function (err, data){
		if (err){
			Ti.API.info("Impossibile scaricare dati segnalatore dal server");
			Ti.API.debug(JSON.stringify(err));
			// se non li scarico provo a caricarli da locale
			var localReporter = Ti.App.Properties.getString(Alloy.Globals.query.userId, "null");
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
				//se la scarico con successo provo a scaricare l'immagine
				// scarico l'immagine della segnalazione e la salvo in un file
				var xhr = Titanium.Network.createHTTPClient({
					onload: function() {
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
						$.repoimage.image = f.nativePath;
						/*$.repoimage.image = imgBlob;*/
						
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
							segnalazioneLocale.data = data.date;
							segnalazioneLocale.loc.latitude = data.loc.latitude;
							segnalazioneLocale.loc.longitude = data.loc.longitude;
							segnalazioneLocale.img = f.nativePath;
							Ti.App.Properties.setString(data._id, JSON.stringify(segnalazioneLocale));
							
							var localeOk = Ti.App.Properties.getString(data._id, "null");
							localeOk != "null" ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");
							
							win.fireEvent("repoDownloaded", {downloaded: "repo"});
						});	
					},
					onerror: function(e){
						Ti.API.info("impossibile scaricare l'immagine dal server");
						Ti.API.debug(JSON.stringify(e));
						$.repodetailpb.hide();
						alert("Immagine segnalazione non disponibile");
					}
				});
				
				var db = service.getDb();
				var uri = db.getProto() + "://" + db.getHost() + ":" + db.getPort() + "/" + db.getName() + "/" + Alloy.Globals.query.repoId + "/" + "img";
				Ti.API.debug("URI allegato: " + uri);
				xhr.setRequestHeader("Authorization", "Basic " + service.getUser().getBase64());
				xhr.open('GET', uri);
				xhr.send();
			}
		});
	}
	else {
		//se c'è la carico da locale
		Ti.API.info("Segnalazione con id: " + Alloy.Globals.query.repoId + " presente in locale");
		Ti.API.debug(localRepo);
		
		var jsonRepo = JSON.parse(localRepo);
		
		$.repoimage.image = jsonRepo.img;
		$.titlelabel.setText(jsonRepo.title);		
		$.descriptionlabel.setText(jsonRepo.msg);
		$.coordlatlabel.setText(Alloy.Globals.decToSes(jsonRepo.loc.latitude) + " °N");
		$.coordlonlabel.setText(Alloy.Globals.decToSes(jsonRepo.loc.longitude) + " °E");
		$.datalabel.setText(Alloy.Globals.dataToString(jsonRepo.data));
		$.addresslabel.setText(jsonRepo.indirizzo);
		win.fireEvent("repoDownloaded", {downloaded: "repo"});
	}
});
	
/* funzione eseguita quando viene premuto il tasto ok sulla alert che conferma l'invio della segnalazione */
function alertconfsend (ev) {
  win.close();
}
