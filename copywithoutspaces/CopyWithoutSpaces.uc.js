// ==UserScript==
// @name           CopyWithoutSpaces.uc.js
// @compatibility  Firefox 42.*
// @include        main
// @version        1.0.20151107
// ==/UserScript==

var ucjs_cws = {

  init: function(){
    var menu = document.getElementById("contentAreaContextMenu");
    if (menu) {
      var menuitem = document.createElement("menuitem");
      menuitem.setAttribute("id", "ucjs_copywithoutspaces_menu");
      menuitem.setAttribute("label", "Ohne Leerzeichen kopieren");
      menuitem.setAttribute("hidden", true);
      menuitem.setAttribute("accesskey","L");
      menuitem.setAttribute("oncommand", "ucjs_cws.copywithoutspaces();");
      var optionsitem = document.getElementById("context-selectall");
      optionsitem.parentNode.insertBefore(menuitem, optionsitem);
      menu.addEventListener("popupshowing",  ucjs_cws.showitem, true);
    }
  },

  showitem: function(){
    try {
      let string = ucjs_cws.getselection();
      if(string != null && string.length > 0) {
        var menuitem = document.getElementById("ucjs_copywithoutspaces_menu");
        menuitem.setAttribute("hidden", false);
        return false;
      }
    } catch(err) {}
        var menuitem = document.getElementById("ucjs_copywithoutspaces_menu");
        menuitem.setAttribute("hidden", true);
        return true;
  },

  getselection: function() {
    let focusedWindow = document.commandDispatcher.focusedWindow;
    let searchStr = focusedWindow.getSelection.call(focusedWindow);
    searchStr = searchStr.toString();
    return searchStr;
  },

  copywithoutspaces: function(){
    try{
      let string = ucjs_cws.getselection() + "";
      string = string.replace(/[ \s]+/g, "");
      if(string != null && string.length > 0){
        let oClipBoard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
                         .getService(Components.interfaces.nsIClipboardHelper);
        oClipBoard.copyString(string);
      }
    }
    catch(err) {
      alert("copy_without_spaces - Unbekannter Fehler");
    }
  }
}

ucjs_cws.init();