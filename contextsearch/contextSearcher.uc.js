// ==UserScript==
// @name           contextSearcher.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @description    Erweiterte Suchefunktion aus dem Kontextmenu 
// @include        main
// @compatibility  Firefox 44
// @version        0.1.1
// @note           0.1.1 e10s で選択文字列の検索ができなかったのを修正
// @note           0.1.0 e10s に対応したかも
// @note           0.0.9 「々」「ゞ」が拾えなかったのを修正
// @note           0.0.8 Firefox 19 で入力欄で使えなくなったのを修正
// @note           0.0.8 NEW_TAB の初期値を browser.search.openintab にした
// @note           0.0.7 リンク上でも単語を取得するように変更
// @note           0.0.7 単語の取得を効率化
// @note           0.0.6 カタカナの正規表現のミスを修正
// @note           0.0.6 splitmenu をやめた（menu 部分をクリックして検索可能）
// @note           0.0.6 Mac でカーソル下の単語をうまく拾えてなかったらしいのを修正したかも
// @note           0.0.5 サブメニューを中クリックすると２回実行される問題を修正
// @note           0.0.5 メニューの検索エンジン名を非表示にした
// @note           0.0.5 カーソル下の単語の取得を調整
// @note           0.0.5 "・"をカタカナとして処理していたのを修正
// @note           0.0.4 アイコンの無い検索エンジンがあるとエラーになるのを修正
// ==/UserScript==
// http://f.hatena.ne.jp/Griever/20100918161044
// ホイールで既定のエンジン変更、サブメニューから他の検索エンジンの利用
// 右クリックの位置により選択文字列、カーソル下の単語を検索可能

if (window.contextSearcher) {
  window.contextSearcher.destroy();
  delete window.contextSearcher;
}

window.contextSearcher = {
  NEW_TAB: Services.prefs.getBoolPref("browser.search.openintab"),

  _regexp: {
    hiragana: "[\\u3040-\\u309F]+",
    katakana: "[\\u30A0-\\u30FA\\u30FC-\\u30FE]+",
    kanji   : "[\\u3005\\u4E00-\\u9FA0]+",
    suuji   : "[0-9_./,%-]+",
    eisu_han: "\\w[\\w\\-]*",
    eisu_zen: "[\\uFF41-\\uFF5A\\uFF21-\\uFF3A\\uFF10-\\uFF19]+",
    hankaku : "[\\uFF00-\\uFFEF]+",
    hangul  : "[\\u1100-\\u11FF\\uAC00-\\uD7AF\\u3130-\\u318F]+",
  },

  get startReg() {
    let reg = {};
    for(let n in this._regexp) {
      reg[n] = new RegExp('^' + this._regexp[n]);
    }
    delete this.startReg;
    return this.startReg = reg;
  },
  get endReg() {
    let reg = {};
    for(let n in this._regexp) {
      reg[n] = new RegExp(this._regexp[n] + '$');
    }
    delete this.endReg;
    return this.endReg = reg;
  },
  getCharType: function(aChar) {
    var c = aChar.charCodeAt(0);
    //if (c >= 0x30 && c <= 0x39) return "suuji";
    if (c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A || c === 0x5F) return "eisu_han";
    if (c >= 0x30A0 && c <= 0x30FA || c >= 0x30FC && c <= 0x30FE) return "katakana";
    if (c >= 0x3040 && c <= 0x309F) return "hiragana";
    if (c >= 0x4E00 && c <= 0x9FA0 || c === 0x3005) return "kanji";
    if (c >= 0xFF41 && c <= 0x9F5A || c >= 0xFF21 && c <= 0xFF3A || c >= 0xFF10 && c <= 0xFF19) return "eisu_zen";
    if (c >= 0xFF00 && c <= 0xFFEF) return "hankaku";
    if (c >= 0x1100 && c <= 0x11FF || c >= 0xAC00 && c <= 0xD7AF || c >= 0x3130 && c <= 0x318F) return "hangul";
    return "";
  },

  searchText: '',
  searchEngines: [],
  init: function(){
    this.isMac = navigator.platform.indexOf("Mac") == 0;
    this.searchService = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);
    this.context = document.getElementById('contentAreaContextMenu');
    var searchselect = document.getElementById('context-searchselect');
    searchselect.style.display = 'none';

    this.menu = this.context.insertBefore(document.createElement('menu'), searchselect);
    this.menu.setAttribute('id', 'context-searcher');
    this.menu.setAttribute('class', 'menu-iconic');
    this.menu.setAttribute('accesskey', searchselect.accessKey);
    this.menu.setAttribute('onclick', 'if (event.target == this) { contextSearcher.command(event); closeMenus(this); }');

    this.popup = this.menu.appendChild( document.createElement('menupopup') );

    this.context.addEventListener('popupshowing', this, false);
    this.menu.addEventListener('DOMMouseScroll', this, false);
    window.addEventListener('unload', this, false);
  },

  uninit: function() {
    this.context.removeEventListener('popupshowing', this, false);
    this.menu.removeEventListener('DOMMouseScroll', this, false);
    window.removeEventListener('unload', this, false);
  },

  destroy: function(){
    this.uninit();
    document.getElementById('context-searchselect').style.removeProperty('display');
    var m = document.getElementById('context-searcher');
    if (m)
      m.parentNode.removeChild(m);
  },

  handleEvent: function(event) {
    if (this[event.type])
      this[event.type](event);
  },
  
  unload: function(e){
    this.uninit();
  },

  DOMMouseScroll: function(e) {
    if (this.searchEngines.length === 0)
      this.searchEngines = this.searchService.getVisibleEngines({});
    if (!this.searchEngines || this.searchEngines.length == 0)
      return;
    
    var index = this.searchEngines.indexOf(this.searchService.currentEngine);
//    var newEngine = e.detail > 0?
//      this.searchEngines[index+1] || this.searchEngines[0]:
//      this.searchEngines[index-1] || this.searchEngines[this.searchEngines.length -1];
    var newEngine = e.detail > 0? this.searchEngines[index+1] : this.searchEngines[index-1];
    if (!newEngine)
      return;
    this.searchService.currentEngine = newEngine;
    this.setMenuitem();
  },

  command: function(e){
    var target = e.target;
    var engine = e.target.engine || this.menu.engine;

    var submission = engine.getSubmission(this.searchText, null);
    if (!submission)
      return;

    var where = whereToOpenLink(e);
    if (this.NEW_TAB && where === 'current' || where === 'save')
      where = 'tab';

    openLinkIn(submission.uri.spec, where, {
      postData: submission.postData,
      relatedToCurrent: true
    });
  },

  setMenuitem: function() {
    var currentEngine = this.searchService.currentEngine;
    var l = this.searchText.length > 16? this.searchText.substr(0, 16) + '...' : this.searchText;
    this.menu.engine = currentEngine;
    //this.menu.setAttribute('label', gNavigatorBundle.getFormattedString("contextMenuSearchText", [currentEngine.name, l]));
    this.menu.setAttribute('label', '"' + l + '" Suche');
    this.menu.setAttribute('tooltiptext', currentEngine.name);
    if (currentEngine.iconURI)
      this.menu.style.listStyleImage = 'url("' + currentEngine.iconURI.spec + '")';
    else 
      this.menu.style.removeProperty('list-style-image');
  },

  popupshowing: function(e){
    if (e.target != this.context) return;

    this.searchText = 
      gContextMenu.onTextInput? this.getTextInputSelection(gContextMenu.ownerDoc) :
      gContextMenu.isTextSelected? this.getBrowserSelection(gContextMenu.ownerDoc) :
      gContextMenu.onImage? gContextMenu.target.getAttribute('alt') :
      //gContextMenu.onLink? gContextMenu.linkText() :
      this.getCursorPositionText();

    if (!this.searchText || !/\S/.test(this.searchText)) {
      this.menu.hidden = true;
      return;
    }
    if (this.searchText.length > 256)
      this.searchText = this.searchText.substr(0, 256);
    this.menu.hidden = false;
    
    if (!this.popup.hasChildNodes() || e.ctrlKey)
      this.createMenuitem();
    
    this.setMenuitem();
  },
  
  createMenuitem: function(){
    this.searchEngines = this.searchService.getVisibleEngines({});
    if (!this.searchEngines || this.searchEngines.length == 0)
      return;

    var f;
    while (f = this.popup.firstChild) {
      this.popup.removeChild(f);
    }

    this.menu.engine = this.searchService.currentEngine;
    if (this.menu.engine.iconURI)
      this.menu.style.listStyleImage = 'url("' + this.menu.engine.iconURI.spec + '")';
    else 
      this.menu.style.removeProperty('list-style-image');
    for (var i = 0, s = this.searchEngines, l = s.length; i < l; i++) {
      var engine = s[i];
      var m = document.createElement('menuitem');
      m.setAttribute('label', engine.name);
      m.setAttribute('class', 'menuitem-iconic bookmark-item');
      if (engine.iconURI) {
        m.setAttribute('image', engine.iconURI.spec);
      }
      m.setAttribute('oncommand', 'contextSearcher.command(event);');
      m.setAttribute('onclick', 'checkForMiddleClick(this, event);');
      m.engine = engine;
      this.popup.appendChild(m);
    }
  },
  
  getBrowserSelection: function (doc) {
    var sel = doc.defaultView.getSelection();
    var str = '';
    if (sel.isCollapsed)
      return str;

    for(var i = 0, l = sel.rangeCount; i < l; i++) {
      str += sel.getRangeAt(i) + ' ';
    }
    return str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' ');
  },
  
  getTextInputSelection: function (doc) {
    var elem = document.activeElement;
    if (!elem || !elem.value) return '';
    var str = elem.value.slice(elem.selectionStart, elem.selectionEnd);
    return str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' ');
  },

  getCursorPositionText: function() {
    var node = gContextMenuContentData.event.rangeParent;
    var offset = gContextMenuContentData.event.rangeOffset;
    if (!node || node.nodeType !== Node.TEXT_NODE)
      return "";

    var text = node.nodeValue;

    // 文字の右半分をクリック時に次の文字を取得する対策
    var range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    var rect = range.getBoundingClientRect();
    range.detach();
    if (rect.left >= gContextMenuContentData.event.clientX)
      offset--;

    if (!text[offset]) return "";
    var type = this.getCharType(text[offset]);
    if (!type) return "";

    var mae = text.substr(0, offset);
    var ato = text.substr(offset); // text[offset] Inhalt
    var ato_word = (this.startReg[type].exec(ato) || [""])[0];
    var str = this.endReg[type].test(mae) ? RegExp.lastMatch + ato_word : ato_word;

    if (str.length === 1) {
      if (type === "kanji") {
        if (this.startReg["hiragana"].test(ato.substr(ato_word.length)))
          str += RegExp.lastMatch;
      } else {
        return "";
      }
    }
    
    return str;
  },
  
  log: function() {
    console.log("[contextSearcher] " + Array.slice(arguments));
  }
}

window.contextSearcher.init();
