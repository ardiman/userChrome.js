// ==UserScript==
// @name           removeSelection.uc.js
// @description    選択範囲を削除
// @include        main
// @compatibility  Firefox
// @namespace      http://twitter.com/xulapp
// @author         xulapp
// @license        MIT License
// @version        2010/04/30 14:00 +09:00
// ==/UserScript==


(function removeSelection() {
	var contentAreaContextMenu = $('contentAreaContextMenu');
	contentAreaContextMenu.addEventListener('popupshowing', function RS_onContextPopupShowing(event) {
		if (event.target !== this) return;
		var doc = gContextMenu.target.ownerDocument;
		var selection = doc.defaultView.getSelection();
		for (let i = 0; i < selection.rangeCount; i++) {
			if (!selection.getRangeAt(i).collapsed) {
				menuitem.removeAttribute('hidden');
				return;
			}
		}
		menuitem.setAttribute('hidden', 'true');
	}, false);

	var menuitem = $E(<menuitem id="context-removeSelection" label={U('Auswahl löschen')} accesskey="r"/>);
	menuitem.addEventListener('command', function RS_onCommand() {
		var doc = gContextMenu.target.ownerDocument;
		var selection = doc.defaultView.getSelection();
		for (let i = 0; i < selection.rangeCount; i++) {
			selection.getRangeAt(i).deleteContents();
		}
	}, false);

	contentAreaContextMenu.appendChild(menuitem);

	function U(text) 1 < 'あ'.length ? decodeURIComponent(escape(text)) : text;
	function $(id) document.getElementById(id);
	function $E(xml, doc) {
		doc = doc || document;
		xml = <root xmlns={doc.documentElement.namespaceURI}/>.appendChild(xml);
		var settings = XML.settings();
		XML.prettyPrinting = false;
		var root = new DOMParser().parseFromString(xml.toXMLString(), 'application/xml').documentElement;
		XML.setSettings(settings);
		doc.adoptNode(root);
		var range = doc.createRange();
		range.selectNodeContents(root);
		var frag = range.extractContents();
		range.detach();
		return frag.childNodes.length < 2 ? frag.firstChild : frag;
	}
})();
