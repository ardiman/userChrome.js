/* Clear Search Term */

(function() {
	var searchbar = document.getElementById("searchbar");
	searchbar._doSearchInternal = searchbar.doSearch;
	searchbar.doSearch = function(aData, aInNewTab) {
		this._doSearchInternal(aData, aInNewTab);
		// clear the search term
		this.value = "";
		// reset the search engine
		this.currentEngine = this.engines ? this.engines[0] : this._engines[0];
	};
}());
