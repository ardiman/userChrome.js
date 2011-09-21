// ==UserScript==
// @name			ucjs_uachanger_2.0.0.uc.js
// @namespace		http://www.sephiroth-j.de/mozilla/
// @description		User Agent
// @author			otokiti
// @include			main
// @compatibility	WindowsXP / Ubuntu8.04(gnome)
// @compatibility	Firefox 3.0 - 3.7a1pre
// @compatibility	userChrome.js 0.7 - 0.8 / userChromeJS 1.1
// @compatibility	Sub-Script/Overlay Loader v3.0.25mod
// @version			1.0.0	07/02/22	初版
// @version			1.0.1	07/08/09	パネルにコンテクストメニューを追加
// @version			1.0.2	08/07/13	Fx のバージョンを見て Fx2/Fx3 を追加するようにした。
// @version			1.0.3	08/11/18	uc.xul から uc.js へ変更
// @version			1.0.4	09/02/09	ツールチップを簡略化
// @version			1.0.5	09/02/24	動作を
// @version								変更：パネルの左クリックでリセット（本来の UA に戻す）
// @version								追加：パネル上のホイルー・スクロールで UA を進める／戻す
// @version								に変更
// @version			1.0.6	09/07/02	1) ボタン／文字列表示を選択可能にした。
// @version								2) 追加する別バージョン Firefox を Fx3 と Fx3.5 に変更した。
// @version								 　＊追加しない設定も可能
// @version			2.0.0	09/11/17	1) 常に特定の UA で開く URL を指定可能にした。
// @version								2) 別バージョン Fx を Fx3.5 の場合のみ Fx3.0 とし他は Fx3.5 にした。
// @version								3) UA リストを新しくした。
// @Note			1) 状态栏菜单上滚动鼠标，可切换UA
// @Note			2) 状态栏菜单上右键单击，可指定UA
// @Note			3) 点击鼠标左键可重置菜单（返回默认UA）
// @Note			Fx3 の時は Fx3.5、Fx2/Fx3.5/3.6 の時は Fx3.0 の UA が追加されます。
// @Note			1) getVer() は Alice0775 氏のスクリプトから拝借しました。
// @Note			2) 指定某个链接用指定的UA打开用 UserAgentSwitcher.uc.js
// @Note			   http://loda.jp/script/?id=53 を参考にさせて頂きました。
// @Note			3) タブ以外で指定した URL を開いた時 UA は変更されますがパネルは変化しません(仕様)。
// @Note			パネル画像や追加する UA は適当に変更してください。
// ==/UserScript==
var ucjs_UAChanger = {
// ------------------------------ 任意に設定 -----------------------------------------------------------------
	// 状态栏菜单的显示位置
	// defautl: 状态栏右侧显示
	TARGET:  null,	// 位置を変更する場合パネルを置きたいターゲット・パネルのＩＤ(文字列)に書き換えてください。

	// 显示式样
	PANEL_TYPE:	true,	// true: 画像	false: 文字

	// 別バージョン Firefox の UA を追加するか
	ADD_OTHER_FX: true,	// true: 追加する、	false: 追加しない

	// 文字形式の場合のパネルの幅(OS/テーマ/フォント/文字数によって変更が必要な場合があります)
	WIDE_WIDTH: 38,		// 別バージョン Firefox の UAを追加する場合
	NARROW_WIDTH: 26,	// 別バージョン Firefox の UAを追加しない場合

	// 总是用指定的UA打开一个指定的链接
	// 	url: 目标 URL(指定正则表达式)
	// 	idx: UA (UA_LIST 顺序)
	//		 default: 0 = 其他版本的 Fx(ADD_OTHER_FX: true 时有效)
	//				  1 = Internet Explorer,	2 = Opera,		3 = 手机
	SITE_LIST: [
		{ url: "http:\/\/www\.google\.co\.jp\/m\/.*",
		  idx: 3 },
		{ url: "http:\/\/www\.google\.co\.jp\/gwt\/.*",
		  idx: 3 },
		{ url: "https?:\/\/.*skydrive\.live\.com\/.*",
		  idx: 0 },
//		{ url: "http:\/\/www\.cybersyndrome\.net\/evc\.html",
//		  idx: 1 },
	],

	// 添加UA到菜单中
	UA_LIST: [
		// 1) Internet Explorer の UA と画像
		{  name: "Internet Explorer",
		   ua: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)",
		   label: "IE",
		   img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAALCAIAAACCpFiiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH1wIWBhob8piSkQAAAK9JREFUeNrFlE0KwjAQRl+mFW/QS/T+e8EzdKG4cCUaiqCCXYiJi9HQoMWEon1kkRmS+eYnxIBnCoSJKBPP+VdfjInMgPqTcakVa9wQPZi68lmMbbWWnqm9goOMV83Ewnloxj5FxntEcC4jT7hCN/S4bnCB+/u9tv1gigBYS1WlywOYuL4O9iGpPk3z3NR1ZAbU/40CDJxg0xc+wloH8EsKKGEXWr2FJdi/fB4zmD8AkkQy603tb5wAAAAASUVORK5CYII=)"},
		// 2) Opera の UA と画像
		{  name: "Opera",
		   ua: "Opera/9.80 (Windows NT 5.1; U; ja) Presto/2.2.15 Version/10.01",
		   label: "Op",
		   img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAALCAIAAACCpFiiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH1wIWBgkEHn/e9gAAAM1JREFUeNrFlN0KwjAMhb92iuwl9jB78CG+hl6IdzJQQWFu6OJFZ9d1v6LMXJ0kbc5JE6qE/9hiKClvVUrNSCxS87n4F1aOdNzZvfsARpC0xjWmcg16KrGppVTNZFndlMEytDk7OH5APPoME4YicIJr34ylXdS26Lla+wq8k00r4Nm3XCUUBmlNlmExkOdVxLjuAZMKwypo3b6uPOI7nOFhfe9mmhJFjUhX6e6g2RMXWwkX2MKt71KSVCCOv9mKAAI4WOI9bCCd5c9awgpeTf9WdYgwaMYAAAAASUVORK5CYII=)"},
		// 3) 手机の UA と画像
		{  name: "DoCoMo",
		   ua: "DoCoMo/2.0 P906i(c100;TB;W24H15)",
		   label: "Do",
		   img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAALCAIAAACCpFiiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH1wIWBgoIPOTBHgAAAVxJREFUeNq9lL9OwzAQxn+XWEggRl4FqSAGYO4LMLDAc2VmYO0OQ1VVPAITYgsg8SchJI3tY0iaui4rtU7Wfd99l7vEvgizc/YNXy3bXYZUSAUjNH57ZVtveK5IhYMdAKd6dh8K5O40StGze7k77faIH1JC/4+qjefp2wBUlq8EVUAmJzqeyuSkf1zgD1DHU4Bvu9biBh8mBu+qvDU8FkmPF57GU1oKC1DY3oDC6ngaQrkZyc2oY1ahYtlH6ESCz5a3hrymsMmqF6e0SuUAKtcb6MVcskO9mMehyq2FKgd0ULLDThkLSktpqT2QxJ/Cq6pifWeqPQx3rPdXD5vkpjIS4BSv/UFwe0Tj2DO0nh/nLueLxWJoYzc7Bn6uZ53T+QMfhjo+WrvZcZgLUDveW/I6KFxZPloqh9P/miJZnn1em+UVd7w2vDT/Ps0JiACmH6y85rGktNv4e6SCkV908juGQIIg7wAAAABJRU5ErkJggg==)"},
	],

	// 現在の Firefox の UA を表す画像
	NOW_UA_IMG: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAALCAIAAACCpFiiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH1wIWBgYCcIRnDAAAAYVJREFUeNq9lMFOGzEURY8zQytVLPsnEClUFWq6zg9kh1SJf6JS1lmwZZ8oSlEWfEAEXWTTxRAENDMMY8b268JOJhMIXcGV9XTffddvPLZsJeff2Y1ZlLwvYiJFpIgV2gXtcFCzjNocDhi1t/bw/lcMz1E6JacHRIrPHxCwEgrtIYNvNbIN/zU8h3Zu9hAD5IZFA5Fa+cHQGXP2lc54c6YXV6X2sOIvktq/Cjd6eJk2Qv7k0I7MkBpSA4RpqaHfAqrYb9EZV9GLnq+Lvkm/FRr68bfkRv9OiiQ1jWotViiF3JJbgF4TqNJV9KQ7qYkbzl6T7oReM4jLIZm5zUxaOCDe3EYn4gQRjONkL4g+9dGnP/e3lozj+IKTPY4vKpvfVivWhQNVcnqAtnyKKR2P1j3ap6Nfwdj7AvDjvLaybaJXXiRrWBT2z105TYq1D+emuC/vcmusvNHdVQpgnpppUiy3Wtv7ub661tnqNr8NogaRUssz1m6WFKPLbJ6Zd3izdiL1MVb/ACNnDbipILqOAAAAAElFTkSuQmCC)",

	// 添加其他版本的firerfox数据
	EXT_FX_LIST: [
		{  name: "Firefox3",
		   ua: "Mozilla/5.0 (Windows; U; Windows NT 5.1; ja; rv:1.9.0.15) Gecko/2009101601 Firefox/3.0.15",
		   label: "Fx3",
		   img: ""},
	    { name: "Firefox3.5",
	      ua: "Mozilla/5.0 (Windows; U; Windows NT 5.1; ja; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5",
		  label: "Fx3.5",
	      img: ""},
	],
	// 其他版本的Firefox添加到状态栏菜单时使用的图片
	EXT_FX_LIST_IMG: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAALCAYAAAANxs/1AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1wodDhw478fZHQAAAI5JREFUeNrNlMENwCAIRcF0I4ZyJoZyJnoyoRaE1B7gpIL68/iKwiRQOC4vgX281oQJsA8QpvDguT9Tu4vmJebBwvS4JCtu3fc7QetCi+pKdtas8934E0Gr1ZqqpqvF6JwmaVkjQzgUmG2TR/fExymBWZFZz0V2edV734zVWu9lR6/+xINY/R9sUDzKC7wBexlwxVK9SE8AAAAASUVORK5CYII=)",

// -----------------------------------------------------------------------------------------------------------

	// UA リストのインデックス
	def_idx: 0,

	// 初期化
	init: function() {
		this.mkData();	// UA データ(UA_LIST)を作る
		this.mkPanel();	// パネルとメニューを作る
		// Observer 登録
		var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
		os.addObserver(this, "http-on-modify-request",false);
		// イベント登録
		var contentArea = document.getElementById("appcontent");
		contentArea.addEventListener("load", this, true);
		contentArea.addEventListener("select", this, false);
		var contentBrowser = this.getContentBrowser();
		contentBrowser.tabContainer.addEventListener("TabClose", this, false);
		window.addEventListener("focus", this, true);
		window.addEventListener("unload", this, false);
	},

	// UA データを作る
	mkData: function() {
		var ver = this.getVer();	// 現在使っている Firefox のバージョン

		// 現在使っている Firefox のデータを作る
		var tmp = [];
		tmp.name = "Firefox" + ver;
		tmp.ua = "";
		tmp.img = this.NOW_UA_IMG;
		tmp.label = "Fx"+ (this.ADD_OTHER_FX? ver: "");
		this.UA_LIST.unshift(tmp);


		// Fx のバージョンを見て UA を追加する
		if (this.ADD_OTHER_FX) {
			if (ver == 3.5) {	// Fx3.5 の場合 Fx3.0 を追加する
				this.EXT_FX_LIST[0].img = this.EXT_FX_LIST_IMG;
				this.UA_LIST.push(this.EXT_FX_LIST[0]);
			} else {			// Fx3.5 以外では Fx3.5 を追加する
				this.EXT_FX_LIST[1].img = this.EXT_FX_LIST_IMG;
				this.UA_LIST.push(this.EXT_FX_LIST[1]);
			}
		}

		// 起動時の UA を 初期化 (general.useragent.override の値が有るかチェック 07/03/02)
		var preferencesService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("");
		if (preferencesService.getPrefType("general.useragent.override") != 0) {
			for (var i = 0; i < this.UA_LIST.length; i++) {
		    	if (preferencesService.getCharPref("general.useragent.override") == this.UA_LIST[i].ua) {
		    		this.def_idx = i;
		    		break;
				}
			}
		}
	},

	// UA パネルを作る
	mkPanel: function() {
		var uacPanel = document.createElement("statusbarpanel");
		uacPanel.setAttribute("id", "uac_statusbar_panel");
		if (this.PANEL_TYPE)
			uacPanel.setAttribute("class", "statusbarpanel-iconic");
		else
			uacPanel.setAttribute("style", "min-width: " + (this.ADD_OTHER_FX? this.WIDE_WIDTH: this.NARROW_WIDTH) +"px; text-align: center; padding: 0px;");

		var toolbar = document.getElementById("status-bar");
		if (this.TARGET !=null) {	// default から書き換えている場合
			this.TARGET = document.getElementById(this.TARGET);
		}
		toolbar.insertBefore(uacPanel, this.TARGET);
		this.setImage(this.def_idx);

		// UA パネルのコンテクストメニューを作る
		var MainPopup = document.getElementById("mainPopupSet");
		var PopupMenu = MainPopup.appendChild(document.createElement("menupopup"));
		PopupMenu.id = "uac_statusbar_panel-context";
		for(var i = 0; i < this.UA_LIST.length; i++) {
			if (this.UA_LIST[i].name == "" ) continue;
			var mi = document.createElement("menuitem");
			mi.setAttribute("label", this.UA_LIST[i].name);
			mi.setAttribute("oncommand", "ucjs_UAChanger.setUA(" + i + ");");
			mi.setAttribute("type", "checkbox");
			mi.setAttribute("checked", i==this.def_idx);
			mi.setAttribute("uac-generated", true);
			PopupMenu.appendChild(mi);
		}
	},

	// URL 指定で User-Agent の書き換え(UserAgentSwitcher.uc.js より)
	observe: function(subject, topic, data){
		if(topic != "http-on-modify-request") return;
		var http = subject.QueryInterface(Ci.nsIHttpChannel);
		for(var i = 0;i < this.SITE_LIST.length; i++) {
			if (http.URI && (new RegExp(this.SITE_LIST[i].url)).test(http.URI.spec)) {
				var idx = (this.SITE_LIST[i].idx == 0)? this.UA_LIST.length-1: this.SITE_LIST[i].idx;
				http.setRequestHeader("User-Agent", this.UA_LIST[idx].ua, false);
			}
		}
	},

	// イベント・ハンドラ
	handleEvent: function(aEvent) {
		var contentBrowser = this.getContentBrowser();
		var uacPanel = document.getElementById("uac_statusbar_panel");
		var uacMenu = document.getElementById("uac_statusbar_panel-context");
    	switch(aEvent.type) {
			case "popupshowing":	// コンテクスト・メニュー・ポップアップ時にチェック・マークを更新する
				var menu = aEvent.target;
				for(var i = 0; i < menu.childNodes.length; i++) {
					menu.childNodes[i].setAttribute("checked", i==ucjs_UAChanger.def_idx);
				}
				break;
			case "DOMMouseScroll":	// UA パネル上のホイール・スクロール
				this.wheelChangeUA(aEvent);
				break;
			case "load":			// SITE_LIST に登録された URL の場合
			case "select":
			case "focus":
			case "TabClose":
				for(var i = 0;i < ucjs_UAChanger.SITE_LIST.length; i++) {
					if ((new RegExp(this.SITE_LIST[i].url)).test(contentBrowser.currentURI.spec)) {
						var idx = (this.SITE_LIST[i].idx == 0)? this.UA_LIST.length-1: this.SITE_LIST[i].idx;
						this.setImage(idx);
						// パネルの変更を不可にする
						uacPanel.setAttribute("context", "");
						uacPanel.setAttribute("onclick", "event.stopPropagation();");
						uacPanel.removeEventListener("DOMMouseScroll", this, false);
						uacMenu.removeEventListener("popupshowing", this, false);
						return;
					}
				}
				this.setImage(this.def_idx);
				// パネルの変更を可能にする
				uacPanel.setAttribute("context", "uac_statusbar_panel-context");
				uacPanel.setAttribute("onclick", "ucjs_UAChanger.resetUA(event);event.stopPropagation();");
				uacPanel.addEventListener("DOMMouseScroll", this, false);
				uacMenu.addEventListener("popupshowing", this, false);
				break;
			case "unload":			// 終了処理
				var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
				os.removeObserver(this, "http-on-modify-request");
				var contentArea = document.getElementById("appcontent");
				contentArea.removeEventListener("load", this, true);
				contentArea.removeEventListener("select", this, false);
				contentBrowser.tabContainer.removeEventListener("TabClose", this, false);
				window.removeEventListener("focus", this, true);
				uacPanel.removeEventListener("DOMMouseScroll", this, false);
				uacMenu.removeEventListener("popupshowing", this, false);
				window.removeEventListener("unload", this, false);
				break;
		}
	},

	// パネルクリックで UA をリセット
	resetUA : function(event){
		if(event.button != 0) return;
		this.def_idx = 0;
		this.setUA(this.def_idx);
	},

	// パネル上のホイール・スクロールで UA を変更
	wheelChangeUA: function(event){
		this.hidePopup(document.getElementById("uac_statusbar_panel-context"));
		if (event.detail > 0) {
			this.def_idx++;
			if ( this.def_idx > this.UA_LIST.length-1  ) this.def_idx = 0;
		} else {
			this.def_idx--;
			if (this.def_idx < 0 ) this.def_idx = this.UA_LIST.length-1;
		}
		this.setUA(this.def_idx);
	},

	// パネル上のホイール・スクロール中はメニューを消す
	hidePopup: function (menu) {
		const Cc = Components.interfaces;
	    var popupBox = null;
	    var menuBox = null;
	    try {
	        popupBox = menu.boxObject.QueryInterface(Cc.nsIPopupBoxObject);
	    } catch (e) {}
	    try {
	        menuBox = menu.parentNode.boxObject.QueryInterface(Cc.nsIMenuBoxObject);
	    } catch (e) {}

	    if (menuBox) menuBox.openMenu(false);
	    else if (popupBox) popupBox.hidePopup();
 	},

	// 番号を指定して UA を設定
	setUA: function(i) {
		var preferencesService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("");
		if ( i == 0 ){	// オリジナル UA にする場合
			// 既にオリジナル UA の場合は何もしない
			if (preferencesService.getPrefType("general.useragent.override") == 0) return;
			preferencesService.clearUserPref("general.useragent.override");
	    } else {		// 指定した UA にする場合
	    	preferencesService.setCharPref("general.useragent.override", this.UA_LIST[i].ua);
		}
		this.def_idx = i;
		this.setImage(i);
	},

	// UA パネル画像とツールチップを設定
	setImage: function(i) {
		var uacPanel = document.getElementById("uac_statusbar_panel");
		if (this.PANEL_TYPE) {
			uacPanel.style.listStyleImage = this.UA_LIST[i].img;
			uacPanel.style.padding = "0";
		} else
			uacPanel.setAttribute("label", this.UA_LIST[i].label);
		uacPanel.setAttribute("tooltiptext", "User Agent("+ this.UA_LIST[i].name + ")");
	},

	// アプリケーションのバージョンを取得する(Alice0775 氏のスクリプトから頂きました。)
	getVer: function(){
		var info = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
		var ver = parseInt(info.version.substr(0,3) * 10,10) / 10;
		return ver;
	},

	// 現在のブラウザオブジェクトを得る。
	getContentBrowser:function(){
		var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
							.getService(Ci.nsIWindowMediator);
		var topWindowOfType = windowMediator.getMostRecentWindow("navigator:browser");
		if(topWindowOfType) return topWindowOfType.document.getElementById("content");
		return null;
	}
}
ucjs_UAChanger.init();
