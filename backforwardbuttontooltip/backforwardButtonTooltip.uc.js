// ==UserScript==
// @name           backforward button tooltip
// @description    replace tooltiptext with target URL and Title
// @include        main
// @compatibility  Firefox 3.5+
// @namespace      http://twitter.com/xulapp
// @author         xulapp
// @license        MIT License
// @version        2010/02/07 00:00 +09:00
// ==/UserScript==


(function backforwardButtonTooltip() {
	document.getElementById('back-button').addEventListener('mouseover', BFBT_onMouseOver, true);
	document.getElementById('forward-button').addEventListener('mouseover', BFBT_onMouseOver, true);

	function getEntryByOffset(offset) {
		var sh = getWebNavigation().sessionHistory;
		var index = sh.index + offset;
		if (index < 0 || sh.count <= index) return null;
		return sh.getEntryAtIndex(index, false);
	}
	function BFBT_onMouseOver() {
		var entry, tooltiptext = '';
		switch (this.getAttribute('id')) {
		case 'back-button':
			entry = getEntryByOffset(-1);
			break;
		case 'forward-button':
			entry = getEntryByOffset(1);
			break;
		}
		if (entry) {
			tooltiptext = [entry.title, entry.URI.spec];
			if (entry.isSubFrame)
				tooltiptext.push('[subframe]');
			tooltiptext = tooltiptext.join('\n');
		}
		this.setAttribute('tooltiptext', tooltiptext);
	}
})();
