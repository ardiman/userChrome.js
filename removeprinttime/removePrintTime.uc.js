<!--
// ==UserScript==
// @name           removePrintTime.uc.js
// @compatibility  Firefox 10.*
// @include        main
// @version        1.0.20120224
// ==/UserScript==
-->

var removePrintTime = {
  // Beginn der Konfiguration (der Druckername muss bestimmt geändert werden)
  printerName: 'printer_Brother_HL-2170W_series',
  // Ende der Konfiguration
  searchInPrefs: ['print_footerright','print_footercenter','print_footerleft','print_headerright','print_headercenter','print_headerleft'],

  init: function() {
    var D = new Date();
    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var month = months[D.getMonth()];
    var year = D.getFullYear();
    var datString= ((D.getDate()<10) ? "0" : "") + D.getDate() + "."+ month + "." + year;
    this.setDate(datString);
  },
  setDate: function(d) {
    var prefManager = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
    for (var i = 0; i < this.searchInPrefs.length; i++) {
     var iPref=this.printerName+'.'+this.searchInPrefs[i];
     if (prefManager.getCharPref(iPref) == "&D") {
       prefManager.setCharPref(iPref, d);
     }
    }
  }
};
removePrintTime.init();