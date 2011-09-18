// ==UserScript==
// @name           TabsInTitlebar_mod.uc.js
// @description    標準の TabsInTitlebar を改変して常に利用する
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @version        0.0.1
// @compatibility  Firefox 4
// ==/UserScript==
// @SS http://f.hatena.ne.jp/Griever/20110408002650

(function(css){
	if (typeof TabsInTitlebar == "undefined") return;
	if (typeof TreeStyleTabService != "undefined") return;

	// メニューを作成
	Array.forEach(document.querySelectorAll('menuitem[command="cmd_ToggleTabsOnTop"]'), function(e) {
		var m = document.createElement("menuitem");
		m.setAttribute("label", "Tabs in Titlebar");
		m.setAttribute("oncommand", "Services.prefs.setBoolPref(TabsInTitlebar._prefName, !Services.prefs.getBoolPref(TabsInTitlebar._prefName))");
		m.setAttribute("accesskey", "I");
		e.parentNode.insertBefore(m, e.nextSibling);
	});

	var titlebar = document.getElementById("titlebar");
	var spacer = document.createElement("hbox");
	spacer.setAttribute("id", "tabs-in-titlebar-spacer");
	titlebar.appendChild(spacer);


	if (typeof updateAppButtonDisplay_org == "undefined")
		updateAppButtonDisplay_org = updateAppButtonDisplay;

	eval("updateAppButtonDisplay = " + updateAppButtonDisplay_org.toString()
		.replace(
			'document.getElementById("titlebar").hidden = !displayAppButton;',
			<![CDATA[
				var drawInTitlebar = Services.prefs.getBoolPref(TabsInTitlebar._prefName);
				if (!displayAppButton)
					displayAppButton = drawInTitlebar;
				document.getElementById("titlebar").hidden = !displayAppButton;
			]]>.toString()
		)
		.replace(
			'TabsInTitlebar.allowedBy("drawing-in-titlebar", displayAppButton);',
			'TabsInTitlebar.allowedBy("drawing-in-titlebar", drawInTitlebar);'
		));

	if (typeof TabsInTitlebar._readPref == "undefined")
		TabsInTitlebar._readPref_org = TabsInTitlebar._readPref;

	TabsInTitlebar._readPref = function () {
		updateAppButtonDisplay();
	}

	if (typeof TabsInTitlebar._update_org == 'undefined')
		TabsInTitlebar._update_org = TabsInTitlebar._update;

	TabsInTitlebar._update = function () {
		if (!this._initialized || window.fullScreen)
			return;

		let allowed = Services.prefs.getBoolPref(this._prefName);
		let docElement = document.documentElement;
/*
		if (allowed == (docElement.getAttribute("tabsintitlebar") == "true"))
			return;
*/
		function $(id) document.getElementById(id);
		let titlebar = $("titlebar");
		let titlebarSpacer = $("tabs-in-titlebar-spacer");

		if (allowed) {
			titlebar.style.marginBottom = "";
			titlebarSpacer.style.minHeight = "";
			docElement.setAttribute("tabsintitlebar", "true");

			let rect = function rect(ele) ele.getBoundingClientRect();

			let appmenuButtonBox = $("appmenu-button-container");
			let captionButtonsBox = $("titlebar-buttonbox");
			let tabsToolbar = $("TabsToolbar");

			let titlebarHeight = titlebar.boxObject.height;
			let tabsHeight = tabsToolbar.boxObject.height;
			let minHeight = titlebarHeight - tabsHeight > 4 ? 0 : tabsHeight - titlebarHeight + 4;

			this._sizePlaceholder("appmenu-button", rect(appmenuButtonBox).width);
			this._sizePlaceholder("caption-buttons", rect(captionButtonsBox).width);

			titlebar.style.marginBottom = - tabsHeight + "px";
			titlebarSpacer.style.minHeight = minHeight + "px";

			if (!this._draghandle) {
				let tmp = {};
				Components.utils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
				this._draghandle = new tmp.WindowDraggingElement(tabsToolbar, window);
				this._draghandle.mouseDownCheck = function () {
					return !this._dragBindingAlive && this.ownerDocument.documentElement.getAttribute("tabsintitlebar") == "true";
				};
			}
		} else {
			docElement.removeAttribute("tabsintitlebar");
			titlebar.style.marginBottom = "";
			titlebarSpacer.style.minHeight = "";
		}
	}
	addStyle(css)

	TabsInTitlebar._update();


	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

})(<![CDATA[
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
#main-window[tabsintitlebar="true"] #TabsToolbar {
  -moz-box-ordinal-group: 1 !important;
}
#main-window[tabsintitlebar="true"] #toolbar-menubar > .titlebar-placeholder {
  display: none;
}

#main-window[tabsintitlebar]:not([inFullscreen]) #TabsToolbar:not(:-moz-lwtheme) {
  background: none !important;
}

]]>.toString());
