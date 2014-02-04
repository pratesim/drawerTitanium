var localUserData = Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA);

var inputNick = $.newUser.getChildren()[2].getChildren()[0].getChildren()[2];
var inputMail = $.newUser.getChildren()[2].getChildren()[1].getChildren()[2];

if (localUserData){
    inputNick.setValue(localUserData.nick);
    inputNick.setEnabled(false);

    inputMail.setValue(localUserData.mail);
}

$.ok.addEventListener('click',function(evt){
    Ti.API.debug("evento click su OK: " + JSON.stringify(evt));

    var dialog = Ti.UI.createAlertDialog({
        ok: 'OK',
        title: 'Errore'
    });

    var progress = Ti.UI.Android.createProgressIndicator({
        message: 'Loading...',
        location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
        type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
        cancelable: false
    });

    // se non c'è connessione mostro il messaggio di errore
    // e simulo il click sul tasto 'Annulla' della view.
    if(!Ti.Network.getOnline()){
        Ti.API.info("getOnline(): FALSE");
        dialog.setTitle("Errore Di Rete");
        dialog.setMessage("Connessione Internet assente");
        dialog.addEventListener('click', function(evt){
            Ti.API.debug("evento click su dialog: " + JSON.stringify(evt));
            $.cancel.fireEvent('click');
        });
        dialog.show();
    }else{
        Ti.API.info("getOnline(): TRUE");
        if (!inputNick.getValue() || !inputMail.getValue()){
        // errore dati immessi dall'utente.
            Ti.API.info("newUser Window: valori di input NON validi.");
            Ti.API.debug("newUser Window:   nickname = " + inputNick.getValue());
            Ti.API.debug("newUser Window:   email    = " + inputMail.getValue());
            dialog.setMessage('Inserire un valore sia per \'NICK NAME\' che per \'E-MAIL\'.');
            dialog.show();
            Ti.API.info("newUser Window: mostrata AlertDialog");
        }else{
        // dati immessi ok
        // ora bisogna vedere cosa fare con questi dati:
        //  1. siamo al primo avvio e bisogna creare un nuovo utente sul server;
        //  2. avvio successivo e si vuole aggiornare solo la e-mail dell'utente.

            Ti.API.info("newUser Window: valori di input validi.");
            Ti.API.debug("newUser Window:   nickname = " + inputNick.getValue());
            Ti.API.debug("newUser Window:   email    = " + inputMail.getValue());

            if(!localUserData){
            // siamo nel caso 1. nuovo utente
                Ti.API.info("newUser Window: dati utente locali NON presenti.");
                Ti.API.debug("newUser Window:   localUserData = " + JSON.stringify(localUserData));

                // configuro l'utente georep con i valori inseriti dall'utente.
                Alloy.Globals.Georep.getUser().nick = inputNick.getValue();
                Alloy.Globals.Georep.getUser().mail = inputMail.getValue();

                // si tenta la registrazione dell'utente.
                progress.setMessage("Registrazione...");
                progress.show();
                Alloy.Globals.Georep.signupRemoteUser(function(err,data){
                    progress.hide();
                    if(!err){
                    // utente registrato con successo, bisogna creare i dati locali.
                        Ti.API.info("newUser Window: utente registrato");
                        Ti.API.debug("newUser Window:   data = " + JSON.stringify(data));

                        // creo i dati locali persistenti
                        Ti.App.Properties.setObject(Alloy.Globals.Constants.LOCAL_USER_DATA,{
                            nick: inputNick.getValue(),
                            mail: inputMail.getValue()
                        });
                        Ti.API.info("newUser Window: dati locali creati.");
                        Ti.API.debug("newUser Window:   localUserData = " + JSON.stringify(Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA)));

                        // mostro un toast che avvisa della registrazione.
                        var toast = Ti.UI.createNotification({
                            message: "Dispositivo registrato",
                            duration: Ti.UI.NOTIFICATION_DURATION_SHORT
                        });
                        toast.show();

                        Ti.App.fireEvent(Alloy.Globals.CustomEvents.USER_REGISTERED);
                        $.newUser.close();

                    }else{
                    // errore, bisogna però vedere se è per colpa del nick già utilizzato
                        if (err.duplicate){
                            Ti.API.info("newUser Window: Errore Nick duplicato.");
                            Ti.API.debug("newUser Window:   nick = " + inputNick.getValue());

                            // avviso l'utente del nick duplicato.
                            dialog.setMessage("Il nick \'" + inputNick.getValue() + "\' è già utilizzato.\nScegli un altro nickname.");

                            // si rimane in questa view.
                        }else{
                            Ti.API.info("newUser Window: Errore server.");
                            Ti.API.debug("newUser Window:   err = " + JSON.stringify(err));

                            // avviso dell'errore
                            dialog.setMessage("Errore di comunicazione con il server.\nProvare più tardi.");
                            dialog.show();

                            // chiudo sa window
                            $.newUser.close();
                        }
                    }
                });

            }else{
            // siamo nel caso 2. dobbiamo aggiornare il valore della email se viene modificato.
                Ti.API.info("newUser Window: dati utente locali presenti.");
                Ti.API.debug("newUser Window:   localUserData = " + JSON.stringify(localUserData));

                var newDataUser = {
                    nick: inputNick.getValue(),
                    mail: inputMail.getValue()
                };

                Ti.API.debug("newUser Window: newDataUser = " + JSON.stringify(newDataUser));

                // aggiorno la mail se quella inserita è diversa da quella solita.
                if (newDataUser.mail != localUserData.mail){
                    Ti.API.info("newUser Window: nuova email da aggiornare.");
                    Ti.API.debug("newUser Window:   oldEmail = " + JSON.stringify(localUserData.mail));
                    Ti.API.debug("newUser Window:   newEmail = " + JSON.stringify(newDataUser.mail));

                    progress.setMessage("Aggiornamento...");
                    progress.show();
                    Alloy.Globals.Georep.updateRemoteUser(newDataUser,function(err,data){
                        progress.hide();
                        if(!err){
                        // email aggiornata!

                            // aggiorno solo i dati locali ma non georep perchè 'updateRemoteUser' lo aggiorna da solo.
                            Ti.App.Properties.setObject(Alloy.Globals.Constants.LOCAL_USER_DATA, newDataUser);

                            Ti.API.info("newUser Window: email aggiornata.");
                            Ti.API.debug("newUser Window:   data = " + JSON.stringify(data));

                            // mostro un toast che avvisa dell'aggiornamento eseguito
                            var toast = Ti.UI.createNotification({
                                message:"e-mail aggiornata a \'" + newDataUser.mail + "\'",
                                duration: Ti.UI.NOTIFICATION_DURATION_SHORT
                            });
                            toast.show();

                            // chiusto la window
                            $.newUser.close();
                        }else{
                        // errore, impossibile aggiornare.

                            Ti.API.info("newUser Window: impossibile aggioranre l'email (errore server)");
                            Ti.API.debug("newUser Window:   err = " + JSON.stringify(err));

                            // avviso dell'errore
                            dialog.setMessage("Errore di comunicazione con il server.\nProvare più tardi.");
                            dialog.show();

                            // chiudo sa window
                            $.newUser.close();
                        }
                    });
                }else{
                // nessuna modifica nella mail, inutile aggiornare.
                    Ti.API.info("newUser Window: nessuna modifica da salvare");
                    Ti.API.debug("newUser Window:   oldEmail = " + JSON.stringify(localUserData.mail));
                    Ti.API.debug("newUser Window:   newEmail = " + JSON.stringify(newDataUser.mail));

                    // chiudo la window
                    $.newUser.close();
                }
            }
        }
    }

});

$.cancel.addEventListener('click',function(evt){
    Ti.API.debug("evento click su ANNULLA: " + JSON.stringify(evt));
    if (localUserData){
        $.newUser.close();
    }else{
        var activity = Titanium.Android.currentActivity;
        activity.finish();
    }
});

$.newUser.open();
