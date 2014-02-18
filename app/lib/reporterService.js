var service = Alloy.Globals.Georep;

// questo servizio
var reporter = Titanium.Android.currentService;

// intent associato a questo servizio
var intent = reporter.intent;

// documento segnalazione da inviare
var doc = JSON.parse(intent.getStringExtra("docToPost"));

// foto in binario da salvare in locale la prendiamo da
// Alloy.Globals.photoBlob

// notifica per l'inizio dell'upload
var uploadingNotif = Ti.Android.createNotification({
    contentTitle: 'Invio segnalazione...',
    contentText: 'Invio della segnalazione \'' + doc.title + '\' in corso.',
    flag: Titanium.Android.FLAG_NO_CLEAR,
    icon: Alloy.Globals.NotificationIcon.UPLOAD_START
});

// notifica per il termine dell'upload
var completeNotif = Ti.Android.createNotification({
    contentTitle: 'Segnalazione inviata',
    contentText: 'La segnalazione \'' + doc.title + '\' è stata inviata.',
    flag: Titanium.Android.FLAG_AUTO_CANCEL,
    icon: Alloy.Globals.NotificationIcon.UPLOAD_COMPLETE,
    defaults: Titanium.Android.DEFAULT_SOUND | Titanium.Android.DEFAULT_VIBRATE | Titanium.Android.DEFAULT_LIGHTS
});

// notifica per segnalare un errore nell'upload
var errorNotif = Ti.Android.createNotification({
    contentTitle: 'Errore invio',
    contentText: 'Errore durante l\'invio della segnalazione \'' + doc.title + '\'.',
    flag: Titanium.Android.FLAG_AUTO_CANCEL,
    icon: Alloy.Globals.NotificationIcon.UPLOAD_ERROR,
    defaults: Titanium.Android.DEFAULT_SOUND | Titanium.Android.DEFAULT_VIBRATE | Titanium.Android.DEFAULT_LIGHTS
});

// ID associato alle notifiche
var notifID = (new Date()).getTime();

/**
 * Aggiunge la notifica che segnala l'inizio dell'upload nella
 * barra delle notifiche
 */
var notifUploading = function(){
    Titanium.Android.NotificationManager.notify(notifID, uploadingNotif);
};

/**
 * Rimuove la notifica precedente e inserisce quella di upload completato
 * nella barra delle notifiche.
 */
var notifCompleting = function(){
    Titanium.Android.NotificationManager.cancel(notifID);
    Titanium.Android.NotificationManager.notify(notifID, completeNotif);
};

/**
 * Rimuove la notifica precedente e inserisce quella di errore upload
 * nella barra delle notifiche.
 */
var notifError = function(){
    Titanium.Android.NotificationManager.cancel(notifID);
    Titanium.Android.NotificationManager.notify(notifID, errorNotif);
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

Titanium.API.info("Reporter Service.  docToPost: " + JSON.stringify(doc));

// inizio upload
notifUploading();
service.postDoc(doc, true, function(err, data){
    if (err){
        // se la segnalazione non è stata inviata avviso con un messaggio di errore
        // e notifico l'evento.
        Ti.API.debug("Reporter Service - postDoc fallita: " + JSON.stringify(err));

        Alloy.Globals.photoBlob = undefined;

        // termino upload con errore
        notifError();
        reporter.stop();
    }
    else{
        // se la segnalazione è stata inviata avviso l'avvenuto successo, salvo la segnalazione in locale e chiudo la window
        Ti.API.info("Reporter Service - Segnalazione Inviata correttamente: " + JSON.stringify(data));

        var n = new Date().getTime();
        var newFileName = n + ".jpeg";   //new file name
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,newFileName);
        var writeOk = f.write(Alloy.Globals.photoBlob); // write to the file

        writeOk == true ? Ti.API.info("file salvato correttamente nel path: " + f.nativePath) : Ti.API.info("file non salvato");

        Ti.Geolocation.reverseGeocoder(doc.loc.latitude, doc.loc.longitude, function (address){
            Ti.API.debug("Reporter Service - traduzione coordinate: " + JSON.stringify(address));
            var indirizzo = address.success == true ? address.places[0].displayAddress : "Non disponibile";

            segnalazioneLocale._id = data.id; //id assegnato dal server couchdb alla segnalazione (disponibile nella risposta inviata dal server)
            segnalazioneLocale.title = doc.title;
            segnalazioneLocale.msg = doc.msg;
            segnalazioneLocale.data = new Date().getTime();
            segnalazioneLocale.img = f.nativePath;
            segnalazioneLocale.indirizzo = indirizzo;
            segnalazioneLocale.loc.latitude = doc.loc.latitude;
            segnalazioneLocale.loc.longitude = doc.loc.longitude;

            Ti.App.Properties.setString(data.id, JSON.stringify(segnalazioneLocale));
            Ti.API.debug("data._id = " + data._id + "\ndata.id = " + data.id);

            var localeOk = Ti.App.Properties.getString(data.id, "null");
            localeOk != "null" ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");

            Alloy.Globals.photoBlob = undefined;

            // termino upload con successo
            notifCompleting();
            reporter.stop();
        });
    }

});