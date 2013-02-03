// ==UserScript==
// @name           UndoCloseTabButtonMod.uc.js
// @description    ツールバーに［閉じたタブを戻す］ボタンを追加
// @include        main
// @include        chrome://browser/content/browser.xul
// @version        1.1.1.3
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function undoCloseTabButton() {

  const locale = (Components.classes["@mozilla.org/preferences-service;1"]
  .getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale")).indexOf("de")==-1;

  var navigator = document.getElementById("navigator-toolbox");
  if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
  var btn = document.createElement("toolbarbutton");
  btn.id = "undoclosetab-button";
  btn.setAttribute("label", "Undo Close Tab");
  btn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
  btn.setAttribute("command", "History:UndoCloseTab");
  btn.setAttribute("tooltiptext", "Kürzlich geschlossene Tabs");
  btn.setAttribute("type", "menu-button");
  btn.setAttribute("removable", "true");
  btn.style.listStyleImage = "url(data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAgAAAASAAAADAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcuFA06Yy0bw0YcFHIAAAAYAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXS8cpNejNf+zfCj9TCIWkgAAABkAAAADAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAACAAAAAgAAAAIAAAACAAAAFWk1Hr7nvkj//+BH/7eALP9DGxeDAAAAFAAAAAIAAAAAAAAACB0NCCYfDAc3HAsGOBwMBjgcDAc4HQwHNw0FAzkqDwt0hlIr7vnUVv//2Uv/jVYn8DcXD14AAAAMAAAAAAAAABlqNCLYlGZS+5VoUfeUZkz3lGVJ95VlRveWZUL4iVY19U8hFsOOWzHw/dhf/+3CTP90QSHXAAAAIgAAAAMAAAAjdkMx7/jx5P///Ob///TT///0yf//9sH///66/9vEh/9LIhijLhEOfLiKSvz/7W//y5xH/0UdE3sAAAAMAAAAJHVDMuz49fT////9////8P/o2L3/p31g/bONavuoe1j/VikZlQAAADFnNyHR99R2//DLaP9hMB7CAAAAGAAAACR1QzLs+PX0////////////+fTp/4xeTPw6EASvMBMLbjIXDzYAAAAhVCgYtePAeP//5of/hFQy3wAAACAAAAAkdUMy7Pz7+//g087/q4l9///////49O//mXNj8U0hE6UPBgM8BQIBPWk5Jdby2Jv///Sk/6h8Tu0AAAAjAAAAJHVDMuz+/f3/28zH/1klFNuSal309fHw///////dzcT/pYJy8ZJrWOrbw6H+//XC///ytf+SZ0XlAAAAIQAAACN2QzLu/v39/97Py/9LJBamNRIHfpt1avT28vH//////////v////T///7n////3P/q2bH/ZjIiwwAAABcAAAAabzop3bugl/uwjoP/VSkZkAAAACE2FQ1ddko62cSspP7s5OH//Pr4//v27f/jz73/i2JJ6C4aB00AAAAJAAAACSEPCSkjDgY/NhYMSyURDCMAAAAHAAAADAAAACE9GQ1wZzQk04FPP/h9STn1Vy8WuCQUBUEAAAAOAAAAAQAAAAAAAAABAAAAAwAAAAQAAAACAAAAAAAAAAAAAAADAAAADAAAABsAAAAkAAAAIwAAABYAAAAIAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/g8AAP4HAAD+AwAAgAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGAQAA//8AAA==)";
  navigator.palette.appendChild(btn);

  var popup = btn.appendChild(document.createElement("menupopup"));
  popup.setAttribute("onpopupshowing", "this.parentNode.populateUndoSubmenu();");
  popup.setAttribute("oncommand", "event.stopPropagation();");
  popup.setAttribute("context", "");
  popup.setAttribute("tooltip", "bhTooltip");
  popup.setAttribute("popupsinherittooltip", "true");

  btn._ss = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
  btn._undoCloseMiddleClick = HistoryMenu.prototype._undoCloseMiddleClick;
  btn.populateUndoSubmenu = eval("(" + HistoryMenu.prototype.populateUndoSubmenu.toString().replace(/._rootElt.*/, "") + ")");

  /*
  var ss = document.styleSheets[0];
  ss.insertRule('#undoclosetab-button .toolbarbutton-icon {list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 72px, 18px, 54px); -moz-transform: scaleX(-1) rotate(30deg);}', ss.cssRules.length);
  */

  UpdateUndoCloseTabCommand = function() {
    document.getElementById("History:UndoCloseTab").setAttribute("disabled", Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore).getClosedTabCount(window) == 0);
  };
  UpdateUndoCloseTabCommand();
  gBrowser.mTabContainer.addEventListener("TabClose", function() {UpdateUndoCloseTabCommand();}, false);
  gBrowser.mTabContainer.addEventListener("SSTabRestoring", function() {UpdateUndoCloseTabCommand();}, false);
  gSessionHistoryObserver.observe = eval("(" + gSessionHistoryObserver.observe.toString().replace(/(?=}$)/, "UpdateUndoCloseTabCommand();") + ")");
  

  var toolbars = document.querySelectorAll("toolbar");
  Array.slice(toolbars).forEach(function (toolbar) {
      var currentset = toolbar.getAttribute("currentset");
      if (currentset.split(",").indexOf("undoclosetab-button") < 0) return;
      toolbar.currentSet = currentset;
      try {
          BrowserToolboxCustomizeDone(true);
      } catch (ex) {
      }
  });
})();