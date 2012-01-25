/* :::::::: LaunchSafari (cf. Safari View) ::::::::::::::: */

var LaunchSafari = {
    mSchemes: ["file", "ftp", "http", "https"],

    init: function()
    {
        this.mItem = document.createElement("menuitem");
        this.mItem.setAttribute("label", "In Safari \u00F6ffnen");
        
        

document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",function() { LaunchSafari.onPopupShowing(this); }, false);
    },

    onPopupShowing: function(aPopup)
    {
        aPopup.insertBefore(this.mItem,

document.getElementById("context-sep-" + ((gContextMenu.onLink)?"open":"stop")));
        this.mItem.setAttribute("oncommand", "LaunchSafari.launch(" +

((gContextMenu.onLink)?"gContextMenu.linkURI":"gBrowser.currentURI") + ");");
        this.mItem.hidden = !gContextMenu.onLink &&

(gContextMenu.isTextSelected || gContextMenu.onImage || gContextMenu.onTextInput);
        this.mItem.setAttribute("disabled", this.mItem.hidden ||

!this.isSupported((gContextMenu.onLink)?gContextMenu.linkURI:gBrowser.currentURI));
    },

    launch: function(aURI, aApp)
    {
        if (!this.isSupported(aURI))
        {
            throw new Error("LaunchSafari: unsupported URI scheme '" +aURI.scheme + "'!");
        }
        
        var safari =

Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        try
        {
            var regkey =

Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);
            

regkey.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,

"SOFTWARE\\Apple Computer, Inc.\\BrowserExe",

Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
            safari.initWithPath(regkey.readStringValue(""));
            regkey.close();
        }
        catch (ex)
        {
            

safari.initWithPath((Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get("ProgramFiles") || "C:\\Program Files")+ "\\Internet\\Safari\\Safari.exe");
        }
        
        var process =

Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
        process.init(safari);
        process.run(false, [aURI.spec], 1);
    },

    isSupported: function(aURI)
    {
        return this.mSchemes.indexOf(aURI.scheme) > -1;
    }
};

LaunchSafari.init();