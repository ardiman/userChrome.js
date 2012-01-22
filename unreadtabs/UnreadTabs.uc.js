// ==UserScript==
// @name           unreadTabs.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    ã‚¿ãƒ–ã®ç§»å‹•å¾Œã‚‚ã‚¿ãƒ–ã®é¸æŠžçŠ¶æ…‹(æœªèª­çŠ¶æ…‹)ã‚’ç¶­æŒã™ã‚‹ã€‚ The selected attribute (unread state) of tabs after moving a tab is preserved.
// @author         Alice0775
// @include        main
// @modified by    Alice0775
// @compatibility  4.0b8pre - 9
// @version        2011/10/16 12:00 ã‚¨ãƒ©ãƒ¼
// @version        2011/09/16 01:00 Bug 487242 - Implement 'unread' attribute for tabbrowser tabs
// @version        2011/07/23 01:00 16æ¡ã®æ—¥ä»˜
// @version        2010/12/22 11:00 æœ€è¿‘ã®Tree Style Tabã¯å¤‰æ›´å¤šã™ãŽã‚‹ã‹ã‚‰ã‚‚ã†çŸ¥ã‚‰ã‚“
// @version        2010/10/12 11:00 by Alice0775  4.0b8pre
// @version        2010/03/26 13:00 Minefield/3.7a4pre Bug 554991 -  allow tab context menu to be modified by normal XUL overlays
// @version        2010/03/15 00:00 Minefield/3.7a4pre Bug 347930 -  Tab strip should be a toolbar instead
// @version        2010/01/29 16:00 http://piro.sakura.ne.jp/latest/blosxom/mozilla/extension/treestyletab/2009-09-29_debug.htm
// @version        2010/01/12 13:00 deleteTabValueä¾‹å¤–å‡¦ç†
// ==/UserScript==
// @version        2009/09/02 13:00 xulãƒ‰ã‚­ãƒ¥ãƒ¡ãƒ³ãƒˆç­‰èª­ã¿è¾¼ã‚“ã å ´åˆã®ä¾‹å¤–å‡¦ç†
// @version        2009/09/01 19:00 ã‚³ãƒ¼ãƒ‰æ•´ç†, typo
// @version        2009/08/22 14:00 ã‚¿ãƒ–ã®ã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ"Remove UnRead For All Tabs"ã‚’è¡¨ç¤º
// @version        2009/08/21 08:00 CHECK_MD5 falseã‚’æ—¢å®šå€¤ã«ã—ãŸ
// @version        2009/08/06 12:10 typeä¿®æ­£, CHECK_MD5=falseãŒåŠ¹ã‹ãªããªã£ã¦ã„ãŸã®ã§ä¿®æ­£, tabãŒbusyã®æ™‚DOMContentLoadedã®è©•ä¾¡ã‚’ã¡ã‚‡ã£ã¨é…å»¶ã•ã›ã¦ã¿ãŸ
// @version        2009/08/06 restoreUnreadForTab
// @version        2009/08/06 typo this.setUnreadTa b (event.target);
// @version        2009/08/05 CSSã¯æœ€å¾Œã«å®Ÿè¡Œã™ã‚‹ã‚ˆã†ã«ã—ãŸ userChrome.cssäºŒè¨˜è¿°ã—ã¦ãŠãã®ãŒã„ã„ã‹ã‚‚
// @version        2009/07/19 ã‚³ãƒ³ãƒ†ãƒ³ãƒ„ã®æœªèª­åˆ¤å®šã«æ–‡æ›¸ã®md5ã‚’è¦‹ã‚‹ã‹ã©ã†ã‹è¿½åŠ 
// @version        2009/07/19
var unreadTabs = {
  // -- config --
  CONTENT_LOAD: true,     // [true]: Tab wird laden, false: Erst laden, wenn neuer und ungelesener Tab
  CHECK_MD5:    true,     // CONTENT_LOAD=true, wenn
                          // true: Prüfung des MD5 der ungelesenen Tabs, [false]: Keine Prüfung
                          // (auch frame-Tab wird mit false gleich behandelt)

  READ_SCROLLCLICK: false,// true: Scrollen, oder Klicken des Tabs [false]: Tabauswahl und lesen
  TABCONTEXTMENU: true,   // Tab-Kontextmenü-Eintrag:"Markierung für ungelesene Tabs entfernen" [ture]: Einblenden, false: Ausblenden
  READ_TIMER: 900,        // Umschaltzeit während der Tabauswahl READ_TIMER(msec)

  UNREAD_COLOR: 'red',    // Farbe rot: ungelesen
  UNREAD_STYLE: 'italic', // Schrift kursiv: ungelesen
  LOADING_COLOR:'blue',   // Farbe blau: Ladevorgang
  LOADING_STYLE:'normal', // Ladevorgang Schrift: normal
  // -- config --

  ss: null,

  init: function(){
    if('TM_init' in window ||
       'InformationalTabService' in window)
      return;

    this.CHECK_MD5 = this.CHECK_MD5 && this.CONTENT_LOAD;

    this.ss = Components.classes["@mozilla.org/browser/sessionstore;1"].
                           getService(Components.interfaces.nsISessionStore);

    if (this.TABCONTEXTMENU)
      this.tabContextMenu();

    window.addEventListener('unload', this, false);
    gBrowser.tabContainer.addEventListener('TabOpen', this, false);
    gBrowser.tabContainer.addEventListener('TabClose', this, false);
    gBrowser.tabContainer.addEventListener('TabSelect', this, false);
    gBrowser.tabContainer.addEventListener('SSTabRestoring', this, false);
    gBrowser.tabContainer.addEventListener('SSTabRestored', this, false);

    // æ—¢ã«ã‚ã‚‹ã‚¿ãƒ–ã«å¯¾ã—ã¦
    var that = this;
    init(0);
    function init(i){
      if(i < gBrowser.mTabs.length) {
        var aTab = gBrowser.mTabs[i];
        if(aTab.linkedBrowser.docShell.busyFlags
          || aTab.linkedBrowser.docShell.restoringDocument) {
          setTimeout(arguments.callee, 250, i);
        }else{
          that.initTab(aTab);
          if (!(aTab.hasAttribute('unreadTabs-restoring') ||
                aTab.hasAttribute('unreadTab')) ){
            that.restoreUnreadForTab(aTab);
            that.restoreMD5ForTab(aTab);
          }
          if (aTab.selected) {
              aTab.removeAttribute('unreadTabs-restoring')
            if (aTab.hasAttribute('unreadTab'))
              that.setReadForTab(aTab);
          }
          i++;
          arguments.callee(i);
        }
      }else{
      }
    }

    var func;
    // Tree Stryle Tab
    if ("treeStyleTab" in gBrowser &&
        "performDrop" in gBrowser.treeStyleTab) {
      func = gBrowser.treeStyleTab.performDrop.toString();
        func = func.replace(
        'targetBrowser.swapBrowsersAndCloseOther(tab, aTab);',
        <><![CDATA[
//window.userChrome_js.debug("swap  " + aTab.label + "  " + aTab.hasAttribute("unreadTab"));
        if (aTab.hasAttribute("unreadTab")) {
          tab.setAttribute('unreadTab', true);
        } else {
          tab.removeAttribute('unreadTab');
        }
        $&
        ]]></>
        );
      eval("gBrowser.treeStyleTab.performDrop = "+ func);

    } else if ("_onDrop" in gBrowser) {
      func = gBrowser._onDrop.toString();
        func = func.replace(
        'this.swapBrowsersAndCloseOther(newTab, draggedTab);',
        <><![CDATA[
//window.userChrome_js.debug("swap  " + draggedTab.label + "  " + draggedTab.hasAttribute("unreadTab"));
        if (draggedTab.hasAttribute("unreadTab")) {
          newTab.setAttribute("unreadTab", true);
        } else {
          newTab.removeAttribute("unreadTab");
        }
        $&
        ]]></>
        );
      eval("gBrowser._onDrop = "+ func);
    }
    //Multiple Tab Handler
    var menupopup = document.getElementById('multipletab-selection-menu');
    if (menupopup){
      var menuitem = document.createElement('menuitem');
      menuitem.setAttribute('label', 'Ungelesene ausgewählte Tabs umschalten');
      menuitem.setAttribute('oncommand', 'unreadTabs.toggleUnreadSelectedTabs();');
      menupopup.appendChild(menuitem);
    }

    var style = <><![CDATA[
    @namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");
      /*æœªèª­ã®ã‚¿ãƒ–ã®æ–‡å­—è‰²*/
      .tabbrowser-tab[unreadTab] .tab-text,
      .alltabs-item[unreadTab]
      {
        color: %UNREAD_COLOR%;
        font-style: %UNREAD_STYLE%;
      }

      /*èª­ã¿è¾¼ã¿ä¸­ã®ã‚¿ãƒ–ã®æ–‡å­—è‰²*/
      .tabbrowser-tab[busy] .tab-text,
      .alltabs-item[busy]
      {
        color: %LOADING_COLOR%;
        font-style: %LOADING_STYLE%;
      }
    ]]></>.toString().
                  replace(/%UNREAD_STYLE%/g, this.UNREAD_STYLE).
                  replace(/%UNREAD_COLOR%/g, this.UNREAD_COLOR).
                  replace(/%LOADING_STYLE%/g, this.LOADING_STYLE).
                  replace(/%LOADING_COLOR%/g, this.LOADING_COLOR).replace(/\s+/g, " ");
    var sspi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
    );
    document.insertBefore(sspi, document.documentElement);
    sspi.getAttribute = function(name) {
      return document.documentElement.getAttribute(name);
    };
  },

  uninit: function(){
    // ã‚¿ã‚¤ãƒžãƒ¼ã‚¯ãƒªã‚¢
    if (this._timer)
      clearTimeout(this._timer);

    // ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠã‚’å‰Šé™¤
    window.removeEventListener('unload', this, false);
    gBrowser.tabContainer.removeEventListener('TabOpen', this, false);
    gBrowser.tabContainer.removeEventListener('TabClose', this, false);
    gBrowser.tabContainer.removeEventListener('TabSelect', this, false);
    gBrowser.tabContainer.removeEventListener('SSTabRestoring', this, false);
    gBrowser.tabContainer.removeEventListener('SSTabRestored', this, false);

    // ã‚¿ãƒ–ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠã‚’å‰Šé™¤
    for (var i = 0; i < gBrowser.mTabs.length; i++) {
      try {
        gBrowser.mTabs[i].unreadTabsEventListener.destroy();
      } catch(e) {}
    }
  },

  tabContextMenu: function(){
    //tab context menu
    var tabContext = document.getAnonymousElementByAttribute(
                        gBrowser, "anonid", "tabContextMenu") ||
                     gBrowser.tabContainer.contextMenu;
    var menuitem = tabContext.appendChild(
                        document.createElement("menuitem"));
    menuitem.id = "removeunreadalltabs";
    menuitem.setAttribute("label", "Markierung für ungelesene Tabs entfernen");
    menuitem.setAttribute("accesskey", "M");
    menuitem.setAttribute("oncommand","unreadTabs.removeUnreadForAllTabs();");
  },


  // ã‚¿ãƒ–ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠã‚’ç™»éŒ²
  initTab: function(aTab){
    if (typeof aTab.unreadTabsEventListener == 'undefined')
      aTab.unreadTabsEventListener = new unreadTabsEventListener(aTab);
  },

  // ã‚¿ãƒ–ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠã‚’å‰Šé™¤
  uninitTab: function(aTab){
    if (aTab.unreadtimer)
      clearTimeout(aTab.unreadtimer);
    //try {
      aTab.unreadTabsEventListener.destroy();
      delete aTab.unreadTabsEventListener;
    //} catch(e) {}
  },

  checkCachedSessionDataExpiration : function(aTab) {
    var data = aTab.linkedBrowser.__SS_data; // Firefox 3.6-
    if (data &&
       data._tabStillLoading &&
       aTab.getAttribute('busy') != 'true')
      data._tabStillLoading = false;
  },

  // ã‚¿ãƒ–ã®çŠ¶æ…‹ã‚’ã‚»ãƒƒã‚·ãƒ§ãƒ³ãƒ‡ãƒ¼ã‚¿ã«ä¿å­˜
  saveUnreadForTab: function (aTab){
    if (aTab.hasAttribute("unreadTab"))
      this.ss.setTabValue(aTab, "unreadTab", true);
    else {
      //try {
        this.checkCachedSessionDataExpiration(aTab);
        this.ss.setTabValue(aTab, "unreadTab", '');
        //this.ss.deleteTabValue(aTab, "unreadTab");
      //} catch(e) {}
    }
  },

  // ã‚¿ãƒ–ã®çŠ¶æ…‹ã‚’ã‚»ãƒƒã‚·ãƒ§ãƒ³ãƒ‡ãƒ¼ã‚¿ã‹ã‚‰å¾©å…ƒ
  restoreUnreadForTab: function(aTab){
    var retrievedData = this.ss.getTabValue(aTab, "unreadTab");
//window.userChrome_js.debug( "restoreUnreadForTab " + !!retrievedData)
    if(typeof retrievedData != 'undefined' && retrievedData)
      aTab.setAttribute('unreadTab', true);
    else
      aTab.removeAttribute('unreadTab');
    return retrievedData;
  },

  // ã‚¿ãƒ–ã®MD5ã‚’ã‚»ãƒƒã‚·ãƒ§ãƒ³ãƒ‡ãƒ¼ã‚¿ã«ä¿å­˜
  saveMD5ForTab: function (aTab){
    if (!this.CHECK_MD5)
      return;
    if (aTab.hasAttribute('md5'))
      this.ss.setTabValue(aTab, "md5", aTab.getAttribute('md5'));
    else {
      //try {
        this.checkCachedSessionDataExpiration(aTab);
        this.ss.setTabValue(aTab, "md5", '');
        //this.ss.deleteTabValue(aTab, "md5");
      //} catch(e) {}
    }
  },

  // ã‚¿ãƒ–ã®MD5ã‚’ã‚»ãƒƒã‚·ãƒ§ãƒ³ãƒ‡ãƒ¼ã‚¿ã‹ã‚‰å¾©å…ƒ
  restoreMD5ForTab: function(aTab){
    if (!this.CHECK_MD5)
      return;
    var retrievedData = this.ss.getTabValue(aTab, "md5");
    if(typeof retrievedData != 'undefined' && retrievedData)
      aTab.setAttribute('md5', retrievedData);
    else
      aTab.removeAttribute('md5');
    return retrievedData;
  },

  setUnreadForTab: function(aTab){
//window.userChrome_js.debug("setUnreadForTab");
    aTab.setAttribute('unreadTab', true);
    this.saveUnreadForTab(aTab);
    this.saveMD5ForTab(aTab);
  },

  setReadForTab: function(aTab){
//window.userChrome_js.debug("setReadForTab");
    aTab.removeAttribute('unreadTab');
    this.saveUnreadForTab(aTab);
    this.saveMD5ForTab(aTab);
  },

  toggleUnreadSelectedTabs: function(){
    var tabs = MultipleTabService.getSelectedTabs();
    for (var i= 0; i < tabs.length; i++) {
      if (tabs[i].selected)
        continue;
      if (tabs[i].hasAttribute('unreadTab'))
        this.setReadForTab(tabs[i]);
      else
        this.setUnreadForTab(tabs[i]);
    }
  },

  removeUnreadForAllTabs: function(){
    for (var i= 0; i < gBrowser.mTabs.length; i++) {
      var aTab = gBrowser.mTabs[i];
      if (!aTab.hasAttribute('busy') &&
          aTab.hasAttribute('unreadTab'))
        this.setReadForTab(aTab);
    }
  },

  tabSelected: function(aTab){
    var Start = new Date().getTime();

    if (this._timer)
      clearTimeout(this._timer);

    if (!aTab.hasAttribute('unreadTab'))
      return;

    this._timer = setTimeout(function(self, aTab){
      //try {
        self.setReadForTab(aTab);
      //} catch(e) {}
    }, Math.max(this.READ_TIMER - ((new Date()).getTime()-Start), 0), this, aTab);
  },

  _timer: null,

  handleEvent: function(event){
    var aTab;
//window.userChrome_js.debug(event.type);
    switch (event.type) {
      case 'unload':
        this.uninit();
        break;
      case 'TabSelect':
        this.tabSelected(event.target);
        break;
      case 'TabOpen':
        this.initTab(event.target);
        this.setUnreadForTab(event.target);
        break;
      case 'TabClose':
        this.uninitTab(event.target);
        this.saveUnreadForTab(event.target);
        this.saveMD5ForTab(event.target);
        break;
      case 'SSTabRestoring':
        event.target.setAttribute('unreadTabs-restoring', true)
        break;
      case 'SSTabRestored':
        this.initTab(event.target);
        event.target.removeAttribute('unreadTabs-restoring')
        this.restoreUnreadForTab(event.target);
        this.restoreMD5ForTab(event.target);
        break;
    }
  }
}



function unreadTabsEventListener(aTab) {
  this.init(aTab);
}

unreadTabsEventListener.prototype = {
  mTab : null,
  init : function(aTab) {
    //window.userChrome_js.debug('init');
    this.mTab = aTab;
    if (unreadTabs.CONTENT_LOAD)
      this.mTab.linkedBrowser.addEventListener('DOMContentLoaded', this, false);
    if (unreadTabs.READ_SCROLLCLICK) {
      this.mTab.linkedBrowser.addEventListener('scroll', this, false);
      this.mTab.linkedBrowser.addEventListener('mousedown', this, false);
    }
  },
  destroy : function() {
    if (unreadTabs.CONTENT_LOAD)
      this.mTab.linkedBrowser.removeEventListener('DOMContentLoaded', this, false);
    if (unreadTabs.READ_SCROLLCLICK) {
      this.mTab.linkedBrowser.removeEventListener('scroll', this, false);
      this.mTab.linkedBrowser.removeEventListener('mousedown', this, false);
    }

    delete this.mTab;
  },
  handleEvent: function(aEvent) {
    switch (aEvent.type) {
      case 'DOMContentLoaded':
        //window.userChrome_js.debug('DOMContentLoaded');
        this.contentLoad(aEvent);
        break;

      case 'scroll':
      case 'mousedown':
        aTab = this.mTab;
        if (!aTab.hasAttribute('unreadTab'))
          return;

        unreadTabs.setReadForTab(aTab);
        break;

    }
  },

  // ã‚³ãƒ³ãƒ†ãƒ³ãƒˆèª­ã¿è¾¼ã¿æ™‚ã®å‡¦ç†
  contentLoad: function(aEvent){
      var aTab = this.mTab;
/**/
      if (aTab.unreadtimer)
        clearTimeout(aTab.unreadtimer);
      if (aTab.hasAttribute('busy') && unreadTabs.CONTENT_LOAD && unreadTabs.CHECK_MD5) {
        aTab.unreadtimer = setTimeout(function(aEvent, self){self.contentLoad(aEvent);}, 10, aEvent, this);
        return;
      }

      // ã‚³ãƒ³ãƒ†ãƒ³ãƒˆã®æ–‡æ›¸ã®MD5
      var doc = aTab.linkedBrowser.contentDocument;
      var md5 = null;
      var prevmd5 = null;
      if (unreadTabs.CHECK_MD5) {
        md5 = this.calculateHashFromStr(this.getTextContentForDoc(doc));
        if (aTab.hasAttribute('md5')) {
          prevmd5 = aTab.getAttribute('md5');
        }
        aTab.setAttribute('md5', md5);
      }

      // ã‚³ãƒ³ãƒ†ãƒ³ãƒˆã‚’èª­ã¿è¾¼ã‚“ã ã®ãŒå‰é¢ã®ã‚¿ãƒ–ãªã‚‰æ—¢èª­ã«ã‚»ãƒƒãƒˆ
      if (aTab.selected) {
          aTab.removeAttribute('unreadTabs-restoring')
        if (!aTab.hasAttribute('unreadTab'))
          return;
        unreadTabs.setReadForTab(aTab);
        return;
      }

      // ã‚¿ãƒ–ã®å¾©å…ƒä¸­ãªã‚‰ä½•ã‚‚ã—ãªã„
      if (aTab.hasAttribute('unreadTabs-restoring')) {
        //aTab.removeAttribute('unreadTabs-restoring')
        return;
      }

      // ã‚³ãƒ³ãƒ†ãƒ³ãƒˆã‚’èª­ã¿è¾¼ã‚“ã ã®ãŒèƒŒé¢ã®ã‚¿ãƒ–ãªã‚‰æœªèª­ã«ã‚»ãƒƒãƒˆ
      if (unreadTabs.CONTENT_LOAD) {
        if (!unreadTabs.CHECK_MD5 || md5 != prevmd5) {
          unreadTabs.setUnreadForTab(aTab);
        }
      }
  },

  getTextContentForDoc: function(aDocument) {
    try {
      if (aDocument.body) {
        var str = aDocument.body.textContent;
        return str.replace(/\b\d{1,2}\b/g,'').replace(/\b\d{1,16}\b/g,'').replace(/\s/g,'');
      }
    } catch(e) {
    }
    return "";
  },

  calculateHashFromStr: function(str) {
    var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                              .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    // ã“ã“ã§ã¯ UTF-8 ã‚’ä½¿ã„ã¾ã™ã€‚ä»–ã®ã‚¨ãƒ³ã‚³ãƒ¼ãƒ‡ã‚£ãƒ³ã‚°ã‚‚é¸ã¶ã“ã¨ã‚‚ã§ãã¾ã™ã€‚
    converter.charset = "UTF-8";
    // result ã¯å‡ºåŠ›ç”¨ãƒ‘ãƒ©ãƒ¡ãƒ¼ã‚¿ã§ã™ã€‚
    // result.value ã¯é…åˆ—ã®é•·ã•ã‚’ä¿æŒã—ã¾ã™ã€‚
    var result = {};
    // data ã¯ãƒã‚¤ãƒˆã®é…åˆ—ã§ã™ã€‚
    var data = converter.convertToByteArray(str, result);
    var ch = Components.classes["@mozilla.org/security/hash;1"]
                       .createInstance(Components.interfaces.nsICryptoHash);
    str = null;
    ch.init(ch.MD5);
    ch.update(data, data.length);
    var hash = ch.finish(false);
    str = data = ch = null;
    // 1 ãƒã‚¤ãƒˆã«å¯¾ã—ã¦ 2 ã¤ã® 16 é€²æ•°ã‚³ãƒ¼ãƒ‰ã‚’è¿”ã™ã€‚
    function toHexString(charCode)
    {
      return ("0" + charCode.toString(16)).slice(-2);
    }

    // ãƒã‚¤ãƒŠãƒªã®ãƒãƒƒã‚·ãƒ¥ãƒ‡ãƒ¼ã‚¿ã‚’ 16 é€²æ•°æ–‡å­—åˆ—ã«å¤‰æ›ã™ã‚‹ã€‚
    return [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
  }


};


unreadTabs.init();
