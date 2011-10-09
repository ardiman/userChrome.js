// ==UserScript==
// @name           TU_recentlyCloseTabsByRightClick.uc.js
// @namespace      TU_recentlyCloseTabsByRightClick@ithinc.cn
// @description    右键单击标签栏弹出“最近关闭的标签页”
// @compatibility  Firefox 4.0
// @author         ithinc
// @version        1.0.8.2
// @updateURL     https://j.mozest.com/ucscript/script/35.meta.js
// ==/UserScript==

/* :::: 右键单击标签栏弹出“最近关闭的标签页” :::: */

(function TU_recentlyCloseTabsByRightClick() {
  var popup = document.getElementById("mainPopupSet").appendChild(document.createElement("menupopup"));
  popup.setAttribute("id", "undoCloseTabPopup");
  popup.setAttribute("onpopupshowing", "this.populateUndoSubmenu();");
  popup.setAttribute("tooltip", "bhTooltip");
  popup.setAttribute("popupsinherittooltip", "true");

  popup._ss = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
  popup._undoCloseMiddleClick = HistoryMenu.prototype._undoCloseMiddleClick;
  popup.populateUndoSubmenu = eval("(" + HistoryMenu.prototype.populateUndoSubmenu.toString().replace("undoMenu.firstChild", "this").replace(/.*undoMenu.*/g, "") + ")");
  
  gBrowser.mTabContainer.addEventListener("contextmenu", function(event) {
    if (event.button == 2 && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && event.originalTarget.localName == "box") {
      document.getElementById("undoCloseTabPopup").openPopupAtScreen(event.screenX, event.screenY, true);      
      event.preventDefault();
    }
  }, false);
})();

