// ==UserScript==
// @name           purgeTabHistory.uc.js
// @description    Die Chronik der einzelnen Tabs wird gelöscht
// @include        main
// @version        0.1
// ==/UserScript==
(function() {

    var cm = document.getElementById('tabContextMenu');
    var mi = document.createElement('menuitem');
    mi.setAttribute('id', 'purge-tab-history');
    mi.setAttribute('label', 'Tab-Chronik löschen');
    mi.addEventListener('command', function () {
        purgeTabHistory();
    }, false);
    cm.appendChild(mi);

    function tabBrowser() {
        return gBrowser.mContextTab ? (gBrowser.mContextTab.localName == 'tabs') ? gBrowser.mCurrentTab.linkedBrowser : gBrowser.mContextTab.linkedBrowser : gBrowser;
    }

    function purgeTabHistory() {
        var history = tabBrowser().webNavigation.sessionHistory;
        var entry = history.getEntryAtIndex(history.index, false);
        if (history.count > 0) {
            history.PurgeHistory(history.count);
        }
        history.QueryInterface(Ci.nsISHistoryInternal);
        history.addEntry(entry, true);
        ['Back', 'BackOrBackDuplicate', 'Forward', 'ForwardOrForwardDuplicate'].forEach(function(id) {
            document.getElementById('Browser:' + id).setAttribute('disabled', 'true');
        });
    }

})();
