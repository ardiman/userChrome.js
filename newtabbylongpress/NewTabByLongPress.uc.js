// ==UserScript==
// @name                newTabByLongPress.uc.js
// @description         リンクやブックマークを左ボタン長押しで新しいタブに開く
// @include             main
// @version             0.8  コードを書き直し 不要になったリスナーを破棄するように改善
// ==/UserScript==
(function func(win) {

	const WAIT = 500; // Zeit für die Dauer des Tastendruck
	const IN_BACKGROUND = true; // "false" für das Öffnen im Vordergrund
	const RELATED_TO_CURRENT = true; // Direkt neben dem aktuellen Tab öffnen

	var longPress = null;

	win.addEventListener('mousedown', {
		handleEvent: function (e) {
			if (e.button !== 0 && longPress) return;

			clearTimeout(func.timer);

			var target = e.target || e.originalTarget;
			if (!target) return;

			var [href,] = hrefAndLinkNodeForClickEvent(e);
			var url = href || this.getPlacesURI(e, target);
			if (!url) return;

			if (e.type === 'mousedown' && (!e.altKey && !e.ctrlKey && !e.shiftKey)) {
				func.timer = setTimeout(function () {
					win.addEventListener('click', function c(e) {
						this.removeEventListener(e.type, c, true);
						e.preventDefault();
						e.stopPropagation();
					}, true);
					gBrowser.loadOneTab(url, {
						relatedToCurrent: RELATED_TO_CURRENT,
						inBackground: IN_BACKGROUND,
						referrerURI: makeURI(gBrowser.currentURI.spec)
					});
					longPress = true;
				}, WAIT);
				win.addEventListener('mouseup', this, true);
				win.addEventListener('dragstart', this, true);
			} else {
				win.removeEventListener('mouseup', this, true);
				win.removeEventListener('dragstart', this, true);
				clearTimeout(func.timer);
				if (longPress && (target._placesNode && PlacesUtils.nodeIsURI(target._placesNode))) {
					e.preventDefault();
				}
				longPress = false;
			}
		},

		getPlacesURI: function (e, target) {
			if (!target || !target.localName)
				return null;
			var ln = target.localName.toLowerCase();
			if ((target._placesNode && PlacesUtils.nodeIsURI(target._placesNode)) || (ln === 'treechildren' && (target.parentNode.id === 'bookmarks-view' || target.parentNode.id === 'historyTree'))) {
				var nodeURI = (ln === 'treechildren') ? this.getTreeInfo(target, e, 'uri') : target._placesNode.uri;
			}
			return nodeURI;
		},

		getTreeInfo: function (treechildren, e, prop) {
			if (!('PlacesUtils' in window))
				return '';
			var tree = treechildren.parentNode;
			var row = {}, col = {}, obj = {};
			var tbo = tree.treeBoxObject;
			tbo.getCellAt(e.clientX, e.clientY, row, col, obj);
			if (row.value === -1)
				return '';
			var node = tree.view.nodeForTreeIndex(row.value);
			if (!PlacesUtils.nodeIsURI(node))
				return '';
			return node[prop];
		}
	}, true);

}(window));
