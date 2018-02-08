// ==UserScript==
// @name    ChromeFolder.uc.js
// @charset UTF-8
// Date     2018/02/08
// ==/UserScript==

(function() {

   if (location != 'chrome://browser/content/browser.xul') return;

	try {


//		Profilordner öffnen
		CustomizableUI.createWidget({
			id: 'profilefolder-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'profilefolder-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Profilordner',
					tooltiptext: 'Profilordner öffnen',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile).launch(); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});


})();
