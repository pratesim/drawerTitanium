var controls=require('controls');
var rpcontrol = Alloy.Globals.repodetail; //controller per repodetail

// get main and menu view as objects
var menuView=controls.getMenuView();
var mainView=controls.getMainView();

var viewIds  = []; // vettore degli ID delle view switchabili
var switches = {}; // stati delle view switchabili.
var buttons  = {}; // riferimenti ai bottoni nel menù per le view switchabili
var icons    = {}; // per ogni view ci saranno i riferimenti all'icona scura e chiara.

// ritorna lo ID della view attualmente visualizzata
var getOn = function(){
    for (var p in switches)
        if (switches[p]) return p;
    return undefined;
};

// constrolla che lo ID sia uno di quelli delle view che si usano
var checkId = function(id){
    var ok = false;
    for (var i in viewIds){
        ok = ok || (viewIds[i] == id);
    }
    return ok;
};

// inizializza il sistema di switch inserendo gli ID delle view switchabili
// nell'apposito vettore e crea l'insieme delle variabili booleane per tracciare
// gli stati delle views.
// Inizializza anche il vettore con i riferimenti hai bottoni.
// inizializza anche l'oggetto con i riferimenti alle varie icone per i bottoni nel menù.
var initSwitcher = function(IDs, rowIDs, iconObjs){
    var views = controls.getMainView().mainView.getChildren(); // vettore di view in mainview
    var rows = menuView.menuView.getChildren()[2].getSections()[0].getRows(); // vettore delle righe del drawer
    var nViews = views.length;

    // inizializzo il vettore degli ID delle view
    for (var i in IDs)
        viewIds[i] = IDs[i];

    // inizializzo lo stato di ogni view segnano con TRUE la
    // view che è attualmente caricata nel drawer.
    for (var j in viewIds){
        var isThere = false;
        for (var i= 0; i<nViews; i++){
            isThere = isThere || viewIds[j] == views[i];
        }
        switches[viewIds[j]] = isThere;
    }

    // associo ogni ID di view con il riferimento al suo bottone nel menù del drawer
    // i riferimenti sono messi nell'oggetto 'buttons'.
    for (var k in viewIds){
        for (var r in rows){
            if (rows[r].id == rowIDs[k])
                buttons[viewIds[k]] = rows[r];
        }
    }

    // associo a ogni ID delle view un oggetto che contiene il path all'icona
    // chiara e scura da usare quando il tasto è selezionato o meno.
    // le associazioni finiscono nell'oggetto 'icons'.
    for (var k in viewIds){
        icons[viewIds[k]] = iconObjs[k];
    }
};

// carica nella mainView una nuova view con identificatore id.
var switchTo = function(id){
    Ti.API.info("Switching...");
    var currentViewId;

    if (!checkId(id))
        throw id + " non è un ID valido per il modulo switcher.";

    // l'ID della view attualmente visualizzata
    currentViewId = getOn();

    Ti.API.info("    currentViewId: " + currentViewId);
    Ti.API.info("    nextViewId   : " + id);
    if (currentViewId != id){
    // la view visualizzata è diversa da quella che si vuole aprire
        if (currentViewId){
        // effettivamente c'era una view già aperta, quindi bisogna rimuoverla e il
        // suo bottone va "scolorito".
            var childViews = mainView.mainView.getChildren();
            var currentView;

            for( var i in childViews){
                if (childViews[i].id == currentViewId)
                    currentView = childViews[i];
            }

            switches[currentViewId] = false;
            Ti.API.info("    switches." + currentViewId + " = " + switches[currentViewId]);

            // scolorisco il bottone della view che prima era visualizzata.
            buttons[currentViewId].setBackgroundColor("trasparent");
            // cambio il colore del testo del label relativo
            buttons[currentViewId].getChildren()[0].getChildren()[1].setColor("#59595C");
            // cambio l'icona mettendo quella scura
            buttons[currentViewId].getChildren()[0].getChildren()[0].setBackgroundImage(icons[currentViewId].dark);

            // rimuovo la view per fare posto a quella nuova.
            mainView.mainView.remove(currentView);
            Ti.API.info("    controls.getMainView().mainView.remove(" + currentView + ")");
        }

        // che sia presente una view nel drawer o meno, a questo punto il drawer è
        // vuoto e quindi bisogna caricare la view selezioneta dall'utente.

        var nextView = (Alloy.createController(id))[id];

        switches[id] = true;
        Ti.API.info("    switches." + id + " = " + switches[id]);

        // coloro il bottone della view selezionata.
        buttons[id].setBackgroundColor("#33B5E5");
        // cambio il colore del testo del label relativo
        buttons[id].getChildren()[0].getChildren()[1].setColor("white");
        // cambio l'icona mettendo quella chiara
        buttons[id].getChildren()[0].getChildren()[0].setBackgroundImage(icons[id].light);

        // carco la view selezionata nel drawer.
        mainView.mainView.add(nextView);
        Ti.API.info("    controls.getMainView().mainView.add(" + nextView + ")");
    }
};

/**
 * Aggiorna la configurazine dell'utene di Georep
 * usando le info locali permanenti.
 */
function updateGeorepUser(){
    var georepUser = Alloy.Globals.Georep.getUser();
    try{
        georepUser.update({
            name: georepUser.getName(),
            password: georepUser.getPassword(),
            nick: Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA).nick,
            mail: Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA).mail
        });
    }catch (e){
        Ti.API.debug("Errore aggiornamento utente georep\n" + JSON.stringify(e));

    }
    Ti.API.info("updateGeorepUser(): Utente Georep aggiornato dai dati locali");
    Ti.API.debug("  Georep.getUser(): " + JSON.stringify(Alloy.Globals.Georep.getUser()));
}

// inizializzo il sistema di switching.

// vettore con gli ID delle view che verrano gestite dal sistema di switching
var switchableViewIDs = ['map','last','my'];
// vettore con gli ID delle righe del menù relative alle finestre gestite dal sistema di switching
var switchableRowIDs  = ['row1','row2','row3'];
// vettore delle icone da usare nel menù per ogni riga.
var switchableIconIDs = [
    {   // icone per map
        light: "/images/ic_action_map_white.png",
        dark: "/images/ic_action_map.png"
    },{ // icone per last
        light: "/images/ic_action_time_white.png",
        dark: "/images/ic_action_time.png"
    },{ // icone per my
        light: "/images/ic_action_view_as_list_white.png",
        dark: "/images/ic_action_view_as_list.png"
    }];
initSwitcher(switchableViewIDs,switchableRowIDs,switchableIconIDs);

// add event listener in this context
menuView.menuTable.addEventListener('click',function(e){
	$.drawermenu.showhidemenu();
    var rowId = e.rowData.id;

    if(rowId == 'row1'){
        switchTo('map');
    }else if(rowId == 'row2'){
        switchTo('last');
    }else if(rowId == 'row3'){
        switchTo('my');
    }else if(rowId == 'row4'){
        Alloy.createController('newUser').newUser.open();
    }else if(rowId == 'rowReporting'){
    	Alloy.createController('reporting').winreporting.open();
    }
});

// add menu view to container exposed by widget
$.drawermenu.drawermenuview.add(menuView.getView()); // get view is an Alloy Method

// attach event listener to menu button
mainView.menuButton.add(controls.getMenuButton({
	h: '60dp',
	w: '60dp'
}));
mainView.menuButton.addEventListener('click',$.drawermenu.showhidemenu); // method is exposed by widget

// add view to container exposed by widget
$.drawermenu.drawermainview.add(mainView.getView());

// appena scopro che l'utente è registrato sul server
// apro il drawer.
Ti.App.addEventListener(Alloy.Globals.CustomEvents.USER_REGISTERED, function(evt){

    // mostro un messaggio di benvenuto
    Ti.UI.createNotification({
        message: "Benvenuto!\n" + evt.nick + " (" + evt.mail + ")",
        duration: Ti.UI.NOTIFICATION_DURATION_LONG
    }).show();

    // apro la view del drower
    $.index.open();
    // dopo l'avvio entra automaticamente nella view delle ultime segnalazioni.
    switchTo('last');
});

// inizializzo una animazione di caricamento
var progress = Ti.UI.Android.createProgressIndicator({
    message: 'Loading...',
    location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
    cancelable: false
});

// Controllo la presenza dei dati locali dell'utente.
var userLocalData = Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA, undefined);

if (userLocalData == undefined){
// due casi possibili:
//  1. primo avvio in assoluto della app;
//  2. avvio della app dopo aver cancellato i suoi dati
    Ti.API.info("Controllo dati utente locali: FAIL");
    Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));

    if (Ti.Network.getOnline()){
    // se c'è connessione internet allora possiamo procedere regolarmente
        Ti.API.info("getOnline(): TRUE");

        // controllo se l'utente locale è già registrato in remoto
        progress.setMessage("Login...");
        progress.show();
        Alloy.Globals.Georep.checkRemoteUser(function(err, data){
            if(!err){
                Ti.API.info("checkRemoteUser(): SUCCESS");
                Ti.API.debug("  data: " + JSON.stringify(data));
                if (data.isRegistered){
                // siamo nel caso 2. (nessuno dato locale)

                    Ti.API.info("checkRemoteUser(): Utente GIA\' registrato.");
                    // vedo di recuperare i dati dell'utente dal server per salvarli
                    // in locale.
                    Alloy.Globals.Georep.getRemoteUser(function(err,data){
                        progress.hide();
                        if(!err){
                            Ti.API.info("getRemoteUser(): SUCCESS");
                            Ti.API.debug("  data: " + JSON.stringify(data));
                            var uld = {
                                nick: data.nick,
                                mail: data.mail
                            };
                            Ti.App.Properties.setObject(Alloy.Globals.Constants.LOCAL_USER_DATA,uld);
                            Ti.API.info("getRemoteUser(): dati utente scaricati e salvati");
                            Ti.API.debug("  userLocalData: " + JSON.stringify(uld));

                            // aggiorno la configurazione di georep
                            updateGeorepUser();

                            // segnalo che l'utente è registrato.
                            Ti.App.fireEvent(Alloy.Globals.CustomEvents.USER_REGISTERED, uld);
                        }else{
                            var dialog = Ti.UI.createAlertDialog({
                                message: 'Errore comunicazione con il server',
                                ok: 'OK',
                                title: 'Errore Di Rete'
                            });
                            dialog.addEventListener('click',function(evt){
                                Ti.Android.currentActivity.finish();
                            });
                            Ti.API.info("getRemoteUser(): FAIL");
                            Ti.API.debug("  err: " + JSON.stringify(err));
                            // al click sulla dialog la app viene chiusa.
                            dialog.show();
                        }
                    });
                }else{
                // siamo nel caso 1. (primo avvio)

                    progress.hide();
                    Ti.API.info("checkRemoteUser(): Utente NUOVO");
                    // apro la view che su occupa di prendere i dati del nuovo utente.
                    Alloy.createController('newUser').newUser.open();
                }
            }else{
            // errore della checkRemoteUser()
                progress.hide();
                var dialog = Ti.UI.createAlertDialog({
                    message: 'Errore comunicazione con il server',
                    ok: 'OK',
                    title: 'Errore Di Rete'
                });
                dialog.addEventListener('click',function(evt){
                    Ti.Android.currentActivity.finish();
                });

                Ti.API.info("checkRemoteUser(): FAIL");
                Ti.API.debug("  err: " + JSON.stringify(err));
                // al click sulla dialog la app viene chiusa.
                dialog.show();
            }
        });
    }else{
        // senza connessione apriamo ugualmente il drawer per consultare i dati in cache.
        var dialog = Ti.UI.createAlertDialog({
            message: 'Nessuna connessione a Internet',
            ok: 'OK',
            title: 'Errore Di Rete'
        });
        dialog.addEventListener('click',function(evt){
            Ti.Android.currentActivity.finish();
        });

        dialog.show();
        Ti.API.info("getOnline(): FALSE");
    }
}else{
// in locale sono presenti i dati dell'utente, quindi l'utente è
// già registrato e questo non è il primo avvio della app.
    Ti.API.info("Controllo dati utente locali: SUCCESS");
    Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));

    // aggiorno la configurazione di georep
    updateGeorepUser();

    // segnalo che l'utente è registrato.
    Ti.App.fireEvent(Alloy.Globals.CustomEvents.USER_REGISTERED, userLocalData);
}
