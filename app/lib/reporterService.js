var service = Alloy.Globals.Georep;

// questo servizio
var reporter = Titanium.Android.currentService;

// intent associato a questo servizio
var intent = reporter.intent;

// documento segnalazione da inviare
var doc = JSON.parse(intent.getStringExtra("localRepo"));

// foto in binario da salvare in locale la prendiamo da
// Alloy.Globals.photoBlob

// notifica per l'inizio dell'upload
var uploadingNotif = Ti.Android.createNotification({
    contentTitle: 'Invio segnalazione...',
    contentText: 'Invio della segnalazione \'' + doc.title + '\' in corso.',
    flag: Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_ONGOING_EVENT,
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

/*
 * Converte una segnalazione locale in una segnalazione da inviare al server
 * @param segnalazioneLocale {object} segnalazioneLocale da convertire
 */
var convertLclRepo = function (segnalazioneLocale){
    var segnalazioneConvertita = {
        title: "",
        msg: "",
        img: {
            content_type: "",
            data: ""
        },
        loc: {
            latitude: "",
            longitude: ""
        }
    }
    var f; //file object
    var pictureBase64;
    var pictureBlob;

    segnalazioneConvertita.title = segnalazioneLocale.title;
    segnalazioneConvertita.msg = segnalazioneLocale.msg;
    segnalazioneConvertita.loc.latitude = segnalazioneLocale.loc.latitude;
    segnalazioneConvertita.loc.longitude = segnalazioneLocale.loc.longitude;

    f = Ti.Filesystem.getFile(segnalazioneLocale.img);
    pictureBlob = f.read();
    pictureBase64 = Ti.Utils.base64encode(pictureBlob);

    segnalazioneConvertita.img.content_type = pictureBlob.getMimeType();
    segnalazioneConvertita.img.data = pictureBase64.text;

    return segnalazioneConvertita;
};
// segnalazione da inviare al server
var segnalazione = {
    title: "",
    msg: "",
    img: {
        content_type: "",
        data: ""
    },
    loc: {
        latitude: "",
        longitude: ""
    }
};

Titanium.API.info("Reporter Service.  segnalazioneLocale: " + JSON.stringify(doc));

segnalazione = convertLclRepo(doc);

Ti.API.info("Reporter Service. segnalazione da inviare al server: "  + JSON.stringify(segnalazione));

// inizio upload
notifUploading();
service.postDoc(segnalazione, true, function(err, data){
    if (err){
        // se la segnalazione non è stata inviata avviso con un messaggio di errore
        // e notifico l'evento.
        Ti.API.debug("Reporter Service - postDoc fallita: " + JSON.stringify(err));

        /*Alloy.Globals.photoBlob = undefined;*/

        // cancello il file contentente l'immagine della segnalazione, dato che la segnalazione
        // non è stata inviata sul server e quindi non serve mantenere l'immagine in locale.
        var f = Ti.Filesystem.getFile(doc.img);
        if (f.isFile()) {
            f.deleteFile();
        }
        // termino upload con errore
        notifError();
        reporter.stop();
    }
    else{
        // se la segnalazione è stata inviata avviso l'avvenuto successo, salvo la segnalazione in locale e chiudo la window
        Ti.API.info("Reporter Service - Segnalazione Inviata correttamente: " + JSON.stringify(data));

        Ti.Geolocation.reverseGeocoder(doc.loc.latitude, doc.loc.longitude, function (address){
            Ti.API.debug("Reporter Service - traduzione coordinate: " + JSON.stringify(address));
            var indirizzo = address.success == true ? address.places[0].displayAddress : "Non disponibile";

            doc.indirizzo = indirizzo;
            doc._id = data.id;
            Ti.App.Properties.setString(data.id, JSON.stringify(doc));
            Ti.API.debug("data.id = " + data.id);

            var localeOk = Ti.App.Properties.getString(data.id, "null");
            localeOk != "null" ? Ti.API.info("Segnalazione salvata in locale: " + localeOk) : Ti.API.info("Segnalazione locale NON riuscita");

            /*Alloy.Globals.photoBlob = undefined;*/

            // termino upload con successo
            notifCompleting();
            reporter.stop();
        });
    }
});