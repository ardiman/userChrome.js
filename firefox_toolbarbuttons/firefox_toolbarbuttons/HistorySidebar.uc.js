
  //  HistorySidebar.uc.js

  (function() {

   if (location != 'chrome://browser/content/browser.xul') return;

	try {
                CustomizableUI.createWidget({
			id: 'HistorySidebar-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'HistorySidebar-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Chronik-Sidebar',
					tooltiptext: 'History Sidebar',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									SidebarUI.toggle("viewHistorySidebar"); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
                                return toolbaritem;
			}
		});
	} catch(e) { };

})();
