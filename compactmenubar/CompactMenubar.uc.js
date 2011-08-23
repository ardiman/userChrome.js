// ==UserScript==
// @name           menu-menu
// @description    compact menubar
// @include        main
// @compatibility  Firefox
// @namespace      http://twitter.com/xulapp
// @author         xulapp
// @license        MIT License
// @version        2010/03/04 08:00 +09:00
// ==/UserScript==


(function menuMenu() {
	const XUL_NS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

	var menubar = $('main-menubar');

	var menu = $E(<menu id="menu-menu" label={U('Menü')} accesskey="m"/>);
	var popup = $E(<menupopup id="menu_MenuPopup"/>);
	popup.appendChild(extractContents(menubar));

	menu.appendChild(popup);
	menubar.appendChild(menu);

	menubar._insertBefore = menubar.insertBefore;
	menubar.insertBefore = function MM_hook_insertBefore(newElement, referenceElement) {
		// It might want to be firstChild.
		if (referenceElement === menu)
			referenceElement = popup.firstChild;
		return popup.insertBefore(newElement, referenceElement);
	};
	menubar.addEventListener('DOMNodeInserted', MM_onDOMNodeInserted, false);

	window.addEventListener('unload', function MM_onUnLoad() {
		menubar.insertBefore = menubar._insertBefore;
		menubar.removeEventListener('DOMNodeInserted', MM_onDOMNodeInserted, false);
		window.removeEventListener('unload', arguments.callee, false);
	}, false);

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
	function extractContents(node) {
		var range = node.ownerDocument.createRange();
		range.selectNodeContents(node);
		var result = range.extractContents();
		range.detach();
		return result;
	}

	function MM_onDOMNodeInserted(event) {
		var target = event.originalTarget;
		if (target.parentNode !== this) return;

		var refElem = null;
		if (target.hasAttribute('insertbefore')) {
			refElem = $(target.getAttribute('insertbefore'));
		} else if (target.hasAttribute('insertafter')) {
			refElem = $(target.getAttribute('insertafter'));
			refElem = refElem && refElem.nextSibling;
		}
		popup.insertBefore(target, refElem);
	}
})();
