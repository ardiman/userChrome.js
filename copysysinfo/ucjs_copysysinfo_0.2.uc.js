// ==UserScript==
// @name			ucjs_copysysinfo_0.2.uc.js
// @include			main
// @description		添加一个复制UA、 附件组件/userChrome.js 脚本列表等信息到剪贴板的菜
// @compatibility	WindowsXP/Vista/7/Ubuntu10.04(gnome)
// @compatibility	Firefox 3.6.* - 9.0.* / Thunderbird 3.1.*
// @compatibility	userChromeJS 1.2 / userChrome.js 0.7 - 0.8 , 0.8.010070202(Fx4 対応 Alice0775 版)
// @compatibility	Sub-Script/Overlay Loader v3.0.29mod
// @author			otokiti
// @version			0.1	:		09/11/13 初版
// @version			0.1_fx4	:	10/07/13 Fx4 専用版
// @version			0.2			10/07/29 Fx3.6/Fx4 用をマージ
// @version						10/02/08 default テーマが表示されない時の処理の改善とリスト表示を整理した。
// @version         0.2a :      02/08/16 Anpassung für Firefox 48 
// @version			auf github/ardiman - Anpassung fuer Benutzer, die nur mit einfacher userChrome.js arbeiten
// @Note			-----------------------------------------------------------------------------------------------------------
// @Note			【制限事項】
// @Note			1) 得られるリストはユニコード(UTF8)文字列となります。
// @Note			2) userChome.js スクリプト・リストは Alice0775 氏のサブスクリプトローダ以外では動作しません。
// @Note			3) userChome.js スクリプト・リストは各スクリプトをユニコードで保存しないと説明等で文字化けします。
// @Note			-----------------------------------------------------------------------------------------------------------
// @Note			userChome.js スクリプト・リストを得る部分は Alice0775 氏作 rebuild_userChrome.uc.xul から拝借しています。
// @Note			Fx4 で利用する場合は userChromeJS 1.2 または Alice0775 氏による trunk 4.0b2pre用のuserchrome.js 0.8の修正版
// @Note			http://space.geocities.jp/alice0775/STORE/userchrome.js-0.8.010070203-Fx4.0.xpi が必要です。
// ==/UserScript==
var ucjs_copysysinfo = {

	// メニュー項目
	MENU_LIST: [
		// ユーザ・エージェント(UA)
		{ disp: true,
		  label: "User Agent",
		  cmd: "UA"},
		// 拡張リスト(Extension list)
		{ disp: true,
		  label: "Addons",
		  cmd: "extension"},
		// テーマ・リスト(Themes list)
		{ disp: true,
		  label: "Themes",
		  cmd: "theme"},
		// プラグイン・リスト(Plugin list)
		{ disp: true,
		  label: "Plugins",
		  cmd: "plugin"},
		// userChrome.js スクリプト・リスト(userChrome.js script list)
		{ disp: true,
		  label: "UserChrome",
		  cmd: "USERCHROME"},
		// テンプレ(Template)
		{ disp: true,
		  label: "Konfiguration",
		  cmd: "TEMPLATE"},
	],

	STR_SELECTED:	"\u0020\u0028\u0061\u0075\u0073\u0067\u0065\u0077\u00e4\u0068\u006c\u0074\u0029",	// (選択)
	STR_DISABLE:	" (deaktiviert)",	// (無効)
	STR_SEP:		" \t",						// 項目の区切り
	
	init:function() {
		var menu = document.createElement("menu");
		menu.setAttribute("id", "ucjs_copysysinfo-menu");
		menu.setAttribute("label", "Firefox Infos");

		var target = document.getElementById("menu_pageSource"); 
		target.parentNode.insertBefore(menu, target);

		// サブ・メニューの作成
		var popup = document.createElement("menupopup");
		menu.appendChild(popup);

		// UA
		if (this.MENU_LIST[0].disp) {
			var menuItem = document.createElement("menuitem");
			menuItem.setAttribute("label", this.MENU_LIST[0].label);
			menuItem.setAttribute("oncommand", "ucjs_copysysinfo.copyText(\'"+this.MENU_LIST[0].cmd+"\');");
			popup.appendChild(menuItem);
			popup.appendChild(document.createElement("menuseparator"));
		}

		// 説明無し
		for (var i = 1; i < this.MENU_LIST.length; i++) {
			if (this.MENU_LIST[i].disp) {
				var menuItem = document.createElement("menuitem");
				menuItem.setAttribute("label", this.MENU_LIST[i].label);
				menuItem.setAttribute("oncommand", "ucjs_copysysinfo.copyText(\'"+this.MENU_LIST[i].cmd+"\');");
				popup.appendChild(menuItem);
			}
		}
		popup.appendChild(document.createElement("menuseparator"));

		// 説明付き
		for (var i = 1; i < this.MENU_LIST.length; i++) {
			if (this.MENU_LIST[i].disp) {
				var menuItem = document.createElement("menuitem");
				if (this.MENU_LIST[i].label=='Konfiguration'){
					menuItem.setAttribute("label", this.MENU_LIST[i].label+"sinfo");
				} else {
					menuItem.setAttribute("label", this.MENU_LIST[i].label+"info");
				}
				menuItem.setAttribute("oncommand", "ucjs_copysysinfo.copyText(\'"+"DESCRIPTION-"+this.MENU_LIST[i].cmd+"\');");
				popup.appendChild(menuItem);
			}
		}
	},

	description: false,	// 説明付き・無しのフラグ

	// 文字列をクリップボードにコピーする
	copyText: function(cmd) {

		if (/DESCRIPTION-(.+)/.test(cmd)) {	// 説明付き
			cmd = RegExp.$1;
			this.description = true;
		} else this.description = false;	// 説明無し

		var txt = "";
		switch(cmd) {
			case "UA":
				txt = window.navigator.userAgent+" BuildID: " + window.navigator.buildID
				break;
			case "extension":
			case "theme":
			case "plugin":
				txt = ucjs_copysysinfo.getAddonsInfo(cmd) + "\n";
				break;
		case "USERCHROME":
				if (typeof(userChrome_js) !="undefined") {
					txt = ucjs_copysysinfo.getScriptsList() + "\n";
				} else {
					txt = ucjs_copysysinfo.getScriptsListSimple() + "\n";
				}
				
				break;
			case "TEMPLATE":
					//【UserAgent】
				txt = "Useragent" + "\n" +
					window.navigator.userAgent+" BuildID: " + window.navigator.buildID + "\n" +
					//【導入している拡張とそのバージョン】
					"\n" + "Erweiterungen" + "\n" +
					ucjs_copysysinfo.getAddonsInfo("extension") + "\n" +
					//【使用しているテーマ】
					"\n" + "Themes" + "\n" +
					ucjs_copysysinfo.getAddonsInfo("theme") + "\n" +
					//【導入しているプラグインとそのバージョン】
					"\n" + "Plugins" + "\n" +
					ucjs_copysysinfo.getAddonsInfo("plugin") +"\n";
				break;
		}
		Components.classes["@mozilla.org/widget/clipboardhelper;1"]
			.getService(Components.interfaces.nsIClipboardHelper)
			.copyString(txt);
	},

	// Fx4/Other で動作を変える
	getAddonsInfo: function(type) {
		if ("@mozilla.org/addons/integration;1" in Components.classes) {	// fx4.0
			return this.getAddonsInfo40(type);
		} else {	// other
			switch(type) {
				case "extension":
					return this.getAddonList(Components.interfaces.nsIUpdateItem.TYPE_EXTENSION);
				case "theme":
					return this.getAddonList(Components.interfaces.nsIUpdateItem.TYPE_THEME);
				case "plugin":
					return this.getPluginList();;
			}
		}
	},

	// アドオン・リストを得る(Fx4)
	getAddonsInfo40: function(type) {
		// ソート
		function compare(a, b) {
			return String.localeCompare(a.toLowerCase() , b.toLowerCase());
		}

		Components.utils.import("resource://gre/modules/AddonManager.jsm");

		// テーマの場合現在のテーマを得る
		if (type == "theme") {
			// default テーマを表す文字列
			var defThemeStr = this.getPrefLocalizedString("extensions.{972ce4c6-7e08-4474-a285-3208198ce6fd}.name");
			// 現在のテーマを表す文字列
			var theme = this.getPrefString("general.skins.selectedSkin");
			if (theme == "classic/1.0") {
				theme = defThemeStr;
			}
		}

		// リストを得る
		var Addons;
		AddonManager.getAddonsByTypes([type], function(installedItems) {
			Addons = installedItems;
		});

		// Callback の実行を待つ
		var thread = Components.classes['@mozilla.org/thread-manager;1'].getService().mainThread;
		while (Addons == void(0)) {
			thread.processNextEvent(true);
		}

		// アドオン情報を得る
		var result = new Array();
		var isSelected = false;		// 選択されているか（テーマの場合のみ）
		var isDefTheme = false;		// default テーマか（テーマの場合のみ）
		for (var j = 0; j < Addons.length; j++) {
			var line = Addons[j].name + this.STR_SEP + Addons[j].version;
			if (Addons[j].type == "theme") {	// テーマの場合
				if (Addons[j].name == defThemeStr)	// default テーマの場合
					isDefTheme = true;
				if (Addons[j].name == theme) {		// 選択されている場合
					isSelected = true;
					line += this.STR_SELECTED;
				}
			} else {							// 拡張・プラグインの場合
				if(Addons[j].userDisabled)
					line += this.STR_DISABLE;
			}
			if (this.description) line += this.STR_SEP+ Addons[j].description;
			result.push(line);
		}

		// ------------------------------------------------------------------------------
		// Mozilla/5.0 (X11; Linux i686; rv:2.0b3pre) Gecko/20100730 Ubuntu/10.04 (lucid)
		// デフォルト・テーマは表示されないので.....
		// 複数テーマがある場合デフォルトに切り替えられないのでバグだと思うが?
		if (type == "theme" && !isDefTheme) {	// テーマで default テーマがない場合は追加する
			var line = defThemeStr + this.STR_SEP
						+ Components.classes["@mozilla.org/xre/app-info;1"]
						.getService(Components.interfaces.nsIXULAppInfo).version;
			if (!isSelected)	// 選択されたテーマがない場合 default が選択されているとする
				line += this.STR_SELECTED;
			if (this.description)
				line += (this.STR_SEP + this.getPrefLocalizedString("extensions.{972ce4c6-7e08-4474-a285-3208198ce6fd}.description"));
			result.push(line);
		}
		// ------------------------------------------------------------------------------
    	result.sort(compare);

		return result.join("\n");
	},

	// プラグインのリストを得る(Fx3.6/Tb)
	getPluginList: function(){
		// ソート
		function compare(a, b) {
			return String.localeCompare(a.name.toLowerCase() , b.name.toLowerCase());
		}

		var result = new Array();
        var gPluginHost = Components.classes["@mozilla.org/plugin/host;1"]
        					.getService(Components.interfaces.nsIPluginHost);
		var itemList = gPluginHost.getPluginTags({});

	    itemList.sort(compare);

		var before = "";
		for (var i=0; i < itemList.length; i++) {
			if (itemList[i].name == before) continue;
			else before = itemList[i].name;
			var line = itemList[i].name;
			if (itemList[i].version) line += this.STR_SEP + itemList[i].version;
			if(itemList[i].disabled) line += this.STR_DISABLE;
      		if (this.description) line += this.STR_SEP + itemList[i].description.replace(/<\/?[a-z][^>]*>/gi, " ");
			result.push(line);
		}
		return result.join("\n");
	},

	// 拡張機またはテーマのリストを得る(Fx3.6/Tb)
	getAddonList: function(type) {
		// ソート
		function compare(a, b) {
			return String.localeCompare(a.name.toLowerCase() , b.name.toLowerCase());
		}

		function getResource(aID, str){
			try {
				var gRDFS = Components.classes["@mozilla.org/rdf/rdf-service;1"]
							.getService(Components.interfaces.nsIRDFService);
				var item = gRDFS.GetResource("urn:mozilla:item:" + aID);
				var property = gRDFS.GetResource("http://www.mozilla.org/2004/em-rdf#" + str)
				var target = gExtensionManager.datasource.GetTarget(item, property, true)
								.QueryInterface(Components.interfaces.nsIRDFLiteral);
				return target.Value;
			} catch (e) {
				return "";
			}
		}

		var result = new Array();
		var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
								.getService(Components.interfaces.nsIExtensionManager);
		var itemList = gExtensionManager.getItemList(type, {});

	    itemList.sort(compare);

		if (type == Components.interfaces.nsIUpdateItem.TYPE_THEME) {	// テーマの場合現在のテーマを得る
			var theme = this.getPrefString("general.skins.selectedSkin");
			if (theme == "classic/1.0") {
				theme = this.getPrefLocalizedString("extensions.{972ce4c6-7e08-4474-a285-3208198ce6fd}.name");
			}
		}
		for (var i=0; i < itemList.length; i++) {
			var line = itemList[i].name + this.STR_SEP + itemList[i].version;
			// 有効・無効／選択・非選択をしらべる
			if (type == Components.interfaces.nsIUpdateItem.TYPE_EXTENSION) {	// 拡張の場合
				if(getResource(itemList[i].id, "isDisabled") =="true")
					line += this.STR_DISABLE;
			} else {										// テーマの場合
				if (itemList[i].name == theme)
					line += this.STR_SELECTED;
			}
			if (this.description) {
				var str = getResource(itemList[i].id, "description");
				if (str != "") line += this.STR_SEP + str;
			}
			result.push(line);
		}
		return result.join("\n");
	},

	// userChome.js スクリプト・リストを得る
	// rebuild_userChrome.uc.xul: onpopup() より
	getScriptsList: function() {
		var result = new Array();

		// フォルダをチェック
		for(var j = 0, lenj = userChrome_js.arrSubdir.length; j < lenj; j++){
			var dirName = userChrome_js.arrSubdir[j] == "" ? "root" : userChrome_js.arrSubdir[j];
			var flg = false;
			// uc.js ファイルが存在するか？
			for(var i = 0, len = userChrome_js.scripts.length; i < len; i++){
				var script = userChrome_js.scripts[i];
				if(script.dir != dirName) continue;
				flg = true;
				break;
			}
			// uc.xul ファイルが存在するか？
			if(!flg){
				for(var i = 0, len = userChrome_js.overlays.length; i < len; i++){
					var script = userChrome_js.overlays[i];
					if(script.dir != dirName) continue;
					flg = true;
					break;
				}
			}
			if(!flg) continue;	// 存在しない場合はスキップ

			// フォルダ名
			var isroot = dirName=="root";
			result.push((isroot? "": "\n" ) + "[chrome/" + (isroot? "": dirName) + "]");
			if (isroot) result.push("userChrome.js");	// userChrome.js を最初に追加

			// uc.js ファイル・リスト
			for(var i = 0, len = userChrome_js.scripts.length; i < len; i++){
				var script = userChrome_js.scripts[i];
				if(script.dir != dirName) continue;
				var line = script.filename + (this.description
							? ((script.description==script.filename)? "": this.STR_SEP + script.description)
							: "") + (userChrome_js.scriptDisable[script.filename]? " (\u7121\u52b9)": "");
				result.push(line);
			}
			// uc.xul ファイル・リスト
			for(var i = 0, len = userChrome_js.overlays.length; i < len; i++){
				var script = userChrome_js.overlays[i];
				if(script.dir != dirName) continue;
				var line = script.filename + (this.description
							?  ((script.description==script.filename)? "": this.STR_SEP + script.description)
							: "") + (userChrome_js.scriptDisable[script.filename]? " (\u7121\u52b9)": "");
				result.push(line);
			}
		}
		return result.join("\n");
	},

	getScriptsListSimple: function() {
		var result = new Array();
		    // Arrays (jeweils ein Array fuer uc.js und uc.xul) nehmen Namen der gefundenen Skripte auf
		let ucJsScripts = [];
		let ucXulScripts = [];
		// Suchmuster, also die Dateierweiterungen uc.js und uc.xul
		let extjs = /\.uc\.js$/i;
		let extxul= /\.uc\.xul$/i;
		let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path);
		// files mit Eintraegen im Chrome-Ordner befuellen
		let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
		// Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
		while (files.hasMoreElements()) {
			let file = files.getNext().QueryInterface(Ci.nsIFile);
			// keine gewuenschte Datei, deshalb continue
			if (!extjs.test(file.leafName) && !extxul.test(file.leafName)) continue;
			// uc.js gefunden -> im Array ablegen
			if (extjs.test(file.leafName)) ucJsScripts.push(file.leafName);
			// uc.xul gefunden -> im Array ablegen
			if (extxul.test(file.leafName)) ucXulScripts.push(file.leafName);
		}

		result.push("userChromeJS/uc.js:");
		for(var i = 0, len = ucJsScripts.length; i < len; i++){
			var line = ucJsScripts[i];
			result.push(line);
		}
		result.push("\nuserChromeJS/uc.xul:");
		for(var i = 0, len = ucXulScripts.length; i < len; i++){
			var line = ucXulScripts[i];
			result.push(line);
		}
		
		return result.join("\n");
	},

	// 設定文字列情報を取得
	getPrefString: function(str) {
		return Components.classes["@mozilla.org/preferences;1"]
						.getService(Components.interfaces.nsIPrefBranch)
						.getCharPref(str);
	},

	// ロケールファイルから既定値を取得
	getPrefLocalizedString: function(str) {
		return Components.classes["@mozilla.org/preferences;1"]
				.getService(Components.interfaces.nsIPrefBranch)
				.getComplexValue(str, Components.interfaces.nsIPrefLocalizedString).data;
	}
};
ucjs_copysysinfo.init();
