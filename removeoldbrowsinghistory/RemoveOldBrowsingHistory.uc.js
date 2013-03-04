// ==UserScript==
// @name           removeOldBrowsingHistory.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    removeOldBrowsingHistory
// @include        main
// @compatibility  Firefox 17+
// @author         Alice0775
// @version        2013/03/03 00:00 
// ==/UserScript==
(function() {
  // Zeitraum für Löschen des Browser Verlaufs
  var dMax = 7; //Tage
  // in Microsekunden
  var aBeginTime = Date.now()*1000 - 10 * 365 * 24 * 3600000000; //10 Jahre
  var aEndTime = Date.now()*1000 - dMax * 24 * 3600000000;
  PlacesUtils.history.QueryInterface(Components.interfaces.nsIBrowserHistory).
              removeVisitsByTimeframe(aBeginTime, aEndTime);
})();