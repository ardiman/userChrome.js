// ==UserScript==
// @name            Context Encoding Menu
// @description     Adds the Character Encoding Menu to the context menu
// @include         main
// @author          nanto_vi (TOYAMA Nao)
// @version         2006.12.26
// ==/UserScript==
(function ContextEncodingMenu() {
    init: {
        let encodingMenu = document.getElementById("charsetMenu")
                                   .cloneNode(true);
        encodingMenu.id = "context-encoding-menu";
        encodingMenu.removeAttribute("oncommand");
        encodingMenu.addEventListener("command",
                                    onEncodingMenuCommand,
                                    false
        );
        document.getElementById("contentAreaContextMenu")
                .insertBefore(encodingMenu,
                        document.getElementById("context-sep-properties")
                );

        UpdateMenus = updateEncodingMenus;
    }

    function onEncodingMenuCommand(aEvent) {
        setTimeout(setEncodingByMenu, 0, aEvent.target);
    }

    function setEncodingByMenu(aMenu) {
        switch (aMenu.getAttribute("name")) {
            case "detectorGroup":
                setDetector(aMenu.id.slice("chardet.".length));
                break;

            case "charsetGroup":
                setCharset(aMenu.id.slice("charset.".length));
                break;
            
            case "charsetCustomize":
                break;
            
            default:
                setCharset(aMenu.id);
        }
    }

    
    function setDetector(aDetector) {
        var webNav = document.commandDispatcher.focusedWindow
                            .QueryInterface(Ci.nsIInterfaceRequestor)
                            .getInterface(nsIWebNavigation);
        
        webNav.QueryInterface(Ci.nsIDocShell).documentCharsetInfo
                                                .forcedDetector = true;
        
        reloadWithCharsetChange(webNav);
        
        var string = Cc["@mozilla.org/pref-localizedstring;1"]
                        .createInstance(Ci.nsIPrefLocalizedString);
        
        string.data = (aDetector == "off") ? "" : aDetector;
        
        Cc["@mozilla.org/preferences-service;1"]
            .getService(Ci.nsIPrefBranch)
            .setComplexValue("intl.charset.detector",
                    Ci.nsIPrefLocalizedString,string
            );
    }

    function setCharset(aCharset) {
        var webNav = document.commandDispatcher.focusedWindow
                            .QueryInterface(Ci.nsIInterfaceRequestor)
                            .getInterface(nsIWebNavigation);
        
        webNav.QueryInterface(Ci.nsIDocCharset).charset
                    = aCharset;reloadWithCharsetChange(webNav);
    }

    function reloadWithCharsetChange(aWebNav) {
        try {
            aWebNav = aWebNav.sessionHistory
                            .QueryInterface(nsIWebNavigation);
        } catch (e) {}


        try {
            aWebNav.reload(nsIWebNavigation.LOAD_FLAGS_CHARSET_CHANGE);
        } catch (e) {}
    }

    function updateEncodingMenus(){
        var detector = Cc["@mozilla.org/preferences-service;1"]
                            .getService(Ci.nsIPrefBranch)
                            .getComplexValue("intl.charset.detector",
                                    Ci.nsIPrefLocalizedString).data;
        
        updateEncodingMenu(document.getElementById("charsetMenu"),
                            content,
                            detector
        );
        
        updateEncodingMenu(
                document.getElementById("context-encoding-menu"),
                document.commandDispatcher.focusedWindow,
                detector
        );
    }

    function updateEncodingMenu(aMenu, aWindow, aDetector) {
        var checkedMenus = aMenu.getElementsByAttribute("checked", "true");
        var checkedMenu;
        while ( (checkedMenu = checkedMenus[0]) )
            checkedMenu.setAttribute("checked", "");
        
        var charsetMenu = aMenu.getElementsByAttribute("id",
                                    "charset."
                                    + aWindow.document.characterSet)[0];

        if (charsetMenu)
            charsetMenu.setAttribute("checked", "true");
        
        var detectorMenu = aMenu.getElementsByAttribute("id",
                                    "chardet." + (aDetector || "off")
                            )[0];
        if (detectorMenu)
            detectorMenu.setAttribute("checked","true");
    }

})();
