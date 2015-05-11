// ==UserScript==
// @name           Dblclick-ContextMenu.uc.js
// @description    Kontextmenü mit Doppelklick auf Seiteninhalt öffnen
// @include        main
// @version        v0.2 Keine Wirkung in Eingabe- bzw. Textfeldern, zbs. Adressleiste, Suchleiste usw.
// ==/UserScript==
(function () {

    gBrowser.addEventListener('dblclick', function (e) {
        if (e.button !== 0) return;

        // thanks for y2k
        var disableTag = { input: true, textarea: true };
        if (disableTag[e.target.localName]) return;

        document.popupNode = e.originalTarget;

        var cacm = document.getElementById("contentAreaContextMenu");
        cacm.openPopupAtScreen(e.screenX, e.screenY, true);
    }, false);

})();
