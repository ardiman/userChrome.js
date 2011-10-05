// ==UserScript==
// @name			utl_3.4.3b1.uc.js
// @namespace		http://loda.jp/script/
// @description		ページの先頭・最後、上へ移動するボタンとメニューを追加する
// @include			main
// @compatibility	WindowsXP / Ubuntu8.04(gnome)
// @compatibility	Firefox 3.0.* - 3.7a4pre
// @compatibility	userChrome.js 0.7 - 0.8 / userChromeJS 1.1
// @compatibility	Sub-Script/Overlay Loader v3.0.28mod
// @author			otokiti
// @version			3.0.7	07/11/02	スクリプト初版
// @version			3.0.8	07/12/30	コンテキスト・メニューの表示を制御
// @version			3.0.9	08/08/09	b2r スレッド画面の場合は"上の階層に移動する"メニューは表示しない
// @version			3.1.0	08/10/15	utl/topbottom ボタンとメニューを無効表示出来る様にした。
// @version			3.2.0	08/12/04	uc.xul から uc.js へ変更。
// @version			3.3.0	09/09/27	chaika のボード／スレッド画面にも対応。
// @version			3.4.0	09/11/01	1) Back/Forward に対応していなかったのを修正した。
// @version								2) ローカル・パス(Win では file:///C:/XXXX 等)に対応した。
// @version								3) メニューの日本語 URL 表示に対応した。
// @version			3.4.1	09/11/13	1) checkURLcommon() でダイアログの判定を chrome:// のみにした。
// @version			 					2) Back/Forward 時ボタンが変化しない事があったので関数の書き換えに変更した。
// @version					09/12/15	3)「上の階層に移動する」メニューの表示方法を変更した。
// @version					10/02/14	4) ボタン画像と表示形式を修正、追加した。
// @version								5) ボタンに class として toolbarbutton-1 を追加した。
// @version			 		10/02/16	6) Fx3.7a3/a4(Bug546098/Bug545842)とそれ以前ではボタン形式の切り替えテスト中。
// @version			3.4.2	10/03/21	Back/Forward-dropmarker からの移動に対応
// @version								* tabLock_mod1.uc.js で gotoHistoryIndex が書き換えられている場合に取り合えず対応
// @version			3.4.3	10/07/26	ボタン形式の判定を Fx のバージョンを見るようにした。
// @Note			制限/仕様:	1) ボタン画像は小さいアイコンのみ
// @Note						2) ボタンの位置を個別には指定できない。
// @Note						3) サブドメインは認識できない
// @Note						   www.hoge.com と hoge.co.jp を区別できない ＿|￣|○ 
// ==/UserScript==
var utl={

	// --------- 任意に編集 -----------------------------------------------------------------
	SHOWUTL_BUTTON:			true,	// 「上の階層に移動する」ボタンを表示する
	UTL_BUTTON_TYPE:		false,	//　ボタンの形式	true: メニュー・ボタン
									//					false: コンテクスト・メニュー・ボタン
	SHOWTOPBOTTOM_BUTTON:	true,	// 「ページの最初か最後に移動」ボタンを表示する
//	TARGEBUTTON:	"home-button",	// ボタンのターゲット
	TARGEBUTTON:	"unified-back-forward-button",	// ボタンのターゲット
	TARGETMENU:		"context-back",	// コンテントエリア・コンテクスト・メニューのターゲット
	// --------------------------------------------------------------------------------------

	// utl-button ボタンの画像データ
	_UTL_BUTTON: "url(data:image/png;base64,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)",

	// topbottom-button ボタンの画像データ
	_TOPBOTTOM_BUTTON: "url(data:image/png;base64,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)",

	// 初期化
	init:function() {

		// Back/Forward の為に関数を書き換える
		var _cmd = "setTimeout(utl.updateButton, 10); $&";
		eval("BrowserForward = " + BrowserForward.toString().replace(/}$/, _cmd));
		eval("BrowserBack = " + BrowserBack.toString().replace(/}$/, _cmd));

		if ("tabLock" in window) {	// for tabLock_mod1.uc.js
			eval("gotoHistoryIndex_org = " + gotoHistoryIndex_org.toString().replace(/return true;/, _cmd));
		} else {
			eval("gotoHistoryIndex = " + gotoHistoryIndex.toString().replace(/return true;/, _cmd));
		}

		this.mkCSS();		// ボタンの画像を変える CSS を作る
		this.mkMenu();		// コンテクスト・メニューを作る
		this.mkButton();	// ボタンを作る
		this.updateButton();// ボタンを更新
		this.addEvent();	// イベント登録
	},

	// ボタンの画像を変える CSS
	mkCSS: function() {
		var style = <![CDATA[
			.ucjs_utl[disabled=true] {
				-moz-image-region:rect(0px, 64px, 16px, 48px); }
			.ucjs_utl:not([disabled=true]) {
				-moz-image-region:rect(0px, 16px, 16px, 0px); }
			.ucjs_utl:not([disabled=true]):hover {
				-moz-image-region:rect(0px, 32px, 16px, 16px); }
			.ucjs_utl:not([disabled=true]):hover:active {
				-moz-image-region: rect(0px, 48px, 16px, 32px); }
		]]>.toString();
		var sspi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css,' + encodeURI(style) + '"'
		);
		document.insertBefore(sspi, document.documentElement);
	    sspi.getAttribute = function(name) {
		    return document.documentElement.getAttribute(name);
	    };
	},

	// コンテクスト・メニューを作る
	mkMenu: function() {
 		//[上の階層に移動する]
 		var goupMenu = document.createElement("menu");
		goupMenu.setAttribute("id", "goup-menu");
		goupMenu.setAttribute("label", "Seiten Men�");
		goupMenu.setAttribute("accesskey", "M");
		// サブ・メニューの作成
		var subPopup = document.createElement("menupopup");
		subPopup.setAttribute("onpopupshowing", "return utl.mkSubMenus(event);");
		subPopup.setAttribute("oncommand", "utl.goUp(event); event.stopPropagation();");
		goupMenu.appendChild(subPopup);

		//[ページの最後に移動]
 		var gotobottomMenu = document.createElement("menuitem");
		gotobottomMenu.setAttribute("id", "gotobottom-menu");
		gotobottomMenu.setAttribute("label", "Seite runter");
		gotobottomMenu.setAttribute("accesskey", "R");
		gotobottomMenu.setAttribute("oncommand", "utl.goTo(false);");
		//[ページの最初に移動]
 		var gototopMenu = document.createElement("menuitem");
		gototopMenu.setAttribute("id", "gototop-menu");
		gototopMenu.setAttribute("label", "Seite hoch");
		gototopMenu.setAttribute("accesskey", "H");
		gototopMenu.setAttribute("oncommand", "utl.goTo(true);");

		// セパレータ
		var sep = document.createElement("menuseparator");
		sep.setAttribute("id", "utlSepMoz");

		var targetmenu = document.getElementById(this.TARGETMENU);
		targetmenu.parentNode.insertBefore(gototopMenu, targetmenu);
		targetmenu.parentNode.insertBefore(gotobottomMenu, targetmenu);
		targetmenu.parentNode.insertBefore(goupMenu, targetmenu);
		targetmenu.parentNode.insertBefore(sep, targetmenu);

	},

	// ボタンを作る
	mkButton: function() {
		var TargetButton = document.getElementById(this.TARGEBUTTON);

		if (this.SHOWUTL_BUTTON) {		// 「上の階層に移動する」ボタン
			var utlButton = document.createElement("toolbarbutton");
			utlButton.id = "utl-button";
			utlButton.style.listStyleImage = this._UTL_BUTTON;;
			// 上の階層に移動する
			utlButton.setAttribute("tooltiptext", "Linke Taste: Seiten zur�ck | Rechte Taste: Seiten Men�");
			utlButton.setAttribute("class", "ucjs_utl toolbarbutton-1 ucjs-toolbarbutton-1");
			utlButton.setAttribute("oncommand", "utl.goUp(); event.stopPropagation();");
			if (this.UTL_BUTTON_TYPE){
				utlButton.setAttribute("type", "menu-button");
				utlButton.setAttribute("context", "");
			} else {
				utlButton.setAttribute("context", "utl-button-menu");
			}

			// ボタンのメニューを作る
			if (this.UTL_BUTTON_TYPE) {
				var aPopup = utlButton.appendChild(document.createElement("menupopup"));
			} else {
				var aPopup = document.getElementById("mainPopupSet").appendChild(document.createElement("menupopup"));
			}
			aPopup.id = "utl-button-menu";
			aPopup.setAttribute("context", "");
			aPopup.setAttribute("onpopupshowing", "return utl.mkSubMenus(event);");
			aPopup.setAttribute("oncommand", "utl.goUp(event); event.stopPropagation();");

			if (this.getVer()>=4) {
				var toolbarbutton_u = utlButton;
			} else {
				var utl_container = document.createElement("toolbaritem");
				utl_container.setAttribute("id", "utl-button-container");
				utl_container.setAttribute("align", "center");
				utl_container.appendChild(utlButton);
				var toolbarbutton_u = utl_container;
			}
			TargetButton.parentNode.insertBefore(toolbarbutton_u, TargetButton.nextSibling);
		}

		if (this.SHOWTOPBOTTOM_BUTTON) {	// 「ページの最初か最後に移動」ボタン
			var topbottomButton = document.createElement("toolbarbutton");
			topbottomButton.id = "topbottom-button";
			topbottomButton.style.listStyleImage = this._TOPBOTTOM_BUTTON;
			 //左クリックで最初に移動・右クリックで最後に移動
			topbottomButton.setAttribute("tooltiptext", "Linke Taste: Seite runter | Rechte Taste: Seite hoch");
			topbottomButton.setAttribute("class", "ucjs_utl toolbarbutton-1 ucjs-toolbarbutton-1");
			topbottomButton.setAttribute("onclick", "utl.updwnButton(event);");
			topbottomButton.setAttribute("context", "");

			if (this.getVer()>=4) {
				var toolbarbutton_t = topbottomButton;
			} else {
				var topbottomButton_container = document.createElement("toolbaritem");
				topbottomButton_container.setAttribute("id", "topbottom-button-container");
				topbottomButton_container.setAttribute("align", "center");
				topbottomButton_container.appendChild(topbottomButton);
				var toolbarbutton_t = topbottomButton_container;
			}
			TargetButton.parentNode.insertBefore(toolbarbutton_t, TargetButton.nextSibling);
		}
	},

	// Fx3.7a2pre(Bug546098/Bug545842) の新ボタン形式か？
	//	＊現在は svg:mask を見ているだけ(Windows only)
/*	chkButtonType:function() {
		return document.getElementById("winstripe-keyhole-forward-mask");
	},*/

	// アプリケーションのバージョンを取得する
	getVer: function(){
		var info = Components.classes["@mozilla.org/xre/app-info;1"]
				.getService(Components.interfaces.nsIXULAppInfo);
		var ver = parseInt(info.version.substr(0,3) * 10,10) / 10;
		return ver;
	},

	// 「上の階層に移動する」サブ・メニューを表示する
	mkSubMenus:function(event) {
		var Menu = event.target;

		// 一度サブ・メニュー項目を削除
        for(var i = Menu.childNodes.length - 1; i >= 0; i--)
            Menu.removeChild(Menu.childNodes.item(i));

		// URL リストを得る
		var URLList = this.getURLList();
		if (URLList.length == 0) return;

		// サブ・メニューを作る
		for (var i = 0; i < URLList.length; i++) {
			var m = document.createElement("menuitem");
			m.setAttribute("label", decodeURI(URLList[i]));	// 日本語表示対応
			m.setAttribute("value", i);
			Menu.appendChild(m);
		}
	},

	// 上の階層に移動する
	goUp:function(event) {
		var URLList = this.getURLList();
		if (URLList.length != 0)
			getBrowser().contentWindow.location.assign(event? URLList[event.target.value]: URLList[0]);
	},

	// 「ページの最初か最後に移動」ボタンの動作
	updwnButton:function(event) {
		if(event.button == 2) this.goTo(true);
		else if(event.button == 0) this.goTo(false);
	},

	// 先頭・末尾へ移動	true: 先頭	false: 末尾
	goTo:function(flg) {
		goDoCommand(flg ? "cmd_scrollTop" : "cmd_scrollBottom");
	},

	// イベント登録
	addEvent: function() {
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",this, false);
		var contentArea = document.getElementById("appcontent");
		contentArea.addEventListener("load", this, true);
		contentArea.addEventListener("select", this, false);
		gBrowser.tabContainer.addEventListener("TabClose", this, false);
		window.addEventListener("unload", this, false);
	},

	// イベント・ハンドラ
	handleEvent: function(event) {
    	switch(event.type) {
			case "load":
			case "select":
			case "TabClose":
				this.updateButton();
				break;
			case "popupshowing":
				this.showMenu();
				break;
			case "unload":
				document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing",this, false);
				var contentArea = document.getElementById("appcontent");
				contentArea.removeEventListener("load", this, true);
				contentArea.removeEventListener("select", this, false);
				gBrowser.tabContainer.removeEventListener("TabClose", this, false);
		 		window.removeEventListener("unload", this, false);
   				break;
		}
	},

	// コンテントエリア・コンテクスト・メニューでメニューの表示・非表示を切り替える
	showMenu:function() {
		// 共通で表示しない条件
		var ishide =   gContextMenu.isTextSelected	// テキストが選択されている
					|| gContextMenu.onLink			// リンク
					|| gContextMenu.onTextInput		// テキスト入力欄
					|| gContextMenu.onImage			// 画像
					|| utl.checkURLcommon();		// 特定の URL(共通)

		// 「ページの最初に移動」「ページの最後に移動」メニュー
		document.getElementById("gotobottom-menu").hidden = ishide;
		document.getElementById("gototop-menu").hidden = ishide;
		document.getElementById("utlSepMoz").hidden = ishide;

		// 「上の階層に移動する」メニュー
		var goupMenu = document.getElementById("goup-menu");
		goupMenu.hidden = ishide
		goupMenu.setAttribute("disabled", ishide ? false
												 : utl.checkURLgoUP() || utl.getURLList().length == 0);
	},

	// ボタンの有効・無効を切り替える
	updateButton:function() {
		utl.updateUtlButton();
		utl.updateTopBottomButton();
	},

	// 「上の階層に移動する」ボタン を切り替える
	updateUtlButton: function() {
		var url_button = document.getElementById("utl-button");
		if (!url_button) return;

		if (this.checkURLcommon() || this.checkURLgoUP() || utl.getURLList().length == 0) {	// 無効な場合
			url_button.setAttribute("disabled", true);
			if (!this.UTL_BUTTON_TYPE) url_button.setAttribute("context", "");
		} else {			// 有効な場合
			url_button.setAttribute("disabled", false);
			if (!this.UTL_BUTTON_TYPE) url_button.setAttribute("context", "utl-button-menu");
		}
	},

	// 「ページの最初か最後に移動」ボタン を切り替える
	updateTopBottomButton: function() {
		var topbottom_button = document.getElementById("topbottom-button");
		if (!topbottom_button) return;

		if (this.checkURLcommon()) {	// 無効な場合
			topbottom_button.setAttribute("disabled", true);
		} else {						// 有効な場合
			topbottom_button.setAttribute("disabled", false);
		}
	},

	// 特別な URL か？共通版(true: 特別な URL、false: 通常の URL)
	checkURLcommon:function() {
		var url = getBrowser().contentWindow.location.href;
		return /^chorme:\/\/.+\.xul$/i.test(url)	// ダイアログ
			||	/^chaika:\/\/board\/|bbs2ch:board:http:\/\/.+/i.test(url)	// b2r/chaika ボード画面
			|| 	/^about:.*/.test(url) 			// about: で始まり
				&& url != "about:plugins"			// about:plugins と
				&& url != "about:support"			// about:support と
				&& !/^about:cache.*/.test(url);		// about:cache 以外
	},

	// 特別な URL か？goUP 版(true: 特別な URL、false: 通常の URL)
	checkURLgoUP: function() {
		var url = getBrowser().contentWindow.location.href;
		return /^http:\/\/127\.0\.0\.1:\d+\/thread\/http:\/\/.+/i.test(url) // b2r/chaika スレッド画面
			|| /^view-source:.+/.test(url);	// ソース表示
	},

	// URL リストを作る
	getURLList:function() {
		var URLList= [], host = "", path = "";

		// ホスト部分と以降とを切り分ける
		if (/(^.*:\/\/+[^\/]+\/)(.*[^\/])\/?$/.test(getBrowser().contentWindow.location.href)) {
			host = RegExp.$1;	// ホスト部分
			path = RegExp.$2;	// ホスト以降
		}
		if (path != "")  {	// ページ・トップ以外
			if (/(.*[^\/])#.*/.test(path)) {	// "#" が有ればそれより前を切り出す(XX/#YY の場合は除外)
				path = RegExp.$1
				URLList.push(host + path);
			}
			if (/(.*[^\/])\?.*/.test(path)) {	// "?" が有ればそれより前を切り出す(XX/?YY の場合は除外)
				path = RegExp.$1
				URLList.push(host + path);
			}
			while (/(.*)\/[^\/]*$/.test(path)) {	// "/" 毎に切り出す
				path = RegExp.$1
				URLList.push(host + path + "/");
			}
			URLList.push(host);	// ページ・トップ
		}
		return URLList;
	}
};
utl.init();