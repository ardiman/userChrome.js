// ==UserScript==
// @name           AddOnLister.uc.js
// @compatibility  Firefox 36.*
// @include        main
// @version        1.0.20150309
// ==/UserScript==

var ADONLI = {

// ----- Start Konfiguration
	// folgende Add-ons nicht auflisten Beispiel: ["InfoLister","AddOnLister.uc.js"]
	BLACKLIST:			[],
	// ans eigene System anpassen - unter Windows den \ bitte verdoppeln
	EXPORTPATH:			"d:\\ein\\pfad\\der\\mit\\Verzeichnistrenner\\endet\\",
	//Dateinamen ohne(!) Erweiterung eingeben - wird weiter unten im Wert "fileext" pro Ausgabeformat definiert
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
	// Aufzulistende Add-On-Typen festlegen
	WHICHTYPES:			["extension","theme","plugin","dictionary","service","greasemonkey-user-script","userchromejs"],
// ----- Ende Konfiguration

// ----- Start Expertenkonfiguration
	ICON_URL:	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0klEQVQ4jaVTz0sbQRQeQm628VCpCv2hh+JfINSjbVmvXtoeSv8Mb9JDb2LSgxRCJTPGZgZncCGhpwhbEz1kuxtH7I8NWRuP8eAlQYJEKHw9rNnWZNMefPAOM7z38d73fY+QvpCcGlLQlOTMVoK2laBtyZkd/FGjvz6MrY30lOQ0KTnrKMEQlZKzjuQ0ubWRnhpoVjyTU4LBlNmWVcyfaqd87ntu1/fcrnbK51Yxf2rKbEsJBsUzuWsgktOkEgyFbdGsVnbPTvxDRGW1sntW2BbNYBqa/LMzZx1TZlv/av4bxJTZ1tU6BpGCppRgsHYKzV6RVcxjwXiK0dEEbo2MwHg2j6r9OQSxdgrBFIKmSMA2g3bKF72CmZlH4Jsf4H2t4OhgD69fvcSL54shgHbKF1ek2iSQisH33O6wsY/0PibG74Zv33O7gTK0HQmQN3OYezyLROI2CCEghCAWi0UDRK3w4P49rK68hXZKOK5VoZ0SCCHRK0SRODZ2B+n3KdS+f0HJ+oQF48k1gD4SB2XMrK9hevoh4vE4Jicn8GZ5KQToycg31zuhtYcZqeFr/KxrNOp6wEgfWfrdf618XHN/NeoH+PHNvjzxDzHUyjc+ppuc82/5232er8x59AAAAABJRU5ErkJggg==",
	MYTPLS:{
		'html':	//für Darstellung als vollständiges html5-Dokument
			{
			'fileext':'html',
			'intro':'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Meine Firefox-Informationen</title>\n</head>\n<body>\n<h1>Meine Firefox-Informationen</h1>\n',
			'tpllastupd':'<div>\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div>\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions">\n<h2>Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes">\n<h2>Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins">\n<h2>Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries">\n<h2>Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services">\n<h2>Dienste <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts">\n<h2>Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs">\n<h2>userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'extension':'',
								'theme':'',
								'plugin':'',
								'dictionary':'',
								'service':'',
								'greasemonkey-user-script':'<p>Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.</p>\n',
								'userchromejs':'<p>Durch die Erweiterung <a href="http://userchromejs.mozdev.org/">userChromeJS</a> eingebundene Skripte ergänzen den Firefox um diverse Funktionen.</p>\n'
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
								'greasemonkey-user-script':'[b]Greasemonkey[/b] (aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)',
								'userchromejs':'[b]userChromeJS[/b] (%%count%%)'
								},
			'tpladdongrp_intro':{
								'extension':'',
								'theme':'',
								'plugin':'',
								'dictionary':'',
								'service':'',
								'greasemonkey-user-script':'Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.\n',
								'userchromejs':'Durch die Erweiterung [url=http://userchromejs.mozdev.org/]userChromeJS[/url] eingebundene Skripte ergänzen den Firefox um diverse Funktionen.\n'
								},
			'tpladdongrp_list_intro':{
								'default':'[list]',
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
		'custom':	//für Darstellung als "include" in einem anderen (x)html-Dokument
			{
			'fileext':'txt',
			'intro':'<p id="bsbuttons">\n<a class="tab active" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=windows">Windows 7</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=ubuntu">XUbuntu</a>\n</p>\n<div id="buttons">\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#extensions">Erweiterungen</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#themes">Themes</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#plugins">Plugins</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#dictionaries">Wörterbücher</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#services">Dienste</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#gmscripts">Greasemonkey</a>\n<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#userchromejs">userChromeJS</a>\n<br/></div>\n',
			'tpllastupd':'<div class="lastupd">\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div class="useragent">\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_extensions.png" />Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_themes.png" />Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_plugins.gif" />Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_dictionaries.png" />Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_services.png" />Dienste <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_monkey.png" />Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_javascript.gif" />userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'extension':'',
								'theme':'',
								'plugin':'',
								'dictionary':'',
								'service':'',
								'greasemonkey-user-script':'<p>Einige Skripte stammen direkt von mir (s. auch <a href="http://www.ardiman.de/sonstiges/fxconfig/gmskripte.html">Greasemonkey-Skripte</a> bzw. <a class="extlink" href="https://openuserjs.org/users/ardiman/scripts" rel="nofollow">https://openuserjs.org/users/ardiman/scripts</a>), andere wurden nur geringf&uuml;gig angepasst.</p>\n',
								'userchromejs':'<p id="fxcuclisteintro">Durch die Erweiterung userChromeJS eingebundene Skripte erg&auml;nzen den Firefox um diverse Funktionen.</p>\n'
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
		// legt verschiebbaren Button an
		if (location != "chrome://browser/content/browser.xul") return;
		var icon = document.createElement('toolbarbutton');
		icon.id = 'adonli-button';
		icon.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
		icon.setAttribute('context', '');
		icon.setAttribute('tooltiptext', 'AddOnLister starten:\nLinksklick öffnet Ergebnis im Editor\nMittelklick öffnet Ergebnis als Tab im Browser (nur bei HTML sinnvoll)\nRechtsklick öffnet Add-ons-Manager');
		icon.setAttribute('onclick', 'if (event.button === 2) {event.preventDefault(); BrowserOpenAddonsMgr("addons://list/extension");} else {return ADONLI.launch(event);}');
		icon.style.padding = '0px 2px';
		icon.style.listStyleImage = "url("+ADONLI.ICON_URL+")";
		document.getElementById('navigator-toolbox').palette.appendChild(icon);
		var toolbars = Array.slice(document.querySelectorAll('toolbar'));
		for (var i=0; i<toolbars.length; i++) {
			var currentset = toolbars[i].getAttribute('currentset');
			if (currentset.split(',').indexOf(icon.id) >= 0) {
				var j;
				if (i == 0) j = 1
				else j = 0;
				toolbars[j].currentSet += ',' + icon.id;
				toolbars[i].currentSet = currentset;
			}	;
		};
	},

	launch: function(e) {
		// ruft alle noetigen Funktionen nach Klick auf Toolbarbutton auf
		var expfile =  ADONLI.EXPORTPATH + ADONLI.EXPORTFILE + "." + ADONLI.MYTPLS[ADONLI.FORMAT].fileext;
		ADONLI.getOtherValues();
		ADONLI.resetStor();
		ADONLI.getAddons();
		if (ADONLI.WHICHTYPES.indexOf('userchromejs') != -1) ADONLI.getScripts();
		ADONLI.writeAddons(expfile);
		ADONLI.showAddons(e,ADONLI.TEXTOPENEXE, expfile);
	},

	resetStor: function() {
		// setzt das JSON-Object (bzw. die "Listen" darin) zurueck
		var h;
		for (h = 0; h < ADONLI.WHICHTYPES.length; h++) {
			ADONLI.MYSTOR[ADONLI.WHICHTYPES[h]] = [];
		}
	},

	getOtherValues: function() {
		// speichert momentan Auswertungsdatum und useragent im JSON-Object
		var options;
		options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false};
		if (ADONLI.SHOWDATE) ADONLI.MYSTOR["lastupd"] = new Date().toLocaleDateString("de-DE", options);
		if (ADONLI.SHOWUSERAGENT) ADONLI.MYSTOR["useragent"] = window.navigator.userAgent;
	},

	getAddons: function() {
		// speichert die gewaehlten Addons (s. WHICHTYPES) im JSON-Object
		var i, x, j, iAo, Addons, added, storedItems;
		AddonManager.getAddonsByTypes(ADONLI.WHICHTYPES, function(addonlist) {
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
			storedItems = ADONLI.MYSTOR[iAo.type].length;
			// nächste Aktionen nur, wenn Addon *nicht* in BLACKLIST steht
			if (ADONLI.BLACKLIST.indexOf(iAo.name) == -1) {
				// Ablage gleich sortiert vornehmen
				for (j = 0; j < storedItems; j++) {
					if (iAo.name.toLowerCase() < ADONLI.MYSTOR[iAo.type][j].name.toLowerCase()) {
						ADONLI.MYSTOR[iAo.type].splice(j,0,{ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'description': iAo.description, 'homepage': iAo.homepageURL});
						added = true;
						break;
					}
				}
				if (!added) ADONLI.MYSTOR[iAo.type].push({ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'description': iAo.description, 'homepage': iAo.homepageURL});
			}
		}
	},

	getScripts: function() {
		// speichert ggf. im Chrome-Ordner vorhandene uc.js und uc.xul-Dateien im JSON-Object
		var hp;
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
			if ((!extjs.test(file.leafName) && !extxul.test(file.leafName)) || ADONLI.BLACKLIST.indexOf(file.leafName) != -1) continue;
			hp = null;
			if (ADONLI.TRYGITHUB) hp = ADONLI.githubLink(file.leafName);
			// uc.js gefunden -> im Array ablegen
			if (extjs.test(file.leafName)) ADONLI.MYSTOR.userchromejs.push({'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
			// uc.xul gefunden -> im Array ablegen
			if (extxul.test(file.leafName)) ADONLI.MYSTOR.userchromejs.push({'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
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

	writeAddons: function(OpenPath){
		var a, t, c, n, d, atype, aout;
		var file  = OpenPath;
		var format = ADONLI.FORMAT;
		var output = "";
		var addontpl = "";
		var addontplwithouturl = "";
		Components.utils.import("resource://gre/modules/osfile.jsm")

		addontpl = ADONLI.MYTPLS[format].tpladdon;
		addontplwithouturl = ADONLI.MYTPLS[format].tpladdon_without_url;
		output += ADONLI.MYTPLS[format].intro;

		if (ADONLI.SHOWDATE) output +=  ADONLI.MYTPLS[format].tpllastupd.replace(/%%lastupd%%/g,ADONLI.MYSTOR["lastupd"])+"\n";
		if (ADONLI.SHOWUSERAGENT) output +=  ADONLI.MYTPLS[format].tpluseragent.replace(/%%useragent%%/g,ADONLI.MYSTOR["useragent"])+"\n";

		for (t = 0; t < ADONLI.WHICHTYPES.length; t++) {
			atype = ADONLI.WHICHTYPES[t];
			c = ADONLI.MYSTOR[atype].length;
			n = 0;
			d = 0;
			output += ADONLI.MYTPLS[format].tpladdongrp_title[atype].replace(/%%count%%/g,c)+"\n";
			output += ADONLI.MYTPLS[format].tpladdongrp_intro[atype];
			if (ADONLI.MYTPLS[format].tpladdongrp_list_intro[atype] === undefined) {
				output += ADONLI.MYTPLS[format].tpladdongrp_list_intro.default+"\n";
			} else {
				output += ADONLI.MYTPLS[format].tpladdongrp_list_intro[atype]+"\n";
			}
			for (a = 0; a < c; a++) {
				// console.log(atype + " "+ ADONLI.MYSTOR[atype][a].name + " " +ADONLI.MYSTOR[atype][a].active);
				if (ADONLI.MYSTOR[atype][a].homepage == undefined) {
					aout = addontplwithouturl;
				} else {
					aout = addontpl;
					aout = aout.replace(/%%homepageURL%%/g,ADONLI.MYSTOR[atype][a].homepage.replace(/&(?!amp;)/g,'&amp;'));
				}
				aout = aout.replace(/%%name%%/g,ADONLI.MYSTOR[atype][a].name);
				if (ADONLI.MYSTOR[atype][a].version == undefined) {
					if (ADONLI.MYSTOR[atype][a].description != undefined) {
						aout = aout.replace(/ %%version%%: /g,": ");
					} else {
						aout = aout.replace(/ %%version%%: /g,"");
					}
				}
				aout = aout.replace(/%%version%%/g,ADONLI.MYSTOR[atype][a].version);
				if (ADONLI.MYSTOR[atype][a].description != undefined) {
					aout = aout.replace(/%%description%%/g,ADONLI.MYSTOR[atype][a].description);
				} else {
					aout = aout.replace(/%%description%%/g,"");
				}
				if (ADONLI.MYSTOR[atype][a].active != true) {
					aout = aout.replace(/%%class%%/g,ADONLI.MYTPLS[format].inactiveclass);
					aout = aout.replace(/%%disabled%%/g,ADONLI.MYTPLS[format].disabledtext);
					d++;
				} else {
					aout = aout.replace(/%%class%%/g,ADONLI.MYTPLS[format].activeclass);
					aout = aout.replace(/%%disabled%%/g,"");
					n++;
				}
				output += aout;
			}
			output = output.replace(/%%countactive%%/g,n).replace(/%%countinactive%%/g,d);
			output += ADONLI.MYTPLS[format].tpladdongrp_list_outro;
			output += ADONLI.MYTPLS[format].tpladdongrp_outro;
		}
		output += ADONLI.MYTPLS[format].outro+"\n";
		let encoder = new TextEncoder();
		let marray = encoder.encode(output);
		let promise = OS.File.writeAtomic(file, marray);
		// alert sorgt ein wenig dafür, dem OS Zeit fürs Speichern der Datei zu geben ...
		alert("Export nach >"+ file + "< ("+ ADONLI.FORMAT + "-format) ist erfolgt.");
		XULBrowserWindow.statusTextField.label = "Export nach >"+ file + "< ist erfolgt.";
	},

	showAddons: function(e,RanPath,OpenPath) {
		// zeigt das EXPORTFILE im Browser (Mittelklick) oder Editor an
		if (e.button === 1) {
			getBrowser().selectedTab = getBrowser().addTab(OpenPath);
		} else {
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			var proc = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
			var args = [OpenPath];
			file.initWithPath(RanPath);
			// falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
			if (!file.exists()) {
				var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				RanPath = pref.getCharPref("view_source.editor.path");
				file.initWithPath(RanPath);
			}
			proc.init(file);
			proc.run(false, args, args.length);
		}
	}

};

ADONLI.init();