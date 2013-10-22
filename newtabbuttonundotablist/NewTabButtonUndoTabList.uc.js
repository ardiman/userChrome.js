// ==UserScript==
// @name           newTabButtonUndoTabList.uc.js
// @description    新しいタブボタンを右クリックで"最近閉じたタブ"メニューを表示
// @include        main
// ==/UserScript==
(function () {

	gBrowser.mTabContainer.addEventListener('click', function (e) {
		if (e.originalTarget.className != 'tabs-newtab-button') return;
		switch (e.button) {
			case 1:
				undoCloseTab(0);
				break;
			case 2:
				UCT.makePopup(e);
				e.preventDefault();
				break;
		}
	}, false);

})();

var UCT = {

	_ss: Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore),

	init: function () {
		var mp = document.createElement("menupopup");
		mp.id = "undo-close-tab-list";
		mp.setAttribute("onpopupshowing", "UCT.onpopupshowing(event);");
		mp.setAttribute("placespopup", true);
		mp.setAttribute("tooltip", "bhTooltip");
		mp.setAttribute("popupsinherittooltip", true);
		document.getElementById("mainPopupSet").appendChild(mp);
	},

	makePopup: function (e) {
		if (this._ss.getClosedTabCount(window) != 0)
			document.getElementById("undo-close-tab-list").openPopupAtScreen(e.screenX +2, e.screenY +2, false);
		else
			throw "\u5143\u306b\u623b\u305b\u308b\u30bf\u30d6\u304c\u3042\u308a\u307e\u305b\u3093";
	},

	onpopupshowing: function (e) {
		var popup = e.target;

		while (popup.hasChildNodes())
			popup.removeChild(popup.firstChild);

		var undoItems = JSON.parse(this._ss.getClosedTabData(window));
		undoItems.map(function (item, id) {
			var m = document.createElement('menuitem');
			m.setAttribute('label', item.title);
			m.setAttribute('image', item.image ? 'moz-anno:favicon:' + item.image : '');
			m.setAttribute('class', 'menuitem-iconic bookmark-item');
			m.setAttribute('oncommand', 'undoCloseTab(' + id + ')');
			popup.appendChild(m);
		});

		popup.appendChild(document.createElement("menuseparator"));
		m = document.createElement("menuitem");
		m.setAttribute("label", "Chronik in der Sidebar öffnen");
		m.setAttribute("image", "chrome://browser/skin/places/history.png");
		m.setAttribute("class", "menuitem-iconic");
		m.setAttribute("oncommand", "toggleSidebar('viewHistorySidebar');");
		popup.appendChild(m);
	},

};
UCT.init();
