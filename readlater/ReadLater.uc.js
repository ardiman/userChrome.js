// ==UserScript==
// @name           readLater.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    稍后阅读
// @author         Alice0775
// @include        main
// @compatibility  Firefox 2.0 3.0
// ==/UserScript==
// @version        LastMod 2008/01/04 23:00 スクロール位置保存
// @version        LastMod 2007/11/28 05:00 コード整理。
// @version        LastMod 2007/11/27 02:00 ttp:等で始まるものに対応。
// @version        LastMod 2007/11/19 01:00 ダブって登録される場合があったのを修正。
// @version        LastMod 2007/11/15 01:00 ステータスバーからのD&D。
// @version        LastMod 2007/11/14 20:00 セッションを保存するようにした。
// @version        LastMod 2007/11/13 19:20 javascript, data:は登録しないようにした。
// @version        LastMod 2007/11/13 18:00
//
// 有用的功能/外部程序
// readLater.addData(url, title);              // 添加url
// readLater.openURL(readLater.getData().url); // 阅读最后一项
// readLater.allOpen();                        // 全部打开
// readLater.allclear();                       // 全部移除
// readLater.delData(url);                     // 移除url
// readLater.getData();                        //{url,title}对象从底部列表中移除
//
//

readLater = {
  AUTODEL: true, //delete item when open it.
  MENUINDEX:3,
  arrTAB : [],
  arrSCX : [],
  init: function(){
    const kXULNS =
         "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    LOCALE = (Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale")).indexOf("zh")==-1;
    this.TOOLTIP      = LOCALE?"Lesen Sie sp\u00E4ter":"\uFEFF\u5168\u90E8\u79FB\u9664";
    this.CLEARLABEL   = LOCALE?"Alles l\u00F6schen" :"\uFEFF\u5168\u90E8\u79FB\u9664";
    this.ALLOPENLABEL = LOCALE?"Alles \u00F6ffnen"  :"\uFEFF\u5168\u90E8\u6253\u5F00";
    this.ADDLABEL     = LOCALE?"Lesen Sie das sp\u00E4ter"           :"\uFEFF\u7A0D\u540E\u9605\u8BFB.";
    this.CLEARWARNING = LOCALE?"Wollen Sie alles l\u00F6schen?"  :"\uFEFF\u662F\u5426\u8981\u5168\u90E8\u79FB\u9664\uFF1F";
    this.OPENALLWARNING = LOCALE?"Wollen Sie alles \u00F6ffnen?" :"\u662F\u5426\u8981\u5168\u90E8\u6253\u5F00\uFF1F";

    this.popup= function(){}
    var statusbarpanel = document.createElementNS(kXULNS,"statusbarpanel");
    statusbarpanel.setAttribute("id","readLater");
    statusbarpanel.setAttribute("class","statusbarpanel-menu-iconic");
    statusbarpanel.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAnElEQVQ4jcWTyw0DMQhEx24gJc2NItJBqtljOkgbiMZgD/Emq/VHjnzISMiSEWN4wgBww6pEZCMZAKaCZIjI9jEgGaoa7j4VqhrlQaTiEe5et/a8v8/Hq0rlnAEg5dXx/29QMzjm7qnw6DNoABvl2iO0TDrGfQbngkFXqYQ392CgM4P4qfJqBCCRhJlNF5kZSH4vlj/TRQeXqSXbATJtb4tQeT1wAAAAAElFTkSuQmCC");
    statusbarpanel.setAttribute("tooltiptext",this.TOOLTIP+"[0]");
    statusbarpanel.setAttribute("style","padding: 0px 2px;");
    statusbarpanel.setAttribute("onclick","if(event.button==0) readLater.popup();");
    statusbarpanel.style.opacity = '0.5';
    document.getElementById("status-bar").appendChild(statusbarpanel);

    var menupopup = document.createElementNS(kXULNS,"menupopup");
    menupopup.setAttribute("id","readLater-popup");
    menupopup.setAttribute("menugenerated","true");
    menupopup.setAttribute("position","before_start");
    menupopup.setAttribute("onpopupshowing","readLater.mainPopupShowing(event)");
    statusbarpanel.appendChild(menupopup);

    var menuitem = document.createElementNS(kXULNS,"menuitem");
    menuitem.setAttribute("id","readLater-Clear");
    menuitem.setAttribute("accesskey","c");
    menuitem.setAttribute("label",this.CLEARLABEL);
    menuitem.setAttribute("tooltiptext",this.CLEARLABEL);
    menuitem.setAttribute("oncommand","readLater.allclear(true);");
    menupopup.appendChild(menuitem);

    menuitem = document.createElementNS(kXULNS,"menuitem");
    menuitem.setAttribute("id","readLater-allOpen");
    menuitem.setAttribute("accesskey","o");
    menuitem.setAttribute("label",this.ALLOPENLABEL);
    menuitem.setAttribute("tooltiptext",this.ALLOPENLABEL);
    menuitem.setAttribute("oncommand","readLater.allOpen()");
    menupopup.appendChild(menuitem);

    menupopup.appendChild(document.createElementNS(kXULNS,"menuseparator"));

    menuitem = document.createElementNS(kXULNS,"menuitem");
    menuitem.setAttribute("id","readLater-addList");
    menuitem.setAttribute("accesskey","R");
    menuitem.setAttribute("label",this.ADDLABEL);
    menuitem.setAttribute("tooltiptext",this.ADDLABEL);
    menuitem.setAttribute("oncommand","readLater.addList()");
    document.getElementById("contentAreaContextMenu").appendChild(menuitem);

    statusbarpanel.setAttribute("ondraggesture","nsDragAndDrop.startDrag(event, readLater)");
    statusbarpanel.setAttribute("ondragover","nsDragAndDrop.dragOver(event, readLater)");
    statusbarpanel.setAttribute("ondragexit","nsDragAndDrop.dragExit(event, readLater)");
    statusbarpanel.setAttribute("ondragdrop","nsDragAndDrop.drop(event, readLater)");
    this.restoreForWindow();
    this.statusIcon();
    this.addPrefListener(readLater.readLaterPrefListener); // 登録処理
    gBrowser.addEventListener("load", readLater.loadListener, true);
  },

  uninit: function(event){
    this.removePrefListener(readLater.readLaterPrefListener); // 登録解除
    gBrowser.removeEventListener("load", readLater.loadListener, true);
  },

  mainPopupShowing: function(event){
    const kXULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var menupopup = document.getElementById("readLater-popup");
    for(i = this.MENUINDEX, len = menupopup.childNodes.length; i < len; i++){
      menupopup.removeChild(menupopup.lastChild)
    }
    for(var i = 0; i < this.arrURL.length; i++){
      var menuitem = document.createElementNS(kXULNS, "menuitem");
      menuitem.setAttribute("url",   this.arrURL[i]);
      menuitem.setAttribute("title", this.arrTTL[i]);
      menuitem.setAttribute("scroll", this.arrSCRL[i]);
      var dd = new Date();
      var lbl = dd.getDate() + "." + (dd.getMonth() + 1) + "." + dd.getFullYear() + " " + dd.getHours() + ":" + dd.getMinutes();
      menuitem.setAttribute("label","["+lbl+"] "+ this.arrTTL[i]);
      menuitem.setAttribute("tooltiptext", this.arrURL[i]);
      menuitem.setAttribute("oncommand", "readLater.openURL(this.getAttribute('url'),this.getAttribute('scroll'))");
      menupopup.appendChild(menuitem);
    }

    if(menupopup.childNodes.length < this.MENUINDEX + 1){
      menupopup.childNodes[0].setAttribute("disabled", true);
      menupopup.childNodes[1].setAttribute("disabled", true);
      menupopup.childNodes[2].setAttribute("hidden",   true);
    }else{
      menupopup.childNodes[0].setAttribute("disabled", false);
      menupopup.childNodes[1].setAttribute("disabled", false);
      menupopup.childNodes[2].removeAttribute("hidden");
    }
  },

  statusIcon: function(){
    var len = this.arrURL.length;
    var statusbarpanel = document.getElementById("readLater");
    statusbarpanel.setAttribute("tooltiptext", this.TOOLTIP + "[" + len + "]");
    statusbarpanel.style.opacity = ( len > 0) ? '1' : '0.5';
  },

  _getFocusedWindow: function(){
    var focusedWindow = document.commandDispatcher.focusedWindow;
    if (!focusedWindow || focusedWindow == window)
      return window._content;
    else
      return focusedWindow;
  },

  addList: function(event){
    var url   = (gContextMenu.onLink) ? gContextMenu.linkURL
                                      : this._getFocusedWindow().content.document.URL;
    var title = (gContextMenu.onLink) ? gContextMenu.linkText()
                                      : this._getFocusedWindow().content.document.title;
    var scroll = (gContextMenu.onLink) ? 0 : this._getFocusedWindow().content.scrollY;
    this.addData(url, title, scroll)
  },

  addData: function(aURL, aTitle, scroll){
    aURL = aURL.replace(/^\s+/,'').replace(/\s+$/,'');
    for(var i = 0; i < this.arrURL.length; i++){
      if (aURL == this.arrURL[i]) return;
    }
    if (aTitle.length > 30) aTitle = aTitle.substr(0,30) + "...";
    this.arrURL.push(aURL);
    this.arrTTL.push(aTitle);
    if(!!scroll)
      this.arrSCRL.push(scroll);
    else
      this.arrSCRL.push(null);

    this.saveForWindow();
    this.statusIcon();
  },

  openURL: function(url,scroll){
    var URIFixup = Components.classes['@mozilla.org/docshell/urifixup;1']
                   .getService(Components.interfaces.nsIURIFixup);
    var uri = URIFixup.createFixupURI(
      url, // URI or file path (encoded in any charset)
      URIFixup.FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP );
    try{
      // urlSecurityCheck wanted a URL-as-string for Fx 2.0, but an nsIPrincipal on trunk
      if(gBrowser.contentPrincipal)
        urlSecurityCheck(uri.spec, gBrowser.contentPrincipal,
                         Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT);
      else
        urlSecurityCheck(uri.spec, gBrowser.currentURI.spec,
                         Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT);
      //openNewTabWith(uri.spec, null, null, null, false);
      // should we open it in a new tab?
      var loadInBackground = true;
      try {
        loadInBackground = this.getPref("browser.tabs.loadInBackground",'bool',true);
      }catch(ex) {}
      var newTab = gBrowser.loadOneTab(uri.spec, null, null, null, loadInBackground, false);
      this.arrTAB.push(newTab)
      if(!scroll)
        this.arrSCX.push(0);
      else
        this.arrSCX.push(scroll);
    }catch(e){}
    //loadURI(uri.spec, null, null, false);
    if(this.AUTODEL)
        this.delData(url);
  },




  getData: function(){
    if(this.arrURL.length < 1){
      return null;
    }else{
      var url   = this.arrURL.pop();
      var title = this.arrTTL.pop();
      var scroll = this.arrSCRL.pop();
    }
    this.saveForWindow();
    this.statusIcon();
    return {url:url, title:title, scroll:scroll};
  },

  delData: function(url){
    var len =this.arrURL.length;
    if(len < 1){
      return;
    }else{
      url = url.replace(/^\s+/,'').replace(/\s+$/,'');
      var arr1 = this.arrURL;
      var arr2 = this.arrTTL;
      var arr3 = this.arrSCRL;
      this.arrURL = [];
      this.arrTTL = [];
      this.arrSCRL = [];
      for(var i = 0; i < len; i++){
        if(arr1[i] == url) continue;
        this.arrURL.push(arr1[i]);
        this.arrTTL.push(arr2[i]);
        this.arrSCRL.push(arr3[i]);
      }
      this.saveForWindow();
      this.statusIcon();
    }
  },

  allOpen: function(){
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                  .getService(Components.interfaces.nsIPromptService);
    var result = prompts.confirm(window, "Sp\u00E4ter lesen", this.OPENALLWARNING);
    if(!result) return;
    for(var i = this.arrURL.length - 1; i > -1; i--){
      this.openURL(this.arrURL[i], this.arrSCRL[i]);
    }
  },

  allclear: function(warn){
    if(warn){
      var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                    .getService(Components.interfaces.nsIPromptService);
      var result = prompts.confirm(window, "Sp\u00E4ter lesen", this.CLEARWARNING);
      if(!result) return;
    }
    this.arrURL = [];
    this.arrTTL = [];
    this.arrSCRL = [];
    this.saveForWindow();
    this.statusIcon();
  },

  restoreForWindow: function(){
    this.arrURL = [];
    this.arrTTL = [];
    this.arrSCRL = [];
    var retrievedData = this.getPref("userChrome.readLater", "str", "");
    if(retrievedData){
      var arr = retrievedData.split(" ");
      var i = 0;
      for(var k = 0; k < arr.length; k++){
        this.arrURL[i] = decodeURI(arr[k]);
        k++;
        this.arrTTL[i] = decodeURI(arr[k]);
        i++;
      }
    }
    var retrievedData = this.getPref("userChrome.readLater.scroll", "str", "");
    if(retrievedData){
      var arr = retrievedData.split(",");
      for(var i = 0; i < arr.length; i++){
        this.arrSCRL[i] = decodeURI(arr[i]);
      }
    }

  },

  saveForWindow: function (){
    var aStringValue = "";
    for(var i = 0; i < this.arrURL.length; i++){
      aStringValue = aStringValue + " " + encodeURI(this.arrURL[i]);
      aStringValue = aStringValue + " " + encodeURI(this.arrTTL[i]);
    }
    this.setPref("userChrome.readLater", "str", aStringValue.replace(/^ /, ""));
    var aStringValue = "";
    for(var i = 0; i < this.arrURL.length; i++){
      aStringValue = aStringValue + "," + encodeURI(this.arrSCRL[i]);
    }
    this.setPref("userChrome.readLater.scroll", "str", aStringValue.replace(/^,/, ""));
  },

  getPref: function(aPrefString, aPrefType, aDefault){
    var xpPref = Components.classes['@mozilla.org/preferences-service;1']
                 .getService(Components.interfaces.nsIPrefService);
    try{
      switch (aPrefType){
        case 'complex':
          return xpPref.getComplexValue(aPrefString, Components.interfaces.nsILocalFile); break;
        case 'str':
          return xpPref.getCharPref(aPrefString).toString(); break;
        case 'int':
          return xpPref.getIntPref(aPrefString); break;
        case 'bool':
        default:
          return xpPref.getBoolPref(aPrefString); break;
      }
    }catch(e){
    }
    return aDefault;
  },

  setPref: function(aPrefString, aPrefType, aValue){
    var xpPref = Components.classes['@mozilla.org/preferences-service;1']
                 .getService(Components.interfaces.nsIPrefService);
    try{
      switch (aPrefType){
        case 'complex':
          return xpPref.setComplexValue(aPrefString, Components.interfaces.nsILocalFile, aValue);
          break;
        case 'str':
          return xpPref.setCharPref(aPrefString, aValue); break;
        case 'int':
          aValue = parseInt(aValue);
          return xpPref.setIntPref(aPrefString, aValue);  break;
        case 'bool':
        default:
          return xpPref.setBoolPref(aPrefString, aValue); break;
      }
    }catch(e){
    }
    return null;
  },

  // 監視を開始する
  addPrefListener: function(aObserver) {
      try {
          var pbi = Components.classes['@mozilla.org/preferences;1']
                    .getService(Components.interfaces.nsIPrefBranch2);
          pbi.addObserver(aObserver.domain, aObserver, false);
      } catch(e) {}
  },

  // 監視を終了する
  removePrefListener: function(aObserver) {
      try {
          var pbi = Components.classes['@mozilla.org/preferences;1']
                    .getService(Components.interfaces.nsIPrefBranch2);
          pbi.removeObserver(aObserver.domain, aObserver);
      } catch(e) {}
  },

  readLaterPrefListener:{
      domain  : 'userChrome.readLater',
          //"userChrome.readLater"という名前の設定が変更された場合全てで処理を行う

      observe : function(aSubject, aTopic, aPrefstring) {
          if (aTopic == 'nsPref:changed') {
              // 設定が変更された時の処理
              setTimeout(function(){
                readLater.restoreForWindow();
                readLater.statusIcon();
              }, 0);

          }
      }
  },
  //D&Dオブジェクトデータ取得
  getTransferData : function(aContentType, aDragSession){
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    var transfer = Cc["@mozilla.org/widget/transferable;1"].
        createInstance(Ci.nsITransferable);
    transfer.addDataFlavor(aContentType);
    aDragSession.getData (transfer, 0);
    var Data = {};
    Data.dataObj = new Object();
    Data.len = new Object();
    try{
      transfer.getTransferData(aContentType, Data.dataObj, Data.len);
    } catch (ex) {}
    return Data;
  },

  getSupportedFlavours : function () {
    var flavours = new FlavourSet();
    flavours.appendFlavour("text/unicode");
    return flavours;
  },

  onDragStart: function (event,transferData,action){
    var tartget = event.target;
    if(/menuitem/i.test(tartget.nodeName)){
      if(!tartget.hasAttribute('url')) return;
      var url   = tartget.getAttribute('url');
      var title = tartget.getAttribute('title');
      var o ={url:url, title:title};
      readLater.delData(url);
    }else
      var o = readLater.getData();
    transferData.data=new TransferData();
    if(o){
      transferData.data.addDataForFlavour("text/x-moz-url", o.url + "\n" + o.title);
      transferData.data.addDataForFlavour("text/unicode", o.url + "\n" + o.title);
      transferData.data.addDataForFlavour("text/html", '<a href="' + o.url + '">' + o.title + '</a>');
    }
  },

  onDragExit: function (event, aDragSession){
    document.getElementById("readLater-popup").hidePopup();
  },

  onDragOver: function (event, flavour, session) {
    var transData = readLater.getTransferData(flavour.contentType, session);
    var DragData = transData.dataObj.value.
            QueryInterface(Ci.nsISupportsString).
            data.substring(0, transData.len.value);
    event.target.setAttribute("dragover", "true");
    return (session.canDrop = /(^h?.?.ps?:\/\/)|(^ftp:).+$/i.test(DragData));
  },

  onDrop: function (event, dropdata, session) {
    if (dropdata.data != "") {
      var dat = transferUtils.retrieveURLFromData(dropdata.data, dropdata.flavour.contentType).split('\n');

      if( /(^h?.?.ps?:\/\/)|(^ftp:)|(^file:\/{3}).+$/i.test(dat[0]) ){
        dat[0] = dat[0].replace(/^(ttp|tp|h..p)/i,'http');
        if(dat.length==2 && dat[1] && dat[1]!=''){
         readLater.addData(dat[0],dat[1]);
        }else if(dat.length == 1){
         readLater.addData(dat[0],dat[0]);
        }
      }
    }
    event.stopPropagation();
  },

  debug: function(aMsg){
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    Cc["@mozilla.org/consoleservice;1"]
      .getService(Ci.nsIConsoleService)
      .logStringMessage(aMsg);
  },


  loadListener: function(event){
    if (event.originalTarget instanceof HTMLDocument) {
      var doc = event.originalTarget;
      if (event.originalTarget.defaultView.frameElement) return;
      var doc = event.originalTarget;
      var index = gBrowser.getBrowserIndexForDocument(doc);
      if(index < 0) return;
      var xBrowser = gBrowser.getBrowserAtIndex(index);
      for(var i=0;i<readLater.arrTAB.length;i++){
        var aTab = readLater.arrTAB[i];
        var aBrowser = gBrowser.getBrowserForTab(aTab);
        if(aBrowser == xBrowser) {
          if(readLater.arrSCX[i]>0){
            doc.defaultView.scrollTo(0, readLater.arrSCX[i]);
          }
          for(var j=i+1;j<readLater.arrTAB.length;j++){
            readLater.arrTAB[j-1] = readLater.arrTAB[j];
            readLater.arrSCX[j-1] = readLater.arrSCX[j];
          }
          readLater.arrTAB.pop();
          readLater.arrSCX.pop();
          return;
        }
      }
    }
  }

}

readLater.init();
window.addEventListener("unload", function(event){ readLater.uninit(event); }, false);
