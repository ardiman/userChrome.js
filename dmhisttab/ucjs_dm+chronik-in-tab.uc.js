<!--
// ==UserScript==
// @name           ucjs_dm+chronik-in-tab.uc.js
// @compatibility  Firefox 9.*
// @version        1.0.20120107
// ==/UserScript==
-->

/*
  Konfiguration des Tabverhaltens fuer Lesezeichen-, Download-, Historymanager
    tabMode 0=nicht veraendern, 1=Tab im Vordergrund, 2=Tab im Hintergrund, 3= als Fenster
*/
var configArray = [
  {tabMode: 3,
   searchedId: "bookmarksShowAll",
   label: "Lesezeichen-Manager",
   chromeUrl: "chrome://browser/content/places/places.xul"},
  {tabMode: 1,
   searchedId: "menu_openDownloads",
   label: "Download-Manager",
   chromeUrl: "chrome://mozapps/content/downloads/downloads.xul"},
  {tabMode: 2,
   searchedId: "menu_showAllHistory",
   label: "History-Manager",
   chromeUrl: "chrome://browser/content/history/history-panel.xul"},
];
// Ende der Konfiguration


// Das configArray durchlaufen und je nach gewaehltem tabMode/Manager agieren
for (var i = 0; i < this.configArray.length; i++) {
  wId=document.getElementById(configArray[i]["searchedId"]);
  wId.setAttribute("command", null);
  switch (configArray[i]["tabMode"]) {
    case 1:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = getBrowser().addTab('"+configArray[i]['chromeUrl']+"'));");
      break;
    case 2:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = getBrowser().addTab('"+configArray[i]['chromeUrl']+"').label = '"+configArray[i]['label']+"');");
      break;
    case 3:
      wId.setAttribute("oncommand", "(getBrowser().selectedTab = window.open('"+configArray[i]['chromeUrl']+"'))");
      break;
  }
}