// ==UserScript==
// @name            NewTabPlus.uc.js
// @description     新しいタブで開く（空白タブを利用）
// @include         main
// @include         chrome://browser/content/bookmarks/bookmarksPanel.xul
// @include         chrome://browser/content/history/history-panel.xul
// @include         chrome://browser/content/places/places.xul
// @compatibility   Firefox 20
// ==/UserScript==
(function() {
    /* Lesezeichen und Chronik */
    try {
        eval('openLinkIn = ' + openLinkIn.toString().
        replace('w.gBrowser.selectedTab.pinned', '(!w.isTabEmpty(w.gBrowser.selectedTab) || $&)').
        replace(/&&\s+w\.gBrowser\.currentURI\.host != uriObj\.host/, ''));
    }catch(e){}

    /* Adressleiste */
    try {
        location == 'chrome://browser/content/browser.xul' && 
        eval('gURLBar.handleCommand = ' + gURLBar.handleCommand.toString().
        replace(/^\s*(load.+);/gm, '\
            if(/^javascript:/.test(url) || isTabEmpty(gBrowser.selectedTab)){\
                loadCurrent();\
            }else{\
                this.handleRevert();\
                gBrowser.loadOneTab(url,{postData:postData,inBackground:false,allowThirdPartyFixup:true});\
            }\
        '));
    }catch(e){}
	
    /* Suchleiste: Dieser Abschnitt ist noch nicht für den Fuchs 20 geändert! */
    try {
        var searchbar = document.getElementById("searchbar");
        eval("searchbar.handleSearchCommand="+searchbar.handleSearchCommand.
            toString().replace(/this.doSearch\(textValue, where\);/,
            "if (!gBrowser.webProgress.isLoadingDocument && gBrowser.curren"
            +"tURI.spec=='about:blank') where='current'; else where='tab'; "
            +"$&"));
    }catch(e){}	

    /* Fokus auf die mittlere Maustaste */
    try {
        eval('whereToOpenLink = ' + whereToOpenLink.toString().
        replace(/ \|\| \(?middle && middleUsesTabs\)\)?/, ')').
        replace('if (alt', 'if (middle && middleUsesTabs) return shift ? "tab" : "tabshifted";\n\n  $&'));
    }catch(e){}

    /* Tab schließen durch Doppelklick */
    try {
        location == 'chrome://browser/content/browser.xul' && 
        gBrowser.mTabContainer.addEventListener('dblclick', function(event){
            if(event.target.localName == 'tab' && event.button == 0) gBrowser.removeCurrentTab();
        }, false);
    }catch(e){}
})();