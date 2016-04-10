// Neuen Tab öffnen, bei Hover über Neue Tab Schaltfäche
// open new tab by hovering over tabs-newtab-button
(function(){

let delay		= 200	;//Zeitverzögerung in Millisekunden
let multi		= true ;//Mehrere Neue Tabs öffnen, true = ja, false = nein.


let tbt = document.getElementById("tabbrowser-tabs");
if(!tbt)return;
let timeoutID;
let hasTabMixPlus = (function()'undefined'!==typeof Tabmix)();
let newTabURL = function(){
	let prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
	return hasTabMixPlus?(function(){
		switch(prefService.getIntPref('extensions.tabmix.loadOnNewTab.type')){
			case 0:
				return 'about:blank';
			case 1:
				return 'about:home';
			case 2://Aktuelle Seite
			case 3://Kopieren einer Seite
				return window.content.location.href;
			case 4://Benutzerdefinierte Website
			default:
				return BROWSER_NEW_TAB_URL;
		}
	})():BROWSER_NEW_TAB_URL;
};
let openNewTab = function(){
	multi?BrowserOpenTab():(function(){
		let url = newTabURL(),
			ii = gBrowser.browsers.length;
		while(ii--){
			if(gBrowser.getBrowserAtIndex(ii).currentURI.spec===url){
				gBrowser.selectedTab = gBrowser.tabContainer.childNodes[ii];
				return;
			}
		}
		BrowserOpenTab();
	})();
};
let listener = function(){
	timeoutID = setTimeout(function(){
		openNewTab();
	}, delay);
};
let newTabBtn = document.getAnonymousElementByAttribute(tbt, "class", "tabs-newtab-button");
newTabBtn.addEventListener('mouseover', listener, false);
newTabBtn.addEventListener('mouseout', function(){
	clearTimeout(timeoutID);
}, false);

})();