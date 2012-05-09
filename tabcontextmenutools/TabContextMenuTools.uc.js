// ==UserScript==
// @name				Tab ContextMenu Tools
// @namespace	http://tinyurl.com/7zs29o2
// @description	タブのコンテキストメニューに新規メニューを追加する
// @include			main
// @author			zuzu
// @version			1.0.0
// ==/UserScript==
// --- 参考サイト
// http://www.xuldev.org/firegestures/getscripts.php
// http://www.xuldev.org/blog/?p=76
(function() {
// ----------config
var tabAddMenu = [


{
label : "separator",
},

{// すべてのタブを閉じる
label : "Alle Tabs schließen",
command : function () {
gBrowser.removeAllTabsBut(gBrowser.addTab("about:blank"));
},
},

{// 他のすべてのタブを閉じる
label : "Andere Tabs schließen",
command : function () {
var browser = getBrowser(); browser.removeAllTabsBut(browser.mCurrentTab);
},
},

{// 右のタブを閉じる
label : "Rechte Tabs schließen",
command : function () {
var tabs = gBrowser.mTabContainer.childNodes;
for (var i = tabs.length - 1; tabs[i] != gBrowser.selectedTab; i--)
{
    gBrowser.removeTab(tabs[i]);
}
},
},

{// 左のタブを閉じる
label : "Linke Tabs schließen",
command : function () {
var tabs = gBrowser.mTabContainer.childNodes;
for (var i = tabs.length - 1; tabs[i] != gBrowser.mCurrentTab; i--){}
for (i--; i >=0 ; i--){
    gBrowser.removeTab(tabs[i]);
}
},
},

{
label : "separator",
},

{// タブの複製
label : "Tab duplizieren",
command : function () {
openNewTabWith(gBrowser.currentURI.spec, null, null, null, false);
},
},

{// タブのタイトルを変更
label : "Tabtitel ändern",
command : function () {
var tab = document.popupNode;
var Tdocument = gBrowser.getBrowserForTab(tab).contentWindow.document;
title = window.prompt("Bitte geben Sie einen neuen Tabtitel", "");
if (title!=null && title!="") {
Tdocument.title = title;
}
},
},

{// タブを閉じて左のタブへフォーカス
label : "Tab schließen & nach links",
command : function () {
var tab = gBrowser.mCurrentTab;
if(tab.previousSibling)
gBrowser.mTabContainer.selectedIndex--;
gBrowser.removeTab(tab);
},
},

{// すべてのタブの読み込みの中止
label : "Laden aller Tabs stoppen",
command : function () {
var tab = gBrowser.mPanelContainer.childNodes.length;
gBrowser.getBrowserAtIndex(i).stop();
},
},

{
label : "separator",
},

{// アドオンマネージャ
label : "Addons",
command : function () {
document.getElementById("Tools:Addons").doCommand();
},
},

{// このタブをブックマーク
label : "Lesezeichen für diese Seite",
command : function () {
document.getElementById("Browser:AddBookmarkAs").doCommand();
},
},

{// 証明書マネージャ
label : "Zertifikate",
command : function () {
window.open('chrome://pippki/content/certManager.xul', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=600,height=400');
},
},

{// 履歴を消去
label : "Neueste Chronik löschen",
command : function () {
setTimeout(function(){ document.getElementById("Tools:Sanitize").doCommand();
}, 0);
},
},

{// クッキーマネージャ
label : "Cookies",
command : function () {
window.open('chrome://browser/content/preferences/cookies.xul', 'Browser:Cookies', 'chrome,resizable=yes');
},
},

{// ダウンロード
label : "Download",
command : function () {
document.getElementById("Tools:Downloads").doCommand();
},
},

{// エラーコンソール
label : "Fehlerkonsole",
command : function () {
toJavaScriptConsole();
},
},

{
label : "separator",
},

{// 上位階層へ移動
label : "Eine Seitenebene nach oben",
command : function () {
var uri = gBrowser.currentURI;
if (uri.path == "/")
	return;
var pathList = uri.path.split("/");
if (!pathList.pop())
	pathList.pop();
loadURI(uri.prePath + pathList.join("/") + "/");
},
},

{// ブックマークの管理
label : "Bibliothek",
command : function () {
document.getElementById("Browser:ShowAllBookmarks").doCommand();
},
},

{// ブラウザ最小化
label : "Fenster minimieren",
command : function () {
window.minimize();
},
},

{// オプション
label : "Einstellungen",
command : function () {
openPreferences();
},
},

{// パスワードマネージャ
label : "Passwörter",
command : function () {
window.open('chrome://passwordmgr/content/passwordManager.xul', 'Toolkit:PasswordManager', 'chrome,resizable=yes');
},
},

{// 履歴サイドバー
label : "Chronik",
command : function () {
toggleSidebar("viewHistorySidebar");
},
},

{// セッションを保存して終了
label : "Speichern & Sitzung beenden",
command : function () {
var prefBranch = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
prefBranch.setBoolPref("browser.sessionstore.resume_session_once", true);
goQuitApplication();
},
},

{// ページ全体を翻訳する
label : "Seite übersetzen",
command : function () {
const FROM = "en";
const TO = "de";
const DOMAIN = "translate.google.com";
const URL = "http://" + DOMAIN + "/translate?langpair="
          + FROM + "-" + TO + "&hl=" + TO + "&u=";

var curURL = gBrowser.currentURI.spec;
if (curURL.indexOf(DOMAIN) != -1)
  BrowserReload();
else
  gBrowser.loadURI(URL + encodeURIComponent(curURL));
},
},




// ----------configend
]
	for (var i = 0; menu = tabAddMenu[i]; i++) {
		if (menu.label == "separator") {
			menuItem = document.createElement("menuseparator");
		}
		else {
			menuItem = document.createElement("menuitem");
			menuItem.setAttribute("label", menu.label);
			menuItem.addEventListener("command", menu.command, false);
		}
		menuItem.id = "tabAddMenu_" + i;
		gBrowser.mStrip.childNodes[1].appendChild(menuItem);
    }
})();


// タブコンテキストメニューにCopy URL Lite を設置 + クリップボードへすべてのタブのURLあるいはHTMLスタイルでコピー
(function() {
	var templates = {
		'html':{
			'header':'<html><head></head><body><dl>\n',
			'body':'<dt>%title%</dt><dd><a href="%url%" target="_blank">%url%</a></dd>\n',
			'footer':'</dl></body></html>'
		},
		'text':{
			'header':'',
			'body':'%title%\n%url%\n\n',
			'footer':''
		}
	};
	var htmlEscape = function(s) {
		s = s.replace(/&/g, "&amp;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/"/g, "&quot;");
		return s;
	};
	var getTabs = function(){
		var tabNodes = document.popupNode.parentNode.childNodes;
		var tabs = new Array;
		for (i=0;i<tabNodes.length;i++){
			tabs.push({'title':tabNodes[i].label, 'url':gBrowser.getBrowserForTab(tabNodes[i]).contentWindow.location.href});
		}
		return tabs;
	};
	var formOutput = function(templateId, tabs){
		var string = new String;
		var template = templates[templateId];
		string += template.header;
		for(i=0;i<tabs.length;i++){
			string += template.body.replace(/%title%/g, htmlEscape(tabs[i].title)).replace(/%url%/g, htmlEscape(tabs[i].url));
		}
		return string += template.footer;
	}
	var putClipboard = function(string){
		Cc["@mozilla.org/widget/clipboardhelper;1"]
		.getService(Ci.nsIClipboardHelper)
		.copyString(string);
		dump("[save tabs]"+"copied to Clipboard\n");
	}
	var main = function(templateId){
		var tabs = getTabs();
		var output = formOutput(templateId, tabs);
		putClipboard(output);
	};
	var htmlEscape = function(s) {
		s = s.replace(/&/g, "&amp;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/"/g, "&quot;");
		return s;
	};
	var copyTabInfo = function (aAsHTML) {
		var tab = document.popupNode;
		var title = tab.label;
		var url = gBrowser.getBrowserForTab(tab).contentWindow.location.href;
		var txt = aAsHTML ?
		          '<a href="' + htmlEscape(url) + '" target="_blank">' + htmlEscape(title) + '</a>' :
		          title + "\n" + url;
		Cc["@mozilla.org/widget/clipboardhelper;1"]
		.getService(Ci.nsIClipboardHelper)
		.copyString(txt);
	};
	var menuitem1 = document.createElement("menuitem");
	menuitem1.setAttribute("label", "Titel + URL aller Tabs kopieren");
	menuitem1.addEventListener("command", function() { main('text'); }, false);
	var menuitem2 = document.createElement("menuitem");
	menuitem2.setAttribute("label", "HTML aller Tabs kopieren");
	menuitem2.addEventListener("command", function() { main('html'); }, false);
	var menuitem3 = document.createElement("menuitem");
	menuitem3.setAttribute("label", "Titel + URL kopieren");
	menuitem3.addEventListener("command", function() { copyTabInfo(false); }, false);
	var menuitem4 = document.createElement("menuitem");
	menuitem4.setAttribute("label", "HTML kopieren");
	menuitem4.addEventListener("command", function() { copyTabInfo(true); }, false);
	setTimeout(function() {
		gBrowser.mStrip.childNodes[1].appendChild(document.createElement("menuseparator"));
		gBrowser.mStrip.childNodes[1].appendChild(menuitem1);
		gBrowser.mStrip.childNodes[1].appendChild(menuitem2);
		gBrowser.mStrip.childNodes[1].appendChild(menuitem3);
		gBrowser.mStrip.childNodes[1].appendChild(menuitem4);
	}, 0);
})();
