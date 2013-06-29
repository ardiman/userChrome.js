// ==UserScript==
// @name                 Historymenu.uc.js
// @namespace            Historymenu@gmail.com
// @description          简单的历史按钮、左键点击打开菜单，右键点击恢复最后关闭的标签
// @author               defpt
// @charset              UTF-8
// @version              2013.5.30.1
// @updateURL     https://j.mozest.com/ucscript/script/106.meta.js
// @icon          http://j.mozest.com/images/uploads/icons/000/00/01/57c8fb4f-12f3-c3ab-f1ba-6c7f731f390e.jpg
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/01/c110c7d1-0321-232f-4adf-1b699d9958cd.jpg http://j.mozest.com/images/uploads/previews/000/00/01/thumb-c110c7d1-0321-232f-4adf-1b699d9958cd.jpg
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
        Historymenu.style.listStyleImage = "url(data:image/jpeg;base64,%2F9j%2F4AAQSkZJRgABAgAAZABkAAD%2F7AARRHVja3kAAQAEAAAAPAAA%2F%2B4ADkFkb2JlAGTAAAAAAf%2FbAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f%2F8AAEQgAEAAQAwERAAIRAQMRAf%2FEAGcAAQEBAAAAAAAAAAAAAAAAAAUCBwEBAQEBAAAAAAAAAAAAAAAAAQIGBxAAAgIBBQADAAAAAAAAAAAAAQIDBBEAIRIFBjFBFBEAAgICAgIDAAAAAAAAAAAAAQIRAwBRYRIhcTFBBP%2FaAAwDAQACEQMRAD8A1CKvbtV%2B7sJYsGajJH%2BeKJzxIkmKMCoydl%2BMa5wtb2LewZ%2B1ZEAHbR8es2pdENSkLDgySNLOF%2Bsr26vkI7L2LAmuwXFsRSOeIEY4rhTg7ht86l63rSliz9rGaQToj6xV0d7FAWEAggbByq%2FtOnoxd3FB2KJZuyJ%2BaeGZAAElLMeQcEZU%2FWqT9D1C4KHDOR1K8NJ88jWD0pYaixXqgMg8jWH%2Bq9h1vZ%2BXhqNfFi9WhtiWSSVHLmbBQKeTMdhjRb%2Biy5KVYOXRj2LckR59DGulK2sKlQrAQBwDn%2F%2FZ)";
        navigator.palette.appendChild(Historymenu);//用于可移动按钮
        //document.getElementById("urlbar-icons").appendChild(Historymenu);//用于固定按钮位置
		//可选固定位置 status-bar  urlbar-icons addon-bar alltabs-button TabsToolbar
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
		max-width: 200px !important;\
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