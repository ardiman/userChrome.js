// ==UserScript==
// @name            googleImageSearch.uc.js
// @namespace       googleImageSearch@zbinlin
// @description     Google-Bildersuche
// @include         chrome://browser/content/browser.xul
// @author          zbinlin
// @versionsinfo    Anpassung für Firefox 52+ von aborix
// @homepage        http://www.czcp.co.cc
// @version         0.0.2.3
// @compatibility   firefox 4.0 - 52.0+
// ==/UserScript==

var googleImageSearch = {
    init: function () {
        var cacm = document.getElementById("contentAreaContextMenu");
        if (!cacm) return;
        var sendimage = document.getElementById("context-sendimage");
        var imagesearch = document.createElement("menuitem");
        imagesearch.setAttribute("id", "context-googleImageSearch");
        imagesearch.setAttribute("label", "Google-Bildersuche");
        imagesearch.setAttribute("accesskey", "B");
        imagesearch.setAttribute("oncommand", "googleImageSearch.onSearch(event);");
        imagesearch.setAttribute("onclick", "googleImageSearch.onSearch(event);");
        cacm.insertBefore(imagesearch, sendimage);
        cacm.addEventListener("popupshowing", function () {
            // bei Canvas deaktivieren
            imagesearch.hidden = gContextMenu.onCanvas || !gContextMenu.onImage;
        }, false);
    },
    onSearch: function (e) {
        if (!gContextMenu)
            return;
        var imageURL = gContextMenu.mediaURL;
        var url = "http://www.google.com/searchbyimage?image_url=";
        var where = (e.type == "click" && e.button == 1) ? "tabshifted" : "tab";
        url += encodeURIComponent(imageURL);
        openUILinkIn(url, where);
        closeMenus(e.target);
    }
}

if (window.location == "chrome://browser/content/browser.xul") {
    googleImageSearch.init();
}