Ti.API.info("lastsection: ");
var service = Alloy.Globals.Georep;
var listSection = $.last.getSections()[0];
var LASTLISTKEY = "lastlistrepo";
var ndoc = 10; // numero delle segnalazioni scaricate  (in ordine di tempo)

	if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_NONE){
		// se non c'è connessione provo a caricare la lista locale'
		var items = Ti.App.Properties.getString(LASTLISTKEY, "null");
			if (items  == "null"){
				//se non ho dati locali avverto l'utente della necessità di una connessione di rete
				alert("Necessaria connessione alla rete...");
			}
			else{
				if (JSON.parse(items).length == 0){
					$.toast.show();
				}
				listSection.setItems(JSON.parse(items));
			}
	}
	else{
		try{
			$.progressIndicatorIndeterminant.show();
			service.getLastDocs(ndoc, function (err, data){
				if (!err){ // ricevuta risposta corretta
					
					$.progressIndicatorIndeterminant.hide();
					Ti.API.info("getLastDocs eseguita con successo");
					Ti.API.debug(JSON.stringify(data.rows));
					/*listSection.setItems(createItems(data.rows));*/
					
					Ti.API.info("Scaricate " + data.rows.length + " segnalazioni");
					$.progressIndicatorDeterminant.setMax(data.rows.length);
					$.progressIndicatorDeterminant.show();
					Ti.API.info("Partita seconda animazione");
					
					if (data.rows.length == 0){
						$.toast.show();
					}
					for (var tmp in data.rows){
						var item = createOneItem(data.rows[tmp]);
						Ti.API.debug(JSON.stringify(item));
						listSection.appendItems([item]);
						$.progressIndicatorDeterminant.value = tmp;
					}
					
					/* salvo la lista in locale, per poterla caricare in caso di assenza di connessione di rete */
					Ti.App.Properties.setString(LASTLISTKEY, JSON.stringify(listSection.getItems()));
					Ti.API.debug("Lista locale : " + Ti.App.Properties.getString(LASTLISTKEY));
					$.progressIndicatorDeterminant.hide();
					Ti.API.info("Items aggiunti alla lista");
				}
				else{
					// errore server (carico la lista locale)
					$.progressIndicatorIndeterminant.hide();
					var items = Ti.App.Properties.getString(LASTLISTKEY, "null");
					if (items  == "null"){
						alert("Errore server...");
					}
					else{
						if (JSON.parse(items).length == 0){
							$.toast.show();
						}
						listSection.setItems(JSON.parse(items));
					}
					
					Ti.API.info("getLastDocs fallita");
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
	// apro la window per mostrare i dettagli della segnalazione
	Alloy.createController('repodetail').winrepodetail.open();
	
};

/* crea un array di ListDataItem partendo da un vettore di oggetti JSON */
/* gli oggetti contenuti nell'array restituito sono del tipo:
 * 		{
 * 			titolo: {text: "titolo segnalazione"},
 * 			data: {text: "dataSegnalazione"},
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
	  item = {titolo: {text: v[tmp].value.title}, data: {text: Alloy.Globals.dataToString(v[tmp].key)}, properties: {itemId: v[tmp].id}, userId: v[tmp].value.userId};	
	  dataItem.push(item);
	  Ti.API.debug("Aggiunto al vettore oggetto: ");
	  Ti.API.debug(JSON.stringify(item));
	}
	Ti.API.debug("createItems ciclo finito. numero iterazioni: " + tmp);
	return dataItem;
};

function createOneItem(obj){
	Ti.API.info("CreateOneItem chiamata");
	Ti.API.debug("Data in millisecondi: " + obj.key);
	Ti.API.debug("Data: " + Alloy.Globals.dataToString(obj.key));
	return {titolo: {text: obj.value.title}, data: {text: Alloy.Globals.dataToString(obj.key)}, properties: {itemId: obj.id}, userId: obj.value.userId};	
};

