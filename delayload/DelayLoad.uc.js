// ==UserScript==
// @name           delayLoad.uc
// @description    Verzögerung beim Laden von FX-Erweiterungen
// @include        chrome://browser/content/browser.xul
// @updateURL      https://github.com/xinggsf/uc/raw/master/delayLoad.uc.js
// @compatibility  Firefox 34.0+
// @author         modify by xinggsf
// @version        2015.8.28
// @note           Neustart bei Aktivieren/deaktivieren von FX-Erweiterungen, keine Verzögerung beim Laden möglich!!
// ==UserScript==
 
location == "chrome://browser/content/browser.xul" && (() => {        
    let {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} =Components;
    Cu.import("resource://gre/modules/AddonManager.jsm");
 
    function toggleDelay(disable) {
        let id,
        a = [//Erweiterungs ID aus Verzeichnis Profiles\extensions einfügen
            '{d10d0bf8-f5b5-c8b4-a8b2-2b9879e08c5d}', //ABP
            'elemhidehelper@adblockplus.org',//EHH
            'redirector@einaregilsson.com',//Redirector
            'simpleproxy@jc3213.github',//Simpe Proxy
            
        ];
        for(id of a) AddonManager.getAddonByID(id, 
            addon => addon.userDisabled = disable);
    }
 
    //Verzögertes Laden der Erweiterungen aktivieren
    this._timer && clearTimeout(this._timer);
    this._timer = setTimeout(() => toggleDelay(false), 2000);
 
    // Verzögertes Laden der Erweiterungen deaktivieren
    window.addEventListener("unload", () => toggleDelay(true), false);
})();