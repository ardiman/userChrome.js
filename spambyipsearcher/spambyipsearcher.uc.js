// ==UserScript==
// @name           spambyipsearcher.uc.js
// @namespace      https://github.com/ardiman/userChrome.js/tree/master/spambyipsearcher
// @compatibility  Firefox 10.*, Firefox 20.*
// @include        main
// @version        1.0.20130403
// ==/UserScript==

var ucjs_SpamByIpSearcher = {
  // Beginn der Konfiguration
  // Dienste im Hintergrundtab oeffnen (true/false)
  openServicesInBackground: false,
  // Bei Fehlern Anzeige im Browser für x Millisekunden (auf 0 setzen, damit Anzeige nicht stattfindet):
  showinstatustime: 750,
  /*
     Im folgenden Abschnitt die abzufragenden Dienste eintragen
       type:0 -> ausgeblendet, 
       type:1 -> wird angezeigt, aber nicht bei "Alle markierten Dienste abfragen" benutzt,
       type:2 -> wird angezeigt und bei "Alle markierten Dienste abfragen" benutzt
  */
  usedServices: [
   {
     label: "BotScout",
     address: "http://botscout.com/ipcheck.htm?ip=",
     id: "ucjs_sbis_botscout",
     type: 2
   },
   {
     label: "Stop Forum Spam",
     address: "http://www.stopforumspam.com/ipcheck/",
     id: "ucjs_sbis_stopforumspam",
     type: 2
   },
   {
     label: "Project Honey Pot",
     address: "http://www.projecthoneypot.org/ip_",
     id: "ucjs_sbis_projecthoneypot",
     type: 2
   },
   {
     label: "Info Sniper",
     address: "http://www.infosniper.net/index.php?ip_address=",
     id: "ucjs_sbis_infosniper",
     type: 1
   },
  ],
  // Ende der Konfiguration

  init: function () {
    if (location != "chrome://browser/content/browser.xul") return;
    var css = " \
      .ucjs_sbis_type2 { \
        list-style-image: url('chrome://mozapps/skin/extensions/rating-not-won.png') !important; \
      }";
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri,sss.AGENT_SHEET);

    var menu = document.createElement("menu");
    menu.setAttribute("id", "ucjs_sbis_menu");
    menu.setAttribute("label", "Spam by IP Searcher");
    // Im Kontexmenue vor "Auswahl-Quelltext anzeigen" einfuegen:
    var target = document.getElementById("context-viewpartialsource-selection"); 
    target.parentNode.insertBefore(menu, target);
    var popup = menu.appendChild(this.createME("menupopup",0,0,0,"ucjs_sbis_popup"));
    var c = 0;
    for (var i = 0; i < this.usedServices.length; i++) {
      if (this.usedServices[i]["type"] > 0) {
        popup.appendChild(this.createME("menuitem",this.usedServices[i]["label"],
                                        "ucjs_SpamByIpSearcher.openservice('"+this.usedServices[i]["address"]+"');",
                                        "ucjs_sbis_type"+ this.usedServices[i]["type"] + " menuitem-iconic",
                                        this.usedServices[i]["id"]));
      if (this.usedServices[i]["type"] > 1) c++;
      }
    }
    if (c > 1) {
      popup.appendChild(document.createElement('menuseparator'));
      popup.appendChild(this.createME("menuitem","Alle markierten Dienste abfragen",
                                      "ucjs_SpamByIpSearcher.openmarkedservices();",
                                      "ucjs_sbis_typeall menuitem-iconic",
                                      "ucjs_sbis_searchall"));
    }
  },

  openservice: function(address) {
    var selected_ip = this.get_ip();
    if (selected_ip == -1 && this.showinstatustime > 0) {
      XULBrowserWindow.statusTextField.label ='Keine IP im markierten Text?';
      setTimeout(function(){XULBrowserWindow.statusTextField.label ='';},this.showinstatustime);
     } else {
      XULBrowserWindow.statusTextField.label =''
    }
    if (selected_ip != -1){
      var address_with_ip = address+selected_ip;
      if (this.openServicesInBackground) {
        getBrowser().addTab(address_with_ip); 
       } else {
        getBrowser().selectedTab = getBrowser().addTab(address_with_ip); 
     }
    }
  },

  openmarkedservices: function() {
    var selected_ip = this.get_ip();
    if (selected_ip == -1 && this.showinstatustime>0) {
      XULBrowserWindow.statusTextField.label ='Keine IP im markierten Text?';
      setTimeout(function(){XULBrowserWindow.statusTextField.label ='';},this.showinstatustime);
     } else {
      XULBrowserWindow.statusTextField.label =''
    }
    if (selected_ip != -1){
      for (var i = 0; i < this.usedServices.length; i++) {
        if (this.usedServices[i]["type"] > 1) {
          var address_with_ip = this.usedServices[i]["address"]+selected_ip;
          if (this.openServicesInBackground) {
            getBrowser().addTab(address_with_ip); 
           } else {
            getBrowser().selectedTab = getBrowser().addTab(address_with_ip);
          }
        }
      }
    }
  },

  get_ip: function() {
    var filter= /(?:\d{1,3}\.){3}\d{1,3}/
    var focused_window = document.commandDispatcher.focusedWindow;
    var sel_text = focused_window.getSelection();
    try {
      var ret_ip=filter.exec(sel_text.toString())[0];
     }
     catch (ex) {
      ret_ip=-1;
     }
    return ret_ip;
  },

  createME:function(sTyp,sLabel,sCommand,sClass,sId) {
    // Anlegen von menuitem oder menupop - fuer bestimmte Typen nicht eingesetzte Parameter werden als 0 uebergeben
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var m = document.createElementNS(XUL_NS, sTyp);
    switch (sTyp) {
      case "menuitem":
        // this.createME("menuitem","Label des Items","ZuzuweisenderCodeFueroncommand","GewuenschteKlasseDesItems","GewuenschteIdDesItems")
        m.setAttribute('label', sLabel);
        m.setAttribute('oncommand',sCommand);
        m.setAttribute('class',sClass);
        m.setAttribute('id',sId);
        break;
      case "menupopup":
        //this.createME("menupopup",0,0,0,"GewuenschteIdDesMenupopups");
        m.setAttribute('id', sId);
        break;
    }
    return m;
  },
}

ucjs_SpamByIpSearcher.init();
