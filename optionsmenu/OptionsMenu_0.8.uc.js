// ==UserScript==
// @name			ucjs_OptionsMenu_0.8.uc.js
// @namespace		http://www.mozilla-japan.org/
// @description		拡張の設定ダイアログを開くボタンとメニューを追加する
// @include			chrome://browser/content/browser.xul
// @include			chrome://messenger/content/messenger.xul
// @compatibility	WindowsXP/Vista/7/Ubuntu10.04(gnome)
// @compatibility	Firefox 3.6.* - 4.0.* / Thunderbird 3.1.*
// @compatibility	userChromeJS 1.2 / userChrome.js 0.7 - 0.8 , 0.8.010070202(Fx4 対応 Alice0775 版)
// @compatibility	Sub-Script/Overlay Loader v3.0.29mod
// @author			otokiti
// @version			0.1 初版 拡張 OptinsMenu 1.3(OptionsMenu-1.3.xpi) より
// @version			0.2 拡張アイコン縮小をスタイルシートから javascript上に変更
// @version			0.3 Minefield(Fx3)対応:preventBubble() を stopPropagation() に変更（メニューボタン)
// @version			0.4 ボタンのコンテキストメニューも表示可能にした
// @version			0.5 メニュー表示用のスタイルを xml-stylesheet に直接書く様にした。
// @version			0.6 Linux 版 Minefield(Fx3.1)の為に大小文字を無視したソートを有効にした。
// @version			0.7 uc.xul から uc.js へ変更して Fx/Tb を自動判定するようにした。
// @version			0.8 Firefox4.0 対応中
// @version			0.8.1b Versionsnummer der Extensions, deaktivierte und Erweiterungen ohne Optionen ebenfalls (aber deaktiviert) anzeigen
// @Note		-----------------------------------------------------------------------------------------------------------
// @Note		Fx4 で利用する場合は userChromeJS 1.2 または Alice0775 氏による trunk 4.0b2pre用のuserchrome.js 0.8の修正版
// @Note		http://space.geocities.jp/alice0775/STORE/userchrome.js-0.8.010070203-Fx4.0.xpi が必要です。
// @Note		-----------------------------------------------------------------------------------------------------------
// @Note		本スクリプトは Firefox Options Menu Extension http://james.istop.com/OptionsMenu/ を参考にさせて頂いた。
// @Note		Mozilla Public License, version 1.1 https://addons.mozilla.org/en-US/firefox/versions/license/75134
// ==/UserScript==
var ucjs_optionmenu = {

	//  -------- 任意に変更 -----------------------------------------------------------
	// ボタン
	SHOW_BUTTON:		true,			// ボタンを追加する
	MENU_BUTTON:		true,			//　ボタンの形式	true: メニュー・ボタン
										// 					false: コンテクスト・メニュー・ボタン
	LIST_DISPLAY:		1,				// 0= nur aktive mit Optionen, 1= nur aktive, auch ohne Optionen, 2= alle (deaktiviert und ohne Optionen)
	TOOLBAR_FX:			"nav-bar",			// Firefox の場合のツールバー
	TARGET_BUTTON_FX:	"window-controls",	// Firefox の場合のターゲット・ボタン(null: 最後の位置)

	TOOLBAR_TB:			"mail-toolbar-menubar2",		// Thunderbird の場合のツールバー
	TARGET_BUTTON_TB:	null,				// Thunderbird の場合のターゲット・ボタン(null: 最後の位置)

	// メニュー
	TARGET_MENU_FX:		"devToolsSeparator",// Firefox の場合のターゲット・メニュー
//	TARGET_MENU_TB:		"devToolsSeparator",// Thunderbird の場合のターゲット・メニュー(Tb3)
	TARGET_MENU_TB:		"activityManager",	// Thunderbird の場合のターゲット・メニュー(Tb3.1)
	// --------------------------------------------------------------------------------

	// [拡張のオプション・リスト] 文字列
	OM_NAME: "Addons Optionen",

	// ボタン、独自アイコンを持たない拡張用の画像
	// ICON_URL: "chrome://mozapps/skin/xpinstall/xpinstallItemGeneric.png",
	// hiermit bekommt man ein kleineres Icon
	ICON_URL: "chrome://mozapps/skin/extensions/extensionGeneric-16.png",
	
	// 初期化
	init: function() {
		if (this.getProgType() === 1 && location != "chrome://browser/content/browser.xul") return;
		// ボタンの画像とメニューのアイコンを小さくする CSS
		var style = <![CDATA[
			#om-button>image,
            #om-button  > toolbarbutton > image {
				width: 16px;
				height: 16px;
				min-width: 16px;
				min-height: 16px;
			}
			.optionsmenu>hbox.menu-iconic-left>image {
				width:16px; height:16px; min-width:16px;
			}
		]]>.toString();
		var ss = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css,' + encodeURI(style) + '"'
		);
		document.insertBefore(ss, document.documentElement);
	    ss.getAttribute = function(name) {
		    return document.documentElement.getAttribute(name);
	    };

		this.mkMenu();
		if (this.SHOW_BUTTON) this.mkButton();
	},

	// メニューの作成（ツール・メニュー)
	mkMenu: function() {
		var parentMenu = document.createElement("menu");
		parentMenu.setAttribute("id", "menu-optionsmenu");
		parentMenu.setAttribute("label", this.OM_NAME);

		var optionsitem = document.getElementById((this.getProgType()==1)? this.TARGET_MENU_FX: this.TARGET_MENU_TB);
		optionsitem.parentNode.insertBefore(parentMenu, optionsitem);

		// サブ・メニューの作成
		var parentPopup = document.createElement("menupopup");
		parentPopup.setAttribute("onpopupshowing", "ucjs_optionmenu.populateMenu(event);");
		parentMenu.appendChild(parentPopup);

		// メニュー項目が無い場合表示する (Empty)
		var EmptyMenu = document.createElement("menuitem");
		EmptyMenu.setAttribute("label", "(Empty)");
		EmptyMenu.setAttribute("disabled", true);
		parentPopup.appendChild(EmptyMenu);
	},

	// ボタンを作る
	mkButton: function() {
		var prgType = this.getProgType() == 1;
		var Button = document.createElement("toolbarbutton");
		Button.setAttribute("id", "om-button");
		Button.setAttribute("tooltiptext", this.OM_NAME);
		Button.setAttribute("oncommand", prgType? "BrowserOpenAddonsMgr();":  "openAddonsMgr();");
		if (this.MENU_BUTTON) {	// メニュー・ボタン形式
			Button.setAttribute("type", "menu-button");
			Button.setAttribute("context", "");
		} else {				// コンテクスト・メニュー形式
			Button.setAttribute("context", "om-button-context");
		}
		Button.style.listStyleImage = "url("+ this.ICON_URL + ")";
		Button.setAttribute("class", "toolbarbutton-1 ucjs-toolbarbutton-1");
		if (prgType && this.getVer() >= 4) {	// Fx で Ver.4 以上
			var toolbarbutton = Button;
		} else {
			var container = document.createElement("toolbaritem");
			container.setAttribute("id", "om-button-container");
			container.setAttribute("align", "center");
			container.appendChild(Button);
			var toolbarbutton = container;
		}

		var ToolBar = document.getElementById(prgType? this.TOOLBAR_FX: this.TOOLBAR_TB);
		var Target_Button = prgType? this.TARGET_BUTTON_FX: this.TARGET_BUTTON_TB;
		var Target = null;
		if (Target_Button != null)	Target = document.getElementById(Target_Button);
		ToolBar.insertBefore(toolbarbutton, Target);

		// メニューを作る
		if (this.MENU_BUTTON) {	// メニュー・ボタン形式
			var Pearent = document.getElementById("om-button");
		} else {				// コンテクスト・メニュー形式
			var Pearent = document.getElementById("mainPopupSet");
		}
		var cPopup = Pearent.appendChild(document.createElement("menupopup"));
		cPopup.id = "om-button-context";
		cPopup.setAttribute("context", "");
		cPopup.setAttribute("onpopupshowing", "return ucjs_optionmenu.populateMenu(event);");
		cPopup.setAttribute("oncommand", "event.stopPropagation();");
	},

	// Fx3.7a2pre(Bug546098/Bug545842) の新ボタン形式か？
	//	＊現在は svg:mask を見ているだけ(Windows only)
//	chkButtonType:function() {
//		return document.getElementById("winstripe-keyhole-forward-mask");
//	},

	// ポップ・アップ・メニューを表示する
    populateMenu:function(e) {
        var menu=e.target;
        for(var i=menu.childNodes.length - 1; i>=0; i--) {
            menu.removeChild(menu.childNodes.item(i));        }
		if ("@mozilla.org/addons/integration;1" in Components.classes) {
			ucjs_optionmenu.populateMenu40(menu);	// Fx4
		} else {
			ucjs_optionmenu.populateMenu36(menu);	// Fx3.6/Tb
		}
	},

	// ポップ・アップ・メニューを作る(Fx4)
    populateMenu40:function(menu) {
		Components.utils.import("resource://gre/modules/AddonManager.jsm");

		// 拡張リストを得る
		var Addons;
		AddonManager.getAddonsByTypes(["extension"], function(installedItems) {
			Addons = installedItems;
       });

		// Callback の実行を待つ
		var thread = Components.classes['@mozilla.org/thread-manager;1'].getService().mainThread;
		while (Addons == void(0)) {
			thread.processNextEvent(true);
		}

		// 拡張の設定リスト・メニューを作る
		for (var j = 0; j < Addons.length; j++) {
			if (Addons[j].userDisabled && this.LIST_DISPLAY < 2) continue;
			if (!Addons[j].optionsURL && this.LIST_DISPLAY == 0) continue;

			// 拡張のオプション・ダイアログを開くコマンドを登録
			var tempItem = document.createElement("menuitem");
			var optionsURL=Addons[j].optionsURL;
			tempItem.setAttribute("oncommand", "ucjs_optionmenu.openOptionsDialog(\""+optionsURL+"\")");
			// 拡張のアイコンを登録
			var iconURL=Addons[j].iconURL;
			if( iconURL=="" || iconURL==null) iconURL = this.ICON_URL;
			tempItem.setAttribute("class", "menuitem-iconic menu-iconic optionsmenu");
			tempItem.setAttribute("style", "list-style-image: url("+iconURL+");");
			if (Addons[j].userDisabled || !Addons[j].optionsURL) tempItem.setAttribute("disabled", true);
			// 拡張名を登録
			var name = Addons[j].name;
			var version = Addons[j].version;
			// tempItem.setAttribute("label", name);
			tempItem.setAttribute("label", name+" ["+version+"]");
			// 拡張のオプション・リストをソートする(linux版 Fx3.1 で大小文字を無視したソートが必要だった為有効にした。)
			var added=false;
			var numMenuItems = menu.childNodes.length;
			for(var i=0; i<numMenuItems; i++) {
				if(name.toLowerCase() < menu.childNodes.item(i).getAttribute("label").toLowerCase()) {
					menu.insertBefore(tempItem, menu.childNodes.item(i));
					added=true;
					break;
				}
			}
			if (!added) menu.appendChild(tempItem);
//			menu.appendChild(tempItem);		// ソートしない場合
		}
	},


	// ポップ・アップ・メニューを作る(Fx3.6/Tb)
    populateMenu36:function(menu) {
        var RDFService = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
        var Container = Components.classes["@mozilla.org/rdf/container;1"].getService(Components.interfaces.nsIRDFContainer);
        var extensionDS= Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).datasource;
        var root = RDFService.GetResource("urn:mozilla:item:root");

        function getRDFValue(element, type) {
		    var arc = RDFService.GetResource("http://www.mozilla.org/2004/em-rdf#" + type);
		    var target = extensionDS.GetTarget(element, arc, true);

		    if (target instanceof Components.interfaces.nsIRDFLiteral || target instanceof Components.interfaces.nsIRDFInt) return target.Value;
	           return "";
        }

         Container.Init(extensionDS, root);
         var elements=Container.GetElements();

		// 拡張の設定リストを作る
        while(elements.hasMoreElements()) {
			var element=elements.getNext();
			element.QueryInterface(Components.interfaces.nsIRDFResource);

			// make sure its an extension, OS X seems to list themes too
			if( getRDFValue(element, "type") != 2 ) continue;
			if( (getRDFValue(element, "isDisabled")=="true") || (getRDFValue(element, "disabled")=="true")) continue;

			var tempItem = document.createElement("menuitem");

			// 拡張のオプション・ダイアログを開くコマンドを登録
			var optionsURL=getRDFValue(element, "optionsURL");
			if(optionsURL=="") continue;
			tempItem.setAttribute("oncommand", "ucjs_optionmenu.openOptionsDialog(\""+optionsURL+"\")");

			// 拡張のアイコンを登録
			var iconURL=getRDFValue(element, "iconURL");
			if( iconURL=="") iconURL = this.ICON_URL;
			tempItem.setAttribute("class", "menuitem-iconic menu-iconic optionsmenu");
			tempItem.setAttribute("style", "list-style-image: url("+iconURL+");");

			// 拡張名を登録
			var name = getRDFValue(element, "name");
			tempItem.setAttribute("label", name);

			// 拡張のオプション・リストをソートする(linux版 Fx3.1 で大小文字を無視したソートが必要だった為有効にした。)
			var added=false;
			var numMenuItems = menu.childNodes.length;
			for(var i=0; i<numMenuItems; i++) {
				if(name.toLowerCase() < menu.childNodes.item(i).getAttribute("label").toLowerCase()) {
					menu.insertBefore(tempItem, menu.childNodes.item(i));
					added=true;
					break;
				}
			}
			if (!added) menu.appendChild(tempItem);
//			menu.appendChild(tempItem);		// ソートしない場合

		}

		if( menu.childNodes.length==0) {
			var tempItem = document.createElement("menuitem");
			tempItem.setAttribute("label", "Empty");
			tempItem.setAttribute("disabled","true");
			menu.appendChild(tempItem);
		}
    },

	// 設定ダイアログを開く
    openOptionsDialog:function(url) {
		if (url == "") return;
		var features;
		try {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"]
			                         .getService(Components.interfaces.nsIPrefBranch);
			var instantApply = prefs.getBoolPref("browser.preferences.instantApply");
			features = "chrome,titlebar,toolbar,centerscreen" + (instantApply ? ",dialog=no" : ",modal");
		} catch (e) {
			features = "chrome,titlebar,toolbar,centerscreen,modal";
		}
		openDialog(url, "", features);
	},

	// アプリケーションの種類(Firefox/Thunderbird)
	// return: 1: Firefox,	2: Thunderbird,	0:other
	getProgType: function() {
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                        .getService(Components.interfaces.nsIXULAppInfo);
		return (appInfo.ID == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}") ? 1
					: (appInfo.ID == "{3550f703-e582-4d05-9a08-453d09bdfdc6}") ? 2
						: 0;
	},

	// アプリケーションのバージョンを取得する
	getVer: function(){
		var info = Components.classes["@mozilla.org/xre/app-info;1"]
				.getService(Components.interfaces.nsIXULAppInfo);
		var ver = parseInt(info.version.substr(0,3) * 10,10) / 10;
		return ver;
	}
};
ucjs_optionmenu.init();
