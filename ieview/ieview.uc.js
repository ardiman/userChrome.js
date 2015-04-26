    /* :::::::: LaunchIE (cf. IE View) ::::::::::::::: */

    var LaunchIE = {
            mSchemes: ["file", "ftp", "http", "https"],

            init: function()
            {
                    this.mItem = document.createElement("menuitem");
                    this.mItem.setAttribute("label", "Im IE öffnen");
                    this.mItem.setAttribute("accesskey", "E");
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
                   
                    var iexplore = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
                    try
                    {
                            var regkey = Cc["@mozilla.org/windows-registry-key;1"].createInstance(Ci.nsIWindowsRegKey);
                            regkey.open(Ci.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\" + (aApp || "IEXPLORE.EXE"), Ci.nsIWindowsRegKey.ACCESS_READ);
                            iexplore.initWithPath(regkey.readStringValue(""));
                            regkey.close();
                    }
                    catch (ex)
                    {
                            iexplore.initWithPath((Cc["@mozilla.org/process/environment;1"].getService(Ci.nsIEnvironment).get("PROGRAMFILES") || "C:\\Program Files") + "\\Internet Explorer\\iexplore.exe");
                    }
                   
                    var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
                    process.init(iexplore);
                   
                    // 兼容21.0 ie11
                    var url = aURI.spec;
                   
                    if(url.indexOf("http://www.") > -1)
                    {
                        url = url.replace("http://www.", "");
                    }               
                    url = url.replace("http://", "");
                    var a = [url];
                    try{
                    process.runw(false, a, a.length);
                    }catch(ex)
                    {
                      alert(ex.message);
                    }
            },

            isSupported: function(aURI)
            {
                    return this.mSchemes.indexOf(aURI.scheme) > -1;
            }
    };

    LaunchIE.init();