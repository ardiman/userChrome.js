// ==UserScript==
// @name           TU_undoCloseTabButton.uc.js
// @namespace      TU_undoCloseTabButton@ithinc.cn
// @description    撤销关闭标签页按钮
// @include        main
// @compatibility  Firefox 4.0
// @author         ithinc
// @homepage       http://board.mozest.com/thread-32810-1-1
// @version        1.0.5.2
// @updateURL     https://j.mozest.com/ucscript/script/19.meta.js
// ==/UserScript==

/* :::: 撤销关闭标签页按钮 :::: */

(function TU_undoCloseTabButton() {
  var refNode = document.getElementById("urlbar");
  if (!refNode)
    return;

  var button = refNode.parentNode.insertBefore(document.createElement("toolbarbutton"), refNode.nextSibling);
  button.setAttribute("id", "undoclosetab-button");
  button.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
  button.setAttribute("label", "Undo Close Tab");
  button.setAttribute("command", "History:UndoCloseTab");
  button.setAttribute("tooltiptext", "K\u00FCrzlich geschlossene Tabs");
  button.setAttribute("type", "menu-button");
  button.setAttribute("image", "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAgAAAASAAAADAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcuFA06Yy0bw0YcFHIAAAAYAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXS8cpNejNf+zfCj9TCIWkgAAABkAAAADAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAACAAAAAgAAAAIAAAACAAAAFWk1Hr7nvkj//+BH/7eALP9DGxeDAAAAFAAAAAIAAAAAAAAACB0NCCYfDAc3HAsGOBwMBjgcDAc4HQwHNw0FAzkqDwt0hlIr7vnUVv//2Uv/jVYn8DcXD14AAAAMAAAAAAAAABlqNCLYlGZS+5VoUfeUZkz3lGVJ95VlRveWZUL4iVY19U8hFsOOWzHw/dhf/+3CTP90QSHXAAAAIgAAAAMAAAAjdkMx7/jx5P///Ob///TT///0yf//9sH///66/9vEh/9LIhijLhEOfLiKSvz/7W//y5xH/0UdE3sAAAAMAAAAJHVDMuz49fT////9////8P/o2L3/p31g/bONavuoe1j/VikZlQAAADFnNyHR99R2//DLaP9hMB7CAAAAGAAAACR1QzLs+PX0////////////+fTp/4xeTPw6EASvMBMLbjIXDzYAAAAhVCgYtePAeP//5of/hFQy3wAAACAAAAAkdUMy7Pz7+//g087/q4l9///////49O//mXNj8U0hE6UPBgM8BQIBPWk5Jdby2Jv///Sk/6h8Tu0AAAAjAAAAJHVDMuz+/f3/28zH/1klFNuSal309fHw///////dzcT/pYJy8ZJrWOrbw6H+//XC///ytf+SZ0XlAAAAIQAAACN2QzLu/v39/97Py/9LJBamNRIHfpt1avT28vH//////////v////T///7n////3P/q2bH/ZjIiwwAAABcAAAAabzop3bugl/uwjoP/VSkZkAAAACE2FQ1ddko62cSspP7s5OH//Pr4//v27f/jz73/i2JJ6C4aB00AAAAJAAAACSEPCSkjDgY/NhYMSyURDCMAAAAHAAAADAAAACE9GQ1wZzQk04FPP/h9STn1Vy8WuCQUBUEAAAAOAAAAAQAAAAAAAAABAAAAAwAAAAQAAAACAAAAAAAAAAAAAAADAAAADAAAABsAAAAkAAAAIwAAABYAAAAIAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/g8AAP4HAAD+AwAAgAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGAQAA//8AAA==");

  var popup = button.appendChild(document.createElement("menupopup"));
  popup.setAttribute("onpopupshowing", "this.parentNode.populateUndoSubmenu();");
  popup.setAttribute("oncommand", "event.stopPropagation();");
  popup.setAttribute("context", "");
  popup.setAttribute("tooltip", "bhTooltip");
  popup.setAttribute("popupsinherittooltip", "true");

  button._ss = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
  button._undoCloseMiddleClick = HistoryMenu.prototype._undoCloseMiddleClick;
  button.populateUndoSubmenu = eval("(" + HistoryMenu.prototype.populateUndoSubmenu.toString().replace(/._rootElt.*/, "") + ")");

  var ss = document.styleSheets[document.styleSheets.length-1];
    ss.insertRule('#undoclosetab-button[disabled="true"] {opacity: 0.5 !important;}', ss.cssRules.length);

  UpdateUndoCloseTabCommand = function() {
    document.getElementById("History:UndoCloseTab").setAttribute("disabled", Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore).getClosedTabCount(window) == 0);
  };
  UpdateUndoCloseTabCommand();
  gBrowser.mTabContainer.addEventListener("TabClose", function() {UpdateUndoCloseTabCommand();}, false);
  gBrowser.mTabContainer.addEventListener("SSTabRestoring", function() {UpdateUndoCloseTabCommand();}, false);
  gSessionHistoryObserver.observe = eval("(" + gSessionHistoryObserver.observe.toString().replace(/(?=}$)/, "UpdateUndoCloseTabCommand();") + ")");
})();