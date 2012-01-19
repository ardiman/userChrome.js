// ==UserScript==
// @name           tabLockLite.uc.js
// @namespace      http://www.slimeden.com/2010/09/firefox/lockandprotectapptab
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    tabLock
// @compatibility  Firefox 4.*
// @author         Alice0775, Xiao Shan
// @version        2011/03/17 customized by Xiao Shan
// @version        2010/09/15 20:00  4.0.b7pre stack by alice0775
//  browser.tabs.loadInBackground           [true]/false
//  browser.tabs.loadBookmarksInBackground  true/[false]

patch: {
  if (location.href == "chrome://updatescan/content/updatescan.xul") {
    var func = USc_updatescan._diffItemThisWindow.toString();
    func = func.replace(
      'if (diffURL) {',
      <><![CDATA[
      $&
      var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                         .getService(Components.interfaces.nsIWindowMediator);
      var mainWindow = wm.getMostRecentWindow("navigator:browser");
      if (mainWindow.gBrowser.isLockTab(mainWindow.gBrowser.selectedTab) &&
          !/^\s*(javascript:|data:)/.test(diffURL)) {
        mainWindow.gBrowser.loadOneTab(diffURL, null, null, null, false, null);
        return;
      }
      ]]></>
    );
    eval ("USc_updatescan._diffItemThisWindow = " + func);
  }

if(location.href != "chrome://browser/content/browser.xul")
    break patch;



window.tabLock = {
    ignoreHashLink: true, 

    //whether allow forward/back when locked up 
    // 0: allow to forward/back in current tab
    // 1: open a new tab loading forwarded/backed page
    // 2: locked completed
    ignoreBrowserBackForward: 2, 

    init: function() {
        /* prevent load a new url in current tab when current tab is locked up, a new tab will be opened */
        var func = window.loadURI.toString();
        func = func.replace(/(getBrowser\(\)|gBrowser)\.loadURIWithFlags/,
            <><![CDATA[
                if (gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(uri)) {
                    gBrowser.loadOneTab(uri, referrer, null, postData, false, flags);
                    return;
                }
                $&
            ]]></>
        );
        eval("window.loadURI="+func);

        /* prevent forward/back when locked up */
        function forwardBackHandler() {
            try {
                var ignoreBrowserBackForward;
                try {
                    ignoreBrowserBackForward = gPrefService.getIntPref("userChrome.tabLock.ignoreBrowserBack_Forward");
                }catch(e){ ignoreBrowserBackForward = tabLock.ignoreBrowserBackForward; }

                if(gBrowser.selectedTab.hasAttribute("locked") || gBrowser.isLockTab(gBrowser.selectedTab)) {
                    switch(ignoreBrowserBackForward) {
                        case 0:
                            break;
                        case 1:
                            var method = arguments.callee.name;//buggy
                            var delta = 0;
                            switch(method) {
                                case "BrowserBack":
                                    delta = -1;
                                    break;
                                case "BrowserForward":
                                    delta = 1;
                                    break;
                                case "gotoHistoryIndex":
                                    delta = index - gBrowser.sessionHistory.index;
                                    break;
                            }
                            duplicateTabIn(gBrowser.selectedTab, "tab", delta);
                            return true;
                        case 2:
                            return false;
                    }
                }
            }catch(e){}
        }
        eval("BrowserForward = " + BrowserForward.toString().replace(/{/, "$&"+forwardBackHandler.toString().replace(/^function.*|}$/g, "")));
        eval("BrowserBack = " + BrowserBack.toString().replace(/{/, "$&"+forwardBackHandler.toString().replace(/^function.*|}$/g, "")));
        eval("gotoHistoryIndex = " + gotoHistoryIndex.toString().replace(/var where = whereToOpenLink\(aEvent\);/, forwardBackHandler.toString().replace(/^function.*|}$/g, "")+"$&"));////forward/back dropDown

        eval("openLinkIn =" + openLinkIn.toString().replace(/switch\s*\(where\)\s*{/,
            <><![CDATA[
                if (where == "current" && gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(url) ) {
                    where = "tab";
                }
                $&
            ]]></>
        ));

        
        // urlbar
        var func = gURLBar.handleCommand.toString();
        func = func.replace('if (aTriggeringEvent instanceof MouseEvent) {',
                <><![CDATA[
                    if (aTriggeringEvent instanceof MouseEvent) {
                        if (aTriggeringEvent.button != 2 && (aTriggeringEvent.button == 1 || (aTriggeringEvent.button ==0 && aTriggeringEvent.ctrlKey) || gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(url))) {
                            this.handleRevert();
                            content.focus();
                            try {
                                var loadInBackground = gPrefService.getBoolPref("browser.tabs.loadInBackground");
                            }catch(ex) {
                                var loadInBackground = false;
                            }
                            gBrowser.loadOneTab(url, null, null, postData, loadInBackground, true);
                            aTriggeringEvent.preventDefault();
                            aTriggeringEvent.stopPropagation();
                            return;
                        }
                ]]></>
        );
      
        func = func.replace('if (aTriggeringEvent && aTriggeringEvent.altKey) {',
            <><![CDATA[
                if (aTriggeringEvent && aTriggeringEvent.altKey || gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(url) ){
            ]]></>
        );
      
        func = func.replace('loadURI(url, null, postData, true);',
            <><![CDATA[
                if (aTriggeringEvent && gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(url)) {
                    this.handleRevert();
                    content.focus();
                    try {
                        var loadInBackground = gPrefService.getBoolPref("browser.tabs.loadInBackground");
                    }catch(ex){
                        var loadInBackground = false;
                    }
                    gBrowser.loadOneTab(url, null, null, postData, loadInBackground, true);
                    aTriggeringEvent.preventDefault();
                    aTriggeringEvent.stopPropagation();
                    return;
                }
                $&
            ]]></>
        );
        eval("gURLBar.handleCommand =" + func);

        // left click (Home Button, WizzRSS)
        eval("gBrowser.loadURI =" + gBrowser.loadURI.toString().replace('{',
            <><![CDATA[
                {
                    if (gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(aURI)){
                    try {
                        var loadInBackground = gPrefService.getBoolPref("browser.tabs.loadBookmarksInBackground");
                    }catch(ex) {
                        var loadInBackground = false;
                    }
                    return gBrowser.loadOneTab(aURI, null, null, null, loadInBackground, false );
                }
            ]]></>
        ));

        //Bookmark, History, searchBar, D&D form sidebar and from outside window.
        eval("loadURI ="+loadURI.toString().replace('getWebNavigation',
            <><![CDATA[
                if(gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(uri)){
                    try{
                        var loadInBackground = gPrefService.getBoolPref("browser.tabs.loadBookmarksInBackground");
                    }catch(ex){
                        var loadInBackground = false;
                    }
                    gBrowser.loadOneTab(uri, null, null, postData, loadInBackground, true );
                }else
                $&
                ]]></>
        ));

        //link click, through the event to window.handleLinkClick.
        var func = contentAreaClick.toString();
        func = func.replace('!event.altKey && !event.metaKey) {',
            <><![CDATA[
                !event.altKey && !event.metaKey && !(gBrowser.isLockTab(gBrowser.selectedTab) && !/^\s*(javascript:|data:)/.test(href) && !gBrowser.isHashLink(linkNode) ) ) {
            ]]></>
        );
        eval("contentAreaClick ="+func);

        //link click
        eval("handleLinkClick = " + handleLinkClick.toString().replace(/{/, 
            <><![CDATA[
                $&
                if(!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && gBrowser.isLockTab(gBrowser.selectedTab) && !gBrowser.isHashLink(linkNode)) {
                    openNewTabWith(href, doc, null, event, false);
                    event.preventDefault();
                    event.stopPropagation();
                    return true;
                }
            ]]></>
        ));

        //D&D on TAB
        func = gBrowser.swapBrowsersAndCloseOther.toString();
        func = func.replace(/}$/,
            <><![CDATA[
                if (aOtherTab.hasAttribute("tabLock")) {
                    aOurTab.setAttribute("tabLock", true);
                    gBrowser.lockTabIcon(aOurTab);
                }
                $&
            ]]></>
        );
        eval("gBrowser.swapBrowsersAndCloseOther = "+ func);
        
        //link drop
        gBrowser.tabContainer.addEventListener('drop', this.onDrop, true);

        this.tabContextMenu();

        var that = this;
        setTimeout(function(){
            that.restoreForTab(gBrowser.selectedTab);
        },0);
        init(0);
        function init(i){
            if(i < gBrowser.mTabs.length){
                var aTab = gBrowser.mTabs[i];
                if(aTab.linkedBrowser.docShell.busyFlags || aTab.linkedBrowser.docShell.restoringDocument) {
                    setTimeout(init,1000,i);
                } else {
                    that.restoreForTab(aTab);
                    i++;
                    setTimeout(init,0,i);
                }
            } else{ }
        }

        gBrowser.tabContainer.addEventListener('TabMove', tabLock.TabMove, false);
        gBrowser.tabContainer.addEventListener('SSTabRestored', tabLock.restore,false);
        window.addEventListener('unload',function(){ tabLock.uninit();},false)
    },

    uninit: function(){
        gBrowser.tabContainer.removeEventListener('drop', this.onDrop, true);
        gBrowser.tabContainer.removeEventListener('TabMove', tabLock.TabMove, false);
        gBrowser.tabContainer.removeEventListener('SSTabRestored', tabLock.restore,false);
    },

    //TAB D&D
    onDrop: function(event) {
        var helper = document.getElementById("tabbrowser-tabs");

        var dt = event.dataTransfer;
        var dropEffect = dt.dropEffect;
        var draggedTab;
        if (dropEffect != "link") { // copy or move
          draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
          // not our drop then
          if (!draggedTab)
            return;
        }

        helper._tabDropIndicator.collapsed = true;
        event.stopPropagation();

        if (draggedTab && (dropEffect == "copy" ||
            draggedTab.parentNode == helper)) {
          let newIndex = helper._getDropIndex(event);
          if (dropEffect == "copy") {
            // copy the dropped tab (wherever it's from)
            let newTab = helper.tabbrowser.duplicateTab(draggedTab);
            helper.tabbrowser.moveTabTo(newTab, newIndex);
            if (draggedTab.parentNode != helper || event.shiftKey)
              helper.selectedItem = newTab;
          } else {
            // move the dropped tab
            if (newIndex > draggedTab._tPos)
              newIndex--;

            if (draggedTab.pinned) {
              if (newIndex >= helper.tabbrowser._numPinnedTabs)
                helper.tabbrowser.unpinTab(draggedTab);
            } else {
              if (newIndex <= helper.tabbrowser._numPinnedTabs - 1)
                helper.tabbrowser.pinTab(draggedTab);
            }

            helper.tabbrowser.moveTabTo(draggedTab, newIndex);
          }
        } else if (draggedTab) {
          // swap the dropped tab with a new one we create and then close
          // it in the other window (making it seem to have moved between
          // windows)
          let newIndex = helper._getDropIndex(event);
          let newTab = helper.tabbrowser.addTab("about:blank");
          let newBrowser = helper.tabbrowser.getBrowserForTab(newTab);
          // Stop the about:blank load
          newBrowser.stop();
          // make sure it has a docshell
          newBrowser.docShell;

          helper.tabbrowser.moveTabTo(newTab, newIndex);

          helper.tabbrowser.swapBrowsersAndCloseOther(newTab, draggedTab);

          // We need to select the tab after we've done
          // swapBrowsersAndCloseOther, so that the updateCurrentBrowser
          // it triggers will correctly update our URL bar.
          helper.tabbrowser.selectedTab = newTab;
        } else {
          let url = browserDragAndDrop.drop(event, { });

          // valid urls don't contain spaces ' '; if we have a space it isn't a valid url.
          // Also disallow dropping javascript: or data: urls--bail out
          if (!url || !url.length || url.indexOf(" ", 0) != -1 ||
              /^\s*(javascript|data):/.test(url))
            return;

          let bgLoad = Services.prefs.getBoolPref("browser.tabs.loadInBackground");

          if (event.shiftKey)
            bgLoad = !bgLoad;

          let tab = helper._getDragTargetTab(event);
          if (!tab || dropEffect == "copy") {
            // We're adding a new tab.
            let newIndex = helper._getDropIndex(event);
            let newTab = helper.tabbrowser.loadOneTab(getShortcutOrURI(url), {inBackground: bgLoad});
            helper.tabbrowser.moveTabTo(newTab, newIndex);
          } else {
            /* hacked here */
            if(gBrowser.isLockTab(tab)) {
                gBrowser.loadOneTab(getShortcutOrURI(url), null, null, null, bgLoad, false);
            }

            // Load in an existing tab.
            try {
              helper.tabbrowser.getBrowserForTab(tab).loadURI(getShortcutOrURI(url));
              if (!bgLoad)
                helper.selectedItem = tab;
            } catch(ex) {
              // Just ignore invalid urls
            }
          }
        }
    },

    TabMove: function (aEvent){
        var aTab = aEvent.target;
        gBrowser.lockTabIcon(aTab);
    },

    tabContextMenu: function(){
        //tab context menu
        var tabContext = document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu") || gBrowser.tabContainer.contextMenu;
        var menuitem = this.tabLockMenu = tabContext.appendChild(document.createElement("menuitem"));
        menuitem.id = "tabLock";
        menuitem.setAttribute("type", "checkbox");
        menuitem.setAttribute("label", "Diesen Tab sperren");
        menuitem.setAttribute("accesskey", "s");
        menuitem.setAttribute("oncommand","tabLock.toggle(event);");
        tabContext.addEventListener('popupshowing',function(event){tabLock.setCheckbox(event);},false);
    },

    restore: function(event){
        var aTab =  event.target;
        tabLock.restoreForTab(aTab);
    },

    restoreForTab: function(aTab){
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        var retrievedData = ss.getTabValue(aTab, "tabLock");
        if(retrievedData) {
            aTab.setAttribute('tabLock',true);
        } else {
            if(aTab.hasAttribute("tabLock")) {
                aTab.removeAttribute("tabLock");
            }
        }
        gBrowser.lockTabIcon(aTab);
    },

    checkCachedSessionDataExpiration : function(aTab) {
        var data = aTab.linkedBrowser.__SS_data || // Firefox 3.6-
                aTab.linkedBrowser.parentNode.__SS_data; // -Firefox 3.5
        if (data && data._tabStillLoading && aTab.getAttribute('busy') != 'true')
            data._tabStillLoading = false;
    },

    toggle: function(event){
        var aTab =  gBrowser.mContextTab || gBrowser.tabContainer._contextTab;
        if (!aTab) {
            aTab = event.target;
        }
        while( aTab && aTab instanceof XULElement && aTab.localName !='tab'){
            aTab = aTab.parentNode;
        }
        if( !aTab || aTab.localName !='tab') return;
        gBrowser.lockTab(aTab);
    },

    toggleLockSelectedTabs: function(){
        var tabs = MultipleTabService.getSelectedTabs();
        gBrowser.lockTab(tabs[0]);
        //var isLockFirstTab = gBrowser.isLockTab(tabs[0]);
        for (var i= 1; i < tabs.length; i++) {
            //if (isLockFirstTab != gBrowser.isLockTab(tabs[i]))
            gBrowser.lockTab(tabs[i]);
        }
    },

    setCheckbox: function(event){
        var menuitem = this.tabLockMenu;
        var aTab =  gBrowser.mContextTab || gBrowser.tabContainer._contextTab;
        if (!aTab) {
            aTab = event.target;
        }
        while( aTab && aTab instanceof XULElement && aTab.localName !='tab'){
            aTab = aTab.parentNode;
        }
        if( !aTab || aTab.localName !='tab') {
            menuitem.setAttribute('hidden',true);
            return;
        }
        menuitem.setAttribute('hidden',false);
        if(aTab.hasAttribute('tabLock') && aTab.getAttribute('tabLock')){
            menuitem.setAttribute('checked', true);
        }else {
            menuitem.setAttribute('checked', false);
        }
    },
}

if(!('TM_init' in window)) {
    gBrowser.isLockTab = function (aTab){
       return aTab.hasAttribute("tabLock");
    }

    gBrowser.lockTab = function (aTab){
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        if ( aTab.hasAttribute("tabLock") ){
            aTab.removeAttribute("tabLock");
            tabLock.checkCachedSessionDataExpiration(aTab);
            ss.deleteTabValue(aTab, "tabLock");
            var isLocked = false;
        }else{
            aTab.setAttribute("tabLock", "true");
            ss.setTabValue(aTab, "tabLock", true);
            var isLocked = true;
        }
        this.lockTabIcon(aTab);
        return isLocked;
    }

    gBrowser.lockTabIcon = function (aTab){
        const kXULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        var image = document.getAnonymousElementByAttribute(aTab, "class", "tab-icon-lock");
        if(aTab.hasAttribute("tabLock")){
            if(!image){
                var siteIcon = document.getAnonymousElementByAttribute(aTab, "class", "tab-icon-image");
                image = document.createElementNS(kXULNS,'image');
                image.setAttribute('class','tab-icon-lock');
                if(siteIcon) siteIcon.parentNode.insertBefore(image, siteIcon.nextSibling);
            }
            image.removeAttribute('hidden');
            aTab.setAttribute('class',aTab.getAttribute('class')+' tabLock');
        } else {
            if(image){
                image.setAttribute('hidden', true);
            }
            aTab.setAttribute('class',aTab.getAttribute('class').replace(/\stabLock/g,''));
        }
    }

    gBrowser.isHashLink = function (aNode){
        var ignoreHashLink = tabLock.ignoreHashLink;
        try {
            ignoreHashLink = Services.prefs.getBoolPref('userChrome.tabLock.ignoreHashLink');
        }catch(e) { ignoreHashLink = tabLock.ignoreHashLink; }

        if(!ignoreHashLink || !aNode) return false;
      
        var b = gBrowser.getBrowserForDocument(aNode.ownerDocument);
        if (!b || b.docShell.busyFlags || b.docShell.restoringDocument)
            return false;

        if (aNode.href && aNode.hash && aNode.ownerDocument && aNode.ownerDocument.location) {
            var doc = aNode.ownerDocument;
            var docprotocol = doc.location.protocol;
            var dochostname = doc.location.hostname;
            var docport = doc.location.port;
            var docpathname = doc.location.pathname;
            if(docprotocol == aNode.protocol && dochostname == aNode.hostname && docport == aNode.port && docpathname == aNode.pathname) {
                return true;
            }
        }
        return false;
    }
    
}

    if(!('TM_init' in window)) {
        tabLock.init();
    }
}