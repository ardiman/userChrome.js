// ==UserScript==
// @name           pasteAndGoInForm.uc.js
// @namespace      pasteAndGoInForm@ithinc.cn
// @description    网页搜索的粘贴并搜
// @compatibility  Firefox 4.0
// @author         ithinc
// @version        1.0.0.2
// @updateURL     https://j.mozest.com/ucscript/script/36.meta.js
// ==/UserScript==

/* :::: 网页搜索的粘贴并搜索 :::: */

(function pasteAndGoInForm() {
  var item = document.createElement("menuitem");
  item.setAttribute("id", "context-pasteandgo");
  item.setAttribute("label", "Paste & Go");
  item.setAttribute("accesskey", "G");
  item.setAttribute("oncommand", "\
    goDoCommand('cmd_selectAll');\
    goDoCommand('cmd_paste');\
    window.QueryInterface(Ci.nsIInterfaceRequestor)\
          .getInterface(Ci.nsIDOMWindowUtils)\
          .sendKeyEvent('keypress', KeyEvent.DOM_VK_RETURN, 0, 0);\
  ");
  document.getElementById("contentAreaContextMenu").insertBefore(item, document.getElementById("context-paste").nextSibling);

  var ss = document.styleSheets[0];
  ss.insertRule("#context-paste:-moz-any([hidden='true'], [disabled='true']) ~ #context-pasteandgo {display: none;}", ss.cssRules.length);
})();