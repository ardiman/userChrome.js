<!--
// ==UserScript==
// @name           errorconsoleintab.uc.js
// @compatibility  Firefox 8.*, 9.*
// @include        main
// @version        1.0.20120112
// ==/UserScript==
-->

ucjs_errcontab = {
  init: function() {
    const err_con_ids = ['javascriptConsole','appmenu_errorConsole','webdeveloper-error-console-toolbar'];
    const sCmd = 'getBrowser (). selectedTab = getBrowser (). addTab ("chrome://global/content/console.xul")';
    for (var i = 0; i < err_con_ids.length; i++) {
      var ele=document.getElementById(err_con_ids[i]);
      if (ele!=null) ele.setAttribute("oncommand",sCmd);
    }
  }
};
ucjs_errcontab.init();