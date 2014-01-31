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

// inizializzo il sistema di switching con i seguenti ID delle view da inter-switchare.
initSwitcher(['map','last','my']);

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

$.index.open();

// dopo l'avvio entra automaticamente nella view delle ultime segnalazioni.
switchTo('last');
