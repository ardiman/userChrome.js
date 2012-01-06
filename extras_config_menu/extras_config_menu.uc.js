<!--
// ==UserScript==
// @name           extras_config_menu.uc.js
// @compatibility  Firefox 8.*, 9.*
// @version        1.0.20120106
// ==/UserScript==
-->

var uProfMenu = {
  // Beginn der Konfiguration
  // In der folgenden Zeile (12) den Pfad zum Texteditor eintragen (unter Ubuntu 10.04 z.B.: '/usr/bin/gedit'). Bei Fehleintrag wird view_source.editor.path ausgelesen:
  TextOpenExe : 'C:\\Programme\\Sonstige\\npp\\unicode\\notepad++.exe',
  // Falls gewuenscht, in Zeile 16 einen Dateimanager eintragen (komplett leer lassen fuer Dateimanager des Systems) Beispiele:
  // vFileManager: 'E:\\Total Commander\\Totalcmd.exe',
  // vFileManager: 'C:\\Program Files (x86)\\FreeCommander\\FreeCommander.exe'
  vFileManager: '',
  // In der folgenden Zeile (20) 'menu' eintragen, damit es unter "Extras" als Menue erscheint, sonst die id des gewuenschten 
  // Elements *nach* dem der Button erscheinen soll (z.B. 'urlbar', 'searchbar', 'undoclosetab-button','abp-toolbarbutton')
  // Bitte nicht so etwas wie die Menue- oder Navigationsleiste (sondern einen Menuepunkt oder einen Button mit id auf diesen Leisten) eintragen:
  warpmenuto: 'urlbar',
 // Unter Linux sollte/kann versucht werden, die userChromeJS-Skripte zu sortieren, unter Windows ist das evtl. nicht noetig (die Sortierung wird Groß- und Kleinschreibung *nicht* beruecksichtigen - dazu wird die sort()-Funktion entsprechend mit einer Vergleichsfunktion aufgerufen)
  sortScripts: 0,   // 1 zum Erzwingen der Sortierung
  // Einbindung GM-Skripte-Ordner (0: nein, 1: Greasemonkey [Profil-Verzeichnis], 2: UserScriptLoader [Chrome-Verzeichnis]):
  gmOrdner: 1,
  // Einbindung CSS-Ordner (0: nein, 1: UserCSSLoader-Ordner im Chrome-Verzeichnis):
  cssOrdner: 0,
  // In Zeile 31 gueltige about:Adressen eintragen, die ebenfalls aufgerufen werden sollen.
  //  - Zum Ausblenden: abouts: [],
  // - Damit die about:-Seiten nicht als Untermenue, sondern direkt als Menuepunkte aufgefuehrt werden, muss das erste Element '0' sein:
  // abouts: ['0','about:about','about:addons','about:cache','about:config','about:support'],
  abouts: ['about:about','about:addons','about:cache','about:config','about:support'],
  // Ende der Konfiguration
  
  init: function() {
    if (this.warpmenuto.toLowerCase() == 'menu') {
      // aufgrund des gewaehlten warpmenuto als Untermenue von Extras anlegen
      var zielmenu = document.getElementById('menu_ToolsPopup');
      var menu = zielmenu.appendChild(this.createME("menu","Config Menü",0,0,"ExtraConfigMenu"));
     } else {
      // als Button nach dem per warpmenuto gewaehlten Element anlegen (s. Kommentar ueber warpmenuto im Konfigurationsabschnitt)
      var zielmenu = document.getElementById(this.warpmenuto);
      var menu = zielmenu.parentNode.insertBefore(document.createElement('toolbarbutton'), zielmenu.nextSibling);
      menu.setAttribute("id", "ExtraConfigMenu-button");
      menu.setAttribute("class", "toolbarbutton-1");
      menu.setAttribute("type", "menu");
      menu.setAttribute("tooltiptext", "Extra Config Menü");
      var css = <![CDATA[
       #ExtraConfigMenu-button {
        list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVR4Xm2RzYtbZRSHn/fr3pvJzTB3qiNM2k2pMBUGhEHaqsUqdeFGQalCobgREaFu/B/cqCtxVSjoQhBEQRBmIfWDKgNGJUPt0Nhah9JJ4iSd5E6+bu5972tAO4SS5/DjXZ1znsMrNiq1eikMQqYYJCmjxNH5+zdW777L0J5KKl9VPmnf+ut9KWkwhbheuzNcOVYOmGKc5iRO0r1ykeXCx0h7kt4fC3z5wfqbQnAJwQHa5S7jAZSRuJ0mkf81cheobhBXZa+ri1uptQjHAZoZCEC1PiPgDuwxCfwerBU7b73zXn//3usCcdt4HkZ7SGZg431U51NUCgwlO3cV/bVXhR/6p9ut+nP9QYeNn7/n8qUPZxvQ/Q6VVWHk4ZqWRvlJjpx9hcGfW2wO95N2q8m3618A2WwDt/0RplSAXsBed57eyossHl5GYdHacG3zGpADM06wjQ1UUIN+CLHPvfAxojPnKLiE+bDE1R9+5GatAmgPeGCAteQ7l5GBhGSyuROyd/gFouUyWkqEErR2mwXAAA8BRS0AgMQBjSra30ZkEeDzz9Dn4ZcvMO51SMcJcTdGChmA0ABA6cAgzyG3I8jLEBylV4fWoaeIc0V7t0Uv7pFbC+CA+28mp/8+SwXKnMVmz1O9HpE+eobMZdjcoY1GIHD/NwIdoH1fBaNguzlg88pVyoUi4vTbFI8eJxsNAIfSkrliESllH/L0v0jktNNomFGv1TFrL3Fo9QSMR3jaEEXzLC09gjaKp595No0WjyCEB4zRclICUMDxtRMce/wJ1MIi2SglXShhfI/cOjxPoZRmbq4gXzt/gVrtBrdvbiG+Wf+p/mvll1BpiVAGhCDPxuAUDotz4HKHlIJON6bRbL4hhPjcMx5mkn8BBLEUrsVZbq0AAAAASUVORK5CYII=) !important;
       }
       #ExtraConfigMenu-button > dropmarker, #ExtraConfigMenu-button > hbox > .toolbarbutton-menu-dropmarker {
        display: none;
       }
      ]]>.toString();
      var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
      var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
      sss.loadAndRegisterSheet(uri,sss.AGENT_SHEET);
    }
    //ab hier ist alles gleich, egal ob Button oder Menue
    menu.setAttribute("onpopupshowing","uProfMenu.getScripts()");
    var menupopup = menu.appendChild(document.createElement('menupopup'));
    menupopup.appendChild(this.createME("menuitem","userChrome.js","uProfMenu.edit(0,'userChrome.js');","uProfMenu_edit",0));
    // Anlegen von Untermenues fuer die userChromeJS-Skripte (befuellt werden sie spaeter)
    var submenu=menupopup.appendChild(this.createME("menu","uc.js",0,0,"submenu-ucjs"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-ucjs-items"));
    var submenu=menupopup.appendChild(this.createME("menu","uc.xul",0,0,"submenu-ucxul"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-ucxul-items"));
     // Ende Anlegen von Untermenues fuer die userChromeJS-Skripte
    menupopup.appendChild(document.createElement('menuseparator'));
    // Einbindung von Konfigdateien
    menupopup.appendChild(this.createME("menuitem","userChrome.css","uProfMenu.edit(0,'userChrome.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","userContent.css","uProfMenu.edit(0,'userContent.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","prefs.js","uProfMenu.edit(1,'prefs.js');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","user.js","uProfMenu.edit(1,'user.js');","uProfMenu_edit"),0);
    // Einbindung von Konfigdateien
    menupopup.appendChild(document.createElement('menuseparator'));
    // Einbindung von Ordnern
    switch (this.gmOrdner) {
      case 1:
        menupopup.appendChild(this.createME("menuitem","GM Scripte","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD')+uProfMenu.getDirSep()+'gm_scripts');","uProfMenu_folder"),0);
        break;
      case 2:
        menupopup.appendChild(this.createME("menuitem","USL Scripte","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'UserScriptLoader');","uProfMenu_folder"),0);
        break;
    }
    if (this.cssOrdner) {
      menupopup.appendChild(this.createME("menuitem","CSS-Ordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'CSS');","uProfMenu_folder"),0);
    }
    menupopup.appendChild(this.createME("menuitem","Chromeordner","uProfMenu.prefDirOpen('UChrm');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Profilordner","uProfMenu.prefDirOpen('ProfD');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Addonordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD')+uProfMenu.getDirSep()+'extensions');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Installationsordner","uProfMenu.prefDirOpen('CurProcD');","uProfMenu_folder"),0);
    // Ende Einbindung von Ordnern
    // Einbindung von abouts
    if (this.abouts.length>0) {
      menupopup.appendChild(document.createElement('menuseparator'));
      // falls der erste Eintrag des arrays ='0' ist, dann kein Untermenue anlegen, sondern direkt als Menuepunkte einbinden
      if (this.abouts[0]=='0') {
        for (var i = 1; i < this.abouts.length; i++) {
         menupopup.appendChild(this.createME("menuitem",this.abouts[i],"getBrowser (). selectedTab = getBrowser (). addTab ('"+this.abouts[i]+"')","uProfMenu_about"),0);
        }
       } else {
        // der erste Eintrag des arrays ist ungleich '0', deshalb als Untermenue einrichten
        var submenu=menupopup.appendChild(this.createME("menu","uc.js",0,0,"submenu-about"));
        var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-about-items"));
        this.fillMenu("submenu-about","submenu-about-items", "about:",this.abouts,"uProfMenu_about",1);
      }
    }
    // Ende Einbindung von abouts
    // falls addRestartButton installiert ist, Neustart zur Verfuegung stellen (addRestartButton 1.0.20120105mod erforderlich)
    if(typeof(ToolRstartMod) != "undefined") menupopup.appendChild(this.createME("menuitem","Neustart","ToolRstartMod.SaveRestart(event,1);","uProfMenu_restart"),0);
  },


  getDirSep:function() {
    // Betriebssystem nach https://developer.mozilla.org/en/Code_snippets/Miscellaneous ermitteln
    var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS; 
    var dirsep="/";
    switch(osString) {
      case "WINNT":
        dirsep="\\";
        break;
      case "Linux":
        dirsep="/";
        break;
      case "Darwin":
        dirsep="/";
        break;
    }
    return dirsep;
  },


  edit:function(OpenMode,Filename){
    var Path = "";
    var dSep = this.getDirSep();  // die Trennzeichen zwischen Ordnern abhaengig vom Betriebssystem machen
    switch (OpenMode){
      //Current is Chrome Directory
      case 0:
        var Path = this.getPrefDirectoryPath("UChrm") + dSep + Filename;
        break;
      //Current is Profile Directory
      case 1:
        var Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename;
        break;
      //Current is Root
      case 2:
        var Path = Filename;
        break;
    }
    this.launch(this.TextOpenExe,Path);
  },


  dirOpen:function(Path){
    if (this.vFileManager.length != 0) {
      var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
      var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
      var args=[Path];
      file.initWithPath(this.vFileManager);
      process.init(file);
      // Verzeichnis mit anderem Dateimanager oeffnen
      process.run(false, args, args.length);
     } else {
      // Verzeichnis mit Dateimanager des Systems oeffnen
      var dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
      dir.initWithPath(Path);
      dir.launch();
    }
  },


  prefDirOpen:function(prefDir){
    Path = this.getPrefDirectoryPath(prefDir);
    this.dirOpen(Path);
  },


  getPrefDirectoryPath:function(str){
    // get profile directory
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get(str, Components.interfaces.nsIFile);
    return file.path;
  },


  launch:function(RanPath,OpenPath){
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    var proc = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    var args = [OpenPath];
    file.initWithPath(RanPath);
    // falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
    if (!file.exists()) {
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
      RanPath=pref.getCharPref("view_source.editor.path");
      file.initWithPath(RanPath);
    }
    proc.init(file);
    proc.run(false, args, args.length);
  },


  stringComparison:function(a, b){
    a = a.toLowerCase();
    a = a.replace(/ä/g,"a");
    a = a.replace(/ö/g,"o");
    a = a.replace(/ü/g,"u");
    a = a.replace(/ß/g,"s");
    b = b.toLowerCase();
    b = b.replace(/ä/g,"a");
    b = b.replace(/ö/g,"o");
    b = b.replace(/ü/g,"u");
    b = b.replace(/ß/g,"s");
    return(a==b)?0:(a>b)?1:-1;
  },


  getScripts:function() {
    // Arrays (jeweils ein Array fuer uc.js und uc.xul) nehmen Namen der gefundenen Skripte auf
    let ucJsScripts = [];
    let ucXulScripts = [];
    // Suchmuster, also die Dateierweiterungen uc.js und uc.xul
    let extjs = /\.uc\.js$/i;
    let extxul= /\.uc\.xul$/i;
    let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
    aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path);
    // files mit Eintraegen im Chrome-Ordner befuellen
    let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
    // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Ci.nsIFile);
      // keine gewuenschte Datei, deshalb continue
      if (!extjs.test(file.leafName) && !extxul.test(file.leafName)) continue;
      // uc.js gefunden -> im Array ablegen
      if (extjs.test(file.leafName)) ucJsScripts.push(file.leafName);
      // uc.xul gefunden -> im Array ablegen
      if (extxul.test(file.leafName)) ucXulScripts.push(file.leafName);
    }
    if (this.sortScripts) {
      ucJsScripts.sort(this.stringComparison);
      ucXulScripts.sort(this.stringComparison);
    }
    // Aufruf der naechsten Methode um die beiden Untermenues zu befuellen
    this.fillMenu("submenu-ucjs","submenu-ucjs-items", "uc.js",ucJsScripts,"uProfMenu_ucjs",0);
    this.fillMenu("submenu-ucxul","submenu-ucxul-items", "uc.xul",ucXulScripts,"uProfMenu_ucxul",0);
  },


  fillMenu:function(whichsubmenu, whichsubmenuitems, strlabel, scriptArray,sClass,sTyp) {
    // Beschriftung des Untermenues mit Anzahl der gefundenen Dateien ergaenzen
    var e = document.getElementById(whichsubmenu);
    e.setAttribute('label',strlabel + ' (' + scriptArray.length + ')');
    var popup = document.getElementById(whichsubmenuitems);
    // zunaechst Untermenue zuruecksetzen
    while(popup.hasChildNodes()){
      popup.removeChild(popup.firstChild);
    }
    // Untermenue endlich befuellen
    for (var i = scriptArray.length-1; i > -1; i--) {
      // bisher nur eine Typunterscheidung (userChromeJS-Skript oder about:)
      if (sTyp==0){
        var mitem = this.createME("menuitem",scriptArray[i],"uProfMenu.edit(0,'"+scriptArray[i]+"')",sClass,0);
        mitem.setAttribute("onclick","uProfMenu.openAtGithub(event,'"+scriptArray[i]+"')");
        mitem.setAttribute("tooltiptext","Linksklick: Bearbeiten, Mittelklick: https://github.com/ardiman/userChrome.js/... öffnen, Rechtsklick: Suche auf GitHub");
       } else {
        var mitem = this.createME("menuitem",scriptArray[i],"getBrowser (). selectedTab = getBrowser (). addTab ('"+scriptArray[i]+"')",sClass,0);
      }
      popup.insertBefore(mitem, popup.firstChild);
    }
  },


  createME:function(sTyp,sLabel,sCommand,sClass,sId) {
    // Anlegen von menuitem, menu oder menupop - fuer bestimmte Typen nicht eingesetzte Parameter werden als 0 uebergeben
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var m = document.createElementNS(XUL_NS, sTyp);
    switch (sTyp) {
      case "menuitem":
        // this.createME("menuitem","Label des Items","ZuzuweisenderCodeFueroncommand","GewuenschteKlasseDesItems",0)
        m.setAttribute('label', sLabel);
        m.setAttribute('oncommand',sCommand);
        m.setAttribute('class',sClass);
        break;
      case "menu":
        // this.createME("menu","Label des Menues",0,0,"GewuenschteIdDesMenues")
        m.setAttribute('label', sLabel);
        m.setAttribute('id', sId);
        break;
      case "menupopup":
        //this.createME("menupopup",0,0,0,"GewuenschteId");
        m.setAttribute('id', sId);
        break;
    }
    return m;
  },


  openAtGithub:function(e,sScript) {
    if (e.button==1){
      sScript=sScript.toLowerCase();
      /* Das folgende Array enthaelt regulaere Ausdruecke, um ungueltige Zeichenfolgen entfernen:
      /Datei-Erweiterungen am Ende/, /"ucjs_" am Anfang/, /"_"gefolgtVonZahlUndDanachBeliebigenZeichen/
      / "_fx"gefolgtVonZahl(en)/, /"-" oder "+" oder "."/, /"_v"gefolgtVonZahlen
      */
      regs=[/\.uc\.js$/,/\.uc\.xul$/,/^ucjs_/,/_\d.+/,/_fx\d+/,/[-+\.]/g,/_v\d+/];
      for (var i = 0; i < regs.length; i++) {
        sScript=sScript.replace(regs[i],"");
      }
      // anschliessend versuchen, die Seite auf GitHub zu oeffnen (das kann nur funktionieren, wenn Ordner- und Dateiname [ohne Erweiterung] uebereinstimmen)
      var sUrl="https://github.com/ardiman/userChrome.js/tree/master/"+sScript;
      getBrowser (). selectedTab = getBrowser (). addTab (sUrl);
    }
    if (e.button==2){
      e.preventDefault();
      var sUrl="https://github.com/search?q="+sScript+"&type=Everything&repo=&langOverride=&start_value=1";
      getBrowser (). selectedTab = getBrowser (). addTab (sUrl);
    }
  }

};
uProfMenu.init();