// ==UserScript==
// @name        save selection
// @namespace      http://efcl.info/
// @description    選択範囲のテキストをファイルとして保存する
// @include     main
// @compatibility Firefox 2.0 3.0
// @Last Change:  2009/08/13
// ==/UserScript==

var saveSelection = {

  init: function() {
    this.mItem = document.createElement("menuitem");
    document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function() { saveSelection.onPopupShowing(this); }, false);
  },
   
  onPopupShowing: function(aPopup) {
    if (!gContextMenu.onImage) {
      aPopup.insertBefore(this.mItem, document.getElementById("context-sep-open"));
      this.mItem.setAttribute("oncommand", "saveSelection.launch();");
      this.mItem.setAttribute("label", !this.isJa() ? "Auswahl kopieren" : "\u9078\u629e\u7bc4\u56f2\u3092\u4fdd\u5b58");
      this.mItem.hidden = false;
      this.mItem.setAttribute("disabled", false);
    } else {
      this.mItem.hidden = true;
      this.mItem.setAttribute("disabled", true);
    }
  },
  _getFocusedWindow: function(){ //現在のウインドウを得る
      var focusedWindow = document.commandDispatcher.focusedWindow;
      if (!focusedWindow || focusedWindow == window)
          return window._content;
      else
          return focusedWindow;
  },

  _getselection: function() {  //選択されている文字列を得る
      var targetWindow = this._getFocusedWindow();
      var sel = Components.lookupMethod(targetWindow, 'getSelection').call(targetWindow);
      // for textfields
      if (sel && !sel.toString()) {
        var node = document.commandDispatcher.focusedElement;
        if (node &&
            (node.type == "text" || node.type == "textarea") &&
            'selectionStart' in node &&
            node.selectionStart != node.selectionEnd) {
            var offsetStart = Math.min(node.selectionStart, node.selectionEnd);
            var offsetEnd   = Math.max(node.selectionStart, node.selectionEnd);
            return node.value.substr(offsetStart, offsetEnd-offsetStart);
        }
      }
      return sel;
  },

  launch: function()
  {
    var sel = this._getselection();
    // オブジェクト生成
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Speichern unter", Components.interfaces.nsIFilePicker.modeSave);
    // ウィンドウに表示するファイルをフィルタする。
    fp.appendFilters(Components.interfaces.nsIFilePicker.filterAll);
    fp.appendFilter('txt', '*.txt');
    fp.appendFilter('JavaScript', '*.js');
    fp.appendFilter('Greasemonkey', '*.user.js');
    // ダイアログを開く
    var result = fp.show();
    if (result == nsIFilePicker.returnOK){
        var thefile = fp.file;
        // 文字コード指定
        var charset = 'UTF-8';
        // 書込む文字列
        var string = sel.toString();
        // ファイルストリーム生成
        var fileStream = Components.classes['@mozilla.org/network/file-output-stream;1']
        .createInstance(Components.interfaces.nsIFileOutputStream);
        // 書込み専用で初期化
        fileStream.init(thefile, 0x2a, 0x200, false);
        // 文字列書込みストリーム生成
        var converterStream = Components.classes['@mozilla.org/intl/converter-output-stream;1']
        .createInstance(Components.interfaces.nsIConverterOutputStream);
        // 文字列書込みストリーム初期化
        converterStream.init(fileStream, charset, string.length,
        Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
        // 文字列書込み
        converterStream.writeString(string);
        // 文字列書込みストリームクローズ
        converterStream.close();
        // ファイルストリームクローズ
        fileStream.close();
    }
  },

  
  isJa: function()
  {
    var prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
                           .getService(Components.interfaces.nsIPrefBranch);
    return prefBranch.getCharPref("general.useragent.locale").indexOf("ja") > -1;
  }
};

saveSelection.init();
