// ==UserScript==
// @name            enable Findbar Highlighting
// @id              enableFindbarHighlighting@zbinlin
// @namespace       http://script.bitcp.com/enablefindbarhighlighting
// @description     默认启用查找栏“全部高亮显示”
// @author          zbinlin
// @homepage        http://bitcp.com
// @version         0.0.1
// ==/UserScript==

(function () {
    "use strict"
    let gFindBar = window.gFindBar || document.getElementById("FindToolbar");
    if (!gFindBar) return;
    gFindBar.watch("hidden", function (prop, oldV, newV) {
        if (!newV) {
            highlighting();
        }
        return newV;
    });

    function highlighting() {
        let highlightBtn = gFindBar.getElement('highlight');
        highlightBtn.setAttribute("checked", "true");
        highlightBtn.setAttribute("checkState", "1");
    }

    function handleEvent(e) {
        gFindBar.unwatch("hidden");
        window.removeEventListener("unload", handleEvent, false);
    }

    window.addEventListener("unload", handleEvent, false);
})();
