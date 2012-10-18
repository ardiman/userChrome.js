// ==UserScript==
// @name           errorconsoleintab.uc.js
// @compatibility  Firefox 8.*, 9.*, 16.*
// @include        main
// @version        1.0.20121018
// ==/UserScript==

ucjs_errcontab = {
  init: function() {
    const err_con_ids = ['javascriptConsole','appmenu_errorConsole','web-developer-error-console-toolbar'];
    const sCmd = 'getBrowser (). selectedTab = getBrowser (). addTab ("chrome://global/content/console.xul")';
    for (var i = 0; i < err_con_ids.length; i++) {
      var ele=document.getElementById(err_con_ids[i]);
      if (ele!=null) {
        ele.setAttribute("command",null);
        ele.setAttribute("label","Fehlerkonsole");
        ele.setAttribute("oncommand",sCmd);
      }
    }
  }
};
ucjs_errcontab.init();