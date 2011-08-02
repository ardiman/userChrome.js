/* :::::::: LaunchIE (cf. IE View) ::::::::::::::: */

var LaunchIE = {
	mSchemes: ["file", "ftp", "http", "https"],

	init: function()
	{
		this.mItem = document.createElement("menuitem");
		this.mItem.setAttribute("label", "Im IE öffnen");
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function() { LaunchIE.onPopupShowing(this); }, false);
	},

	onPopupShowing: function(aPopup)
	{
		aPopup.insertBefore(this.mItem, document.getElementById("context-sep-" + ((gContextMenu.onLink)?"open":"stop")));
		this.mItem.setAttribute("oncommand", "LaunchIE.launch(" + ((gContextMenu.onLink)?"gContextMenu.linkURI":"gBrowser.currentURI") + ");");
		this.mItem.hidden = !gContextMenu.onLink && (gContextMenu.isTextSelected || gContextMenu.onImage || gContextMenu.onTextInput);
		this.mItem.setAttribute("disabled", this.mItem.hidden || !this.isSupported((gContextMenu.onLink)?gContextMenu.linkURI:gBrowser.currentURI));
	},

	launch: function(aURI, aApp)
	{
		if (!this.isSupported(aURI))
		{
			throw new Error("LaunchIE: unsupported URI scheme '" + aURI.scheme + "'!");
		}
		
		var iexplore = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		try
		{
			var regkey = Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);
			regkey.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\" + (aApp || "IEXPLORE.EXE"), Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
			iexplore.initWithPath(regkey.readStringValue(""));
			regkey.close();
		}
		catch (ex)
		{
			iexplore.initWithPath((Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get("PROGRAMFILES") || "C:\\Programme") + "\\Internet Explorer\\iexplore.exe");
		}
		
		var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
		process.init(iexplore);
		process.run(false, [aURI.spec], 1);
	},

	isSupported: function(aURI)
	{
		return this.mSchemes.indexOf(aURI.scheme) > -1;
	}
};

LaunchIE.init();