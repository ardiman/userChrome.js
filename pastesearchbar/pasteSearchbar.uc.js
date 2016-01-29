// ==UserScript==
// @name         pasteSearchbar.uc.js
// @description  Text aus Zwischenablage, mit Doppeltklick in Suchleiste einfügen
// @include      main
// @version      v0.3 Beim Einfügen die interne Suchbefehl Methode ersetzen
// @version      v0.2 Beim Einfügen Suche automatisch starten (Standard = deaktiviert, true = aktiviert, false = deaktiviert)
// ==/UserScript==
(function() {

	const SEARCH_GO = false; //"true" = Suchen automatisch starten

	var searchbar = BrowserSearch.searchBar;
	if (!searchbar) return;

	searchbar.addEventListener('dblclick', (event) => {
		var str = readFromClipboard();
		if (str) {
			goDoCommand('cmd_paste');
			if (SEARCH_GO) {
				searchbar.select();
				searchbar.handleSearchCommand();
			}
		}
	});

}());
