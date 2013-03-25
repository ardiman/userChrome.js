// ==UserScript==
// @name           tabInfoCopier.uc.js
// @namespace      wuxiaoshan@gmail.com
// @author         Xiao Shan
// @description    Add a context menu on tabs for copy tab information
// @version        0.0.2.1
// @updateURL     https://j.mozest.com/ucscript/script/25.meta.js
// ==/UserScript==
(function() {
    var menu = [
        ["URL kopieren","ucjs_URLCopier.copyURL(document.popupNode);"],
        ["Kurztitel kopieren", "ucjs_URLCopier.copyShortTitle(document.popupNode);"],
        ["Titel kopieren", "ucjs_URLCopier.copyTitle(document.popupNode);"],
        ["Titel & URL kopieren", "ucjs_URLCopier.copyTabInfo(document.popupNode);"],
        ["Titel & URL als BBCode kopieren", "ucjs_URLCopier.copyTabInfo(document.popupNode, 'bbcode');"],
        ["Titel & URL als HTML", "ucjs_URLCopier.copyTabInfo(document.popupNode, 'html');"],
        ["Alle Tabs kopieren' URLs", "ucjs_URLCopier.copyAllTabsURL();"],
        ["Alle Tabs kopieren' Titels", "ucjs_URLCopier.copyAllTabsTitles();"],
        ["Alle Tabs kopieren' Titel & URL", "ucjs_URLCopier.copyAllTabsInfo();"],
        ["Alle Tabs kopieren' Titel & URL als BBCode", "ucjs_URLCopier.copyAllTabsInfo('bbcode');"],
        ["Alle Tabs kopieren' Titel & URL als HTML", "ucjs_URLCopier.copyAllTabsInfo('html');"],
    ];

    var rootMenuLabel = "Tab Info kopieren"; 

    window.ucjs_URLCopier = {
        clipboard: Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper),

        copyURL: function(tab) {
            var url = gBrowser.getBrowserForTab(tab).contentWindow.location.href;
            this.clipboard.copyString(url); 
        },

        copyTitle: function(tab) {
            this.clipboard.copyString(tab.label); 
        },

        copyShortTitle: function(tab) {
            var index = tab.label.indexOf('-');
            if(index != -1) {
                this.clipboard.copyString(tab.label.substring(0, index)); 
            } else {
                this.clipboard.copyString(tab.label); 
            }
        },

        copyTabInfo: function(tab, mode) {
            this.clipboard.copyString(this.buildTabInfo(tab, mode)); 
        },

        copyAllTabsURL: function() {
            var URLs = "";
            Array.slice(gBrowser.tabContainer.childNodes).forEach(function(tab) {
                var url = gBrowser.getBrowserForTab(tab).contentWindow.location.href;
                URLs += url + "\n";
            });
            this.clipboard.copyString(URLs); 
        },

        copyAllTabsTitles: function() {
            var titles = "";
            Array.slice(gBrowser.tabContainer.childNodes).forEach(function(tab) {
                titles += tab.label + "\n";
            });
            this.clipboard.copyString(titles); 
        },

        copyAllTabsInfo: function(mode) {
            var txt = "";
            Array.slice(gBrowser.tabContainer.childNodes).forEach(function(tab) {
                txt += ucjs_URLCopier.buildTabInfo(tab, mode) + "\n";
            });
            this.clipboard.copyString(txt); 
        },

        buildTabInfo: function(tab, mode) {
            var info = "";
            var url = gBrowser.getBrowserForTab(tab).contentWindow.location.href;

            switch(mode) {
                case "bbcode":
                    info = '[url=' + url + ']' + tab.label + '[/url]';
                    break;
                case "html":
                    info = '<a href="' + url + '">' + tab.label + '</a>';
                    break;
                default:
                    info = tab.label + "\n" + url;
            }
            return info;
        },
    };

    attachMenu(buildMenu(prepareMenuItemList()));

    function prepareMenuItemList() {
        var list = new Array();
        menu.forEach(function(item) {
            var menuitem = document.createElement("menuitem");
            menuitem.setAttribute("label", item[0]);
            menuitem.setAttribute("oncommand", item[1]);
            list.push(menuitem);
        });
        return list;
    }

    function attachMenu(menu) {
        setTimeout(function() {
            gBrowser.mStrip.childNodes[1].appendChild(document.createElement("menuseparator"));
            gBrowser.mStrip.childNodes[1].appendChild(menu);
        }, 0);  
    }

    function buildMenu(menuitems) {
        var rootMenu = document.createElement("menu"); 
        rootMenu.setAttribute("label", rootMenuLabel);//root menu label
        var rootMenuPopup = document.createElement("menupopup");
        rootMenu.appendChild(rootMenuPopup);

        menuitems.forEach(function(node) {
            rootMenuPopup.appendChild(node);
        });

        return rootMenu;
    }
})();