// ==UserScript==
// @name           SmartScrollbar_mod.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// @version        0.0.4
// @note           encodeURIComponent を使うように修正
// ==/UserScript==
// thx! http://www.geocities.jp/adsldenet/past/sample.html

(function(){
  const HIDE_START     = true;
  const HIDE_ALL       = true; // falseならコンテンツの一番外側のスクロールバーのみ有効
  const HIDE_SCROLLBAR = false;

  var css = <![CDATA[
    scrollbar * { background: transparent !important; }

scrollbar[orient="vertical"] 
{ -moz-appearance: none ! important;
border: none !important; 
min-width: 0px !important; 
max-width: 0px !important;}

scrollbar[orient="horizontal"]
{ -moz-appearance: none ! important;
border: none !important; 
min-height: 0px !important; 
max-height: 0px !important;}

scrollbar thumb[orient="vertical"]
{ -moz-appearance: none !important; 
border: none !important; 
min-width: 0px !important; 
max-width: 0px !important; }

scrollbar thumb[orient="horizontal"]
{ -moz-appearance: none !important; 
border: none !important; 
min-height: 0px !important; 
max-height: 0px !important; } 

scrollbar scrollbarbutton
{ -moz-appearance: none ! important;
min-height: 0px ! important;
min-width: 0px ! important;
background-color: transparent !important;
border: none !important; }

scrollbar gripper { display: none !important; }
scrollcorner { background: transparent !important; }

  ]]>.toString();

  if (HIDE_SCROLLBAR)
    css = 'html|html > scrollbar { visibility: collapse !important; }';
  var NS = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");';
      NS += '@namespace html url("http://www.w3.org/1999/xhtml");';
  css = NS + css;

  if (HIDE_ALL)
    css = css.replace(/html\|html > /g, 'html|*:not(html|select) > ');
  
  var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
  var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));

  var p = document.getElementById('devToolsSeparator');
  var m = document.createElement('menuitem');
  m.setAttribute('label', "Scrollbar ausblenden");
  m.setAttribute('type', 'checkbox');
  m.setAttribute('autocheck', 'false');
  m.setAttribute('checked', HIDE_START);
  p.parentNode.insertBefore(m, p);

  m.addEventListener('command', command, false);

  if (HIDE_START) {
    sss.loadAndRegisterSheet(uri,sss.AGENT_SHEET);
  }


  function command(){
    if (sss.sheetRegistered(uri, sss.AGENT_SHEET)){
      sss.unregisterSheet(uri, sss.AGENT_SHEET);
      m.setAttribute('checked', false);
    } else {
      sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
      m.setAttribute('checked', true);
    }
  }
  
})();