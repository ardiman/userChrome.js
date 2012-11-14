// ==UserScript==
// @name           FloatingScrollbar.uc.js
// @namespace      nightson1988@gmail.com
// @include        main
// @version        0.0.1
// @note           Thanks to Griever(https://github.com/Griever/userChromeJS/blob/master/SmartScrollbar.uc.js) and Paul Rouget(https://gist.github.com/4003205) 
// ==/UserScript==
(function () {
    var prefs = Services.prefs,
        enabled;
    if (prefs.prefHasUserValue('userChromeJS.floating_scrollbar.enabled')) {
        enabled = prefs.getBoolPref('userChromeJS.floating_scrollbar.enabled')
    } else {
        prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
        enabled = true;
    }

    var css = <![CDATA[
    @namespace url(http: //www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
    scrollbar {
        -moz-appearance: none!important;
        position: relative;
        background-color: transparent;
        background-image: none;
        z-index: 2147483647;
        padding: 2px;
    }

    scrollbar[orient = "vertical"] {
        -moz-margin-start: -10px;
        min-width: 10px;
    }

    scrollbar[orient = "vertical"] thumb {
        min-height: 20px;
    }

    scrollbar[orient = "horizontal"] {
        margin-top: -10px;
        min-height: 10px;
    }

    scrollbar[orient = "horizontal"] thumb {
        min-width: 20px;
    }

    scrollbar thumb {
        -moz-appearance: none!important;
        border-width: 0px!important;
        background-color: rgba(0, 0, 0, 0.1)!important;
        border-radius: 3px!important;
    }

    scrollbar thumb:active,
    scrollbar thumb:hover {
        background-color: #DDDDDD!important;
    }

    scrollbar scrollbarbutton, scrollbar gripper {
      display: none;
    }
  ]]>.toString();

  
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));

    var p = document.getElementById('devToolsSeparator');
    var m = document.createElement('menuitem');
    m.setAttribute('label', "Schwimmende Scrollbar");
    m.setAttribute('type', 'checkbox');
    m.setAttribute('autocheck', 'false');
    m.setAttribute('checked', enabled);
    p.parentNode.insertBefore(m, p);
    m.addEventListener('command', command, false);

    if (enabled) {
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    }

    function command() {
        if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', false);
            sss.unregisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', false);
        } else {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
            sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', true);
        }

        let root = document.documentElement;
        let display = root.style.display;
        root.style.display = "none";
        window.getComputedStyle(root).display; // Flush
        root.style.display = display;
    }
})();