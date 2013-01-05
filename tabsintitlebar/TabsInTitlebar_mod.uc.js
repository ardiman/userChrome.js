// ==UserScript==
// @name           TabsInTitlebar_mod.uc.js
// @description    標準の TabsInTitlebar を改変して常に利用する
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @compatibility  Firefox 4
// @version        0.0.2
// @note           Remove E4X
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

	if (typeof updateAppButtonDisplay_org == "undefined")
		updateAppButtonDisplay_org = updateAppButtonDisplay;

	eval("updateAppButtonDisplay = " + updateAppButtonDisplay_org.toString()
		.replace(
			'document.getElementById("titlebar").hidden = !displayAppButton;',
			[
				'var drawInTitlebar = Services.prefs.getBoolPref(TabsInTitlebar._prefName);'
				,'if (!displayAppButton)'
				,'	displayAppButton = drawInTitlebar;'
				,'document.getElementById("titlebar").hidden = !displayAppButton;'
			].join("\n")
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

		if (allowed) {
			let rect = function rect(ele) ele.getBoundingClientRect();

			let appmenuButtonBox = $("appmenu-button-container");
			let captionButtonsBox = $("titlebar-buttonbox");
			let tabsToolbar = $("TabsToolbar");
			let titlebarHeight = titlebar.boxObject.height;
			let tabsHeight = tabsToolbar.boxObject.height;
			let marginBottom = titlebarHeight - 4;
			if (marginBottom > tabsHeight)
				marginBottom = tabsHeight;

			this._sizePlaceholder("appmenu-button", rect(appmenuButtonBox).width);
			this._sizePlaceholder("caption-buttons", rect(captionButtonsBox).width);

			titlebar.style.marginBottom = - marginBottom + "px";
			docElement.setAttribute("tabsintitlebar", "true");

			if (!this._draghandle) {
				let tmp = {};
				Components.utils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
				this._draghandle = new tmp.WindowDraggingElement(tabsToolbar, window);
				this._draghandle.mouseDownCheck = function () {
					return !this._dragBindingAlive && this.ownerDocument.documentElement.getAttribute("tabsintitlebar") == "true";
				};
			}
		} else {
			titlebar.style.marginBottom = "";
			docElement.removeAttribute("tabsintitlebar");
		}
	}
	
	addStyle(css)

	updateAppButtonDisplay();
	setTimeout(function(){
		TabsInTitlebar._update();
	}, 1000);


	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

})('\
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
#main-window[tabsintitlebar] #TabsToolbar {\
  -moz-box-ordinal-group: 1 !important;\
}\
#main-window[tabsintitlebar] #toolbar-menubar > .titlebar-placeholder {\
  display: none;\
}\
#main-window[tabsintitlebar]:not([inFullscreen]) #TabsToolbar:not(:-moz-lwtheme) {\
  background: -moz-linear-gradient(rgba(50%,50%,50%,0), ActiveCaption 60%) !important;\
  color: CaptionText !important;\
}\
#main-window[tabsintitlebar]:not([inFullscreen]) #TabsToolbar:not(:-moz-lwtheme):-moz-window-inactive {\
  background: -moz-linear-gradient(rgba(50%,50%,50%,0), InactiveCaption 60%) !important;\
  color: InactiveCaptionText !important;\
}\
#main-window[tabsintitlebar]:not([inFullscreen]) #TabsToolbar:not(:-moz-lwtheme) #main-menubar> menu,\
#main-window[tabsintitlebar]:not([inFullscreen]) #TabsToolbar:not(:-moz-lwtheme) toolbarbutton {\
  color: inherit !important;\
}\
\
#main-window[title="Firefox - Tab-Gruppen"] #titlebar-buttonbox-container,\
#main-window[title="Firefox - Tab-Gruppen"] #appmenu-button-container\
{\
  visibility: hidden !important;\
}\
');
