/* OpenURLWith.uc.js
* Open an application with the current page's URL.
*/

(function OpenURLWith() {
    if (location != "chrome://browser/content/browser.xul") return;
    const MENU_LABEL = "Öffnen mit...";
    const MENU_ACCESSKEY = "ö";

    const FIREFOX_PATH = "D:\\Programme\\Mozilla Firefox\\firefox.exe";
    const IE_PATH = "C:\\Programme\\Internet Explorer\\iexplore.exe";
    const OPERA_PATH = "D:\\Programme\\Opera\\Opera.exe";
    const CHROME_PATH = "C:\\Documents and Settings\\Administrator\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe";

    var mMenus = [
        {
            label: "Firefox (Link)",
            accesskey: "F",
            application: FIREFOX_PATH,
            get url() { return gContextMenu.linkURL; },
            get shouldDisplay() { return gContextMenu.onLink; }
        },
        {
            label: "IE (Link)",
            accesskey: "I",
            application: IE_PATH,
            get url() { return gContextMenu.linkURL; },
            get shouldDisplay() { return gContextMenu.onLink; }
        },
        {
            label: "Opera (Link)",
            accesskey: "O",
            application: OPERA_PATH,
            get url() { return gContextMenu.linkURL; },
            get shouldDisplay() { return gContextMenu.onLink; }
        },
        {
            label: "Chrome (Link)",
            accesskey: "C",
            application: CHROME_PATH,
            get url() { return gContextMenu.linkURL; },
            get shouldDisplay() { return gContextMenu.onLink; }
        },
        {
            label: "-",
            get shouldDisplay() { return gContextMenu.onLink; }
        },
        {
            label: "Firefox (Seite)",
            accesskey: "F",
            application: FIREFOX_PATH,
            get url() { return content.location.href; },
        },
        {
            label: "IE (Seite)",
            accesskey: "I",
            application: IE_PATH,
            get url() { return content.location.href; },
        },
        {
            label: "Opera (Seite)",
            accesskey: "O",
            application: OPERA_PATH,
            get url() { return content.location.href; },
        },
        {
            label: "Chrome (Seite)",
            accesskey: "C",
            application: CHROME_PATH,
            get url() { return content.location.href; },
        },
        {
            label: "-",
            get shouldDisplay() { return gContextMenu.inFrame; }
        },
        {
            label: "Firefox",
            accesskey: "F",
            application: FIREFOX_PATH,
            get url() { return document.commandDispatcher.focusedWindow.location.href; },
            get shouldDisplay() { return gContextMenu.inFrame; }
        },
        {
            label: "IE",
            accesskey: "I",
            application: IE_PATH,
            get url() { return document.commandDispatcher.focusedWindow.location.href; },
            get shouldDisplay() { return gContextMenu.inFrame; }
        },
        {
            label: "Opera",
            accesskey: "O",
            application: OPERA_PATH,
            get url() { return document.commandDispatcher.focusedWindow.location.href; },
            get shouldDisplay() { return gContextMenu.inFrame; }
        },
        {
            label: "Chrome",
            accesskey: "C",
            application: CHROME_PATH,
            get url() { return document.commandDispatcher.focusedWindow.location.href; },
            get shouldDisplay() { return gContextMenu.inFrame; }
        }
    ];

    init: {
        let parentMenu = document.createElement("menu");
        parentMenu.setAttribute("label", MENU_LABEL);
        parentMenu.setAttribute("id", "ucjs_openurlwith-menu");
        if (typeof MENU_ACCESSKEY != "undefined" && MENU_ACCESSKEY)
            parentMenu.setAttribute("accesskey", MENU_ACCESSKEY);
        document.getElementById("contentAreaContextMenu").insertBefore(
            parentMenu, document.getElementById("context-sep-properties"));

        let parentPopup = document.createElement("menupopup");
        parentPopup.id = "ucjs_openurlwith-popup";
        parentPopup.addEventListener("command", openApplication, false);
        parentMenu.appendChild(parentPopup);

        for (let i = 0, menu; menu = mMenus[i]; i++) {
            let menuItem;
            if (menu.label == "-") {
                menuItem = document.createElement("menuseparator");
            } else {
            menuItem = document.createElement("menuitem");
            menuItem.setAttribute("label", menu.label);
            menuItem.setAttribute("id", "ucjs_openurlwith-"+menu.label.replace(/[()\s]/g,""));
            if ("accesskey" in menu)
                menuItem.setAttribute("accesskey", menu.accesskey);
            menuItem.ouwMenu = menu;
        }
        parentPopup.appendChild(menuItem);
    }

    parentMenu.parentNode.addEventListener("popupshowing", setMenuDisplay, false);
}

function openApplication(aEvent) {
    var menu = aEvent.target.ouwMenu;

    var app = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
    app.initWithPath(menu.application);
    if (!app.exists()) {
        alert("Die Datei existiert nicht: " + menu.application);
        return;
    }

    Cc["@mozilla.org/browser/shell-service;1"]
    .getService(Ci.nsIShellService_MOZILLA_1_8_BRANCH || Ci.nsIShellService)
    .openApplicationWithURI(app, menu.url);
}

function setMenuDisplay() {
    var menuItems = document.getElementById("ucjs_openurlwith-popup").childNodes;
    for (var i = 0, menu; menu = mMenus[i]; i++)
        menuItems[i].hidden = "shouldDisplay" in menu && !menu.shouldDisplay || menu.application=='';
}

})();