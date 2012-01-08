<!--
// ==UserScript==
// @name           ucjs_dm+chronik-in-tab.uc.js
// @compatibility  Firefox 9.*
// @version        1.0.20120108b
// ==/UserScript==
-->


!function dmhisttab(){
/*
  Konfiguration des Tabverhaltens fuer Lesezeichen-, Download-, Historymanager
    tabMode 0=nicht veraendern, 1=Tab im Vordergrund, 2=Tab im Hintergrund, 3= als Fenster
    Sonderfall fuer den DM-Manager bei startenden Downloads wird uber die (nicht existierende) searchedId "VerhaltenBeimDownload" behandelt
*/
var configArray = [
  {tabMode: 3,
   searchedId: "bookmarksShowAll",
   label: "Lesezeichen-Manager",
   chromeUrl: "chrome://browser/content/places/places.xul"},
  {tabMode: 2,
   searchedId: "menu_openDownloads",
   label: "Download-Manager",
   chromeUrl: "chrome://mozapps/content/downloads/downloads.xul"},
  {tabMode: 1,
   searchedId: "VerhaltenBeimDownload",
   label: "Download-Manager",
   chromeUrl: "chrome://mozapps/content/downloads/downloads.xul"},
  {tabMode: 1,
   searchedId: "menu_showAllHistory",
   label: "History-Manager",
   chromeUrl: "chrome://browser/content/history/history-panel.xul"},
  {tabMode: 2,
   searchedId: "history-button",
   label: "History-Manager",
   chromeUrl: "chrome://browser/content/history/history-panel.xul"},
  {tabMode: 0,
   searchedId: "menu_historySidebar",
   label: "History-Manager",
   chromeUrl: "chrome://browser/content/history/history-panel.xul"},
];
// Ende der Konfiguration


// WindowHook (ist für "DM in Hintergrundtab" bei startenden Downloads notwendig)
var WindowHook = {
	observe: function(aSubject, aTopic, aData)
	{
		if (!aSubject._WindowHook)
		{
			aSubject._WindowHook = this;
			aSubject.addEventListener("load", this.onLoad_window, false);
		}
	},

	onLoad_window: function()
	{
		this.removeEventListener("load", this._WindowHook.onLoad_window, false);
		var funcs = this._WindowHook.mFuncs[this.document.location.href] || null;
		if (funcs)
		{
			funcs.forEach(function(aFunc) { aFunc(this); }, this);
		}
		delete this._WindowHook;
	},

	register: function(aURL, aFunc)
	{
		if (!this.mFuncs)
		{
			this.mFuncs = {};
			Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService).addObserver(this, "domwindowopened", false);
		}
		if (!this.mFuncs[aURL])
		{
			this.mFuncs[aURL] = [];
		}
		this.mFuncs[aURL].push(aFunc);
	}
};
// Ende WindowHook

var dlMode;

// Das configArray durchlaufen und je nach gewaehltem tabMode/Manager agieren
for (var i = 0; i < configArray.length; i++) {
  if (configArray[i]["searchedId"]=="VerhaltenBeimDownload") {
    dlMode=configArray[i]["tabMode"];
    continue;
   } else {
    wId=document.getElementById(configArray[i]["searchedId"]);
    wId.setAttribute("command", null);
  }
  switch (configArray[i]["tabMode"]) {
    case 1:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = getBrowser().addTab('"+configArray[i]['chromeUrl']+"'));");
      break;
    case 2:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = getBrowser().addTab('"+configArray[i]['chromeUrl']+"').label = '"+configArray[i]['label']+"');");
      break;
    case 3:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = window.open('"+configArray[i]['chromeUrl']+"'))");
      break;
  }
}


// Behandlung von startenden Downloads
if (dlMode==1 || dlMode==2) {
  WindowHook.register("chrome://mozapps/content/downloads/downloads.xul", function(aWindow) {
    var browser = Components.classes["@mozilla.org/appshell/window-mediator;1"]
      .getService(Components.interfaces.nsIWindowMediator)
      .getMostRecentWindow("navigator:browser").getBrowser();
    aWindow.addEventListener("unload", function() {
      if (dlMode==1) {
        browser.selectedTab = browser.addTab("chrome://mozapps/content/downloads/downloads.xul");
       } else {
      browser.addTab("chrome://mozapps/content/downloads/downloads.xul");
      }
    }, false);
    aWindow.close();
  });
}


}();