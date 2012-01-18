// ==UserScript==
// @name            refresh livemark
// @namespace       http://script.bitcp.com/refreshLivemark
// @description     单击书签工具栏的实时书签将自动重新载入
// @author          zbinlin
// @homepage        http://blog.bitcp.com
// @version         0.0.2
// @version         0.0.1
// @note            about:config     browser.bookmarks.livemark_refresh_seconds
// ==/UserScript==

if (location == "chrome://browser/content/browser.xul") {
    (function () {
        function $(id) {
            return document.getElementById(id);
        }

        var placesToolbarItems = $("PlacesToolbarItems");
        if (placesToolbarItems === null) return;
        placesToolbarItems.addEventListener("click", function (e) {
            if (e.button != 0) return;
            var t = e.target;
            if (t.hasAttribute("livemark") && t.getAttribute("livemark") == "true")
                PlacesUtils.livemarks.reloadLivemarkFolder(t._placesNode.itemId);
        }, false);

    })();
}
