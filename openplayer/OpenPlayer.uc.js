// ==UserScript==
// @name           OpenPlayer
// @description    特定のサイト上でリンクやページURLを外部プレーヤーで開く
// @include        main
// @charset        UTF-8
// @version        0.2
// ==/UserScript==
var OpenPlayer = {

    mi: null,

    PATH: "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe",
    NAME: "VLC Player",
    REGEXP: /youtube\.com/,

    init: function () {
        this.mi = document.createElement("menuitem");
        this.mi.setAttribute("label", this.NAME + " öffnen");
        this.mi.setAttribute("image", "moz-icon:file://" + this.PATH + "?size=16;");
        document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function () {
            OpenPlayer.onPopupShowing(this);
        }, false);
    },

    onPopupShowing: function (popup) {
        if (!gContextMenu.target) return;
        popup.insertBefore(this.mi, document.getElementById("context-sep-copyimage" + ((gContextMenu.onLink) ? "open" : "stop")));
        this.mi.setAttribute("oncommand", "OpenPlayer.exec(" + ((gContextMenu.onLink) ? "gContextMenu.linkURI" : "gBrowser.currentURI") + ");");
        this.mi.hidden = !this.REGEXP.test(gContextMenu.onLink ? gContextMenu.linkURL : gContextMenu.target.ownerDocument.location.href);
    },

    exec: function (url) {
        var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        file.initWithPath(OpenPlayer.PATH);
        var proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
        proc.init(file);
        proc.run(false, [url.spec], 1, {});
    }

};
OpenPlayer.init();
