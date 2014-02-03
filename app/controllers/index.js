var controls=require('controls');

// get main and menu view as objects
var menuView=controls.getMenuView();
var mainView=controls.getMainView();

var viewIds = [];  // vettore degli ID delle view switchabili
var switches = {}; // stati delle view switchabili.

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
var initSwitcher = function(IDs){
    var views = controls.getMainView().mainView.getChildren();
    var nViews = views.length;

    for (var i in IDs)
        viewIds[i] = IDs[i];

    for (var j in viewIds){
        var isThere = false;
        for (var i= 0; i<nViews; i++){
            isThere = isThere || viewIds[j] == views[i];
        }
        switches[viewIds[j]] = isThere;
    }
};

// carica nella mainView una nuova view con identificatore id.
var switchTo = function(id){
    Ti.API.info("Switching...");
    var currentViewId;

    if (!checkId(id))
        throw id + " non è un ID valido per il modulo switcher.";

    currentViewId = getOn();

    Ti.API.info("    currentViewId: " + currentViewId);
    Ti.API.info("    nextViewId   : " + id);
    if (currentViewId != id){
        if (currentViewId){
            var childViews = mainView.mainView.getChildren();
            var currentView;

            for( var i in childViews){
                if (childViews[i].id == currentViewId)
                    currentView = childViews[i];
            }

            switches[currentViewId] = false;
            Ti.API.info("    switches." + currentViewId + " = " + switches[currentViewId]);
            mainView.mainView.remove(currentView);
            Ti.API.info("    controls.getMainView().mainView.remove(" + currentView + ")");
        }
        var nextView = (Alloy.createController(id))[id];

        switches[id] = true;
        Ti.API.info("    switches." + id + " = " + switches[id]);
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

// inizializzo il sistema di switching con i seguenti ID delle view da inter-switchare.
initSwitcher(['map','last','my']);

// add event listener in this context
menuView.menuTable.addEventListener('click',function(e){
	$.drawermenu.showhidemenu();
    var rowId = e.rowData.id;
    Ti.API.debug("Drawer: cliccato su \'" + rowId + "\'");

    if(rowId == 'row1'){
        switchTo('map');
    }else if(rowId == 'row2'){
        switchTo('last');
    }else if(rowId == 'row3'){
        switchTo('my');
    }else if(rowId == 'row4'){
        Alloy.createController('newUser').newUser.open();
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
    // apro la view del drower
    $.index.open();
    // dopo l'avvio entra automaticamente nella view delle ultime segnalazioni.
    switchTo('last');
});

// Controllo la presenza dei dati locali dell'utente.
var userLocalData = Ti.App.Properties.getObject(Alloy.Globals.Constants.LOCAL_USER_DATA, undefined);

if (userLocalData == undefined){
// due casi possibili:
//  1. primo avvio in assoluto della app;
//  2. avvio della app dopo aver cancellato i suoi dati
    Ti.API.info("Controllo dati utente locali: FAIL");
    Ti.API.debug("  userLocalData: " + JSON.stringify(userLocalData));

    // controllo se l'utente locale è già registrato in remoto
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
                        alert("Errore comunicazione con il server");
                        Ti.API.info("getRemoteUser(): FAIL");
                        Ti.API.debug("  err: " + JSON.stringify(err));
                        // qui si potrebbe chiudere la app
                    }
                });
            }else{
            // siamo nel caso 1. (primo avvio)

                Ti.API.info("checkRemoteUser(): Utente NUOVO");
                // apro la view che su occupa di prendere i dati del nuovo utente.
                Alloy.createController('newUser').newUser.open();
            }
        }else{
            alert("Errore comunicazione con il server");
            Ti.API.info("checkRemoteUser(): FAIL");
            Ti.API.debug("  err: " + JSON.stringify(err));
            // qui si potrebbe chiudere la app
        }
    });
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
