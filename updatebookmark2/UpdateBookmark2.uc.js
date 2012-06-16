location == "chrome://browser/content/browser.xul" && (function () {
	var newBM = document.getElementById("placesContext_new:bookmark");
	var repBM = newBM.parentNode.insertBefore(newBM.cloneNode(true), newBM);
	repBM.label = "Mit aktueller URL ersetzen";
	repBM.command = "";
	repBM.addEventListener("command", function () {
		var itemId = (document.popupNode._placesNode || document.popupNode.node).itemId;
		PlacesUtils.bookmarks.changeBookmarkURI(itemId, gBrowser.currentURI);  //Adresse aktualisieren
		PlacesUtils.bookmarks.setItemTitle(itemId, gBrowser.contentTitle);     //Titel aktualisieren
	}, false)
})()