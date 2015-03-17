// ==UserScript==
// @name           AddOnLister.uc.js
// @compatibility  Firefox 36.*
// @include        main
// @version        1.0.20150317
// ==/UserScript==

var ADONLI = {

// ----- Start Konfiguration
	// folgende Add-ons nicht auflisten Beispiel: ["InfoLister","AddOnLister.uc.js"]
	BLACKLIST:			[],
	// einige Tests der Konfiguration durchführen (true oder false)?
	CHECKCONFIG:		true,
	// ans eigene System anpassen - Pfad mit Verzeichnistrenner abschliessen. Unter Windows den \ bitte verdoppeln
	EXPORTPATH:			"d:\\ein\\pfad\\der\\mit\\Verzeichnistrenner\\endet\\",
	//Dateinamen ohne(!) Erweiterung eingeben - diese wird weiter unten im Wert "fileext" pro Ausgabeformat definiert
	EXPORTFILE:			"addonlister",
	// Ausgabeformat bbcode, html oder custom
	FORMAT:				"bbcode", 
	// Erstellungsdatum anzeigen (true oder false)
	SHOWDATE:			true,
	// Useragent anzeigen (true oder false)
	SHOWUSERAGENT:		true,
	// Versuche, Links zu Github zu generieren (für userchromejs)?
	TRYGITHUB:			true,
	// In der folgenden Zeile  den Pfad zum Texteditor eintragen (unter Ubuntu 10.04 z.B.: '/usr/bin/gedit'). Bei Fehleintrag wird view_source.editor.path ausgelesen:
	TEXTOPENEXE :		'C:\\Program Files (x86)\\Notepad++\\notepad++.exe',
	// Aufzulistende Add-On-Typen festlegen - möglich sind: ["extension","theme","plugin","dictionary","service","userstyle","greasemonkey-user-script","userchromejs"]
	WHICHTYPES:			["extension","theme","plugin","dictionary","service","greasemonkey-user-script","userchromejs"],
// ----- Ende Konfiguration

// ----- Start Expertenkonfiguration
	ICON_URL:	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0klEQVQ4jaVTz0sbQRQeQm628VCpCv2hh+JfINSjbVmvXtoeSv8Mb9JDb2LSgxRCJTPGZgZncCGhpwhbEz1kuxtH7I8NWRuP8eAlQYJEKHw9rNnWZNMefPAOM7z38d73fY+QvpCcGlLQlOTMVoK2laBtyZkd/FGjvz6MrY30lOQ0KTnrKMEQlZKzjuQ0ubWRnhpoVjyTU4LBlNmWVcyfaqd87ntu1/fcrnbK51Yxf2rKbEsJBsUzuWsgktOkEgyFbdGsVnbPTvxDRGW1sntW2BbNYBqa/LMzZx1TZlv/av4bxJTZ1tU6BpGCppRgsHYKzV6RVcxjwXiK0dEEbo2MwHg2j6r9OQSxdgrBFIKmSMA2g3bKF72CmZlH4Jsf4H2t4OhgD69fvcSL54shgHbKF1ek2iSQisH33O6wsY/0PibG74Zv33O7gTK0HQmQN3OYezyLROI2CCEghCAWi0UDRK3w4P49rK68hXZKOK5VoZ0SCCHRK0SRODZ2B+n3KdS+f0HJ+oQF48k1gD4SB2XMrK9hevoh4vE4Jicn8GZ5KQToycg31zuhtYcZqeFr/KxrNOp6wEgfWfrdf618XHN/NeoH+PHNvjzxDzHUyjc+ppuc82/5232er8x59AAAAABJRU5ErkJggg==",
	MYTPLS:{
		'html':	//für Darstellung als vollständiges html5-Dokument
			{
			'fileext':'html',
			'intro':'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n'
				+'<title>Meine Firefox-Informationen</title>\n</head>\n<body>\n<h1>Meine Firefox-Informationen</h1>\n',
			'tpllastupd':'<div>\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div>\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions">\n<h2>Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes">\n<h2>Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins">\n<h2>Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries">\n<h2>Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services">\n<h2>Dienste <small>(%%count%%)</small></h2>',
								'userstyle':'<div id="userstyles">\n<h2>Userstyles <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts">\n<h2>Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs">\n<h2>userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'<p>Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.</p>',
								'userchromejs':'<p>Durch die Erweiterung <a href="http://userchromejs.mozdev.org/">userChromeJS</a> eingebundene Skripte ergänzen den Firefox um diverse Funktionen.</p>'
								},
			'tpladdongrp_list_intro':{
								'default':'<ul>'
								},
			'tpladdon':'<li class="%%class%%"><a href="%%homepageURL%%">%%name%%</a> %%version%%: %%description%% %%disabled%%</li>\n',
			'tpladdon_without_url':'<li class="%%class%%">%%name%% %%version%%: %%description%% %%disabled%%</li>\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':'<small>[deaktiviert]</small>',
			'tpladdongrp_list_outro':'</ul>\n',
			'tpladdongrp_outro':'</div>\n\n',
			'outro':'</body>\n</html>'
			},
		'bbcode':	//für Postings in Foren, die bbcode unterstützen
			{
			'fileext':'txt',
			'intro':'Meine Firefox-Informationen\n\n',
			'tpllastupd':'Letzte Aktualisierung: %%lastupd%%',
			'tpluseragent':'User Agent: %%useragent%%\n',
			'tpladdongrp_title':{
								'extension':'[b]Erweiterungen[/b] (aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)',
								'theme':'[b]Themes[/b] (%%count%%)',
								'plugin':'[b]Plugins[/b] (%%count%%)',
								'dictionary':'[b]Wörterbücher[/b] (%%count%%)',
								'service':'[b]Dienste[/b] (%%count%%)',
								'userstyle':'[b]Userstyles[/b] (%%count%%)',
								'greasemonkey-user-script':'[b]Greasemonkey[/b] (aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)',
								'userchromejs':'[b]userChromeJS[/b] (%%count%%)'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.',
								'userchromejs':'Durch die Erweiterung [url=http://userchromejs.mozdev.org/]userChromeJS[/url] eingebundene Skripte ergänzen den Firefox um diverse Funktionen.'
								},
			'tpladdongrp_list_intro':{
								'default':'[list]'
								},
			'tpladdon':'[*][url=%%homepageURL%%]%%name%%[/url] %%version%%: %%description%% %%disabled%%\n',
			'tpladdon_without_url':'[*]%%name%% %%version%%: %%description%% %%disabled%%\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':'[deaktiviert]',
			'tpladdongrp_list_outro':'[/list]\n',
			'tpladdongrp_outro':'\n',
			'outro':''
			},
		'custom':	//Beispiel - für Darstellung als "include" in einem anderen (x)html-Dokument
			{
			'fileext':'txt',
			'intro':'<p id="bsbuttons">\n'
				+'<a class="tab active" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=windows">Windows 7</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=ubuntu">XUbuntu</a>\n'
				+'</p>\n'
				+'<div id="buttons">\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#extensions">Erweiterungen</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#themes">Themes</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#plugins">Plugins</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#dictionaries">Wörterbücher</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#services">Dienste</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#userstyles">Userstyles</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#gmscripts">Greasemonkey</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#userchromejs">userChromeJS</a>\n'
				+'<br/></div>\n',
			'tpllastupd':'<div class="lastupd">\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div class="useragent">\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_extensions.png" />Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_themes.png" />Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_plugins.gif" />Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_dictionaries.png" />Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_services.png" />Dienste <small>(%%count%%)</small></h2>',
								'userstyle':'<div id="userstyles" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_styles.png" />Userstyles <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_monkey.png" />Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_javascript.gif" />userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'<p>Einige Skripte stammen direkt von mir (s. auch <a href="http://www.ardiman.de/sonstiges/fxconfig/gmskripte.html">Greasemonkey-Skripte</a> bzw. <a class="extlink" href="https://openuserjs.org/users/ardiman/scripts" rel="nofollow">https://openuserjs.org/users/ardiman/scripts</a>), andere wurden nur geringf&uuml;gig angepasst.</p>',
								'userchromejs':'<p id="fxcuclisteintro">Durch die Erweiterung userChromeJS eingebundene Skripte erg&auml;nzen den Firefox um diverse Funktionen.</p>'
								},
			'tpladdongrp_list_intro':{
								'default':'<ul>',
								'userchromejs':'<ul id="fxcucliste">'
								},
			'tpladdon':'<li class="%%class%%"><a href="%%homepageURL%%" rel="nofollow" class="extlink">%%name%%</a> %%version%%: %%description%% %%disabled%%</li>\n',
			'tpladdon_without_url':'<li class="%%class%%">%%name%% %%version%%: %%description%% %%disabled%%</li>\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':'<small>[deaktiviert]</small>',
			'tpladdongrp_list_outro':'</ul>\n',
			'tpladdongrp_outro':'</div>\n\n',
			'outro':''
			}
	},
// ----- Ende Expertenkonfiguration

	MYSTOR: {},

	init: function() {
		// legt verschiebbaren Button und Menü unter Extras an
		// Button
		if (location != "chrome://browser/content/browser.xul") return;
		try {
			CustomizableUI.createWidget({
				id: 'adonli-button',
				type: 'custom',
				defaultArea: CustomizableUI.AREA_NAVBAR,
				onBuild: function(aDocument) {
					var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
					var attributes = {
						id: 'adonli-button',
						class: 'toolbarbutton-1 chromeclass-toolbar-additional',
						removable: 'true',
						label: 'AddonLister',
						tooltiptext: 'AddOnLister starten (Erstellung im Format »'+ADONLI.FORMAT+'«):\nLinksklick öffnet Ergebnis im Editor\nMittelklick öffnet Ergebnis als Tab im Browser (nur bei HTML sinnvoll)\nRechtsklick exportiert die Liste ohne Anzeige im Editor oder Browser',
						style: 'list-style-image: url(' + ADONLI.ICON_URL + ')',
						onclick: 'event.preventDefault(); return ADONLI.launch(event.button, \"' + ADONLI.FORMAT +'\");'
					};
				for (var a in attributes)
					toolbaritem.setAttribute(a, attributes[a]);
					return toolbaritem;
				}
			});
		} catch(e) { };
		// Menü
		this.createME("menu_ToolsPopup","menu_openAddons",'\
		<menu id="menu_ucjsAddonLister" accesskey="L" label="AddonLister" class="menu-iconic" style="list-style-image: url(' + ADONLI.ICON_URL + ')">\
			<menupopup id="menu_ucjsAddonLister-popup">\
				<menu id="menu_ucjsAddonLister-bbcode" accesskey="B" label="BBCODE" class="menu-iconic">\
					<menupopup id="menu_ucjsAddonLister-popup-bbcode">\
						<menuitem id="menu_ucjsAddonLister_editor-bbcode" class="menAddonLister_item" oncommand="ADONLI.launch(0,\'bbcode\')" accesskey="E" label="Liste erstellen und im Editor anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_browser-bbcode" class="menAddonLister_item" oncommand="ADONLI.launch(1,\'bbcode\')" accesskey="A" label="Liste erstellen und im Browser anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_write-bbcode" class="menAddonLister_item" oncommand="ADONLI.launch(2,\'bbcode\')" accesskey="o" label="Liste erstellen ohne Anzeige"/>\
					</menupopup>\
				</menu>\
				<menu id="menu_ucjsAddonLister-html" accesskey="H" label="HTML" class="menu-iconic">\
					<menupopup id="menu_ucjsAddonLister-popup-html">\
						<menuitem id="menu_ucjsAddonLister_editor-html" class="menAddonLister_item" oncommand="ADONLI.launch(0,\'html\')" accesskey="E" label="Liste erstellen und im Editor anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_browser-html" class="menAddonLister_item" oncommand="ADONLI.launch(1,\'html\')" accesskey="A" label="Liste erstellen und im Browser anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_write-html" class="menAddonLister_item" oncommand="ADONLI.launch(2,\'html\')" accesskey="o" label="Liste erstellen ohne Anzeige"/>\
					</menupopup>\
				</menu>\
				<menu id="menu_ucjsAddonLister-custom" accesskey="C" label="Custom" class="menu-iconic">\
					<menupopup id="menu_ucjsAddonLister-popup-custom">\
						<menuitem id="menu_ucjsAddonLister_editor-custom" class="menAddonLister_item" oncommand="ADONLI.launch(0,\'custom\')" accesskey="E" label="Liste erstellen und im Editor anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_browser-custom" class="menAddonLister_item" oncommand="ADONLI.launch(1,\'custom\')" accesskey="A" label="Liste erstellen und im Browser anzeigen"/>\
						<menuitem id="menu_ucjsAddonLister_write-custom" class="menAddonLister_item" oncommand="ADONLI.launch(2,\'custom\')" accesskey="o" label="Liste erstellen ohne Anzeige"/>\
					</menupopup>\
				</menu>\
				<menuitem tooltiptext="Erstellung im Format »'+ADONLI.FORMAT+'«" id="menu_ucjsAddonLister_editor" class="menAddonLister_item" oncommand="ADONLI.launch(0,\''+ADONLI.FORMAT+'\')" accesskey="E" label="Liste erstellen und im Editor anzeigen"/>\
				<menuitem tooltiptext="Erstellung im Format »'+ADONLI.FORMAT+'«" id="menu_ucjsAddonLister_browser" class="menAddonLister_item" oncommand="ADONLI.launch(1,\''+ADONLI.FORMAT+'\')" accesskey="A" label="Liste erstellen und im Browser anzeigen"/>\
				<menuitem tooltiptext="Erstellung im Format »'+ADONLI.FORMAT+'«" id="menu_ucjsAddonLister_write" class="menAddonLister_item" oncommand="ADONLI.launch(2,\''+ADONLI.FORMAT+'\')" accesskey="o" label="Liste erstellen ohne Anzeige"/>\
			</menupopup>\
		</menu>'
		);
	},

	createME: function (zId,zPos,sXml) {
		var range = document.createRange();
		var mytarget = document.getElementById(zPos);
		range.selectNodeContents(document.getElementById(zId));
		range.collapse(false);
		mytarget.parentNode.insertBefore(range.createContextualFragment(sXml.replace(/\n|\t/g, '')), mytarget.nextSibling);
		range.detach();
	},

	launch: function(e,f) {
		// ruft alle noetigen Funktionen nach Klick auf Toolbarbutton auf
		var ctrlConf = "";
		if (this.CHECKCONFIG) ctrlConf = this.configCheck();
		if (ctrlConf === "") {
			var expfile =  this.EXPORTPATH + this.EXPORTFILE + "." + this.MYTPLS[f].fileext;
			this.getOtherValues();
			this.resetStor();
			this.getAddons();
			if (this.WHICHTYPES.indexOf('userchromejs') != -1) this.getScripts();
			this.writeAddons(expfile,f);
			this.showAddons(e,this.TEXTOPENEXE,expfile,f);
		} else {
			alert ("Lt. Konfigurationstest des AddonListers muss folgendes kontrolliert werden:\n" + ctrlConf);
		}
	},

	configCheck: function() {
		var fehler = "";
		// Kontrolle des Pfades
		if (this.EXPORTPATH.substr(-1) != "\\" && this.EXPORTPATH.substr(-1) != "/") fehler += "\n - Der Pfad in EXPORTPATH endet nicht mit einem Verzeichnistrenner.";
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(this.EXPORTPATH);
		if (!file.exists()) fehler += "\n - Der Pfad »" + this.EXPORTPATH + "« in EXPORTPATH existiert nicht.";
		// Kontrolle des Dateinamens
		if (this.EXPORTFILE.indexOf(".") != -1) fehler += "\n - Der Dateiname in EXPORTFILE sollte keinen Punkt enthalten (ohne Erweiterung sein).";
		if (this.EXPORTFILE.length === 0) fehler += "\n - Es wurde kein Dateiname in EXPORTFILE hinterlegt.";
		// Kontrolle des Formates
		var formate = ["bbcode", "custom", "html"];
		if (formate.indexOf(this.FORMAT) === -1) fehler += "\n - Ungültiges FORMAT »" + this.FORMAT + "«.";
		// Kontrolle des Editors
		file.initWithPath(this.TEXTOPENEXE);
		if (!file.exists()) {
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			file.initWithPath(pref.getCharPref("view_source.editor.path"));
			if (!file.exists()) {
				fehler += "\n - Der in TEXTOPENEXE und about:config [view_source.editor.path] hinterlegte Editor kann nicht gefunden werden.";
			}
		}
		// Kontrolle der gewünschten Addon-Typen, folgende sind momentan gültig:
		var addontypes = ["extension","theme","plugin","dictionary","service","userstyle","greasemonkey-user-script","userchromejs"];
		var w;
		for (w = 0; w < this.WHICHTYPES.length; w++) {
			if (addontypes.indexOf(this.WHICHTYPES[w]) == -1) {
				fehler += "\n - In WHICHTYPES wurden ein oder mehrere unbekannte Add-on-Typen (z.B. »" + this.WHICHTYPES[w] + "«) gewählt.";
				break;
			}
		}
		return fehler;
	},

	resetStor: function() {
		// setzt das JSON-Object (bzw. die "Listen" darin) zurueck
		var h;
		for (h = 0; h < this.WHICHTYPES.length; h++) {
			this.MYSTOR[this.WHICHTYPES[h]] = [];
		}
	},

	getOtherValues: function() {
		// speichert momentan Auswertungsdatum und useragent im JSON-Object
		var options;
		options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false};
		if (this.SHOWDATE) this.MYSTOR["lastupd"] = new Date().toLocaleDateString("de-DE", options);
		if (this.SHOWUSERAGENT) this.MYSTOR["useragent"] = window.navigator.userAgent;
	},

	getAddons: function() {
		// speichert die gewaehlten Addons (s. WHICHTYPES) im JSON-Object
		var i, x, j, iAo, Addons, added, storedItems;
		AddonManager.getAddonsByTypes(this.WHICHTYPES, function(addonlist) {
			Addons = addonlist;
		});
		var thread = Cc['@mozilla.org/thread-manager;1'].getService().mainThread;
		while (Addons == void(0)) {
			thread.processNextEvent(true);
		}
		// Schleife ueber Addons
		for (i = 0; i < Addons.length; i++) {
			iAo = Addons[i];
			added = false;
			storedItems = this.MYSTOR[iAo.type].length;
			// nächste Aktionen nur, wenn Addon *nicht* in BLACKLIST steht
			if (this.BLACKLIST.indexOf(iAo.name) == -1) {
				// Ablage gleich sortiert vornehmen
				for (j = 0; j < storedItems; j++) {
					if (iAo.name.toLowerCase() < this.MYSTOR[iAo.type][j].name.toLowerCase()) {
						this.MYSTOR[iAo.type].splice(j,0,{ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'description': iAo.description, 'homepage': iAo.homepageURL});
						added = true;
						break;
					}
				}
				if (!added) this.MYSTOR[iAo.type].push({ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'description': iAo.description, 'homepage': iAo.homepageURL});
			}
		}
	},

	getScripts: function() {
		// speichert ggf. im Chrome-Ordner vorhandene uc.js und uc.xul-Dateien im JSON-Object
		var hp, j, storedItems, added;
		// Suchmuster, also die Dateierweiterungen uc.js und uc.xul
		let extjs = /\.uc\.js$/i;
		let extxul = /\.uc\.xul$/i;
		let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path);
		// files mit Eintraegen im Chrome-Ordner befuellen
		let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
		// Ordner bzw. Dateien durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
		while (files.hasMoreElements()) {
			let file = files.getNext().QueryInterface(Ci.nsIFile);
			// keine gewuenschte Datei, deshalb continue
			if ((!extjs.test(file.leafName) && !extxul.test(file.leafName)) || this.BLACKLIST.indexOf(file.leafName) != -1) continue;
			// uc.js bzw. uc.xul gefunden, die nicht in der Blacklist stehen -> Ablage sortiert (unter Linux erforderlich) im JSON vornehmen
			hp = null;
			if (this.TRYGITHUB) hp = this.githubLink(file.leafName);
			added = false;
			storedItems = this.MYSTOR.userchromejs.length;
			for (j = 0; j < storedItems; j++) {
				if (file.leafName.toLowerCase() < this.MYSTOR.userchromejs[j].name.toLowerCase()) {
					this.MYSTOR.userchromejs.splice(j,0,{'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
					added = true;
					break;
				}
			}
			if (!added) this.MYSTOR.userchromejs.push({'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
		}
	},

	githubLink: function(sName) {
		// übergibt für gegebenen Skriptnamen den Link zu github
		sName = sName.toLowerCase();
		/* Das folgende Array enthaelt regulaere Ausdruecke, um ungueltige Zeichenfolgen entfernen:
		/Datei-Erweiterungen am Ende/, /"ucjs_" am Anfang/, /"_"gefolgtVonZahlUndDanachBeliebigenZeichen/
		/ "_fx"gefolgtVonZahl(en)/, /"-" oder "+" oder "."/, /"_v"gefolgtVonZahlen
		*/
		var regs=[/\.uc\.js$/,/\.uc\.xul$/,/^ucjs_/,/_\d.+/,/_fx\d+/,/[-+\.]/g,/_v\d+/];
		for (var i = 0; i < regs.length; i++) {
			sName=sName.replace(regs[i],"");
		}
		return "https://github.com/ardiman/userChrome.js/tree/master/" + sName;
	},

	writeAddons: function(OpenPath,f){
		var a, t, c, n, d, atype, aout, thisaddon;
		var file  = OpenPath;
		var format = f;
		var output = "";
		var addontpl = "";
		var addontplwithouturl = "";
		Components.utils.import("resource://gre/modules/osfile.jsm");

		addontpl = this.MYTPLS[format].tpladdon;
		addontplwithouturl = this.MYTPLS[format].tpladdon_without_url;
		output += this.MYTPLS[format].intro;

		if (this.SHOWDATE) output +=  this.MYTPLS[format].tpllastupd.replace(/%%lastupd%%/g,this.MYSTOR.lastupd)+"\n";
		if (this.SHOWUSERAGENT) output +=  this.MYTPLS[format].tpluseragent.replace(/%%useragent%%/g,this.MYSTOR.useragent)+"\n";

		for (t = 0; t < this.WHICHTYPES.length; t++) {
			atype = this.WHICHTYPES[t];
			c = this.MYSTOR[atype].length;
			n = 0;
			d = 0;
			output += this.MYTPLS[format].tpladdongrp_title[atype].replace(/%%count%%/g,c)+"\n";
			if (this.MYTPLS[format].tpladdongrp_intro[atype] == undefined) {
				output += this.MYTPLS[format].tpladdongrp_intro.default + (this.MYTPLS[format].tpladdongrp_intro.default.length > 0 ? "\n" : "");
			} else {
				output += this.MYTPLS[format].tpladdongrp_intro[atype] + (this.MYTPLS[format].tpladdongrp_intro[atype].length > 0 ? "\n" : "");
			}
			if (this.MYTPLS[format].tpladdongrp_list_intro[atype] == undefined) {
				output += this.MYTPLS[format].tpladdongrp_list_intro.default+"\n";
			} else {
				output += this.MYTPLS[format].tpladdongrp_list_intro[atype]+"\n";
			}
			for (a = 0; a < c; a++) {
				thisaddon =  this.MYSTOR[atype][a];
				// console.log(atype + " " + thisaddon.name + " " + thisaddon.active);
				if (thisaddon.homepage == undefined) {
					aout = addontplwithouturl;
				} else {
					aout = addontpl;
					aout = aout.replace(/%%homepageURL%%/g,thisaddon.homepage.replace(/&(?!amp;)/g,'&amp;'));
				}
				aout = aout.replace(/%%name%%/g,thisaddon.name);
				if (thisaddon.version == undefined) {
					if (thisaddon.description != undefined) {
						aout = aout.replace(/ %%version%%: /g,": ");
					} else {
						aout = aout.replace(/ %%version%%: /g,"");
					}
				}
				aout = aout.replace(/%%version%%/g,thisaddon.version);
				if (thisaddon.description != undefined) {
					aout = aout.replace(/%%description%%/g,thisaddon.description);
				} else {
					aout = aout.replace(/%%description%%/g,"");
				}
				if (thisaddon.active !== true) {
					aout = aout.replace(/%%class%%/g,this.MYTPLS[format].inactiveclass);
					aout = aout.replace(/%%disabled%%/g,this.MYTPLS[format].disabledtext);
					d++;
				} else {
					aout = aout.replace(/%%class%%/g,this.MYTPLS[format].activeclass);
					aout = aout.replace(/%%disabled%%/g,"");
					n++;
				}
				output += aout;
			}
			output = output.replace(/%%countactive%%/g,n).replace(/%%countinactive%%/g,d);
			output += this.MYTPLS[format].tpladdongrp_list_outro;
			output += this.MYTPLS[format].tpladdongrp_outro;
		}
		output += this.MYTPLS[format].outro+"\n";
		let encoder = new TextEncoder();
		let myarray = encoder.encode(output);
		let promise = OS.File.writeAtomic(file, myarray);
	},

	showAddons: function(e,RanPath,OpenPath,f) {
		// zeigt das EXPORTFILE im Editor oder im Browser (Mittelklick) an
		switch (e) {
			case 0:
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				var proc = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
				var args = [OpenPath];
				file.initWithPath(RanPath);
				// falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
				if (!file.exists()) {
					console.log("AddonLister meldet: Editor nicht gefunden, ausweichen auf about:config.");
					var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					RanPath = pref.getCharPref("view_source.editor.path");
					file.initWithPath(RanPath);
				}
				proc.init(file);
				proc.run(false, args, args.length);
				break;
			case 1:
				// alert sorgt ein wenig dafür, dem OS Zeit fürs Speichern der Datei zu geben ...
				alert("Export nach >"+ OpenPath + "« ("+ f + "-format) ist erfolgt.");
				getBrowser().selectedTab = getBrowser().addTab(OpenPath);
				break;
			default:
				XULBrowserWindow.statusTextField.label = "Export nach  »"+ OpenPath + "« ist erfolgt.";
				break;
		}
	}

};

ADONLI.init();