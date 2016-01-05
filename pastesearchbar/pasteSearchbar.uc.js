// ==UserScript==
// @name         pasteSearchbar.uc.js
// @description  Text aus Zwischenablage, mit Doppelklick in Suchleiste einfügen
// @include      main
// @version      v0.2 Bei Einfügen Suche automatisch starten (Standard = deaktiviert, true = aktiviert, false = deaktiviert)

// ==/UserScript==
(function () {

	const SEARCH_GO = false; //Suchen automatisch starten = "true"

	var searchbar = BrowserSearch.searchBar;
	if (!searchbar) return;

	var goButton = document.getAnonymousElementByAttribute(searchbar,"anonid", "search-go-button");

	searchbar.addEventListener('dblclick', function (event) {
		var str = readFromClipboard();
		if (str) {
			goDoCommand('cmd_paste');
			if (SEARCH_GO) goButton.click();
		}
	}, false);

}());
