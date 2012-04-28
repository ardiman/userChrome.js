// ==UserScript==
// @name				App Menu Plus
// @description	Appボタンに「メインメニューバーの項目」と自分で設定したメニューを追加します
// @version			1.0
// @author			y2k
// @include			main
// ==/UserScript==
(function() {
function U(text) { return (1 < 'あ'.length) ? decodeURIComponent(escape(text)) : text; };

var CUSTOM_MENU = [
	/*
		{
			id:			ID eines Elementes, oder die Original-ID. Für Separator "-" als ID
			label:		Name des Elementes
			command:	Befehl des Elementes
		}
	*/
	{ id: "menu_restart", label: U("Neustart"), command: "Application.restart();" }, 
	{ id: "-" },
	{ id: "javascriptConsole" }, // Fehlerkonsole
	{ id: "menu_domInspector" }, // DOM Inspector, wenn er installiert ist

];
var appmenuPoppup = document.getElementById("appmenu-popup");
if (!appmenuPoppup) {
	return;
}

var toolbarMenubar = document.getElementById("toolbar-menubar");
if (toolbarMenubar.getAttribute("autohide") != "true") {
	toolbarMenubar.setAttribute("autohide", true);
	document.persist(toolbarMenubar.id, "autohide");
	updateAppButtonDisplay();
}

var appmenuPrimaryPane = document.getElementById("appmenuPrimaryPane");
var menuLength = CUSTOM_MENU.length, menu, item;
for (var i = 0; i < menuLength; i++) {
	menu = CUSTOM_MENU[i];
	item = null;
	if (menu.id == "-") {
		item = document.createElement("menuseparator");
	}
	else if (menu.label && menu.command) {
		item = document.createElement("menuitem");
		item.id = menu.id;
		item.setAttribute("label", menu.label);
		item.setAttribute("oncommand", menu.command);
	}
	else {
		item = document.getElementById(menu.id);
		if (item) {
			item = item.cloneNode(true);
			item.id = item.id + "_amp";
			item.removeAttribute("key");
		}
	}
	if (item) {
		appmenuPrimaryPane.appendChild(item);
	}
}

var mainMenubar = document.getElementById("main-menubar");
var appmenuSecondaryPane = document.getElementById("appmenuSecondaryPane");

var appmenuSplit = document.createElement("menuseparator");
appmenuSplit.id = "appmenu-split";
appmenuSecondaryPane.appendChild(appmenuSplit);

appmenuPoppup.addEventListener("popupshowing", function(e) {
	if (e.target == appmenuPoppup) {
		appmenuSplit.hidden = false;
		while (mainMenubar.firstChild) {
			appmenuSecondaryPane.appendChild(mainMenubar.firstChild);
		}
	}
}, false);

// Appメニューを非表示にしたらメニューバーを元に戻す
appmenuPoppup.addEventListener("popuphiding", function(e) {
	if (e.target == appmenuPoppup) {
		appmenuSplit.hidden = true;
		while (appmenuSplit.nextSibling) {
			mainMenubar.appendChild(appmenuSplit.nextSibling);
		}
	}
}, false);
})();

