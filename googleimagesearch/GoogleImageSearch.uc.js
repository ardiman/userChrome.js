// ==UserScript==
// @name            googleImageSearch.uc.js
// @namespace       googleImageSearch@zbinlin
// @description     google 以图搜图脚本
// @include         chrome://browser/content/browser.xul
// @author          zbinlin
// @homepage        http://www.czcp.co.cc
// @version         0.0.2.2
// @compatibility   firefox 4.0+
// @updateURL     https://j.mozest.com/ucscript/script/43.meta.js
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
            // 暂不支持 canvas
            imagesearch.hidden = gContextMenu.onCanvas || !gContextMenu.onImage;
        }, false);
    },
    onSearch: function (e) {
        var imageURL = e.target.parentNode.triggerNode.src;
        var url = "http://www.google.com/searchbyimage?image_url=";
        var where = (e.type == "click" && e.button == 1) ? "tabshifted" : "tab";
        url += encodeURIComponent(imageURL);
        var that = gContextMenu;
        var doc = that ? that.target.ownerDocument : '';
        openUILinkIn(url, where, null, null, doc.documentURIObject);
        closeMenus(e.target);
    }
}

if (window.location == "chrome://browser/content/browser.xul") {
    googleImageSearch.init();
}