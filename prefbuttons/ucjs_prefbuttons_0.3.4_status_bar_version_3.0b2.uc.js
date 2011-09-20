// ==UserScript==
// @name            ucjs_prefbuttons_0.3.4_status_bar_version_3.0b2.uc.js
// @description		Adds frequently used buttons to the toolbar
// @include			main
// @compatibility	WindowsXP/Vista/7/Ubuntu10.04(gnome)
// @compatibility	Firefox 3.6 - 4.0
// @compatibility	userChromeJS 1.2 / userChrome.js 0.7 - 0.8 , 0.8.010070202(Fx4 対応 Alice0775 版)
// @compatibility	Sub-Script/Overlay Loader v3.0.29mod
// @creator			Samir L. Boulema
// @modifies        otokiti
// @version			version 1:		2007/12/4	スクリプト化初版
// @version			version 1.1:	2007/12/15	不要なコードの整理
// @version			version 2:		08/10/15	uc.xul から uc.js 化と整理
// @version			version 2.1:	08/12/28	CSS の手直しと色指定の簡略化
// @version			version 2.2:	09/05/25	1) このタブのリダイレクト/フレームのみ 許可／禁止を追加
// @version										2) load/reload 時をチェック(tmp の「機能の許可」等)
// @version			version 2.3:	09/05/28	1) PreButtons の全てのチェックボックスを追加
// @version										   ＊「クッキー警告の 使用／不使用」は新規に書き直し
// @version										   https://developer.mozilla.org/En/Cookies_Preferences_in_Mozilla
// @version										2) ボタンの並び順を自由にした。(button の並び替え)
// @version										3)「JavaScript の無効」または「画像読み込みの無効」の時
// @version										   「このタブの～」のボタンを無効化し操作不可にした。
// @version			version 2.4:	09/07/02	1) マウスジェスチャー等の cmd_close でタブを閉じた場合の
// @version										   エラー対策で「このタブの～」のチェック時に setTimeout を付加
// @version										2) 一部コードの整理
// @version			version 2.5:	09/08/30	Fx3.6 以降で Java の有効・無効がアドオンマネージャだけに変更された為
// @version										Fx3.6 以降では自動的に Java ボタンは非表示とした。
// @version										Bug 506985 - remove java-specific preferences from Firefox UI, hidden prefs
// @version			version 3.0:	10/08/07	Fx4 対応中：navigator.preference() を通常の Preferences API 処理に変更した。
// @Note            Pref Buttons 0.3.4をベースに useChrome.js スクリプト化
// @Note            チェックボックスのみステータスバーに表示するように改変している
// @Note            「このタブのリダイレクトのみ 許可／禁止」「このタブのフレームのみ 許可／禁止」を追加
// @Note            ボタンが画像は「PrefButtons のチェックボックスをボタン化する」
// @Note            http://mid-knight.seesaa.net/article/17723970.html
// @Note            の物を利用させて頂いている。
// @Note            ＊仕様：1) about:config や別拡張等から javascript.enabled/permissions.default.image を
// @Note					   変更した場合はダイレクトにボタンが変化しない時が有る。
// @Note					2) Linux の デフォルト・テーマ(TANGO) ではチェックボックスをボタン化が動作しない。
// @Note			Fx4 で利用する場合は userChromeJS 1.2 または Alice0775 氏による trunk 4.0b2pre用のuserchrome.js 0.8の修正版
// @Note			http://space.geocities.jp/alice0775/STORE/userchrome.js-0.8.010070203-Fx4.0.xpi が必要です。
// ==/UserScript==
/***** BEGIN LICENSE BLOCK *****
Version: MPL 1.1/GPL 2.0/LGPL 2.1

The contents of this file are subject to the Mozilla Public License Version
1.1 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
for the specific language governing rights and limitations under the
License.

The Original Code is the Preferences Toolbar 2

The Initial Developer of the Original Code is Aaron Andersen.

Portions created by the Initial Developer are Copyright (C) 2002
the Initial Developer. All Rights Reserved.

Contributor(s):
  Aaron Andersen <aaron@xulplanet.com>
  Stephen Clavering <mozilla@clav.me.uk> (conversion to PrefButtons extension)

Alternatively, the contents of this file may be used under the terms of
either the GNU General Public License Version 2 or later (the "GPL"), or
the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
in which case the provisions of the GPL or the LGPL are applicable instead
of those above. If you wish to allow use of your version of this file only
under the terms of either the GPL or the LGPL, and not to allow others to
use your version of this file under the terms of the MPL, indicate your
decision by deleting the provisions above and replace them with the notice
and other provisions required by the LGPL or the GPL. If you do not delete
the provisions above, a recipient may use your version of this file under
the terms of any one of the MPL, the GPL or the LGPL.
***** END LICENSE BLOCK *****/
var PrefButtons = {

// ------------------------------ 任意に設定 -----------------------------------------------
	Target: "statusbar-display",	// ボタン表示のターゲット(任意に設定)

	IMGButton: true,				// ボタン画像に置き換える(任意に設定)
	BUTTON_COLOR: "lightcyan",			// 画像に置き換えた時のバック・グランド・カラー(任意に設定)

	// ボタンの設定 (dsp: 表示・非表示、順番を変える事でボタンの並びを変更可能)
	button: [
		// このタブのJavascriptのみ 許可／禁止
		{	dsp: true,
			id: "prefbuttons:javascript-tab",
			label: "javascript-tab",
			type: "oncommand",
			cmd: "PrefButtons.togglePermInTab(this.checked, 'allowJavascript');",
			func: function() { this.checked = getBrowser().docShell.allowJavascript; PrefButtons.setDisabledJavascriptInTab(); },
			text: "\u3053\u306e\u30bf\u30d6\u306e\u004a\u0061\u0076\u0061\u0073\u0063\u0072\u0069\u0070\u0074\u306e\u307f\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// このタブのプラグインのみ 許可／禁止
		{	dsp: true,
			id: "prefbuttons:plugins-tab",
			label: "plugins-tab",
			type: "oncommand",
			cmd: "PrefButtons.togglePermInTab(this.checked, 'allowPlugins');",
			func: function() { this.checked = getBrowser().docShell.allowPlugins; },
			text: "\u3053\u306e\u30bf\u30d6\u306e\u30d7\u30e9\u30b0\u30a4\u30f3\u306e\u307f\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// このタブの画像のみ 許可／禁止
		{	dsp: true,
			id: "prefbuttons:images-tab",
			label: "images-tab",
			type: "oncommand",
			cmd: "PrefButtons.togglePermInTab(this.checked, 'allowImages');",
			func: function() { this.checked = getBrowser().docShell.allowImages; PrefButtons.setDisabledImagesInTab();},
			text: "\u3053\u306e\u30bf\u30d6\u306e\u753b\u50cf\u306e\u307f\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// このタブのリダイレクトのみ 許可／禁止
		{	dsp: true,
			id: "prefbuttons:redirect-tab",
			label: "redirect-tab",
			type: "oncommand",
			cmd: "PrefButtons.togglePermInTab(this.checked, 'allowMetaRedirects');",
			func: function() { this.checked = getBrowser().docShell.allowMetaRedirects; },
			text: "\u3053\u306e\u30bf\u30d6\u306e\u30ea\u30c0\u30a4\u30ec\u30af\u30c8\u306e\u307f\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// このタブのフレームのみ 許可／禁止
		{	dsp: true,
			id: "prefbuttons:subframes-tab",
			label: "subframes-tab",
			type: "oncommand",
			cmd: "PrefButtons.togglePermInTab(this.checked, 'allowSubframes');",
			func: function() { this.checked = getBrowser().docShell.allowSubframes; },
			text: "\u3053\u306e\u30bf\u30d6\u306e\u30d5\u30ec\u30fc\u30e0\u306e\u307f\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// Javascript の 許可／禁止
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:javascript",
			label: "javascript",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "javascript.enabled",
			topref: "value",
			frompref: "value",
			text: "\u004a\u0061\u0076\u0061\u0073\u0063\u0072\u0069\u0070\u0074\u0020\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// 画像の 許可／禁止
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:images",
			label: "images",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "permissions.default.image",
			topref: "Number(!value)+1",
			frompref: "Boolean(value % 2)",
			text: "\u753b\u50cf\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// Javaの 許可／禁止(Fx3.6 以上では無効)S
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:java",
			label: "java",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "security.enable_java",
			topref: "value",
			frompref: "value",
			text: "\u004a\u0061\u0076\u0061\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// クッキーの 許可／禁止
		{	dsp: true,
			id: "prefbuttons:cookies",
			label: "cookies",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "network.cookie.cookieBehavior",
			topref: "2*Number(!value)",
			frompref: "Boolean(!value)",
			text: "\u30af\u30c3\u30ad\u30fc\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// クッキー警告の 使用／不使用
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:cookiewarnig",
			label: "cookie warning",
			type: "onclick",
			cmd: "PrefButtons.changeCookieWarningPref(event);",
			str: "network.cookie.lifetimePolicy",
			text: "\u30af\u30c3\u30ad\u30fc\u8b66\u544a\u306e\u0020\u4f7f\u7528\uff0f\u4e0d\u4f7f\u7528" },
		// フォント指定の 許可／禁止
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:fonts",
			label: "fonts",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "browser.display.use_document_fonts",
			topref: "Number(value)",
			frompref: "Boolean(value)",
			text: "\u30d5\u30a9\u30f3\u30c8\u6307\u5b9a\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// 色指定の 許可／禁止
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:colors",
			label: "colors",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "browser.display.use_document_colors",
			topref: "value",
			frompref: "value",
			text: "\u8272\u6307\u5b9a\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// システムの配色 使用／不使用
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:systemcolors",
			label: "system colors",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "browser.display.use_system_colors",
			topref: "value",
			frompref: "value",
			text: "\u30b7\u30b9\u30c6\u30e0\u306e\u914d\u8272\u0020\u4f7f\u7528\uff0f\u4e0d\u4f7f\u7528" },
		// フォーム履歴補完の 許可／禁止
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:formfill",
			label: "form fill",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "browser.formfill.enable",
			topref: "value",
			frompref: "value",
			text: "\u30d5\u30a9\u30fc\u30e0\u5c65\u6b74\u88dc\u5b8c\u306e\u0020\u8a31\u53ef\uff0f\u7981\u6b62" },
		// リファラを 送る／送らない
		{	dsp: false,	// 現在非表示
			id: "prefbuttons:referrer",
			label: "referrer",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "network.http.sendRefererHeader",
			topref: "2*Number(value)",
			frompref: "Boolean(value)",
			text: "\u30ea\u30d5\u30a1\u30e9\u3092\u0020\u9001\u308b\uff0f\u9001\u3089\u306a\u3044" },
		// パイプラインの 使用／不使用
		{	dsp: true,
			id: "prefbuttons:pipelining",
			label: "pipelining",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "network.http.pipelining",
			topref: "value",
			frompref: "value",
			text: "\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u0020\u4f7f\u7528\uff0f\u4e0d\u4f7f\u7528" },
		// プロキシの 使用／不使用
		{	dsp: true,
			id: "prefbuttons:proxycheck",
			label: "proxycheck",
			type: "onclick",
			cmd: "PrefButtons.changePref(event);",
			str: "network.proxy.type",
			topref: "Number(value)",
			frompref: "Boolean(value)",
			text: "\u30d7\u30ed\u30ad\u30b7\u306e\u0020\u4f7f\u7528\uff0f\u4e0d\u4f7f\u7528" }
	],
// --------------------------------------------------------------------------------

	// 初期化
	init: function() {
		this.mkButton();
		if (this.IMGButton) this.mkCSS();
		this.initTabChecks();
		this.setChecks();
		// reload tab based prefs on every tab switch
		var appcontent = document.getElementById("appcontent");
		appcontent.addEventListener("select", function(){PrefButtons.setChecks();}, false);
		// load/reload 時をチェック
		appcontent.addEventListener("load", function(){PrefButtons.setChecks();}, true);
		// Fx の設定ダイアログからの復帰時に有効
		window.addEventListener("focus", function(){PrefButtons.setChecks();}, false);
	},

	// ボタンを作る
	mkButton: function() {
		var TargetButton = document.getElementById(this.Target);
		var Button = document.createElement("statusbarpanel");
		Button.setAttribute("id", "prefbuttons");
		for (var i = 0; i < this.button.length; i++ ) {
			// Fx3.6 以降では java のボタンは無意味になる。
			if (this.button[i].id=="prefbuttons:java" && this.getVer()>3.5)
				this.button[i].dsp = false;
			if (!this.button[i].dsp) continue;
			var box = document.createElement("checkbox");
			box.setAttribute("id", this.button[i].id);
			box.setAttribute("label", this.button[i].label);
			box.setAttribute( this.button[i].type,  this.button[i].cmd);
			box.setAttribute("tooltiptext",  this.button[i].text);
			if (this.button[i].type == "onclick") {
				box.setAttribute("prefstring", this.button[i].str);
				box.setAttribute("topref", this.button[i].topref);
				box.setAttribute("frompref", this.button[i].frompref);
			}
			Button.appendChild(box);
		}
		TargetButton.parentNode.insertBefore(Button, TargetButton);
	},

	tabChecks: [],	//「このタブの～」ボタンのチェック処理

	// 「このタブの～」ボタンのチェック処理を初期化
	initTabChecks: function() {
		this.tabChecks = [];
		for(var i = 0; i < this.button.length; i++) {
			if (!this.button[i].dsp) continue;
			if (this.button[i].type=="onclick") continue;	// Fx 全体の設定はスキップ
			var check = document.getElementById(this.button[i].id);
			check.update = this.button[i].func;
			this.tabChecks.push(check);
		}
	},

	// -- 全てのボタンの ON/OFF 状態をまとめてチェック --
	setChecks: function() {
		for(var i = 0; i < PrefButtons.button.length; i++)	{ // Fx 全体
			if (!PrefButtons.button[i].dsp) continue;
			if (PrefButtons.button[i].type=="oncommand") continue;	//「このタブの～」の設定はスキップ
			PrefButtons.setCheck(PrefButtons.button[i].id);
		}		
		setTimeout(PrefButtons.setTabChecks, 0);	// 「このタブの～」
	},

	// --「このタブの～」のボタンの ON/OFF 状態をまとめてチェック --
	setTabChecks: function() {
		for(var i = 0; i < PrefButtons.tabChecks.length; i++)
			PrefButtons.tabChecks[i].update();	// fuc 内容でチェック
	},
	// 「Javascript の禁止」の場合「このタブのJavascriptのみ 許可／禁止」を無効にする
	setDisabledJavascriptInTab: function() {
		var button = document.getElementById("prefbuttons:javascript-tab");
		if (button)
			button.setAttribute("disabled", this.getPref("javascript.enabled")? false: true);
	},
	// 「画像の禁止」の場合「このタブの画像のみ 許可／禁止」を無効にする
	setDisabledImagesInTab: function() {
		var button = document.getElementById("prefbuttons:images-tab");
		if (button)
			button.setAttribute("disabled", (this.getPref("permissions.default.image")==1)? false: true);
	},

	// -- Fx 全体のボタンの ON/OFF 状態をまとめてチェック --
	setCheck: function(itemId) {
		var item = document.getElementById(itemId);
		try {
			var str = item.getAttribute("prefstring");
			var value = this.getPref(str);
		} catch(e) {}
		// Cookie Warning の場合
		//	network.cookie.lifetimePolicy と network.cookie.alwaysAcceptSessionCookies をチェック
		if (!!str && str == "network.cookie.lifetimePolicy") {
			var value2 = this.getPref("network.cookie.alwaysAcceptSessionCookies");
			item.setAttribute("checked",(value==1) && (value2==true));
		// それ以外の場合
		} else {
			item.setAttribute("checked",eval(item.getAttribute("frompref")));
		}
	},

	// ---「このタブの～」毎に設定の変更 --
	togglePermInTab: function(newState, Type) {
		var docShell = getBrowser().docShell;
		docShell.QueryInterface(Ci.nsIDocShell);
		docShell[Type] = newState;
	},

	// -- Fx 全体の設定を変更 --
	changePref: function(event) {
		var item = event.target;
		var value = !item.checked;
		this.setPref(item.getAttribute("prefstring"), eval(item.getAttribute("topref")));
		// 「このタブの～」もチェックする(実際は javascript と画像の場合)
		this.setTabChecks();
	},
	// Cookie Warning だけ別に設定する
	//	network.cookie.lifetimePolicy
	//		0 = サーバーが指定した期間まで
	//		1 = 毎回ユーザーに確認する
	//		2 = ブラウザを終了するまで
	//		3 = 指定された日数の間保存する(network.cookie.lifetime.days)
	//	network.cookie.alwaysAcceptSessionCookies
	//		＊network.cookie.lifetimePolicy が 1 の場合のみ
	//		true  = セッション cookie の受け入れをプロンプトで確認する
	//		false = セッション cookie をプロンプトなしで受け入れる
	changeCookieWarningPref: function(event) {
		var item = event.target;
		var value = !item.checked;
		this.setPref("network.cookie.lifetimePolicy",Number(value));	// 0 or 1
		this.setPref("network.cookie.alwaysAcceptSessionCookies",value);// true or false
	},

	// 設定値を読み込む
	// prefs.js に設定を保存する・設定を読み込む - outsider reflex
	// http://piro.sakura.ne.jp/xul/tips/x0007.html
	getPref: function(prefstring) {
		const PREF = Cc["@mozilla.org/preferences;1"].getService(Ci.nsIPrefBranch);
		var type = PREF.getPrefType(prefstring);
		const nsIPrefBranch = Ci.nsIPrefBranch;
		switch (type) {
			case nsIPrefBranch.PREF_STRING:
			return PREF.getCharPref(prefstring);
			break;
		case nsIPrefBranch.PREF_INT:
			return PREF.getIntPref(prefstring);
			break;
		case nsIPrefBranch.PREF_BOOL:
			default:
			return PREF.getBoolPref(prefstring);
			break;
		}
	},

	// 設定値を保存する
	setPref: function(prefstring, value) {
		const PREF = Cc["@mozilla.org/preferences;1"].getService(Ci.nsIPrefBranch);
		var type = typeof(value);
		switch (type) {
			case "string":
			return PREF.setCharPref(prefstring, value);
			break;
		case "number":
			return PREF.setIntPref(prefstring, value);
			break;
		case "boolean":
			default:
			return PREF.setBoolPref(prefstring, value);
			break;
		}
	},

	// アプリケーションのバージョンを取得する(Alice0775 氏のスクリプトから頂きました。)
	getVer: function(){
		var info = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
		var ver = parseInt(info.version.substr(0,3) * 10,10) / 10;
		return ver;
	},

	// チェック・ボックスをボタンにする CSS を登録
	mkCSS: function() {
		var style = <![CDATA[
			checkbox[id*='prefbuttons']:focus > hbox {
				border-style: none !important;
			}
			statusbar, statusbarpanel[id*='prefbuttons'] * {
				margin-left: 0px !important;
				margin-right: 1px !important;
				padding: 0px !important;
				border: 0px !important;
			}
			checkbox[id*='prefbuttons'] > image,
			#main-window checkbox[id*='prefbuttons'] label {
				display:none !important;
			}
			checkbox[id*='prefbuttons'] > hbox > image {
				min-width: 22px !important;
				height: 15px !important;
				border: 0px none transparent !important;
				background: transparent none center center no-repeat;
			}
			checkbox[id*='prefbuttons'][checked='true'] > hbox > image {
				margin-left: 0px !important;
				margin-right: 1px !important;
				border: 0px none transparent !important;
				background-color:
			]]>.toString().replace(/\s+/g, " ")
				 + this.BUTTON_COLOR +
			<![CDATA[!important; }
            checkbox[id="prefbuttons:javascript"] > hbox > image {
                width: 22px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAEFJREFUeF6lj9sKACAIQ6f+/z838kLEXqIZCKdxQLgMHCLxjI0BuO72pnwaqzbaxEl3Nw31c2AbnJIiIxn8f2XILIDQANXN2zCwAAAAAElFTkSuQmCC);
           }

			checkbox[id='prefbuttons:java'] > hbox > image {
				width: 24px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAMAAADJev/pAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAEBJREFUeF6tj0EKACAIBEf7/5+LDT2EEkSLwsCwgngTnDLjSdgKaAFhNGzPFsK7iHuBEpaNxFNoU4gK8fHz0WQCogMA8sEhUIsAAAAASUVORK5CYII=);
			}
            checkbox[id="prefbuttons:images"] > hbox > image {
                width: 22px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAADdJREFUeF6lzyESADAIA8E7+P+fq6hgotqg2EEEKoYipB9YRUDQ4bsrgpnX9YyR2czm3OT/y445h5YA3enor/UAAAAASUVORK5CYII=);
           }
			checkbox[id='prefbuttons:cookies'] > hbox > image {
				width: 32px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAD9JREFUeF69UEEKADAI0vr/nwfCVqe8jMyEmkQNYYDAiPxjINFEJJWUQZ0uRVwD6k0xG15N+gl+B3/Fxk+mwQEKHgExVKC/7AAAAABJRU5ErkJggg==);
			}
			checkbox[id='prefbuttons:cookiewarnig'] > hbox > image {
				width: 43px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAPCAMAAABKvsbSAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAFlJREFUeF7FkeEKACEIg129/zsfMmGjOvBPZKmjPlZRjH7EiG7MmyygBTAZQJWcyVIY6xosYt0QteMsm1gsg6cjceaJpVk2+bvv7vpzX38uOamSYt//2+zHB670AXyYL9rnAAAAAElFTkSuQmCC);
			}
			checkbox[id='prefbuttons:fonts'] > hbox > image {
				width: 24px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAMAAADJev/pAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAD5JREFUeF6tj1kKACAIBZ96/zvXfBS0iBBNidhooDxBrivxJKwjEVwZICjnG5koxPiFs03UQoegdxE/N4+EBqKdAPEG07DrAAAAAElFTkSuQmCC);
			}
			checkbox[id='prefbuttons:colors'] > hbox > image {
				width: 27px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAPCAMAAAAiTUTqAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAD5JREFUeF61kDEKACAMxBL9/58dShWEiiBmOFoyXCmthkZFf3FKhOSg4QRnrC0d9w6V0nHu2++MIN2Pv/SaAcRqAQljBtPxAAAAAElFTkSuQmCC);
			}
			checkbox[id='prefbuttons:systemcolors'] > hbox > image {
				width: 43px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAPCAMAAABKvsbSAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAFRJREFUeF7FkTEKwDAMxKTk/3/ucOSmFLyUHsYIrOHArHlYTLO/dBXEAKBZyAGNGxMDINhV8LjHJghvLkoMvbvt0Evg7tK+nV5nHQTLGqj7/9/2PA+2AgF8W5dIswAAAABJRU5ErkJggg==);
			}
			checkbox[id='prefbuttons:formfill'] > hbox > image {
				width: 43px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAPCAMAAABKvsbSAAAADFBMVEX///8AAACAgIDAwMB7spOCAAAAAXRSTlMAQObYZgAAAFBJREFUeF7NkVEKwCAMQ1/q/e88qQ3724og+DApQiiBMvow6BIHs5pAKo3ShBQgZ1kfleUDQfp+VsKxNdzhc69HuwP8ZHmL4N1VxIor7hZ9HijUAYEFS6YIAAAAAElFTkSuQmCC);
			}
			checkbox[id='prefbuttons:referrer'] > hbox > image {
				width: 22px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAADlJREFUeF6tzzEKACAMxdCk3v/OQpcuHwXxDxneUCgVRxG2Hljt2BkGEehcWSfDIocjkdXhL1+uuA2HHADbJfkLugAAAABJRU5ErkJggg==);
			}
			checkbox[id='prefbuttons:pipelining'] > hbox > image {
				width: 22px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAADFBMVEX///8AAACAgIDAwMB7spOCAAAAAXRSTlMAQObYZgAAADxJREFUeF6tj0EKACAIBGfs/3/uYEgHKYIGWZfBi4wWBg3xrFVQq5iafQSOWklnRl0vvfZdq1Uk/nwZLROqVQDk/72LOwAAAABJRU5ErkJggg==);
			}
			checkbox[id='prefbuttons:proxycheck'] > hbox > image {
				width: 26px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAPCAMAAADNjy/UAAAADFBMVEX///8AAADAwMCAgIBBMhrPAAAAAXRSTlMAQObYZgAAAEFJREFUeF6tkFEKACAIQze9/50jYwjCCKKpw3isDxFWCBjlMyKJY6jtVKF6tt3R+FC9RylFlBoItKiaaPT/Gmm1AL4nAQZ72CM1AAAAAElFTkSuQmCC);
			}
			/* javascript-tab の有効時の画像 */
			checkbox[id='prefbuttons:javascript-tab']:not([disabled=true]) > hbox > image {
				width: 22px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAAD1BMVEX///8AAACAgIDAwMDg4OA1ZdzKAAAAAXRSTlMAQObYZgAAAElJREFUeF6Vj1EKACAIQ6d2/zO3sqJEP3oGwmsMRLNBC8Aw0ELbC3WC1loIwBXT0/LlOktjN3G8eycF6+fScrSXuDklrj/P0ZQOKmUBT359EfgAAAAASUVORK5CYII=);
			}
			/* javascript-tab の無効時の画像 */
			checkbox[id='prefbuttons:javascript-tab'][disabled=true] > hbox > image {
				width: 22px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAQAAABKZPfjAAAAAXNSR0IArs4c6QAAAAJiS0dEAP+Hj8y/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH2QUbByQscGIjaQAAAH5JREFUKM+1kdEJgDAQQ5PiIM5wAziLo4iTOUFn6CSeH2fQYin6YUqhgddcaFm8QBrR11AwUWb1uQ/XtvSjN9/xbi2e8EEDAGQPY5QztuAUkPFCjUZdb8BPdZJrLLty46R9wvVQ1YhCqtZMbrVVqaTRRr1D9nD3Qn9/Chd/Dx9SFmBWS9gtewAAAABJRU5ErkJggg==);
			}
			checkbox[id='prefbuttons:plugins-tab'] > hbox > image {
				width: 24px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAMAAADJev/pAAAAD1BMVEX///8AAACAgIDAwMDg4OA1ZdzKAAAAAXRSTlMAQObYZgAAAEdJREFUeF6Fz0sKwDAIANEZk/ufuUQolTSfceHigSC9jfovGqPYQptLWBQnUEHe/AAswAyJ5raemiYBroALQIEKJfX+YGx6AG0DAX5Gbey3AAAAAElFTkSuQmCC);
			}
			/* images-tab の有効時の画像 */
            checkbox[id="prefbuttons:images-tab"]:not([disabled=true]) > hbox > image {
                width: 22px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAMAAADXs89aAAAAD1BMVEX///8AAACAgIDAwMDg4OA1ZdzKAAAAAXRSTlMAQObYZgAAAEBJREFUeF59zkEKACAIRNEZ7f5njiEMNPO3sF4bsVytEhzKPuw58ZtNTBLU1DX4vs8ne0bmOGwZlRE8blIa2do2MHMBV79VsEEAAAAASUVORK5CYII=);
           }
			/* images-tab の無効時の画像 */
            checkbox[id="prefbuttons:images-tab"][disabled=true] > hbox > image {
                width: 22px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPAgMAAACdA9f7AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAgICAwMDA4ODgUbeBrAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QUbBygBmQgwEAAAAEBJREFUCNdjeLX+////Hxga2CEU26pVqxYwNDAAgQCcWtHQ1ACkFBZ1KEAokKBCR8cCCAUWbABTUJUo2kNBIAAAG2MguKX/hasAAAAASUVORK5CYII=);
           }
            checkbox[id="prefbuttons:redirect-tab"] > hbox > image {
                width: 24px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAAAAADbz1AHAAAAAnRSTlMA/iyWEiMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABJSURBVBiVlY+LCQAgCERvdEdzFCeRMguiK6EHHicP+sA0MALqgTyFnkxBSCUAeASyZQ7Re4RnyyGx5H4Ui7WwKO+4vOr3g/KgAaDHDMxx4iIpAAAAAElFTkSuQmCC);
           }
            checkbox[id="prefbuttons:subframes-tab"] > hbox > image {
                width: 24px;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAAAAADbz1AHAAAAAnRSTlMA/iyWEiMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABJSURBVBiVlY/RCQAgCERvdEdzFCeRvIygwqL3o/LgVJgSO4A6kVLozhAHchMIHJyi9gZDuM8ZlHiKmZCZKKJqsS3Pyxbx+6AUNA74DcpUL43rAAAAAElFTkSuQmCC);
           }
		]]>.toString().replace(/\s+/g, " ");
		var ss = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css,' + encodeURI(style) + '"'
		);
		document.insertBefore(ss, document.documentElement);
	    ss.getAttribute = function(name) {
		    return document.documentElement.getAttribute(name);
	    };
	}
};
PrefButtons.init();
