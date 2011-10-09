// ==UserScript==
// @name           recentlyClosedTabsInContext
// @namespace      recentlyClosedTabsInContext@zbinlin
// @description    在右键菜单添加“最近关闭的标签页”菜单项
// @include        chrome://browser/content/browser.xul
// @author         zbinlin
// @version        0.0.1.1
// @compatibility  Firefox 4+
// @updateURL     https://j.mozest.com/ucscript/script/44.meta.js
// ==/UserScript==

var recentlyClosedTabsInContext = {
    get _ss() {
        return Cc["@mozilla.org/browser/sessionstore;1"].getService(
            Ci.nsISessionStore);
    },

    init: function () {
        var rctic = document.createElement("menu");
        rctic.id = "context-recentlyclosedtabs";
        rctic.setAttribute("label", document.getElementById(
                           "appmenu_recentlyClosedTabsMenu").label);
        var menupopup = document.createElement("menupopup");
        menupopup.setAttribute("onpopupshowing",
                               "recentlyClosedTabsInContext.populateUndoSubmenu(this);");
        rctic.appendChild(menupopup);
        var cacm = document.getElementById("contentAreaContextMenu");
        if (!cacm) return;
        cacm.addEventListener("popupshowing", this, false);
        cacm.insertBefore(rctic, cacm.firstChild);
    },
    handleEvent: function (e) {
        switch (e.type) {
            case "popupshowing" :
                this.toggleUndoMenu();
                break;
            case "click" :
                break;
        }
    },
    toggleUndoMenu: function () {
        var undoMenu = document.getElementById("context-recentlyclosedtabs");
        var isDisabled = this._ss.getClosedTabCount(window) ||
                         this._ss.getClosedWindowCount(window);
        if (isDisabled)
            undoMenu.removeAttribute("disabled");
        else
            undoMenu.setAttribute("disabled", true);
    },
    populateUndoSubmenu: function (undoPopup) {
        // remove existing menu items
        while (undoPopup.hasChildNodes())
            undoPopup.removeChild(undoPopup.firstChild);

        // populate menu
        let undoTabItems = JSON.parse(this._ss.getClosedTabData(window));
        for (let i = 0; i < undoTabItems.length; i++) {
            let m = document.createElement("menuitem");
            m.setAttribute("label", undoTabItems[i].title);
            if (undoTabItems[i].image) {
                let iconURL = undoTabItems[i].image;
                // don't initiate a connection just to fetch a favicon (see bug 467828)
                if (!/^https?:.*\.ico$/.test(iconURL))
                    iconURL = "moz-anno:favicon:" + iconURL;
                m.setAttribute("image", iconURL);
            }
            m.setAttribute("class", "menuitem-iconic menuitem-with-favicon bookmark-item");
            m.setAttribute("value", i);
            m.setAttribute("oncommand", "undoCloseTab(" + i + ");");
            m.setAttribute("onclick", "(function (e) { if (e.button == 1) undoCloseTab(" + i + ")})(event);");

            // Set the targetURI attribute so it will be shown in tooltip and trigger
            // onLinkHovered. SessionStore uses one-based indexes, so we need to
            // normalize them.
            let tabData = undoTabItems[i].state;
            let activeIndex = (tabData.index || tabData.entries.length) - 1;
            if (activeIndex >= 0 && tabData.entries[activeIndex]) {
                let url = tabData.entries[activeIndex].url;
                m.setAttribute("targetURI", url);
                m.setAttribute("tooltiptext", url);
            }

            m.addEventListener("click", this._undoCloseMiddleClick, false);
            //if (i == 0)
            //    m.setAttribute("key", "key_undoCloseTab");
            undoPopup.appendChild(m);
        }


        let strings = gNavigatorBundle;
        let menuLabelString = strings.getString("menuUndoCloseWindowLabel");
        let menuLabelStringSingleTab =
            strings.getString("menuUndoCloseWindowSingleTabLabel");

        // populate menu
        let undoWindowItems = JSON.parse(this._ss.getClosedWindowData());
        if (undoTabItems.length && undoWindowItems.length)
            undoPopup.appendChild(document.createElement("menuseparator"));
        for (let i = 0; i < undoWindowItems.length; i++) {
            let undoItem = undoWindowItems[i];
            let otherTabsCount = undoItem.tabs.length - 1;
            let label = (otherTabsCount == 0) ? menuLabelStringSingleTab
                                              : PluralForm.get(otherTabsCount, menuLabelString);
            let menuLabel = label.replace("#1", undoItem.title)
                                 .replace("#2", otherTabsCount);
            let m = document.createElement("menuitem");
            m.setAttribute("label", menuLabel);
            let selectedTab = undoItem.tabs[undoItem.selected - 1];
            if (selectedTab.attributes.image) {
                let iconURL = selectedTab.attributes.image;
                // don't initiate a connection just to fetch a favicon (see bug 467828)
                if (!/^https?:.*\.ico$/.test(iconURL))
                    iconURL = "moz-anno:favicon:" + iconURL;
                m.setAttribute("image", iconURL);
            }
            m.setAttribute("class", "menuitem-iconic menuitem-with-favicon bookmark-item");
            m.setAttribute("oncommand", "undoCloseWindow(" + i + ");");
            m.setAttribute("onclick", "(function (e) { if (e.button == 1) undoCloseWindow(" + i + ")})(event);");

            // Set the targetURI attribute so it will be shown in tooltip.
            // SessionStore uses one-based indexes, so we need to normalize them.
            let activeIndex = (selectedTab.index || selectedTab.entries.length) - 1;
            if (activeIndex >= 0 && selectedTab.entries[activeIndex]) {
                let url = selectedTab.entries[activeIndex].url;
                m.setAttribute("targetURI", url);
                m.setAttribute("tooltiptext", url);
            }

            //if (i == 0)
            //    m.setAttribute("key", "key_undoCloseWindow");
            undoPopup.appendChild(m);
        }


        // "Restore All Tabs"
        undoPopup.appendChild(document.createElement("menuseparator"));
        m = undoPopup.appendChild(document.createElement("menuitem"));
        m.id = "contextmenu_restoreAllTabs";
        m.setAttribute("label", strings.getString("menuRestoreAllTabs.label"));
        m.addEventListener("command", function() {
          for (let i = 0; i < undoTabItems.length; i++)
            undoCloseTab();
        }, false);
        if (this._ss.getClosedTabCount(window) == 0)
            m.setAttribute("disabled", true);
        else
            m.removeAttribute("disabled");
        // "Open All in Windows"
        m = undoPopup.appendChild(document.createElement("menuitem"));
        m.id = "contextmenu_restoreAllWindows";
        m.setAttribute("label", strings.getString("menuRestoreAllWindows.label"));
        m.addEventListener("command", function() {
          for (let i = 0; i < undoWindowItems.length; i++)
            undoCloseWindow();
        }, false);
        if (this._ss.getClosedWindowCount(window) == 0)
            m.setAttribute("disabled", true);
        else
            m.removeAttribute("disabled");
    }
};

if (window.location == "chrome://browser/content/browser.xul") {
    recentlyClosedTabsInContext.init();
}