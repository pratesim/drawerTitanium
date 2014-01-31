Ti.API.info("Mysection: ");
var service = Alloy.Globals.service;
var listSection = $.my.getSections()[0];
var MYLISTKEY = "mylistrepo";


	if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_NONE){
		// se non c'è connessione provo a caricare la lista locale'
		var items = Ti.App.Properties.getString(MYLISTKEY, "null");
			if (items  == "null"){
				//se non ho dati locali avverto l'utente della necessità di una connessione di rete
				alert("Necessaria connessione alla rete...");
			}
			else{
				listSection.setItems(JSON.parse(items));
			}
	}
	else{
		try{
			$.progressIndicatorIndeterminant.show();
			service.getUserDocs(service.getUserId(), function (err, data){
				if (!err){ // ricevuta risposta corretta
					
					$.progressIndicatorIndeterminant.hide();
					Ti.API.info("getUserDocs eseguita con successo");
					Ti.API.debug(JSON.stringify(data.rows));
					/*listSection.setItems(createItems(data.rows));*/
					
					Ti.API.info("Scaricate " + data.rows.length + " segnalazioni");
					$.progressIndicatorDeterminant.setMax(data.rows.length);
					$.progressIndicatorDeterminant.show();
					Ti.API.info("Partita seconda animazione");
					
					for (var tmp in data.rows){
						var item = createOneItem(data.rows[tmp]);
						Ti.API.debug(JSON.stringify(item));
						listSection.appendItems([item]);
						$.progressIndicatorDeterminant.value = tmp;
					}
					
					/* salvo la lista in locale, per poterla caricare in caso di assenza di connessione di rete */
					Ti.App.Properties.setString(MYLISTKEY, JSON.stringify(listSection.getItems()));
					Ti.API.debug("Lista locale : " + Ti.App.Properties.getString(MYLISTKEY));
					$.progressIndicatorDeterminant.hide();
					Ti.API.info("Items aggiunti alla lista");
				}
				else{
					// errore server (carico la lista locale)
					$.progressIndicatorIndeterminant.hide();
					var items = Ti.App.Properties.getString(MYLISTKEY, "null");
					if (items  == "null"){
						alert("Errore server...");
					}
					else{
						listSection.setItems(JSON.parse(items));
					}
					
					Ti.API.info("getUserDocs fallita");
					Ti.API.debug(JSON.stringify(err));
				}
			});
		}catch(e){Ti.API.debug(JSON.stringify(e));};
}
/***********Funzioni***************/
function dataClick(e){
	Ti.API.debug(JSON.stringify(e.itemId));
	Ti.API.debug(JSON.stringify(e));
	
	var itemClicked = e.section.items[e.itemIndex];
	Ti.API.info("Segnalazione selezionata: " + JSON.stringify(itemClicked));
	Alloy.Globals.query.repoId = e.itemId;
	Alloy.Globals.query.userId = itemClicked.userId;
	Ti.API.debug("RepoId: " + Alloy.Globals.query.repoId + "\n UserId: " + Alloy.Globals.query.userId);
	
};

/* crea un array di ListDataItem partendo da un vettore di oggetti JSON */
/* gli oggetti contenuti nell'array restituito sono del tipo:
 * 		{
 * 			titolo: {text: "titolo segnalazione"},
 * 			userId: "userId segnalatore"
 * 			properties: {
 * 				itemId: "id segnalazione"
 * 			}
 * 		}
 */
function createItems(v){
	Ti.API.debug("CreateItems chiamata");
	var dataItem = [];
	var item = {};
	for(var tmp in v){
	  item = {titolo: {text: v[tmp].value}, properties: {itemId: v[tmp].id}, userId: v[tmp].key};	
	  dataItem.push(item);
	  Ti.API.debug("Aggiunto al vettore oggetto: ");
	  Ti.API.debug(JSON.stringify(item));
	}
	Ti.API.debug("createItems ciclo finito. numero iterazioni: " + tmp);
	return dataItem;
};

function createOneItem(obj){
	Ti.API.info("CreateOneItem chiamata");
	
	return {titolo: {text: obj.value}, properties: {itemId: obj.id}, userId: obj.key};	
};

