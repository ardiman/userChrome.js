// ==UserScript==
// @name			tab_open_in_sidebar_menu_plus_0.4.uc.js
// @namespace		http://loda.jp/script/
// @description		コンテクスト・メニューに「サイドバーで開く」を追加
// @include			main
// @compatibility	Firefox 3.0 - 3.7a4pre
// @compatibility	userChrome.js 0.7 - 0.8 / userChromeJS 1.1
// @compatibility	Sub-Script/Overlay Loader v3.0.28mod
// @author			otokiti
// @version			0.1:	09/04/03	初版
// @version			0.2:	10/02/14	タブ以外の部分の右クリックでエラーが出るのを回避。
// @version			0.3:	10/03/15	Bug 347930 -  Tab strip should be a toolbar instead
// @version			0.4:	10/03/27	Bug 554991 -  allow tab context menu to be modified by normal XUL overlays
// ==/UserScript==
(function() {
	//  Link
	var contentAreaContextMenu = document.getElementById("contentAreaContextMenu");
	var c_menu = document.createElement("menuitem");
	c_menu.setAttribute("id", "ucjs_openlinksidebar");
	c_menu.setAttribute("label", "Link in Sidebar öffnen");
	c_menu.addEventListener("command", function() {
		try {
   			urlSecurityCheck(gContextMenu.linkURL, gContextMenu.target.ownerDocument.nodePrincipal);
			openWebPanel("Web Page", gContextMenu.linkURL);
		} catch(e) {}
	}, false);
	contentAreaContextMenu.insertBefore(c_menu, document.getElementById("context-sep-open"));
	contentAreaContextMenu.addEventListener("popupshowing",
		function() {
			document.getElementById("ucjs_openlinksidebar").hidden =
							document.getElementById("context-openlinkintab").hidden;
		} , false);

	// Tab
	//  -- Bug 554991 -  allow tab context menu to be modified by normal XUL overlays
	var tabContextMenu =
		document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu")
	  || gBrowser.tabContainer.contextMenu;

	var t_menu = document.createElement("menuitem");
	t_menu.setAttribute("id", "ucjs_context_openTabInSidebar");
	t_menu.setAttribute("label", "Tab in Sidebar öffnen");
	t_menu.addEventListener("command", function() {
		var tab = document.popupNode;
		openWebPanel(tab.label, gBrowser.getBrowserForTab(tab).contentWindow.location.href); 
	}, false);
	var TargetMenu = document.getElementById("context_openTabInWindow");
	if (!TargetMenu)	// Fx3.0 only
		var TargetMenu = document.getElementById("context_reloadAllTabs");
	tabContextMenu.insertBefore(t_menu, TargetMenu.nextSibling);
	tabContextMenu.addEventListener("popupshowing",
		function() {
			var flg = true;
			try {
				flg = gBrowser.getBrowserForTab(document.popupNode).contentWindow.location.href == "about:blank";
			} catch(e) {}
			document.getElementById("ucjs_context_openTabInSidebar").setAttribute("disabled", flg);
		} , false);

})();