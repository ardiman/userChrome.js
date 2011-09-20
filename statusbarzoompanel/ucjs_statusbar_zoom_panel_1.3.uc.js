// ==UserScript==
// @name			ucjs_statusbar_zoom_panel_1.3.uc.js
// @namespace		http://bbs2ch.sourceforge.jp/uploader/upload.php
// @description		状态栏上添加缩放值来显示·修改网页大小
// @include			main
// @author			otokiti
// @compatibility	WindowsXP / Ubuntu8.04(gnome)
// @compatibility	Firefox 3.0 - 3.6a1pre
// @compatibility	userChrome.js 0.7 - 0.8 / userChromeJS 1.0
// @compatibility	Sub-Script/Overlay Loader v3.0.24mod
// @version			0.1: 08/10/21 初版
// @version			0.2: 08/10/23 ズーム値以外のメニューを追加
// @version			0.3: 08/11/18 uc.xul から uc.js へ変更
// @version			0.4: 08/12/13 Zoom 関係の関数の書き換える様に変更
// @version			0.5: 09/01/22 パネル上のホイール・スクロールでズーム
// @version			0.6: 09/02/18 onLocationChange のフックに気づいていなかったので追加した
// @version			    		  thanks: http://pc11.2ch.net/test/read.cgi/software/1230791860/717
// @version			0.7: 09/02/19 直接数値で指定してズーム値を変更するメニューを追加
// @version			0.8: 09/02/20 メニューが toolkit.zoomManager.zoomValues と同期するモードを追加した(default)。
// @version			0.9: 09/02/21 ホイール・スクロール時にメニューが出ている場合は消す様にした。
// @version			1.0: 09/02/21 onLocationChange の引数を忘れていたのを修正
// @version						   thanks: http://pc11.2ch.net/test/read.cgi/software/1230791860/757
// @version			1.1: 09/05/12 Zoom 関係の関数を書き換え方法の変更とその他微修正。
// @version						  画面上での Ctrl+<マウススクロール> に再対応。＊注意
// @version			1.2: 09/05/13 メニューの数値指定でズームを変更した場合タブの切り替えに対応していなかったのを修正(0.7から)。
// @version			1.3: 09/05/18 _handleMouseScrolled だけ別扱いにしてみる。
// @Note			1) ステータスバーにズーム値・モードを表示するパネルを追加する。
// @Note			2) パネルのコンテクスト・メニューにズーム・メニューを表示する。
// @Note			3) パネル上のホイール・スクロールでズーム。
// @Note			4) パネル・クリックでリセット。
// @Note			5) 直接ズームを指定可能なメニューリスト。
// @Note	仕様	_SYNC_ZOOMVALUES が false の場合 toolkit.zoomManager.zoomValues や USER_ZOOM_LEVEL の値を変更すると
// @Note			Zoom In(Ctrl++)/Zoom Out(Ctrl+-)で変えたズーム値がメニューに無く結果チェックが付かない場合がある。
// @Note	対策	A) _SYNC_ZOOMVALUES を true で使う。
// @Note			B) 別に構わないとそのまま使う。
// @Note	＊注意	Ctrl+<マウススクロール> では独自ステップが利用される為メニューの値以外になる場合が有る。
// @Note	----------------------------------------------------------------------------------------------
// @Note	＊このスクリプトは Alice0775氏作の拡張「Default FullZoom Level 3.5」を参考にさせて頂きました。
// @Note	----------------------------------------------------------------------------------------------
// ==/UserScript==
var ucjs_zoom = {
// ------------------------------ 任意に設定 -----------------------------------------------
	// ボタンを置くターゲット・パネルのＩＤ (default: ページ・レポートの後)
	_TAGET_ID:	"page-report-button",

	// ズームモードを表す文字と文字色
	_ZOOM_MODE: [ { txt: "Zoom Einstellungen", color: "#00000" }, 					// 0) フルズーム、黒
				  { txt: "\u30c6\u30ad\u30b9\u30c8\u30ba\u30fc\u30e0", color: "#096CE6" } ],	// 1) テキストズーム、青

	// toolkit.zoomManager.zoomValues とメニューを(true: 同期させる、false: 同期させない)
	_SYNC_ZOOMVALUES: true,

	// メニューに表示するユーザ設定のズーム値(_SYNC_ZOOMVALUES: false の場合のみ有効) ％（整数）で表記
	USER_ZOOM_LEVEL: [ 30, 50, 67, 80, 90, 100, 110, 120, 133, 150, 170, 200, 240, 300 ],
//	USER_ZOOM_LEVEL: [ 30, 50, 75, 100, 150, 200, 250, 300 ],
// --------------------------------------------------------------------------------

	// メニューに表示するズーム値リスト
	ZoomLevel: [ ],

	// 初期化
	init: function() {

		// Zoom 関係の関数を書き換え
		var _cmd = "ucjs_zoom.updateZoom(); $&";
		// toggleZoom
		eval("ZoomManager.toggleZoom = " + ZoomManager.toggleZoom.toString().replace(/}$/, _cmd));
		// reset
		eval("FullZoom.reset = " + FullZoom.reset.toString().replace(/}$/, _cmd));
		// enlarge
		eval("FullZoom.enlarge = " + FullZoom.enlarge.toString().replace(/}$/, _cmd));
		// reduce
		eval("FullZoom.reduce = " + FullZoom.reduce.toString().replace(/}$/, _cmd));
		// onLocationChange
		eval("FullZoom.onLocationChange = " + FullZoom.onLocationChange.toString().replace(/}$/, _cmd));
		// _handleMouseScrolled
		_cmd = "setTimeout(ucjs_zoom.updateZoom, 0); $&";
		eval("FullZoom._handleMouseScrolled = " + FullZoom._handleMouseScrolled.toString().replace(/}$/, _cmd));

		// メニューに表示するズーム値リストを作る
		if (this._SYNC_ZOOMVALUES) {	// toolkit.zoomManager.zoomValues とメニューを同期させる場合
			var SysZoomLevel = Cc["@mozilla.org/preferences;1"].getService(Ci.nsIPrefBranch)
						.getCharPref("toolkit.zoomManager.zoomValues").split(",");
			for (var i=0; i<SysZoomLevel.length; i++) this.ZoomLevel.push(parseInt(parseFloat(SysZoomLevel[i])*100));
		} else {						// させない場合(USER_ZOOM_LEVEL の値を使う場合)
			this.ZoomLevel = this.USER_ZOOM_LEVEL;
		}

		// Zoom パネルを作る
		var zoomPanel = document.createElement("statusbarpanel");
		zoomPanel.setAttribute("id", "ucjs_zoom_statuslabel");
		zoomPanel.setAttribute("context", "ucjs_zoom-context");
		zoomPanel.setAttribute("onclick", "ucjs_zoom.click_StatusLabel(event);event.stopPropagation();");
		var targetPanel = document.getElementById(this._TAGET_ID);
		targetPanel.parentNode.insertBefore(zoomPanel, targetPanel.nextSibling);

		// Zoom パネルのコンテキストメニューを登録
		var MainPopup = document.getElementById("mainPopupSet");
		var PopupMenu = MainPopup.appendChild(document.createElement("menupopup"));
		PopupMenu.id = "ucjs_zoom-context";
		PopupMenu.setAttribute("oncommand", "event.stopPropagation();");
		PopupMenu.setAttribute("onpopupshowing", "ucjs_zoom.show_Popup(event);");
		ucjs_zoom.updateZoom();

		// Zoom パネル上のホイール・スクロールにイベント登録
		zoomPanel.addEventListener("DOMMouseScroll", function(event){
			ucjs_zoom.wheelZoom(event);
		}, false);
	},

	// パネルのコンテクスト・メニューを作る
	show_Popup : function(e) {
		var aPopup = e.target;
        for(var i = aPopup.childNodes.length - 1; i >= 0; i--) {
            aPopup.removeChild(aPopup.childNodes.item(i));
		}

		// ズーム値・リスト・メニューを作る
		for (var i = ucjs_zoom.ZoomLevel.length-1; i >=0 ; i--) {
			var tempItem = document.createElement("menuitem");
			tempItem.setAttribute("label", ucjs_zoom.ZoomLevel[i] + "%");
			tempItem.setAttribute("oncommand","ucjs_zoom.set_Zoom(" + ucjs_zoom.ZoomLevel[i]/100 + ");");
			tempItem.setAttribute("type", "checkbox");
			if(ucjs_zoom.ZoomLevel[i] == Math.floor((ZoomManager.zoom + 0.005) * 100) ){
				tempItem.setAttribute("checked",true);
			}
			aPopup.appendChild(tempItem);
		}

		var tempItem = document.createElement("menuseparator");
		aPopup.appendChild(tempItem);

		// Zoom メニュー・リストを複製する
		var popup = document.getElementById("viewFullZoomMenu").lastChild;
		for (var i = 0; i < popup.childNodes.length; i++) {
			var tempItem = popup.childNodes[i].cloneNode(true);
			if (tempItem.id) tempItem.id = "ucjs-" + tempItem.id;
			aPopup.appendChild(tempItem);
		}
	},

	// 数値で指定してズーム値を変更する
	set_Zoom: function(n) {
		var markupDocumentViewer = getBrowser().markupDocumentViewer;
		if (!markupDocumentViewer) return;

		if (ZoomManager.useFullZoom) {
			if (markupDocumentViewer.textZoom != 1) markupDocumentViewer.textZoom = 1;
			if (markupDocumentViewer.fullZoom != n) markupDocumentViewer.fullZoom = n;
		} else {
			if (markupDocumentViewer.textZoom != n) markupDocumentViewer.textZoom = n;
			if (markupDocumentViewer.fullZoom != 1) markupDocumentViewer.fullZoom = 1;
		}
		FullZoom._applySettingToPref();
		ucjs_zoom.updateZoom();
		return n;
	},

	// ホイール・スクロールで Zoom
	wheelZoom: function(e) {
		ucjs_zoom.hidePopup(document.getElementById("ucjs_zoom-context"));
		// ズーム
		if (e.detail > 0) FullZoom.reduce();
		else FullZoom.enlarge();
	},

	// メニューを消す
	hidePopup: function (menu) {
	    var popupBox = null;
	    var menuBox = null;
	    try {
	        popupBox = menu.boxObject.QueryInterface(Ci.nsIPopupBoxObject);
	    } catch (e) {}
	    try {
	        menuBox = menu.parentNode.boxObject.QueryInterface(Ci.nsIMenuBoxObject);
	    } catch (e) {}

	    if (menuBox) menuBox.openMenu(false);
	    else if (popupBox) popupBox.hidePopup();
 	},

	// パネルをクリックでリセット
	click_StatusLabel:function(e){
		if(e.button != 0) return;
		FullZoom.reset();
	},

	// メニューとステータス・ボタン表示を更新
	updateZoom: function(){
		// メニューを更新
		var Toggle_org = document.getElementById("toggle_zoom");
		if (Toggle_org) {
			Toggle_org.setAttribute("checked", !ZoomManager.useFullZoom);
		}
		var Toggle_ucjs = document.getElementById("ucjs-toggle_zoom");
		if (Toggle_ucjs) {
			Toggle_ucjs.setAttribute("checked", !ZoomManager.useFullZoom);
		}
		// ステータス・ボタンを更新
		var Zoom = document.getElementById("ucjs_zoom_statuslabel");
		Zoom.setAttribute("label", Math.floor((ZoomManager.zoom + 0.005) * 100) + "%");
		Zoom.setAttribute("tooltiptext", ucjs_zoom._ZOOM_MODE[ZoomManager.useFullZoom? 0: 1].txt);
		Zoom.setAttribute("style", "color: " + ucjs_zoom._ZOOM_MODE[ZoomManager.useFullZoom? 0: 1].color + ";");
	}
}
ucjs_zoom.init();