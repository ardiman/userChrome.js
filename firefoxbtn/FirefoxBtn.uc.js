(function() {
	var FirefoxBtn = $('TabsToolbar').appendChild($C('button', {
		id: "Firefox-button",
		label: " Firefox",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZ0lEQVQ4jXXSPUjWURgF8KtJaRKpgbwY1NYQOEVE5mAK6SzoFFpTFuRWTQ0RKS5BQ9RihHM0lhRYg7j4QUJSOBgFVhQ6iBZh+Wt4b/L3ejvrc865z3nODSEBKnAY59CPPrSjMeUWRdVRWMIg7uI6LuAibmIUA2hIxXtxFZ24F0VdOJrwTmIGU3G7yn+DJszhC15jDA9Rm3noLF7hY4y2L6AZy3ZiHMdQnYlbwgt8QkvAEDYTgy1M41TGYD8eRd6NgLd2YxOXt3PuNKiNUWE8xKMU8R1P0P6fxkqYiNyVgMXEYAknlGutwaHiJujFauS+C5jNRJjHHTzDJE4XDK4VeGMB9zMGv/E1rtqNg6hEG15Gzjp6AlrxOTHYwDCOxFcP4BI+4FfkPEddwB7cxp/E5Ifyz3uqfOifhdk3dBQvW4/HGZMc1nAFFWk9dbgVs+ewhfc4j6pcxQFVOIMHWFCuawVvMILjqeYvqgnSNpNhUc4AAAAASUVORK5CYII=",
		type: 'menu',
		style: "margin: 0px 0px 0px 0px; font-weight: bold; font: 18px Microsoft Yahei; color: #FFF; min-width: 89px; max-width: 89px; -moz-appearance: none; background: #3B3B3B; border: none; padding: 0px; opacity:0.95;",
		ordinal: "0",
	}));
	var ToolsPopup = FirefoxBtn.appendChild($("menu_ToolsPopup"));
	ToolsPopup.setAttribute('onclick', 'event.preventDefault(); event.stopPropagation();');
	ToolsPopup.addEventListener("mouseover", function (event) {event.originalTarget.setAttribute('closemenu', "none")}, true);
	var css = '\
		#Firefox-button dropmarker {display:none;}\
		'.replace(/[\r\n\t]/g, '');;
	FirefoxBtn.style = addStyle(css);

/* Menüelement im Menü Extras einfügen */
	var n, Item, FavIDs;
	FavIDs = [
		'goOfflineMenuitem',
		'fullScreenItem',
		'FavIconReloader',
		'subscribeToPageMenuitem',
		'subscribeToPageMenupopup',
		];
	for(n = 0; n < FavIDs.length; n++) {
		Item = $(FavIDs[n]);
			if (Item) {
				Item = Item.cloneNode(true);
				Item.removeAttribute('key');
			}
		if (Item!=null) $('devToolsSeparator').parentNode.insertBefore(Item, $('devToolsSeparator'));
	}

	var n, Item, FavIDs;
	FavIDs = [
		'file-menu',
		'edit-menu',
		'view-menu',
		'history-menu',
		'bookmarksMenu',
		'helpMenu',
		];
	for(n = 0; n < FavIDs.length; n++) {
		var FavID = FavIDs[n];
			Item = $(FavID);
			if (Item) {
//				Item = Item.cloneNode(true);
				Item.removeAttribute('key');
			}
		if (Item!=null) $('menu_ToolsPopup').insertBefore(Item, $('webDeveloperMenu'));
	}

	var n, Item, FavIDs;
	FavIDs = [
		'charsetMenu',
		];
	for(n = 0; n < FavIDs.length; n++) {
		var FavID = FavIDs[n];
			Item = $(FavID);
			if (Item) {
				Item = Item.cloneNode(true);
				Item.removeAttribute('key');
			}
		if (Item!=null) $('menu_ToolsPopup').insertBefore(Item, $('webDeveloperMenu'));
	}

	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})();
