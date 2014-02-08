var win = $.winreporting;
var actionBar; 
var service = Alloy.Globals.Georep;
var pictureBlob;
var pictureBase64 = "";
var ImageFactory = require('ti.imagefactory');

win.addEventListener("open", function() {
	Ti.API.info('Window "dettagli segnalazione" aperta');
    if (Ti.Platform.osname === "android") {
        if (! win.activity) {
            Ti.API.error("Can't access action bar on a lightweight window.");
        } else {
            actionBar = win.activity.actionBar;
            if (actionBar) {
                actionBar.icon = "/images/icon.png";
                actionBar.title = "Degrado Ambientale";
                actionBar.navigationMode = Ti.Android.NAVIGATION_MODE_STANDARD;
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    Ti.API.info("Home icon clicked!");
                    win.close();
                };
            }
        }
    }
});

function getPhoto(){
	Ti.Media.showCamera({
		success:function(event) {
			// called when media returned from the camera
			Ti.API.debug('Foto scattata con successo');
			// pictureBlob verrà usata dentro sendRepo per salvare localmente la foto in caso di invio con successo della segnalazione
            // ridimensione la foto scattata se supera le dimensioni di 2048x2048.
            var resizedMedia = Alloy.Globals.resizePhoto(event.media);
            // comprimo la foto ad un JPEG di qualità media (50%).
            pictureBlob = ImageFactory.compress(resizedMedia, 0.5);
			// pictureBase64 verrà usata come attachments della segnalazione da inviare al server couchdb
			pictureBase64 = Ti.Utils.base64encode(pictureBlob);
			$.repoimage.setImage(pictureBlob);
		},
		cancel:function() {
			// called when user cancels taking a picture
			Ti.API.info("Foto scartata: premuto il tasto cancel");
		},
		error:function(error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({title:'Camera'});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Il dispositivo non disponde di una fotocamera');
			} else {
				a.setMessage('Errore inatteso: ' + error.code);
			}
			a.show();
		},
		autohide: true,
		saveToPhotoGallery:false,
		allowEditing:false,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

function sendRepo(){
	//leggo i campi titolo, descrizione, foto, e controllo che siano tutti completi
	var title = $.titleinput.getValue();
	var descr = $.descriptioninput.getValue();
	//segnalazione da inviare
	var segnalazione = {
		title: "",
		msg: "",
		img: {
			content_type: "",
			data: "" //immagine in base64
		},
		loc: {
			latitude: "",
			longitude: ""
		}
	};
	// segnalazione da salvare in locale
	var segnalazioneLocale = {
		_id: "",
		title: "",
		msg: "",
		data: "",
		img: "", // filepath di dove è salvata l'immagine della segnalazione
		indirizzo: "", // coordinate tradotte in indirizzo
		loc: {
			latitude: "",
			longitude: ""
		}
	};
	
	Ti.API.info("Titolo: " + title + "\nDescrizione: " + descr);
	Ti.API.debug("Foto Base64: " + pictureBase64);
	
	if (title == "" || descr == "" || pictureBase64 == ""){
		// se non sono completi avviso di completarli prima di inviare la segnalazione
		alert("Completare tutti i campi e scattare una foto prima di inviare la segnalazione!");
	}
	else{
		$.progressIndicatorIndeterminant.show();
		// se sono completi provo a leggere la posizione
		Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_HIGH); // imposto la precisione della posizione
		Ti.Geolocation.getCurrentPosition(function (location){
			if (location.success == false){
				// se non è possibile ottenere la posizione avviso con un messaggio di errore
				$.progressIndicatorIndeterminant.hide();
				alert("Impossibile ottenere la posizione: " + location.error);
				Ti.API.debug("Impossibile ottenere la posizione. error code: " + location.code);
			}
			else{
				// se è stata ottenuta la posizione provo ad inviare la segnalazione
				Ti.API.info("Posizione letta correttamente: " + JSON.stringify(location));
				
				segnalazione.title = title;
				segnalazione.msg = descr;
				segnalazione.img.content_type = "image/jpeg";
				segnalazione.img.data = pictureBase64.text;
				segnalazione.loc.latitude = location.coords.latitude;
				segnalazione.loc.longitude = location.coords.longitude;
				
				try{
					service.postDoc(segnalazione, true, function(err, data){
						if (err){
							// se la segnalazione non è stata inviata avviso con un messaggio di errore
							$.progressIndicatorIndeterminant.hide();
							Ti.API.debug("postDoc fallita: " + JSON.stringify(err));
							alert("Invio segnalazione fallito!...Prova di nuovo");
						}
						else{
							// se la segnalazione è stata inviata avviso l'avvenuto successo, salvo la segnalazione in locale e chiudo la window
							Ti.API.info("Segnalazione Inviata correttamente: " + JSON.stringify(data));
							
							var n = new Date().getTime();
				            var newFileName = n + ".jpeg";   //new file name
							var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,newFileName);
							var writeOk = f.write(pictureBlob); // write to the file
							
							writeOk == true ? Ti.API.info("file salvato correttamente nel path: " + f.nativePath) : Ti.API.info("file non salvato");
							
							Ti.Geolocation.reverseGeocoder(location.coords.latitude, location.coords.longitude, function (address){
								Ti.API.debug("traduzione coordinate: " + JSON.stringify(address));
								var indirizzo = address.success == true ? address.places[0].displayAddress : "Non disponibile";
								
								segnalazioneLocale._id = data.id; //id assegnato dal server couchdb alla segnalazione (disponibile nella risposta inviata dal server)
								segnalazioneLocale.title = title;
								segnalazioneLocale.msg = descr;
								segnalazioneLocale.data = new Date().getTime();
								segnalazioneLocale.img = f.nativePath;
								segnalazioneLocale.indirizzo = indirizzo;
								segnalazioneLocale.loc.latitude = location.coords.latitude;
								segnalazioneLocale.loc.longitude = location.coords.longitude;
								
								Ti.App.Properties.setString(data.id, JSON.stringify(segnalazioneLocale));
								Ti.API.debug("data._id = " + data._id + "\ndata.id = " + data.id);

								var localeOk = Ti.App.Properties.getString(data.id, "null");
								localeOk != "null" ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");
								$.progressIndicatorIndeterminant.hide();
								$.dialog.show();
							});	
						}
						
					});
				}catch(e){Ti.API.debug(JSON.stringify(e));}
			}
		});
	}	
};

/* funzione eseguita quando viene premuto il tasto ok sulla alert che conferma l'invio della segnalazione */
function alertconfsend (ev) {
  win.close();
}
