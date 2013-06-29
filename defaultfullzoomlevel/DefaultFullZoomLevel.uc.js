// ==UserScript==
// @name       DefaultFullZoomLevel.uc.js
// ==/UserScript==
var FullZoomConfig = new
function() {
    this.defaultLv = 100;
    this.Textmode = false;
    this.localFolderSpecific = true;
    this.fitToWidth = false;
    this.forceFitToWidth = false;
    this.fitToWidthPreserveTextSize = false;
    this.reserveSidebarWidth = true;
    this.maximum = 300;
    this.minimum = 30;
    this.ignoreImageDocument = true;
    this.zoomValues = "0.3,0.5,0.67,0.8,0.9,1,1.2,1.3,1.4,1.5,1.7,2,2.4,3";
    this.fitToWindow = "An Fenstergröße anpassen";
    this.reset = "Zurücksetzen";
}
var FullZoom = {
    name: "browser.content.full-zoom",
    mode: "browser.content.full-mode",
    auto: "browser.content.full-AutoFit",
    lastInnerWidth: 0,
    get globalValue() {
        var globalValue = FullZoomConfig.defaultLv;
        return this.globalValue = globalValue / 100;
    },
    get globalMode() {
        var globalMode = !FullZoomConfig.Textmode;
        if (typeof globalMode == "undefined") globalMode = true;
        delete this.globalMode;
        return this.globalMode = globalMode;
    },
    get globalAuto() {
        var globalAuto = FullZoomConfig.fitToWidth;
        if (typeof globalAuto == "undefined") globalAuto = false;
        delete this.globalAuto;
        return this.globalAuto = globalAuto;
    },
    get forceFitToWidth() {
        var forceFitToWidth = FullZoomConfig.forceFitToWidth;
        return this.forceFitToWidth = forceFitToWidth;
    },
    get ignoreImageDocument() {
        var ignoreImageDocument = FullZoomConfig.ignoreImageDocument;
        return this.ignoreImageDocument = ignoreImageDocument;
    },
    getContentPrefs: function getContentPrefs(aWindow) {
        Cu.import('resource://gre/modules/ContentPrefInstance.jsm');
        let context = aWindow ? aWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsILoadContext) : null;
        return new ContentPrefInstance(context);
    },
    get _cps() {
        delete this._cps;
        if (fullZoomBtn.getVer() >= 19) return this._cps = this.getContentPrefs(gBrowser.contentDocument.defaultView);
        else return this._cps = Cc["@mozilla.org/content-pref/service;1"].getService(Ci.nsIContentPrefService);
    },
    get _prefBranch() {
        delete this._prefBranch;
        return this._prefBranch = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch2);
    },
    _siteSpecificPref: undefined,
    updateBackgroundTabs: undefined,
    _inPrivateBrowsing: false,
    get siteSpecific() {
        return ! this._inPrivateBrowsing && this._siteSpecificPref;
    },
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIDOMEventListener, Ci.nsIObserver, Ci.nsIContentPrefObserver, Ci.nsISupportsWeakReference, Ci.nsISupports]),
    init: function FullZoom_init() {
        window.addEventListener("DOMMouseScroll", this, false);
        document.getElementById("cmd_fullZoomReset").setAttribute("oncommand", "FullZoom.resetZoom()");
        document.getElementById("cmd_fullZoomToggle").setAttribute("oncommand", "FullZoom.toggleZoom()");
        this._cps.addObserver(this.name, this);
        this._cps.addObserver(this.mode, this);
        let os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
        os.addObserver(this, "private-browsing", true);
        try {
            this._inPrivateBrowsing = Cc["@mozilla.org/privatebrowsing;1"].getService(Ci.nsIPrivateBrowsingService).privateBrowsingEnabled;
        } catch(e) {
            this._inPrivateBrowsing = false;
        }
        this._siteSpecificPref = this._prefBranch.getBoolPref("browser.zoom.siteSpecific");
        this.localFolderSpecific = FullZoomConfig.localFolderSpecific;
        try {
            this.updateBackgroundTabs = this._prefBranch.getBoolPref("browser.zoom.updateBackgroundTabs");
        } catch(e) {}
        this._prefBranch.addObserver("browser.zoom.", this, true);
        if (gBrowser.mTabs.length == 1) {
            this.onLocationChange(gBrowser.currentURI, true, gBrowser.selectedBrowser);
        }
    },
    destroy: function FullZoom_destroy() {
        let os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
        try {
            os.removeObserver(this, "private-browsing");
        } catch(e) {}
        this._prefBranch.removeObserver("browser.zoom.", this);
        this._cps.removeObserver(this.name, this);
        this._cps.removeObserver(this.mode, this);
        window.removeEventListener("DOMMouseScroll", this, false);
        delete this._cps;
    },
    handleEvent: function FullZoom_handleEvent(event) {
        switch (event.type) {
        case "DOMMouseScroll":
            this._handleMouseScrolled(event);
            break;
        }
    },
    _handleMouseScrolled: function FullZoom__handleMouseScrolled(event) {
        var pref = "mousewheel";
        if (typeof MOUSE_SCROLL_IS_HORIZONTAL != 'undefined') {
            if (event.scrollFlags & MOUSE_SCROLL_IS_HORIZONTAL) pref += ".horizscroll";
        } else {
            if (event.axis == event.HORIZONTAL_AXIS) pref += ".horizscroll";
        }
        if (event.shiftKey) pref += ".withshiftkey";
        else if (event.ctrlKey) pref += ".withcontrolkey";
        else if (event.altKey) pref += ".withaltkey";
        else if (event.metaKey) pref += ".withmetakey";
        else pref += ".withnokey";
        pref += ".action";
        var isZoomEvent = false;
        try {
            isZoomEvent = (gPrefService.getIntPref(pref) == MOUSE_SCROLL_ZOOM);
        } catch(e) {}
        if (!isZoomEvent) return;
        window.setTimeout(function(self) {
            self._applySettingToPref()
        },
        0, this);
    },
    observe: function(aSubject, aTopic, aData) {
        switch (aTopic) {
        case "nsPref:changed":
            switch (aData) {
            case "browser.zoom.siteSpecific":
                this._siteSpecificPref = this._prefBranch.getBoolPref("browser.zoom.siteSpecific");
                break;
            case "browser.zoom.updateBackgroundTabs":
                this.updateBackgroundTabs = this._prefBranch.getBoolPref("browser.zoom.updateBackgroundTabs");
                break;
            }
            break;
        case "private-browsing":
            switch (aData) {
            case "enter":
                this._inPrivateBrowsing = true;
                break;
            case "exit":
                this._inPrivateBrowsing = false;
                break;
            }
            break;
        }
    },
    convURI: function(aURI) {
        const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
        if ( !! aURI && !this.localFolderSpecific) {
            if (/^file:/i.test(aURI.spec)) {
                var tmp = aURI.spec.split('/');
                tmp.pop();
                var url = tmp.join('/');
                aURI = ioService.newURI(url, null, null)
            }
        }
        return aURI;
    },
    onContentPrefSet: function FullZoom_onContentPrefSet(aGroup, aName, aValue) {
        var url = this.convURI(gBrowser.currentURI);
        if (aGroup == this._cps.grouper.group(url)) this._applyPrefToSetting(aName, aValue);
        else if (aGroup == null) {
            this.globalValue = this._ensureValid(aValue);
            if (!this._cps.hasPref(url, aName)) this._applyPrefToSetting(aName);
        }
    },
    onContentPrefRemoved: function FullZoom_onContentPrefRemoved(aGroup, aName) {
        var url = this.convURI(gBrowser.currentURI);
        if (aGroup == this._cps.grouper.group(url)) this._applyPrefToSetting(aName);
        else if (aGroup == null) {
            this.globalValue = undefined;
            if (!this._cps.hasPref(url, aName)) this._applyPrefToSetting(aName);
        }
    },
    onLocationChange: function FullZoom_onLocationChange(aURI, aIsTabSwitch, aBrowser) {
        if (!aURI || (aIsTabSwitch && !this.siteSpecific)) return;
        var aBrowser = aBrowser || gBrowser.selectedBrowser;
        aURI = this.convURI(aURI);
        if (this.ignoreImageDocument && aBrowser.contentDocument instanceof Ci.nsIImageDocument) {
            ZoomManager.setZoomForBrowser(aBrowser, 1.0);
        } else {
            if (!this.siteSpecific) {
                if (this.isAlreadyApplied(aBrowser)) {
                    var useFullAuto = this.getApplied(aBrowser);
                    var index = gBrowser.getBrowserIndexForDocument(aBrowser.contentDocument);
                    var aTab = gBrowser.mTabs[index];
                    var SavedURL = aTab.getAttribute("FullZoomAutoSavedURL");
                    if (this.globalAuto && useFullAuto && SavedURL != aURI.spec) {
                        if (aBrowser == gBrowser.selectedBrowser) fullZoomBtn.doFullZoomBy( - 1, true);
                    }
                } else {
                    var useFullZoom = this.globalMode;
                    ZoomManager.useFullZoom = useFullZoom;
                    ZoomManager.setZoomForBrowser(aBrowser, this.globalValue);
                    ZoomManager.useFullZoom = useFullZoom;
                    ZoomManager.useFullAuto = false;
                    this.setApplied(aBrowser);
                }
            } else {
                if (aURI.spec == "about:blank") {
                    this._applyPrefToSetting(this.mode, undefined, aBrowser);
                    this._applyPrefToSetting(this.name, undefined, aBrowser);
                    this._applyPrefToSetting(this.auto, undefined, aBrowser);
                    return;
                }
                this._applyPrefToSetting(this.mode, this._cps.getPref(aURI, this.mode), aBrowser);
                this._applyPrefToSetting(this.name, this._cps.getPref(aURI, this.name), aBrowser);
                this._applyPrefToSetting(this.auto, this._cps.getPref(aURI, this.auto), aBrowser);
                if (this.globalAuto && ZoomManager.useFullAuto) if (aBrowser == gBrowser.selectedBrowser && (typeof gBrowser.selectedBrowser.FullZoomAutoSavedURL == 'undefined' || gBrowser.selectedBrowser.FullZoomAutoSavedURL != aURI.spec)) {
                    fullZoomBtn.doFullZoomBy( - 1, true);
                    gBrowser.selectedBrowser.FullZoomAutoSavedURL = aURI.spec;
                }
            }
        }
        if (aBrowser == gBrowser.selectedBrowser) {
            fullZoomBtn.showZoomLevelInStatusbar();
        }
    },
    isAlreadyApplied: function FullZoom_isAlreadyApplied(aBrowser) {
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        var browser = aBrowser || gBrowser.selectedBrowser;
        var index = gBrowser.getBrowserIndexForDocument(browser.contentDocument);
        var aTab = gBrowser.mTabs[index];
        try {
            if ( !! ss.getTabValue(aTab, "FullZoomMode")) {
                return true;
            }
        } catch(ex) {
            return aTab.hasAttribute("FullZoomMode");
        }
    },
    getApplied: function FullZoom_getApplied(aBrowser) {
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        var browser = aBrowser || gBrowser.selectedBrowser;
        var index = gBrowser.getBrowserIndexForDocument(browser.contentDocument);
        var aTab = gBrowser.mTabs[index];
        var value, useFullZoom, useFullAuto;
        try {
            value = ss.getTabValue(aTab, "FullZoomLevel");
            useFullZoom = ss.getTabValue(aTab, "FullZoomMode") == 'true';
            useFullAuto = ss.getTabValue(aTab, "FullZoomAuto") == 'true';
        } catch(ex) {
            value = aTab.getAttribute("FullZoomLevel");
            useFullZoom = aTab.getAttribute("FullZoomMode") == 'true';
            useFullAuto = aTab.getAttribute("FullZoomAuto") == 'true';
        }
        ZoomManager.useFullZoom = useFullZoom;
        if (value) ZoomManager.setZoomForBrowser(browser, this._ensureValid(value));
        else ZoomManager.setZoomForBrowser(browser, this.globalValue);
        ZoomManager.useFullZoom = useFullZoom;
        ZoomManager.useFullAuto = useFullAuto;
        return useFullAuto;
    },
    setApplied: function FullZoom_setApplied(aBrowser) {
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        var browser = aBrowser || gBrowser.selectedBrowser;
        var index = gBrowser.getBrowserIndexForDocument(browser.contentDocument);
        var aTab = gBrowser.mTabs[index];
        try {
            ss.setTabValue(aTab, "FullZoomLevel", ZoomManager.getZoomForBrowser(browser));
            ss.setTabValue(aTab, "FullZoomMode", !!ZoomManager.useFullZoom);
            ss.setTabValue(aTab, "FullZoomAuto", !!ZoomManager.useFullAuto);
        } catch(ex) {}
        aTab.setAttribute("FullZoomLevel", ZoomManager.getZoomForBrowser(browser));
        aTab.setAttribute("FullZoomMode", !!ZoomManager.useFullZoom);
        aTab.setAttribute("FullZoomAuto", !!ZoomManager.useFullAuto);
        aTab.setAttribute("FullZoomAutoSavedURL", browser.currentURI.spec);
    },
    removeApplied: function FullZoom_removeApplied() {
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        var aTab = gBrowser.mCurrentTab;
        try {
            ss.deleteTabValue(aTab, "FullZoomLevel");
            ss.deleteTabValue(aTab, "FullZoomMode");
            ss.deleteTabValue(aTab, "FullZoomAuto");
            ss.deleteTabValue(aTab, "FullZoomAutoSavedURL");
        } catch(ex) {}
        aTab.removeAttribute("FullZoomLevel");
        aTab.removeAttribute("FullZoomMode");
        aTab.removeAttribute("FullZoomAuto");
        aTab.removeAttribute("FullZoomAutoSavedURL");
    },
    updateMenu: function FullZoom_updateMenu() {
        var menuItem = document.getElementById("toggle_zoom");
        menuItem.setAttribute("checked", !ZoomManager.useFullZoom);
    },
    reduce: function FullZoom_reduce() {
        ZoomManager.reduce();
        this._applySettingToPref();
    },
    enlarge: function FullZoom_enlarge() {
        ZoomManager.enlarge();
        this._applySettingToPref();
    },
    toggleZoom: function FullZoom_enlarge() {
        ZoomManager.toggleZoom();
        this._applySettingToPref();
    },
    resetZoom: function FullZoom_enlarge() {
        ZoomManager.reset();
        this._applySettingToPref();
    },
    reset: function FullZoom_reset() {
        if (typeof this.globalValue != "undefined") ZoomManager.zoom = this.globalValue;
        else ZoomManager.reset();
        if (! (this.ignoreImageDocument && content.document instanceof Ci.nsIImageDocument)) {
            this._removePref();
            this.removeApplied();
        }
    },
    setSettingValue: function FullZoom_setSettingValue(aBrowser) {
        var browser = aBrowser || gBrowser.selectedBrowser;
        var uri = this.convURI(browser.currentURI);
        var value = this._cps.getPref(uri, this.name);
        this._applyPrefToSetting(this.name, value, browser);
        value = this._cps.getPref(uri, this.mode);
        this._applyPrefToSetting(this.mode, value, browser);
    },
    _applyPrefToSetting: function FullZoom__applyPrefToSetting(aName, aValue, aBrowser) {
        var browser = aBrowser || gBrowser.selectedBrowser;
        var resetZoom = (gInPrintPreviewMode || browser.contentDocument instanceof Ci.nsIImageDocument);
        if (aName == this.name) {
            try {
                if (resetZoom) ZoomManager.setZoomForBrowser(browser, this.globalValue);
                else if (typeof aValue != "undefined") ZoomManager.setZoomForBrowser(browser, this._ensureValid(aValue));
                else ZoomManager.setZoomForBrowser(browser, this.globalValue);
            } catch(ex) {}
        } else if (aName == this.mode) {
            try {
                if (resetZoom) ZoomManager.useFullZoom = this.globalMode;
                else if (typeof aValue != "undefined") ZoomManager.useFullZoom = !!aValue;
                else ZoomManager.useFullZoom = this.globalMode;
            } catch(ex) {}
        } else if (aName == this.auto) {
            try {
                if (resetZoom) ZoomManager.useFullAuto = false;
                else if (typeof aValue != "undefined") ZoomManager.useFullAuto = !!aValue;
                else ZoomManager.useFullAuto = false;
            } catch(ex) {}
        }
        if (browser == gBrowser.selectedBrowser) fullZoomBtn.showZoomLevelInStatusbar();
    },
    _applySettingToPref: function FullZoom__applySettingToPref(aBrowser) {
        if (gInPrintPreviewMode) return;
        var browser = aBrowser || gBrowser.selectedBrowser;
        var url = this.convURI(browser.currentURI);
        if (! (this.ignoreImageDocument && browser.contentDocument instanceof Ci.nsIImageDocument)) {
            if (!this.siteSpecific) {
                this.setApplied(browser);
            } else {
                if (Math.floor(ZoomManager.getZoomForBrowser(browser) * 100) != Math.floor(this.globalValue * 100)) {
                    this._cps.setPref(url, this.name, ZoomManager.getZoomForBrowser(browser));
                } else {
                    this._removePrefZoom(url);
                }
                if (ZoomManager.useFullZoom != this.globalMode) {
                    this._cps.setPref(url, this.mode, ZoomManager.useFullZoom);
                } else {
                    this._removePrefMode(url);
                }
                if ( !! ZoomManager.useFullAuto) {
                    this._cps.setPref(url, this.auto, ZoomManager.useFullAuto);
                } else {
                    this._removePrefAuto(url);
                }
            }
        }
        if (browser == gBrowser.selectedBrowser) fullZoomBtn.showZoomLevelInStatusbar();
    },
    _removePref: function FullZoom_removePref(url) {
        if (!url) url = this.convURI(gBrowser.currentURI);
        this._cps.removePref(url, this.mode);
        this._cps.removePref(url, this.name);
        this._cps.removePref(url, this.auto);
    },
    _removePrefZoom: function FullZoom_removePrefZoom(url) {
        if (!url) url = this.convURI(gBrowser.currentURI);
        this._cps.removePref(url, this.name);
    },
    _removePrefMode: function FullZoom_removePrefMode(url) {
        if (!url) url = this.convURI(gBrowser.currentURI);
        this._cps.removePref(url, this.mode);
    },
    _removePrefAuto: function FullZoom_removePrefAuto(url) {
        if (!url) url = this.convURI(gBrowser.currentURI);
        this._cps.removePref(url, this.auto);
    },
    _ensureValid: function FullZoom__ensureValid(aValue) {
        if (isNaN(aValue)) return this.globalValue;
        if (aValue < ZoomManager.MIN) return ZoomManager.MIN;
        if (aValue > ZoomManager.MAX) return ZoomManager.MAX;
        return aValue;
    }
};
var fullZoomBtn = {
    full: null,
    win: null,
    windowResizedTimer: null,
    init: function() {
        window.removeEventListener('DOMContentLoaded', this, false);
        window.addEventListener('unload', this, false);
        document.getElementById("appcontent").addEventListener("resize", this, false);
        fullZoomBtn.lastInnerWidth = fullZoomBtn.calculateWidth();
        var isFx35 = parseInt(Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).version.substr(0, 3) * 10, 10) / 10 > 3.0;
        if (isFx35) gBrowser.tabContainer.addEventListener('TabSelect', this, false);
    },
    uninit: function() {
        window.removeEventListener('unload', this, false);
        document.getElementById("appcontent").removeEventListener("resize", this, false);
        gBrowser.tabContainer.removeEventListener('TabSelect', this, false);
    },
    handleEvent: function(event) {
        switch (event.type) {
        case 'TabSelect':
            this.tabSelect(event);
            break;
        case 'resize':
            this.windowResized(event);
            break;
        case 'unload':
            this.uninit(event);
        }
    },
    tabSelect: function(event) {
        FullZoom.onLocationChange(event.target.linkedBrowser.currentURI, true, event.target.linkedBrowser);
    },
    showZoomLevelInStatusbar: function() {
        var statusbarZoomLevel = document.getElementById("statusbarZoomLevel");
        if (!statusbarZoomLevel) return;
        var label = Math.floor(ZoomManager.zoom * 100 + 0.5);
        if (ZoomManager.useFullZoom) label = "V" + label + "%";
        else label = "T" + label + "%";
        statusbarZoomLevel.setAttribute("label", label);
    },
    clickStatusLabel: function(evt) {
        if (evt.type == "DOMMouseScroll") {
            this.click(evt, ZoomManager.useFullZoom);
            return;
        }
        if (evt.button == 0) {
            evt.stopPropagation();
            evt.preventDefault();
            document.getElementById("cmd_fullZoomToggle").doCommand();
            return;
        }
        if (evt.button == 1) {
            document.getElementById("cmd_fullZoomReset").doCommand();
            return;
        }
        var btn = evt.target;
        this.full = ZoomManager.useFullZoom;
        var popup = document.getElementById("fullZoomBtn_popup");
        if (popup.status == "open") {
            popup.hidePopup();
            popup.removeAttribute("height");
            popup.removeAttribute("width");
        } else {
            popup.removeAttribute("height");
            popup.removeAttribute("width");
            popup.openPopup(btn);
        }
    },
    click: function(evt, fullZoom) {
        if ( !! document.getElementById("textZoomBtn_popup2") && document.getElementById("textZoomBtn_popup2").state == "open") {
            return;
        }
        if ( !! document.getElementById("fullZoomBtn_popup2") && document.getElementById("fullZoomBtn_popup2").state == "open") {
            return;
        }
        if (evt.type == "DOMMouseScroll") {
            if (evt.detail > 0) {
                this.toggleZoom(fullZoom);
                document.getElementById("cmd_fullZoomReduce").doCommand();
            } else {
                this.toggleZoom(fullZoom);
                document.getElementById("cmd_fullZoomEnlarge").doCommand();
            }
            return;
        }
        if (evt.button == 0 && evt.shiftKey) {
            evt.stopPropagation();
            var btn = evt.target;
            if (document.getElementById("fullzoombtn") == btn || document.getElementById("fullzoombtn2") == btn) this.full = true;
            else if (document.getElementById("textzoombtn") == btn || document.getElementById("textzoombtn2") == btn) this.full = false;
            var popup = document.getElementById("fullZoomBtn_popup");
            popup.removeAttribute("height");
            popup.removeAttribute("width");
            popup.openPopup(btn, "after_end");
        } else if (evt.button == 2 && evt.shiftKey) {
            this.openPrefWindow();
        } else {
            this.zoom(evt.button, fullZoom)
        }
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    },
    zoom: function(type, fullZoom) {
        ZoomManager.useFullAuto = false;
        switch (type) {
        case 0:
            this.toggleZoom(fullZoom);
            document.getElementById("cmd_fullZoomEnlarge").doCommand();
            break;
        case 1:
            this.toggleZoom(fullZoom);
            document.getElementById("cmd_fullZoomReset").doCommand();
            fullZoomBtn.showZoomLevelInStatusbar();
            break;
        case 2:
            this.toggleZoom(fullZoom);
            document.getElementById("cmd_fullZoomReduce").doCommand();
            break;
        }
    },
    toggleZoom: function ZoomManager_toggleZoom(useFullZoom) {
        var zoomLevel = ZoomManager.zoom;
        ZoomManager.useFullZoom = useFullZoom;
        ZoomManager.zoom = zoomLevel;
    },
    openPrefWindow: function() {
        window.openDialog("chrome://DefaultFullZoomLevel/content/pref.xul", "DefaultFullZoomLevel:Setting", "chrome,titlebar,toolbar,centerscreen,modal");
    },
    windowResized: function(event) {
        if (this.windowResizedTimer) {
            clearTimeout(this.windowResizedTimer);
            this.windowResizedTimer = null;
        }
        this.windowResizedTimer = setTimeout(function(self) {
            var width = self.calculateWidth();
            var diff = width - self.lastInnerWidth;
            if (Math.abs(diff) < 5) return;
            self.lastInnerWidth = width;
            if (FullZoom.globalAuto && !!ZoomManager.useFullAuto) {
                self.doFullZoomBy( - 1, true);
            }
        },
        500, this);
    },
    calculateWidth: function() {
        var reservesidebar = FullZoomConfig.reserveSidebarWidth;
        var sidebarWidth = 0;
        var sidebarsplitterWidth = 0;
        var sidebarbox = document.getElementById("sidebar-box");
        var sidebar = document.getElementById("sidebar");
        if (reservesidebar && sidebarbox.boxObject.width == 0) {
            sidebarWidth = Math.ceil(sidebarbox.width);
            if (!sidebarWidth) sidebarWidth = Math.ceil(document.defaultView.getComputedStyle(sidebar, '').getPropertyValue('width').replace('px', ''));
            var sidebarsplitter = document.getElementById("sidebar-splitter");
            if (sidebarsplitter.boxObject.width == 0) sidebarsplitterWidth = Math.ceil(document.defaultView.getComputedStyle(sidebarsplitter, '').getPropertyValue('min-width').replace('px', ''));
            sidebarWidth = sidebarWidth + sidebarsplitterWidth;
        }
        return gBrowser.mPanelContainer.boxObject.width - sidebarWidth;
    },
    getFitZoomLevel: function(useFullZoom, aBrowser, forceFit) {
        var doc = aBrowser.contentDocument;
        if (!doc.documentElement) return;
        var minzoom = (FullZoomConfig.minimum / 100);
        var maxzoom = (FullZoomConfig.maximum / 100);
        ZoomManager.preserveTextSize = FullZoomConfig.fitToWidthPreserveTextSize;
        ZoomManager.useFullZoom = useFullZoom;
        var width = this.calculateWidth();
        var scw = Math.ceil((doc.defaultView.innerWidth - doc.documentElement.offsetWidth) * ZoomManager.getZoomForBrowser(aBrowser));
        var ww = width - scw;
        var hw = doc.documentElement.scrollWidth;
        var dw = (doc.body) ? doc.body.scrollWidth: hw;
        if (! (FullZoom.forceFitToWidth || forceFit) || ww > Math.max(hw, dw)) {
            changeZoom();
        } else {
            ZoomManager.setZoomForBrowser(aBrowser, (FullZoom.forceFitToWidth || forceFit) ? maxzoom: FullZoom.globalValue);
            setTimeout(function() {
                changeZoom();
            },
            0);
        }
        function changeZoom() {
            var hw = doc.documentElement.scrollWidth;
            var dw = (doc.body) ? doc.body.scrollWidth: hw;
            var error = (FullZoom.forceFitToWidth || forceFit) ? 1.03 : 1;
            var zoom = Math.floor(Math.floor((ww / (Math.max(hw, dw) * error)) * 20) * 5) / 100;
            zoom = Math.min(Math.max(zoom, minzoom), maxzoom);
            ZoomManager.useFullAuto = true;
            ZoomManager.useFullZoom = useFullZoom;
            ZoomManager.setZoomForBrowser(aBrowser, zoom);
            FullZoom._applySettingToPref();
        }
    },
    doFullZoomBy: function(zoom, useFullZoom, aBrowser, forceFit) {
        var browser = aBrowser || gBrowser.selectedBrowser;
        var ss = Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore);
        if (zoom < 0) {
            fullZoomBtn.getFitZoomLevel(useFullZoom, browser, forceFit);
            return;
        }
        ZoomManager.useFullAuto = false;
        ZoomManager.useFullZoom = useFullZoom;
        ZoomManager.setZoomForBrowser(browser, zoom);
        FullZoom._applySettingToPref();
    },
    onPopupShowing: function(event, useFullZoom) {
        function cmp_val(a, b) {
            var aa = Math.floor(a);
            var bb = Math.floor(b);
            return aa > bb ? -1 : 1;
        }
        var popup = event.target;
        while (popup.lastChild) {
            popup.removeChild(popup.lastChild);
        }
        if (typeof useFullZoom == 'undefined') {
            useFullZoom = this.full;
        }
        var p = FullZoomConfig.zoomValues;
        var s = p.split(',');
        s.sort(cmp_val);
        var arr = [];
        var zoom = Math.floor(ZoomManager.zoom * 100 + 0.5);
        for (var i = 0; i < s.length; i++) {
            try {
                var x = Math.floor(s[i] * 100 + 0.5);
                if (x < zoom) {
                    arr.push(zoom);
                    zoom = 0;
                } else if (x == zoom) {
                    zoom = 0;
                }
                arr.push(x);
            } catch(ex) {}
        }
        if (zoom != 0) {
            arr.push(zoom);
        }
        for (var i = 0; i < arr.length; i++) {
            var menuitem = document.createElement('menuitem');
            var s = '    ' + (arr[i]).toString();
            menuitem.setAttribute('label', s.substr(s.length - 4, 4) + '%');
            menuitem.setAttribute('type', 'radio');
            menuitem.setAttribute('oncommand', 'fullZoomBtn.doFullZoomBy(' + arr[i] / 100 + ', ' + useFullZoom + ');');
            if (!ZoomManager.useFullZoom == !useFullZoom && arr[i] == Math.floor(ZoomManager.zoom * 100 + 0.5)) {
                menuitem.setAttribute('checked', true);
            }
            popup.appendChild(menuitem);
        }
        var bundle = document.getElementById("bundle_defaultfullzoomlevel");
        if (useFullZoom) {
            var menuitem = document.createElement('menuseparator');
            popup.appendChild(menuitem);
            var menuitem = document.createElement('menuitem');
            menuitem.setAttribute('label', FullZoomConfig.fitToWindow);
            menuitem.setAttribute('oncommand', 'fullZoomBtn.doFullZoomBy( -1, ' + useFullZoom + ', null, true);');
            menuitem.setAttribute('type', 'checkbox');
            if (FullZoom.globalAuto && !!ZoomManager.useFullAuto) {
                menuitem.setAttribute('checked', true);
            }
            popup.appendChild(menuitem);
        }
        var menuitem = document.createElement('menuseparator');
        popup.appendChild(menuitem);
        var menuitem = document.createElement('menuitem');
        menuitem.setAttribute('label', FullZoomConfig.reset);
        var value = FullZoom.globalValue;
        menuitem.setAttribute('oncommand', 'fullZoomBtn.doFullZoomBy(' + value + ', ' + useFullZoom + ');');
        menuitem.setAttribute('type', 'checkbox');
        popup.appendChild(menuitem);
    },
    getPref: function(aPrefString, aPrefType, aDefault) {
        var xpPref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
        try {
            switch (aPrefType) {
            case 'complex':
                return xpPref.getComplexValue(aPrefString, Components.interfaces.nsILocalFile);
                break;
            case 'str':
                return xpPref.getCharPref(aPrefString).toString();
                break;
            case 'int':
                return xpPref.getIntPref(aPrefString);
                break;
            case 'bool':
            default:
                return xpPref.getBoolPref(aPrefString);
                break;
            }
        } catch(e) {}
        return aDefault;
    },
    setPref: function(aPrefString, aPrefType, aValue) {
        var xpPref = Components.classes['@mozilla.org/preferences;1'].getService(Components.interfaces.nsIPrefBranch2);
        try {
            switch (aPrefType) {
            case 'complex':
                return xpPref.setComplexValue(aPrefString, Components.interfaces.nsILocalFile, aValue);
                break;
            case 'str':
                return xpPref.setCharPref(aPrefString, aValue);
                break;
            case 'int':
                aValue = parseInt(aValue);
                return xpPref.setIntPref(aPrefString, aValue);
                break;
            case 'bool':
            default:
                return xpPref.setBoolPref(aPrefString, aValue);
                break;
            }
        } catch(e) {}
        return null;
    },
    debug: function(aMsg) {
        const Cc = Components.classes;
        const Ci = Components.interfaces;
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).logStringMessage(aMsg);
    },
    getVer: function() {
        const Cc = Components.classes;
        const Ci = Components.interfaces;
        var info = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
        var ver = parseInt(info.version.substr(0, 3) * 10, 10) / 10;
        return ver;
    }
};
var ZoomManager = {
    useFullAuto: false,
    preserveTextSize: false,
    get _prefBranch() {
        delete this._prefBranch;
        return this._prefBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    },
    get MIN() {
        delete this.MIN;
        return this.MIN = this._prefBranch.getIntPref("zoom.minPercent") / 100;
    },
    get MAX() {
        delete this.MAX;
        return this.MAX = this._prefBranch.getIntPref("zoom.maxPercent") / 100;
    },
    get useFullZoom() {
        return this._prefBranch.getBoolPref("browser.zoom.full");
    },
    set useFullZoom(aVal) {
        this._prefBranch.setBoolPref("browser.zoom.full", aVal);
        return aVal;
    },
    get zoom() {
        return this.getZoomForBrowser(getBrowser());
    },
    getZoomForBrowser: function ZoomManager_getZoomForBrowser(aBrowser) {
        var markupDocumentViewer = aBrowser.markupDocumentViewer;
        return this.useFullZoom ? markupDocumentViewer.fullZoom: markupDocumentViewer.textZoom;
    },
    getZoom2: function ZoomManager_get_zoom(aBrowser) {
        var markupDocumentViewer = aBrowser.markupDocumentViewer;
        return this.useFullZoom ? markupDocumentViewer.fullZoom: markupDocumentViewer.textZoom;
    },
    set zoom(aVal) {
        this.setZoomForBrowser(getBrowser(), aVal);
        return aVal;
    },
    setZoomForBrowser: function ZoomManager_setZoomForBrowser(aBrowser, aVal) {
        if (aVal < this.MIN || aVal > this.MAX) throw Components.results.NS_ERROR_INVALID_ARG;
        var markupDocumentViewer = aBrowser.markupDocumentViewer;
        if (!markupDocumentViewer) return;
        if (this.useFullZoom) {
            if (this.preserveTextSize) markupDocumentViewer.textZoom = markupDocumentViewer.textZoom * markupDocumentViewer.fullZoom / aVal;
            else if (markupDocumentViewer.textZoom != 1) markupDocumentViewer.textZoom = 1;
            if (markupDocumentViewer.fullZoom != aVal) markupDocumentViewer.fullZoom = aVal;
        } else {
            if (markupDocumentViewer.textZoom != aVal) markupDocumentViewer.textZoom = aVal;
            if (markupDocumentViewer.fullZoom != 1) markupDocumentViewer.fullZoom = 1;
        }
    },
    zoom2: function ZoomManager_set_zoom(aVal, aBrowser) {
        if (aVal < this.MIN || aVal > this.MAX) throw Components.results.NS_ERROR_INVALID_ARG;
        var markupDocumentViewer = aBrowser.markupDocumentViewer;
        if (!markupDocumentViewer) return;
        if (this.useFullZoom) {
            if (this.preserveTextSize) markupDocumentViewer.textZoom = markupDocumentViewer.textZoom * markupDocumentViewer.fullZoom / aVal;
            else if (markupDocumentViewer.textZoom != 1) markupDocumentViewer.textZoom = 1;
            if (markupDocumentViewer.fullZoom != aVal) markupDocumentViewer.fullZoom = aVal;
        } else {
            if (markupDocumentViewer.textZoom != aVal) markupDocumentViewer.textZoom = aVal;
            if (markupDocumentViewer.fullZoom != 1) markupDocumentViewer.fullZoom = 1;
        }
        return aVal;
    },
    get zoomValues() {
        var zoomValues = FullZoomConfig.zoomValues.split(",").map(parseFloat);
        zoomValues.sort(function(a, b) a - b);
        while (zoomValues[0] < this.MIN) zoomValues.shift();
        while (zoomValues[zoomValues.length - 1] > this.MAX) zoomValues.pop();
        delete this.zoomValues;
        return this.zoomValues = zoomValues;
    },
    enlarge: function ZoomManager_enlarge() {
        this.useFullAuto = false;
        var i = this.zoomValues.indexOf(this.snap(this.zoom)) + 1;
        if (i < this.zoomValues.length) this.zoom = this.zoomValues[i];
    },
    reduce: function ZoomManager_reduce() {
        this.useFullAuto = false;
        var i = this.zoomValues.indexOf(this.snap(this.zoom)) - 1;
        if (i >= 0) this.zoom = this.zoomValues[i];
    },
    reset: function ZoomManager_reset() {
        this.useFullAuto = false;
        this.zoom = FullZoom.globalValue;
    },
    toggleZoom: function ZoomManager_toggleZoom() {
        this.useFullAuto = false;
        var zoomLevel = this.zoom;
        this.useFullZoom = !this.useFullZoom;
        this.zoom = zoomLevel;
    },
    snap: function ZoomManager_snap(aVal) {
        var values = this.zoomValues;
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= aVal) {
                if (i > 0 && aVal - values[i - 1] < values[i] - aVal) i--;
                return values[i];
            }
        }
        return values[i - 1];
    }
}
function fullZoomUI() {
    var statusbar = document.getElementById("urlbar-icons");
    var button = document.createElement("statusbarpanel");
    button.setAttribute("id", "statusbarZoomLevel");
    button.setAttribute("onmousedown", "fullZoomBtn.clickStatusLabel(event);");
    button.setAttribute("onclick", "event.preventDefault();");
    button.setAttribute("onDOMMouseScroll", "fullZoomBtn.clickStatusLabel(event);");
    statusbar.insertBefore(button, statusbar.childNodes[0]);
    var popupSet = document.getElementById("mainPopupSet");
    var popup = document.createElement("menupopup");
    popup.setAttribute("id", "fullZoomBtn_popup");
    popup.setAttribute("ignorekeys", "true");
    popup.setAttribute("position", "event.preventDefault();");
    popup.setAttribute("onpopupshowing", "event.stopPropagation();\
  event.target.shown = true;\
        if (event.target == this)\
     fullZoomBtn.onPopupShowing(event)");
    popupSet.appendChild(popup);
}
fullZoomUI();
FullZoom.init();
fullZoomBtn.init();
