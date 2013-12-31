// ==UserScript==
// @name                 Historymenu.uc.js
// @namespace            Historymenu@gmail.com
// @description          简单的历史按钮、左键点击打开菜单，右键点击恢复最后关闭的标签
// @author               defpt
// @charset              UTF-8
// @version              v2013.5.30
// ==/UserScript==
const XULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
location == "chrome://browser/content/browser.xul" && (function() {
    function createBtn() {
        var navigator = document.getElementById("navigator-toolbox");
        if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
        var Historymenu = document.createElementNS(XULNS, 'toolbarbutton');
        Historymenu.id = "Historymenu";
        Historymenu.setAttribute("label", "Chronikmenü");
        Historymenu.setAttribute("tooltiptext", "Chronikmenü");
        Historymenu.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
        Historymenu.setAttribute("type", "menu");
        Historymenu.setAttribute("removable", "true");
        Historymenu.addEventListener("click",
        function(event) {
            if (event.button == 2) {
                event.preventDefault();
                event.stopPropagation();
                undoCloseTab();
            }
        },
        false);
        Historymenu.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL9SURBVDhPdZJfSFNxFMcVSauHoPAhLfujmDozzS1zm9O5uV33361tun/OP3MztZYWrSSUQHNIuGKwxEoktRIUxAchqKeKHuwPiX8oMwoGK+YwTH1Q8nR+61oUeeB77/2d8znfc8/lRvwbALBzY2MjfgvF0Nj/g0CtbV3ZKcz8/oQ07tekTC4QHWZw/AwW39c/NJqCTByN/wmcGkmauZS6PvE4f+kEXwE8iR74ciPKALxiHWQXyCA5kxMQqw0mwtKtv4IkWHxpyzEuBTypHgzVjeO+uwPnvwSDyvfzn055untd6vK653kSHaSfLAKRwljx24Ts7HC6+Ok8yZpQZYamKx0eLOYEl5ZSMziC2ax82RM8H0Gxbc7mQYHKBAwO9c3b3ZuBvdvC03MKVQPCEgtorA1P8XwUC1HDw2OpLFyFyZd+JwyBV1ZWmAqjfYasxRFp3JiPCxuwRapAsa4abvfdN+N5FzEYHR9nCFUW4Kksy4Sh3za25ZrHRWmrgU1pXobz09PTB/lKMxTrrOsIJNJg2ECkqQCxsmrVHwolkDdARfc9HM4nw9hU6WLY4NnERBKlrYIitfUHDUYSEywmSHX2KTHWckUl1wmMinHf9OVKSmugQGEOhQ3wsl9usAXkBgeYbI1qNNhNG+wJLi4KyutdIwyebK2ivkmEtVh5WfVZwqpM9rebBvFljsaREusZyBVrX5AzKvzH4X0HNjF7B4caCpVGt98fSuCKSyeVlgaodF72Ym0v2Xf72KPHEmm5Y5XC3VgCpY+AZBoqmpjh/dC7+fmcHJF6SFJWA1KrfWFyZo6N+SgyiJgcaOn0tmsqz5FvARl51BtKY7F0enqyLra6c4tKjDUsnvxDsd4GamvduvfOoBON94WbNwMTae03etrUVQ3LMmMtcCWlkE3+g0Il8GQGkJtOg87WtHCr78EFZJPptr+DmLyemtU6mzvumWovTZIGvc0ZMNe6XrmudnXPffys3LJ5MxAgHy4LlYfPQpQAxUWlYy6axuiIiPgJAMruhpF4ADUAAAAASUVORK5CYII=)";
        navigator.palette.appendChild(Historymenu);
        //status-bar  urlbar-icons addon-bar alltabs-button TabsToolbar go-button
        //document.getElementById("urlbar-icons").appendChild(Historymenu);
        //历史菜单
        var popup = document.createElementNS(XULNS, 'menupopup');
        popup.setAttribute('placespopup', 'true');
        popup.setAttribute('oncommand', 'this.parentNode._placesView._onCommand(event);');
        popup.setAttribute('onclick', 'checkForMiddleClick(this, event);');
        popup.setAttribute('onpopupshowing', 'if (!this.parentNode._placesView) new HistoryMenu(event);');
        popup.setAttribute('tooltip', 'bhTooltip');
        popup.setAttribute('popupsinherittooltip', 'true');

        //最近关闭的标签页
        item = document.getElementById('historyUndoMenu');
        if (item) {
            item = item.cloneNode(false);
            item.setAttribute('id', 'Historymenu_recentlyClosedTabsMenu');
            itemPopup = document.createElementNS(XULNS, 'menupopup');
            itemPopup.setAttribute('id', 'Historymenu_recentlyClosedTabsMenupopup');
            itemPopup.setAttribute('onpopupshowing', "document.getElementById('Historymenu')._placesView.populateUndoSubmenu();");
            itemPopup.setAttribute('placespopup', 'true');
            item.appendChild(itemPopup);
            popup.appendChild(item);
        }
        //查看所有历史记录
        item = document.createElement('menuitem');
        item.setAttribute('id', 'Historymenu_allhistory');
        item.setAttribute("label", 'Gesamte Chronik anzeigen');
        item.setAttribute('oncommand', "toggleSidebar('viewHistorySidebar');");
        popup.appendChild(item);
        //分割线
        item = document.getElementById('startHistorySeparator');
        if (item) {
            item = item.cloneNode(false);
            item.setAttribute('id', 'Historymenu_startHistorySeparator');
            popup.appendChild(item);
        }
        Historymenu.appendChild(popup); //显示历史记录
        document.insertBefore(document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent('\
#Historymenu menuitem {\
		max-width: 300px !important;\
	}\
') + '"'), document.documentElement);
    }
    function updateToolbar() {
        var toolbars = document.querySelectorAll("toolbar");
        Array.slice(toolbars).forEach(function(toolbar) {
            var currentset = toolbar.getAttribute("currentset");
            if (currentset.split(",").indexOf("Historymenu") < 0) return;
            toolbar.currentSet = currentset;
            try {
                BrowserToolboxCustomizeDone(true);
            } catch(ex) {}
        });
    }
    createBtn();
    updateToolbar();
})();