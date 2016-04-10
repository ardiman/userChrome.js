// ==UserScript==
// @name           downloadSoundPlay_Fx26.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Beim öffnen des Downloadmanager, nach Beenden, bei Abbruch und bei Fehler des Downloads Sound wiedergeben
// @include        main
// @compatibility  Firefox 45
// @author         Alice0775
// @version        2016/03/15 hack of selection chanhe
// @version        2015/01/15 1:00 Fixed strictmode
// @version        2013/12/18 11:00 defineLazyModuleGetter for Firefox26
// @version        2013/12/18 Firefox26
// @version        2009/11/28
// ==/UserScript==

var downloadPlaySound = {
  // -- config --
  DL_START : "file:///C:/WINDOWS/Media/tada.wav",
  DL_DONE  : "file:///C:/WINDOWS/Media/chimes.wav",
  DL_CANCEL: "file:///C:/Adaten/Abmeldesound.wav",
  DL_FAILED: "file:///C:/WINDOWS/Media/WindowsError.wav",
  // -- config --

  _list: null,
  init: function sampleDownload_init() {
    XPCOMUtils.defineLazyModuleGetter(window, "Downloads",
              "resource://gre/modules/Downloads.jsm");

    //window.removeEventListener("load", this, false);
    window.addEventListener("unload", this, false);

    //**** Zusätzliche Downloads Überwachung
    if (!this._list) {
      Downloads.getList(Downloads.ALL).then(list => {
        this._list = list;
        return this._list.addView(this);
      }).then(null, Cu.reportError);
    }
  },

  uninit: function() {
    window.removeEventListener("unload", this, false);
    if (this._list) {
      this._list.removeView(this);
    }
  },

  onDownloadAdded: function (aDownload) {
    //**** ダウンロード開始イベント
    if (this.DL_START)
      this.playSoundFile(this.DL_START);
  },

  onDownloadChanged: function (aDownload) {
    //**** ダウンロードキャンセル
    if (aDownload.canceled && this.DL_CANCEL)
      this.playSoundFile(this.DL_CANCEL)
    //**** ダウンロード失敗
    if (aDownload.error && this.DL_FAILED)
      this.playSoundFile(this.DL_FAILED)
    //**** ダウンロード完了
    if (typeof aDownload.downloadPlaySound == "undefined" &&
        aDownload.succeeded && aDownload.stopped && this.DL_DONE) {
      aDownload.downloadPlaySound = true;
      this.playSoundFile(this.DL_DONE);
    }
  },

  playSoundFile: function(aFilePath) {
    if (!aFilePath)
      return;
    var ios = Components.classes["@mozilla.org/network/io-service;1"]
              .createInstance(Components.interfaces["nsIIOService"]);
    try {
      var uri = ios.newURI(aFilePath, "UTF-8", null);
    } catch(e) {
      return;
    }
    var file = uri.QueryInterface(Components.interfaces.nsIFileURL).file;
    if (!file.exists())
      return;

    this.play(uri);
   },

  play: function(aUri) {
    var sound = Components.classes["@mozilla.org/sound;1"]
              .createInstance(Components.interfaces["nsISound"]);
    sound.play(aUri);
  },

  handleEvent: function(event) {
    switch (event.type) {
      case "unload":
        this.uninit();
        break;
    }
  }
}
downloadPlaySound.init();
