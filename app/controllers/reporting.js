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
            Alloy.Globals.photoBlob = ImageFactory.compress(resizedMedia, 0.5);
            resizedMedia = undefined;
			// pictureBase64 verrà usata come attachments della segnalazione da inviare al server couchdb
			pictureBase64 = Ti.Utils.base64encode(Alloy.Globals.photoBlob);
			$.repoimage.setImage(Alloy.Globals.photoBlob);
		},
		cancel:function() {
			// called when user cancels taking a picture
			Ti.API.info("Foto scartata: premuto il tasto cancel");
            Alloy.Globals.photoBlob = undefined;
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
            Alloy.Globals.photoBlob = undefined;
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
	
	Ti.API.info("Titolo: " + title + "\nDescrizione: " + descr);
	Ti.API.debug("Foto Base64: " + pictureBase64);
	
	if (title == "" || descr == "" || pictureBase64 == ""){
		// se non sono completi avviso di completarli prima di inviare la segnalazione
		alert("Completare tutti i campi e scattare una foto prima di inviare la segnalazione!");
	}
	else{
		// se sono completi provo a leggere la posizione
		Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_HIGH); // imposto la precisione della posizione
		Ti.Geolocation.getCurrentPosition(function (location){
			if (location.success == false){
				// se non è possibile ottenere la posizione avviso con un messaggio di errore
				alert("Impossibile ottenere la posizione: " + location.error);
				Ti.API.debug("Impossibile ottenere la posizione. error code: " + location.code);
			}
			else{
				// se è stata ottenuta la posizione provo ad inviare la segnalazione
				Ti.API.info("Posizione letta correttamente: " + JSON.stringify(location));

                // completo i campi della segnalazione
                segnalazione.title = title;
				segnalazione.msg = descr;
				segnalazione.img.content_type = "image/jpeg";
				segnalazione.img.data = pictureBase64.text;
				segnalazione.loc.latitude = location.coords.latitude;
				segnalazione.loc.longitude = location.coords.longitude;

                // creo l'intento del servizio
                var intent = Titanium.Android.createServiceIntent({
                    url: 'reporterService.js',
                    startMode: Ti.Android.START_NOT_STICKY
                });

                // passo la segnalazione al servizio tramite il suo intento
                intent.putExtra('docToPost', JSON.stringify(segnalazione));

                // passo la foto in binario al servizio tramite il suo intento
                //intent.putExtra('photo', JSON.stringify(pictureBase64));

                // setto l'intervallo di ripetizione del servizio a 15 min così
                // sono abbastanza sicuro di riuscire a completare l'invio e fermare
                // il servizio prima che possa ripartire.
                intent.putExtra('interval', 900000);

                // creo un istanza del servizio di uploading
                var reporterService = Titanium.Android.createService(intent);

                // stampa informazioni una volta che il servizio viene attivato
                // viene mostrato anche un toast che avverte dell'inizio dell'uploading.
                reporterService.addEventListener('start', function(e) {
                    Titanium.API.info('Reporter Service avviato (start), iteration ' + e.iteration);
                    Ti.UI.createNotification({
                        message: 'Invio segnalazione \'' + segnalazione.title + '\' in corso.',
                        duration: Ti.UI.NOTIFICATION_DURATION_LONG
                    }).show();
                });

                // stampa informazioni una volta che il servizio viene arrestato
                reporterService.addEventListener('stop', function(e) {
                    Titanium.API.info('Reporter Service terminato (stop), iteration ' + e.iteration);
                });

                // stampa informazioni una volta che il servizio viene riavviato
                reporterService.addEventListener('resume', function(e) {
                    Titanium.API.info('Reporter Service riavviato (resume), iteration ' + e.iteration);
                });

                // avvio il servizio che si occupa di inviare la segnalazione e di salvarla
                // in locale.
                reporterService.start();

                // il servizio gira in backgroud quindi posso chiudere questa finestra.
                win.close();
			}
		});
	}	
};

function alertconfsend(){
    win.close();
};