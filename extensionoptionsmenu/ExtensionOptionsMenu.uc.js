// ==UserScript==
// @name                Extension Options Menu.uc.js
// @description         Symbolleistenschaltfläche zur Add-onsverwaltung
// @include             main
// @version             3.0.0  Sortiermöglichkeit für Erweiterungen und Add-ons wurde eingefügt
// @downloadURL         https://github.com/ardiman/userChrome.js/tree/master/extensionoptionsmenu
// @note                Diese Erweiterungen und Scripte dienten als Vorlage: Extension Options Menu, ucjs_optionsmenu_0.8.uc.js und toggleRestartlessAddons.js
// ==/UserScript==
/*
Schaltflächensymbol:
Linksklick: Erweiterungsliste anzeigen
Mittelklick: Firefox neustarten und sofern installiert DOM & Element Inspector Erweiterung aktivieren / deaktvieren
Rechtsklick: Add-ons-Manager öffnen

Erweiterungen:
Linksklick: Erweiterungen aktivieren / deaktivieren
Mittelklick: Internetseite der Erweiterung öffnen
Rechtsklick: Erweiterungseinstellungen wenn vorhanden öffnen
Strg + Linksklick: Erweiterungsordner öffnen
Strg + Mittelklick: Erweiterungs ID und Symboladresse, wenn vorhanden, in Zwischenablage kopieren
Strg + Rechtsklick: Erweiterung entfernen
*/
(function() {
	EOM = {
		BUTTON_TYPE:		0, // 0 = Schaltfläche 2 = Menü
		ADDON_TYPES:		['extension', 'plugin'], // Reihenfolge der Typen (Erweiterungen, Plugins usw. )
		SHOW_VERSION:		true, // Versionsinfo anzeigen (true = Versionsinfo anzeigen false = nicht anzeigen)
		SHOW_ALL:			true, // Alles anzeigen, auch bei Erweiterungen ohne Einstellungen
		SHOW_USERDISABLED:	true, // Vom Benutzer deaktiviete Erweiterungen anzeigen (deaktivierte Add-ons anzeigen)
		SHOW_APPDISABLED:	false, // Deaktivierte - bzw. inkompatible Erweiterungen anzeigen (nicht kompatible Add-ons anzeigen)
		AUTO_RESTART:		false, // Firefox, nach Installation- bzw. deinstallation automatisch neu starten
		ICON_URL:			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAACkUlEQVQ4T43T60tTYRwH8HMQ9QQJRSBJ50xU8BL1QpJMsbxNc162edxcYlAoZdkFh6gZurF5WV6nc7M/oBdBb7q9DSPEVBDbZtN0c5tzNymolwXht2eDhVO0Dnx4Hn6/5/me8xx4KOqQR2rcYfjpIC81BpXiqWBnxUSgpWQ0kHrY+gN1xdOdu/XTQfDGIMSGAET6AMpG/TbhiD/uv0LqTYF7cmPgN2/wQzzhh2jMB+Gwz1I65I3/Z8A1o5eRTXqP85M+pVTv260Z86JieNtcMridXNjnZvI1Lia31xV7IIgf99AKg/e1wrAN+YQHtXoPJKNbqBrewlWdG6UDLlzRupCv3sTFns3vFx47SqJCFHoPoyAb5eNb4MlGyYgb1UNuiHQulPW7UKRx4rJqE5d6HMjpdiC7066mRFpHvFTnbCHuSJ84E+rIJumQExKdEzVE5YAT5RoHCnvsyO3aQHb7Os63rSHrwRoy76+qqErNBi/ut4PYrdFsKCWDDoj77CjvXUdu+yqyWleQcsuK5GYrBE0WcE0Wm6DZmsk1W7VEI1XRu6YUqb6gUh22W9BhQ8ZtCwQ3PoEjQuM+psi5SSBNCR/Zusq7bSju+IyMpmWwjUvgrh+hcWks6scVKs0tBQ/NSG5YBKtYNHOKRRxt4WUogKufTwmh8lqXU9MaFlY42UcLJ5tnOfk8yPwov0j/LfGNUIe/huXnYrm6uTiOn2UI7GEjcxMxTrwifu7rq6KOw0o+MAT2SI8sYGtnaVJ/s68fFUCfONd2jK2e+cFWv0dY1bu+mPiTocsTmyR8kU56X//2wmtmuiMvoMkkdEkEp3K0N08XPZsKScwzdNB0zFlSz0pIaxBG6mQ0JBU/1yXmm878AbFQoHrb98HyAAAAAElFTkSuQmCC',

		sort: {
			enabled: 0,
			clickToPlay: 0,
			disabled: 1
			// 0, 0, 0 - In Alphabetischer Reihenfolge sortieren
			// 0, 0, 1 - Selbe Reihenfolge wie im Add-on-Manager
			// 0, 1, 2 - Reihenfolge: Aktivierte Add-ons, click-to-play und deaktivierte Add-ons
		},

		init: function() {
			if (EOM.BUTTON_TYPE == 0) {
				try {
					CustomizableUI.createWidget({
						id: 'eom-button',
						type: 'custom',
						defaultArea: CustomizableUI.AREA_NAVBAR,
						onBuild: function (document) {
							var button = document.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
							var attributes = {
								id: 'eom-button',
								type: 'menu',
								class: 'toolbarbutton-1 chromeclass-toolbar-additional',
								style: '-moz-transform: scale(0.875);',
								label: 'Extension Options Menu',
								image: EOM.ICON_URL
							};
							for (var a in attributes)
								button.setAttribute(a, attributes[a]);
							return button;
						}
					});
				} catch(e) { };
				var btn = $('eom-button');
			}
			else if (EOM.BUTTON_TYPE == 2) {
				var btn = $('menu_ToolsPopup').insertBefore($C('menu', {
					id: 'eom-menu',
					class: 'menu-iconic',
					label: 'Erweiterungen verwalten',
					image: this.ICON_URL
				}), $('menu_preferences'));
			};

			btn.setAttribute('tooltiptext', 'Linksklick: Erweiterungsliste anzeigen\nMittelklick: DOM & Element Inspector Erweiterung aktivieren / deaktvieren\n(und Firefox neustarten)\nRechtsklick: Add-ons-Manager öffnen');
			btn.setAttribute('onclick', 'EOM.iconClick(event);');

			var mp = btn.appendChild($C('menupopup', {
				id: 'eom-button-popup',
				onpopupshowing: 'EOM.populateMenu(event.currentTarget)',
				onclick: 'event.preventDefault(); event.stopPropagation();',
				style: "max-width: 420px;"
			}));
			mp.addEventListener("mouseover", function (event) {event.originalTarget.setAttribute('closemenu', "none")}, true);
		},

		populateMenu: function(aParent) {
			var popup = aParent;
			var i, mi, addon, addons, menuIcon, df,
				sep, type, prevType, addStyle;
			var _this = this;

			for (i = 0, len = popup.childNodes.length; i < len; i++) {
				popup.removeChild(popup.firstChild);
			}

			AddonManager.getAddonsByTypes(this.ADDON_TYPES, function(addonlist) {
				addons = Array.slice(addonlist);
			});

			var thread = Services.tm.mainThread;
			while (addons == void(0)) {
				thread.processNextEvent(true);
			}

			function sortPosition(addon) {
				if ('STATE_ASK_TO_ACTIVATE' in AddonManager && addon.userDisabled == AddonManager.STATE_ASK_TO_ACTIVATE)
					return EOM.sort.clickToPlay;
				return (!addon.isActive) ? EOM.sort.disabled : EOM.sort.enabled;
			}

			function key(addon) {
				return EOM.ADDON_TYPES.indexOf(addon.type) + '\n' + sortPosition(addon) + '\n' + addon.name.toLowerCase();
			}

			addons.sort(function(a, b) {
				var ka = key(a);
				var kb = key(b);
				return ka == kb ? 0 : ka < kb ? -1 : 1;
			});

			for (i = 0, len = addons.length; i < len; i++) {
				addon = addons[i];
				df = document.createDocumentFragment();
				sep = $C('menuseparator');

				if ((!addon.appDisabled || (addon.appDisabled && this.SHOW_APPDISABLED)) && ((addon.isActive && addon.optionsURL) || ((addon.userDisabled && this.SHOW_USERDISABLED) || (!addon.userDisabled && this.SHOW_ALL) || (addon.appDisabled && this.SHOW_APPDISABLED)))) {
					type = addon.type;
					if (prevType && type != prevType)
						df.appendChild(sep);
					prevType = type;
					menuIcon = addon.iconURL
							|| type == 'extension' && 'chrome://mozapps/skin/extensions/extensionGeneric-16.png'
							|| type == 'plugin' && 'chrome://mozapps/skin/plugins/pluginGeneric-16.png';
					date = new Date(addon.updateDate);
					updateDate = ("0"+date.getDate()).substr(-2)+"."+("0"+(date.getMonth()+1)).substr(-2)+"."+date.getFullYear();
					mi = $C('menuitem', {
						label: _this.SHOW_VERSION ? addon.name += ' ' + '[' + addon.version + ']' : addon.name,
						tooltiptext: 'Linksklick: Erweiterungen aktivieren / deaktivieren' + ' (Größe: ' + Math.floor(addon.size / 1024) + 'KB)' + '\nMittelklick: Erweiterungs-Internetseite: ' + addon.homepageURL + ' öffnen.' + '\nRechtsklick: Erweiterungseinstellungen öffnen: ' + addon.optionsURL + '\nStrg + Linksklick: Erweiterungsordner öffnen\nStrg + Mittelklick: Erweiterungs ID:  ' + addon.id + ' \nund　Symboladresse: ' + addon.iconURL + ' kopieren.\nStrg + Rechtsklick: Erweiterung löschen' + '\n\nAktualisierungsdatum： ' + updateDate + '\nBeschreibung: ' + addon.description,
						class: 'menuitem-iconic',
						image: menuIcon
					});
					if (addon.type == 'plugin') {
						mi.setAttribute("tooltiptext", 'Linksklick: Plugins aktivieren / deaktivieren' + ' (Größe: ' + Math.floor(addon.size / 1024) + 'KB)' + '\nStrg + Mittelklick:  Plugin ID: ' + addon.id + '\nund Symboladresse:  ' + addon.iconURL + ' kopieren. \n\nAktualisierungsdatum: ' + updateDate + '\nBeschreibung: ' + addon.description)
					}
					mi.addon = addon;
					mi.addEventListener('click', function(e) {
						EOM.itemClick(e, this.addon);
					}, true);
					EOM.setDisabled(mi, addon.userDisabled);
					EOM.setUninstalled(mi, addon.pendingOperations != 0);
					addStyle = mi.style;

					if (!addon.optionsURL && addon.isActive)
						addStyle.color = 'blue';
					if (!addon.optionsURL && !addon.homepageURL && addon.isActive)
						addStyle.color = 'red';
					if (addon.userDisabled)
						addStyle.color = 'gray';
					if (addon.type == 'plugin' && 'STATE_ASK_TO_ACTIVATE' in AddonManager && addon.userDisabled == AddonManager.STATE_ASK_TO_ACTIVATE)
						addStyle.color = 'green';

					df.appendChild(mi);
					popup.appendChild(df);
				}
			}

			var menusep = popup.insertBefore($C('menuseparator'), popup.firstChild);
			var menugroup = popup.insertBefore($C("menugroup", {
				id: "eom-menugroup"
			}), menusep);

			for (let i = 0, menu; menu = mMenus[i]; i++) {
				let menuItem = menugroup.appendChild($C("menuitem", {
					label: menu.alabel,
					tooltiptext: menu.label,
					image: menu.image,
					class: "menuitem-iconic",
					oncommand: menu.oncommand,
					style: menu.style || "max-width: 10px;"
				}));
			}
		},

		iconClick: function(event) {
			switch (event.button) {
			case 1:
				EOM.DOMEI(event);
				break;
			case 2:
				gBrowser.selectedTab = gBrowser.addTab('about:addons');
				event.preventDefault();
				break;
			}
		},

		DOMEI: function(event) {
			var { AddonManager } = Components.utils.import("resource://gre/modules/AddonManager.jsm", {});
			var AddonIDs = [
				'inspector@mozilla.org',
				'InspectElement@zbinlin',
				];
			for(n = 0; n < AddonIDs.length; n++) {
				AddonManager.getAddonByID(AddonIDs[n], function(addon) {
					addon.userDisabled = addon.userDisabled ? false : true;
				});
			}
			Application.restart();
		},

		CopyList: function(event) {
			Application.extensions ? Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(Application.extensions.all.map(function(item, id) {
				return id + 1 + ". " + item._item.name + " [" + item._item.version + "]" + "\nID:" + item._item.id;
			}).join("\n")) : Application.getExtensions(function(extensions) {
				Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(extensions.all.map(function(item, id) {
					return id + 1 + ". " + item._item.name + " [" + item._item.version + "]" + "\nID:" + item._item.id;
				}).join("\n"));
			})
			XULBrowserWindow.statusTextField.label = "Add-onsliste in Zwischenablage kopieren";
		},

		itemClick: function(e, aAddon) {
			var addon = aAddon;
			var mi = e.target;
			var ctrl = e.ctrlKey,
				shift = e.shiftKey,
				alt = e.altKey;
			switch (e.button) {
			case 0:
				// 啟用/禁用擴展 (有効/無効を切り替え)
				if (!ctrl && !shift && !alt) {
					let curDis = addon.userDisabled;
					let newDis;
					if ('STATE_ASK_TO_ACTIVATE' in AddonManager && curDis == AddonManager.STATE_ASK_TO_ACTIVATE)
						newDis = false;
					else if (!curDis)
						newDis = true;
					else {
						if (this.isAskToActivateAddon(addon))
							newDis = AddonManager.STATE_ASK_TO_ACTIVATE;
						else
							newDis = false;
					}
					addon.userDisabled = newDis;
					this.setDisabled(mi, newDis);
				}
				// 打開擴展的安裝文件夾 (拡張のフォルダを開く)
				else if (ctrl && !shift && !alt) {
					var dir = Services.dirsvc.get('ProfD', Ci.nsIFile);
					var nsLocalFile = Components.Constructor('@mozilla.org/file/local;1', 'nsILocalFile', 'initWithPath');
					dir.append('extensions');
					dir.append(addon.id);
					var fileOrDir = dir.path + (dir.exists() ? '' : '.xpi');
					try {
						(new nsLocalFile(fileOrDir)).reveal();
					} catch (ex) {
						var addonDir = /.xpi$/.test(fileOrDir) ? dir.parent : dir;
						try {
							if (addonDir.exists()) {
								addonDir.launch();
							}
						} catch (ex) {
							var uri = Services.io.newFileURI(addonDir);
							var protSvc = Cc['@mozilla.org/uriloader/external-protocol-service;1'].getService(Ci.nsIExternalProtocolService);
							protSvc.loadUrl(uri);
						}
					}
				}
				break;
			case 1:
				// 打開擴展首頁 (拡張のウェブページを開く)
				if ((!ctrl && !shift && !alt) && addon.homepageURL) {
					openLinkIn(addon.homepageURL, 'tabshifted', {}); // 'tab' で背面に開く
				}
				// 複製擴展 ID 和圖標地址 (いろいろコピー)
				else if (ctrl && !shift && !alt) {
					clipboard = Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper);
					clipboard.copyString("id: " + addon.id + "\r\n" + "iconURL: " + addon.iconURL);
				}
				break;
			case 2:
				// 打開擴展選項 (拡張の設定画面を開く)
				if ((!ctrl && !shift && !alt) && addon.optionsURL) {
					if (addon.optionsType == 2) {
						BrowserOpenAddonsMgr('addons://detail/' + encodeURIComponent(addon.id) + ('/preferences'));
					} else {
						openDialog(addon.optionsURL, addon.name, 'chrome,titlebar,toolbar,resizable,scrollbars,centerscreen,dialog=no,modal=no');
					}
				}
				// 移除擴展 (アンインストール)
				else if (ctrl && !shift && !alt) {
					(addon.pendingOperations & AddonManager.PENDING_UNINSTALL) ? addon.cancelUninstall() : addon.uninstall();
					this.setUninstalled(mi, addon.pendingOperations & AddonManager.PENDING_UNINSTALL);
				}
				break;
			}
		},

		isAskToActivateAddon: function(addon) {
			return addon.type == 'plugin'
					&& 'STATE_ASK_TO_ACTIVATE' in AddonManager
					&& Application.prefs.getValue('plugins.click_to_play', false);
		},

		setDisabled: function(mi, disabled) {
			var askToActivate = 'STATE_ASK_TO_ACTIVATE' in AddonManager && disabled == AddonManager.STATE_ASK_TO_ACTIVATE;
			(askToActivate) ? mi.classList.add('askToActivate') : mi.classList.remove('askToActivate');
			(disabled && !askToActivate) ? mi.classList.add('addon-disabled') : mi.classList.remove('addon-disabled');
		},

		setUninstalled: function(mi, uninstalled) {
			(uninstalled) ? mi.classList.add('addon-uninstall') : mi.classList.remove('addon-uninstall');
		}
	};
	var mMenus = [
		{
			alabel: 'Firefox neustarten',
			label: 'ScriptCache löschen',
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgElEQVQ4jY2RfUzMARjHv7tODnmJOxGm3LnKe3fnoh+W184ypjmZpZrQFLOSstns5g/cIXq9fuqQUd4tx0jFcLVRrSxNNE2bsUYY5Sr09Y9u2Nz6/vk83+ez5/s8gBvFAbKCUKw7Hz6o3KrDDHfev5Qmx/BCAVvKklR1b8rSWHMovM+ignJAw6IeEZU7FC3tNxeSjWvJF8l8Z0/tu5eyqKloiWd6MjDELcCqg/5hqk8bm8LIulCyQiCrjGRVCjuupbN04+Tygyoo3EIypkNVluDd0OsIJe+F8KV5IjtFFXkhnM7iRF5eM+aaEfBwDeTpEGDVQcgLwTyTAl4AIGqhrNg+uvlzaTBti3D0nEGa2W6ZRNoW87VpAfPnwuAC2I1eLa3FMT8cphVOUQtNfz1XA1XJqkH3bQJWAkBJhMcZ54mp/Hl4Fq8aPM+5AFUxsi42JLFR3PwtQ40J/ySShAHS31sFPt873smjKjqihr5yOSo3DH7NO2vZkm/8njUb+v/dJg6Q1e6Sv2FOIOs3jfzqalxYjlM/CrXsvrWVxSs9TwFAjh7q0wKsohbyft8RJcZWJ4zp+nTAj4/WD/v45+vCWtN9SHsk2zINLJiPvVYdNjRbo2mP9X9i8cM4ADAp4FUoINYmIP6kgNV/5bwaIS3tOaEmr0Tybe5qPtg553N3dRa/1Yi8ETvNYQ6A7/+iAQDMAfC9bZQ97jT7k0ULyevR5KUo8qzAnrt7WJ6oeSpqMdMtRNRCXrJMkl27bWTHh/3jfzJDSWb4s/eYmg37QliwALvdAvplCcJUR8yI953mKayP9/5ycRls2cHQAZAMCGDyw6grBumz4qUS83ENgtx5fwEzyhRmLMK7zwAAAABJRU5ErkJggg==",
			oncommand: "Services.appinfo.invalidateCachesOnRestart() || Application.restart();",
			style: "min-width: 358px;"
		},
		{
			label: "Erweiterungsordner öffnen",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADEElEQVQ4jY2RXUiTcRjF/9JFpBAapk5NnWzzI5vTbb5uuunrtFm5XCpi7tVEs0zU9aFFk6wmiV9RfrRqkRgZhVIZSjXUNDPCmaamlZQQ0gdFVxGFbu10paXzonN5Hs6P5zkPISsVniYjArXAzv8vceVyIi8A71g7hNW9k56eQsfFEYeQtUlOzqFJ69dzV4uuIbw4LxLB7CCyfNDGccgujcE9rqgvM4D6ZAjmvKjm+HYUbWShLYxn65Rsfro87iHwI9H5YBUYsankGqQXnkNycQyBlSaIK+7i6x4pblFBn/e6usMUswVP4vgzjKMr6y/ANYhFonIR1WxGTMsrSI2TEBnGwG8cgUjfjY+7JeiL5eM8zx/jieEYUYThPhVireP6Zi4iHEhk9im/Q20vvAuvQNBoRkjDMJry9mM0NRrv0yi8U0fgTZIIU4lCjNECm1kuQDXbh/m7RVzxARJ/pJLI8uF3oguc+iG0ZqSiR03jbbIYw2oRLhdSMCvCYIoIfqZycfH5twUHIs1d2LDXgI3F1+Bf8xjeVf1w1/fAu/QmprcJUX9UCk27EvcSQtEZHjRo94Z18qwPXsc64FczCK8zj+B2+iHoWiNS9BVo04hwSB+FlNZ45FRIoaigPtgBjuZtvlXZUIDx4cNIb2rGhvJOfDFrYOpVIePmVqS0JkBlVEDZSEN8Ujy7FExRurIMx0N0tdrA0S5jPKxzJdA0n4OHrg1fzAxeDqpxp0sJ7VUaygYa7JKA64SQNUuAg7t9yw06PoY7d+F1vwbWuRL8nNmHH1M5sEwzmJ9Ih2VUDX1LLGJrYsDRhsAjj3t7CcAkuYW2N9LfrF91sH4qg3VOC8tsAb5PZMMyzWDApMLOszLIqmQ2ySkZhMejEFAknFx2/8EsbtCD1sSpoY5kWOe0MF2NHzhTxPv9a1KD+907EK4T2/ilIoSWRdrc0tmMk8Rli12JRzTstK4rCfML74ttN+qo5NIstqq3ha46fThY4Ug7J7MY7rfgYspCBM7OduFFZW/34uWm+vivOgxw9HSiXPgr7T+DX3N5gyCN2AAAAABJRU5ErkJggg==",
			oncommand: "FileUtils.getFile('ProfD', ['extensions']).reveal();"
		},
		{
			label: "Add-onsliste in die Zwischenablage kopieren",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABlSURBVDhP5Y5BCsAgEAP3i/1AP+D/zxUlwWBXXQueOhAQzQStcN3p2UmVFK80C7QGH1aEBniOBPqhgRnsQB8P8KzRe+i/+YHCO+htQNPjdaB/G4D6hoWekFzQohfUxngSg4pglgGUsQ0ZR4jGSwAAAABJRU5ErkJggg==",
			oncommand: "EOM.CopyList(event);"
		}
	];
	var css = '\
		#eom-button dropmarker {display:none;}\
		#eom-button, #eom-button > .toolbarbutton-icon {padding:0!important;}\
		#eom-menugroup .menu-iconic-icon {margin-left:2px;}\
		.addon-disabled > .menu-iconic-left {filter:url("chrome://mozapps/skin/extensions/extensions.svg#greyscale")}\
		.addon-disabled label {opacity:0.8;}\
		.addon-disabled label:after {content:"deaktiviert";}\
		.addon-uninstall label {font-weight:bold!important;}\
		.addon-uninstall label:after {content:"entfernt";}\
		'.replace(/[\r\n\t]/g, '');;
	EOM.style = addStyle(css);
	EOM.init();
	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})();
