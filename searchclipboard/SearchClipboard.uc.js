// ==UserScript==
// @name         Search Clipboard
// @namespace    http://www.xuldev.org/
// @description  Middle-click the search engine button or popup to search clipboard text
// @include      main
// @author       Gomita
// @version      1.0.20080201
// @homepage     http://www.xuldev.org/misc/ucjs.php
// ==/UserScript==

(function() {
	var searchClipboard = function(event) {
		if (event.button != 1)
			return;
		// get clipboard text
		var str = readFromClipboard();
		// get nsISearchEngine object
		var engine = event.target.engine;
		if (!engine)
			engine = document.getElementById("searchbar").currentEngine;
		// get nsISearchSubmission object
		var submission = engine.getSubmission(str, null);
		if (!submission)
			return;
		// decide whether opening in a new tab or not
		var inNewTab = gPrefService.getBoolPref("browser.search.openintab");
		inNewTab = ((event && event.altKey) ^ inNewTab);
		// load the URL
		if (inNewTab) {
			var tab = gBrowser.loadOneTab(submission.uri.spec, null, null, submission.postData, null, false);
			gBrowser.selectedTab = tab;
		}
		else {
			loadURI(submission.uri.spec, null, submission.postData, false);
		}
		// hide popup after middle-clicking the search popup
		if (event.target.localName == "menuitem") {
			event.target.parentNode.hidePopup();
			event.stopPropagation();
		}
	};
	var searchbar = document.getElementById("searchbar");
	// middle-click the search engine popup to search clipboard
	document.getAnonymousElementByAttribute(searchbar, "anonid", "searchbar-popup")
	.addEventListener("click", searchClipboard, false);
	// middle-click the search engine button to search clipboard
	document.getAnonymousElementByAttribute(searchbar, "anonid", "searchbar-engine-button")
	.addEventListener("click", searchClipboard, false);
}());
