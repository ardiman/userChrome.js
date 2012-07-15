// ==UserScript==
// @description     OpenNewTab.uc.js
// @description     Lesezeichen, Chronik, Searchbar, Urlbar in neuen Tabs
// @include		    chrome://browser/content/browser.xul
// @include 		chrome://browser/content/bookmarks/bookmarksPanel.xul
// @include 		chrome://browser/content/history/history-panel.xul
// @include 		chrome://browser/content/places/places.xul
// @compatibility	Firefox 13
// ==/UserScript==

    if (location == "chrome://browser/content/browser.xul") {

    /*======= Clear the searchbar after submit & open in new fg tab or current tab if empty (browser.search.openintab = false) =======*/

    // search.xml
    var ucSearchbar = {
       init: function() {
          this.searchbar = document.getElementById("searchbar");
          if (!this.searchbar) return;
          var str = this.searchbar.handleSearchCommand.toString().replace('this.d','if (where == "current" && !isTabEmpty(gBrowser.selectedTab)) where = "tab"; setTimeout("ucSearchbar.searchbar.value=\'\';",0); $&');
          eval("ucSearchbar.searchbar.handleSearchCommand = " + str);
       }
    };
    ucSearchbar.init();
    eval("BrowserToolboxCustomizeDone = " + BrowserToolboxCustomizeDone.toString().replace('focus();','$& ucSearchbar.init();'));


    /*======= Open urlbar queries in new fg tab or in current tab if empty =======*/

    // urlbarBindings.xml
    (function() {
    var urlbar = document.getElementById("urlbar");
    var str = gURLBar.handleCommand.toString();
    str = str.replace(/^\s*(load.+);/gm,"/^javascript:/.test(url)||content.location=='about:blank'?$1:gBrowser.loadOneTab(url, {postData: postData, inBackground: false, allowThirdPartyFixup: true});");
    eval("gURLBar.handleCommand= " + str);


    /*======= Open bookmark-menu, Library & bookmarks/history sidebar URIs in new fg tab or in current tab if empty =======*/

    // modules\PlacesUIUtils.jsm
    if (typeof PlacesUIUtils.aa == 'undefined') {
       PlacesUIUtils.aa = true;
       PlacesUIUtils.pu = PlacesUtils;
       str = PlacesUIUtils._openNodeIn.toString().replace('PlacesUtils','this.pu','g');
       str = str.replace('aWindow.','var browserWin = this._getTopBrowserWin(); if (browserWin) { if (!browserWin.isTabEmpty(browserWin.gBrowser.selectedTab) && !/^j/.test(aNode.uri) && aWhere == "current") aWhere = "tab"; } $&');   //http://forums.mozillazine.org/viewtopic.php?p=3201065#3201065
       eval("PlacesUIUtils._openNodeIn = " + str);
       str = PlacesUIUtils._openTabset.toString().replace('ue;','$& if (!browserWindow.isTabEmpty(browserWindow.gBrowser.selectedTab)) replaceCurrentTab = false;');
       eval("PlacesUIUtils._openTabset = " + str);
    }
    })();


    /*======= Open history-menu URIs in new fg tab or in current tab if empty =======*/

    // browser.js
    eval("HistoryMenu.prototype._onCommand = " + HistoryMenu.prototype._onCommand.toString().replace("uri);","$& if (!isTabEmpty(gBrowser.selectedTab) && (aEvent == null || (!aEvent.ctrlKey && !aEvent.shiftKey && !aEvent.altKey))) { gBrowser.selectedTab = gBrowser.addTab(); }"));


    /*======= Open external app links in new tab or in current tab if empty =======*/

    // browser.js
    // only applies if browser.link.open_newwindow = 3
    eval('nsBrowserAccess.prototype.openURI = ' + nsBrowserAccess.prototype.openURI.toString().replace("switch","if (isExternal && aWhere == Ci.nsIBrowserDOMWindow.OPEN_NEWTAB && isTabEmpty(gBrowser.selectedTab)) aWhere = Ci.nsIBrowserDOMWindow.OPEN_CURRENTWINDOW; $&"));

    } //chrome://browser/content/browser.xul

