// ==UserScript==
// @name                Close Tabs from the Beginning
// @id                  closetabsfromthebeginning@zbinlin
// @namespace           http://script.mozcp.com/closetabsfromthebeginning.uc.js
// @description         在标签页右键菜单添加“关闭左侧标签页”
// @include             chrome://browser/content/browser.xul
// @homepage            http://mozcp.com/
// @updateURL           https://bitbucket.org/zbinlin/close-tabs-from-the-beginning/raw/tip/closeTabsFromTheBeginning@zbinlin.uc.js
// @version             0.0.1
// ==/UserScript==

/**
 * ******************************** Changelog ********************************
 *
 * Version: 0.0.1
 *  * 初始化
 *  * 在 Firefox 24 的标签页右键菜单会添加“关闭右侧标签页”菜单项，但没有“关闭
 *    左侧标签页”菜单项，这里就是添加“关闭左侧标签页”菜单项的 UserChromeJS 脚本。
 *    注意：这里没有实现“关闭多个标签页时警告我！”的弹出警告。
 *
 * ***************************************************************************
 */

"use strict";

if (!"chrome://browser/content/browser.xul".indexOf(location.href)) {

    let { classes: Cc, interfaces: Ci, utils: Cu } = Components;

    let {Services} = Cu.import("resource://gre/modules/Services.jsm", {});

    const LABEL = {
        "en-US": "Linke Tabs schließen",
        "zh-CN": "关闭左侧标签页"
    }[Services.prefs.getCharPref("general.useragent.locale") || "en-US"];
    
    let commandString = function () {/*
    return (function (aTab) {
        "use strict";
        var tabsFromBegin = [];
        var tabs = gBrowser.visibleTabs;
        for (var i = 0, len = tabs.length; tabs[i] != aTab && i < len; i++) {
            tabs[i].pinned || tabsFromBegin.push(tabs[i]);
        }
        tabsFromBegin.forEach(function (aTab) {
            this.removeTab(aTab, {animate: true});
        }, gBrowser);
    })(TabContextMenu.contextTab);
    */}.toString().replace(/^[^/]+\/\*([\s\S]*)\*\/\s*}$/, "$1");

    let tabContextMenu = document.getElementById("tabContextMenu");
    let menuitem = document.createElement("menuitem");
    let beforeItem = document.getElementById("context_closeTabsToTheEnd") || document.getElementById("context_closeOtherTabs");
    menuitem.id = "context_closeTabsFromTheBegin";
    menuitem.setAttribute("oncommand", commandString);
    menuitem.setAttribute("label", "Linke Tabs schließen");
    tabContextMenu.insertBefore(menuitem, beforeItem);
    tabContextMenu.addEventListener("popupshowing", function __handleEvent__() {
        let aTab = TabContextMenu.contextTab;
        menuitem.hidden = aTab.pinned;
        menuitem.disabled = !!(1 == gBrowser.visibleTabs.length || (aTab.previousElementSibling && aTab.previousElementSibling.pinned));
    }, true);
}
