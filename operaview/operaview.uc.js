/* :::::::: LaunchOpera (cf. Opera View) ::::::::::::::: */

var LaunchOpera = {
    mSchemes: ["file", "ftp", "http", "https"],

    init: function()
    {
        this.mItem = document.createElement("menuitem");
        this.mItem.setAttribute("label", "In Opera \u00F6ffnen");
        
        

document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",function() { LaunchOpera.onPopupShowing(this); }, false);
    },

    onPopupShowing: function(aPopup)
    {
        aPopup.insertBefore(this.mItem,

document.getElementById("context-sep-" + ((gContextMenu.onLink)?"open":"stop")));
        this.mItem.setAttribute("oncommand", "LaunchOpera.launch(" +

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
            throw new Error("LaunchOpera: unsupported URI scheme '" +aURI.scheme + "'!");
        }
        
        var opera =

Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        try
        {
            var regkey =

Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);
            

regkey.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,

"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\" + (aApp || "OPERA.EXE"),

Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
            opera.initWithPath(regkey.readStringValue(""));
            regkey.close();
        }
        catch (ex)
        {
            

opera.initWithPath((Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment).get("ProgramFiles") || "C:\\Program Files")+ "\\Internet\\Opera\\Opera.exe");
        }
        
        var process =

Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
        process.init(opera);
        process.run(false, [aURI.spec], 1);
    },

    isSupported: function(aURI)
    {
        return this.mSchemes.indexOf(aURI.scheme) > -1;
    }
};

LaunchOpera.init();