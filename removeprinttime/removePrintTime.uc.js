// ==UserScript==
// @name           removePrintTime.uc.js
// @compatibility  Firefox 35.*
// @include        main
// @version        1.0.20120318
// ==/UserScript==

var removePrintTime = {
  // Beginn der Konfiguration (der Druckername muss bestimmt geändert werden)
  printerNames: ['printer_Drucker_A', 'printer_Drucker_B', 'printer_Drucker_C'],
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
    var Datummuster = /^(31|30|[012]\d|\d)\.(0\d|1[012]|\d)\.(\d{1,4})$/;   
    for (var j = 0; j < this.printerNames.length; j++) {
      var printerName = this.printerNames[j];
      for (var i = 0; i < this.searchInPrefs.length; i++) {
        var iPref = 'print.' + printerName + '.' + this.searchInPrefs[i];
        var vPref = prefManager.getCharPref(iPref);
        if (vPref == "&D" || Datummuster.test(vPref)) {
          prefManager.setCharPref(iPref, d);
        }
      }
    }
  }
};
removePrintTime.init();
