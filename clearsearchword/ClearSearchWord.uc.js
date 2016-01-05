// ==UserScript==
// @name           Clear Search Word
// @description    Clears the search term after searching.
// @include        main
// @version        1.0
// ==/UserScript==
(function(searchbar) {
	searchbar.doSearch_org = searchbar.doSearch;
	searchbar.doSearch = function(aData, aWhere, aEngine) {
		this.doSearch_org(aData, aWhere, aEngine);
		this.value = "";
		this.updateDisplay();
	}
}(document.getElementById("searchbar")));
