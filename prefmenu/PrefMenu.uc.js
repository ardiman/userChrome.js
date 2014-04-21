// ==UserScript==
// @name			prefMenu.uc.js
// @description		about:configの設定を変更するメニューを追加
// @include			main
// @version			0.4  切り替えたい値を予め設定しておけるように
// @charset			UTF-8
// @note			アイテムを右クリックで設定をデフォルト値にリセット ※デフォルト値がない設定をリセットすると設定自体消えるので注意
// ==/UserScript==
var prefMenu = {

	showWhere: 'menu_ToolsPopup', // Position des Menüs
	showAs: 'menu', // Menü, oder "toolbarbutton"

	//  name: 'Name der Einstellung', val: Werte (nicht mehr als 2), die geändert werden können. Die Originalwerte werden dadurch überschrieben.
	prefs: [
		{ name: 'javascript.enabled' },
		{ name: 'plugin.state.flash' },
		{ name: 'network.cookie.cookieBehavior' },
		{ name: 'permissions.default.image', value: [2, 3] },
		{ name: 'permissions.default.script', value: [2, 3] },
		{ name: 'network.http.max-connections' },
		{ name: 'network.http.max-persistent-connections-per-server' },
	],

	init: function () {
		Components.utils.import("resource://gre/modules/Preferences.jsm");

		var target = document.getElementById(this.showWhere);
		var menu = document.createElement(this.showAs);
		menu.setAttribute('id', 'prefMenu');
		menu.setAttribute('label', 'Pref Menü');
		menu.setAttribute('type', 'menu');
		menu.setAttribute('class', (this.showAs === 'toolbarbutton') ? 'toolbarbutton-1' : 'menu-iconic');
		menu.setAttribute('image', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAh9JREFUeNpi/P//PwMlgFFGVga7BBAyMTEpsrCwTADSNn///l3558+frH///4HlHz96DKaZGEAOQMcgCWYmLW4e7ov8Avx+7p7uPEdPHmEEAhQ1YHUgL6BjkEIxMbGJPNw8vIICggwVVeVbgC7J+fvvL1AvWLcxzAAWbGHAzMTMwMTIZM/GzgbS8J+dnT3SUNfoL0gtMwuzFhsr226gMiGIAQyYBgD9zADUzAJiA/3NYG5i8QtkO9BgNj5evvVAOQGEC/79Rw89kDek2djYGH78+MHw8+dPRlZW1v8gdSysLCAXMJiZm/3B6QWg7dJAJx98/+49I8gLIO8Aw4LhH+c/BkYmRgagCxiiY6L2YxrACPa7NDc390GgTcrAWAAHKDAWwIEKAto6WgzJqckfgAGci2EA0GYJLi6ug0DnKgMxWExQUJChu6/rrYSExG+o+oNAXKyrqff0+fPnCAPAmjm5joBsRtbc1dP5DKjZ0kDH8BFI3b9//xjAUYkUbixA50lwcnHCNYOcKyQsxNDb3/NMUkrSUktd+9G/v/9wJmUmoObNFpYWEtLS0mABYaDmvgm9YM2aalqPgEmYAVtigxsAdLphSFjIZRVVlW/CwsIM/ZP6n0lJSVlqqGoiNGOBcDB1xtRvikqKv6ysrD6eu3j26ev3r+RAXgCFgYCgAE4MT/ZADWlAcyYD8R0g9lFX1rgPznEEcvn79+/BNECAAQDAQu/JjGzUgAAAAABJRU5ErkJggg==');
		target.appendChild(menu);
		var mp = document.createElement('menupopup');
		mp.setAttribute('id', 'prefMenu-popup');
		mp.setAttribute('onclick', 'event.preventDefault(); event.stopPropagation();');
		mp.setAttribute('onpopupshowing', 'return prefMenu.populateMenu(event.currentTarget)');
		menu.appendChild(mp);
	},

	populateMenu: function (parent) {
		while (parent.hasChildNodes())
			parent.removeChild(parent.firstChild);

		this.prefs.forEach(function (pref) {
			var prefName = pref.name;
			var prefType = Services.prefs.getPrefType(prefName);
			if (Preferences.has) {
				var prefStr = Preferences.get(prefName).toString();
				var prefState = (prefStr.length > 25) ? prefStr.slice(0, 25) + '...' : prefStr;
				var mi = document.createElement('menuitem');
				mi.setAttribute('label', prefName + '  ' + '[' + prefState + ']');
				if (prefType === Ci.nsIPrefBranch.PREF_BOOL || pref.value) {
					mi.setAttribute('closemenu', 'none');
//					mi.setAttribute('type', 'checkbox');
//					mi.setAttribute('checked', Preferences.get(prefName));
//					mi.setAttribute('autoCheck', 'false');
				}
				var self = this;
				mi.addEventListener('click', function clk(event) {
					self.handleClick(pref, event);
				});
				parent.appendChild(mi);
			}
		}, this);
	},

	handleClick: function (pref, event) {
		if (event.button === 0) {
			this.setPref(pref.name, pref.value);
		} else if (event.button === 2) {
			Preferences.reset(pref.name);
		}
		var mp = document.getElementById('prefMenu-popup');
		this.populateMenu(mp);
	},

	setPref: function (prefName, prefValue) {
		const promptSvc = Services.prompt;
		var prefType = Services.prefs.getPrefType(prefName);
		var result = { value: Preferences.get(prefName) },
			dummy = { value: 0 };
		switch (prefType) {
		case Ci.nsIPrefBranch.PREF_STRING:
			if (prefValue) {
				var value = (Preferences.get(prefName) === prefValue[0]) ? prefValue[1] : prefValue[0];
				Preferences.set(prefName, value);
			} else {
				var prompt = promptSvc.prompt(window, 'Zeichenfolge angeben', prefName, result, null, dummy);
				if (prompt) {
					result.value = result.value.trim();
					Preferences.set(prefName, result.value);
				}
			}
			break;
		case Ci.nsIPrefBranch.PREF_INT:
			if (prefValue) {
				var value = (Preferences.get(prefName) === prefValue[0]) ? prefValue[1] : prefValue[0];
				Preferences.set(prefName, value);
			} else {
				var prompt = promptSvc.prompt(window, 'Wert angeben', prefName, result, null, dummy);
				if (prompt) {
					result.value = result.value.trim() | 0;
					Preferences.set(prefName, result.value);
				}
			}
			break;
		case Ci.nsIPrefBranch.PREF_BOOL:
			var check = Preferences.get(prefName);
			Preferences.set(prefName, !check);
			break;
		}
	}

};
prefMenu.init();
