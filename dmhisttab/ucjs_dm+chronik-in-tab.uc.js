
/*
 *********************************************************************************
 ***** 21. Downloadmanager und Chronik im Tab oeffnen *******************
 *********************************************************************************
 *
 *** 21.01 Window Hook (ist fuer "DM in Hintergrundtab" noetig etc.) ***
 */


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


///// 21.02. diverse-Manager in Tab oeffnen
 
 
// Bookmark Manager open in Tab //GEHT NICHT MEHR MIT FX3!!
//document.getElementsById("Browser:ShowAllBookmarks").setAttribute("oncommand", '(getBrowser().selectedTab = //getBrowser().addTab("chrome://browser/content/places/places.xul"))');


// Download Manager open in Tab // GEHT mit FX3!
document.getElementById("Tools:Downloads").setAttribute("oncommand", '(getBrowser().selectedTab = getBrowser().addTab("chrome://mozapps/content/downloads/downloads.xul")).label = "Download Manager";');

// History Manager open in Tab // GEHT mit FX3!
document.getElementById("viewHistorySidebar").setAttribute("oncommand", '(getBrowser().selectedTab = getBrowser().addTab("chrome://browser/content/history/history-panel.xul")).label = "History Manager";');


///// 21.03. Download-Manager in Hintergrundtab oeffnen

WindowHook.register("chrome://mozapps/content/downloads/downloads.xul", function(aWindow) {
   var browser = Components.classes["@mozilla.org/appshell/window-mediator;1"]
      .getService(Components.interfaces.nsIWindowMediator)
      .getMostRecentWindow("navigator:browser").getBrowser();
   aWindow.addEventListener("unload", function() {
      browser.addTab("chrome://mozapps/content/downloads/downloads.xul");
   }, false);
   aWindow.close();
});




/* im Vordergrund:
...
browser.selectedTab = browser.addTab("chrome://mozapps/content/downloads/downloads.xul"); 
*/


