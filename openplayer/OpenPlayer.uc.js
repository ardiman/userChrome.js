// ==UserScript==
// @name           OpenPlayer
// @description    Youtubeの動画を外部プレーヤーで開く
// @include        main
// @charset        UTF-8
// @version        0.4 Youtubeにてplaylist内の個別動画を再生できなかったのを修正。menuitemの表示位置を先頭に固定。コマンドライン引数をcustomArgsで指定できるように改善。
// @version        0.3 youtu.be形式の短縮URLリンクに対応
// ==/UserScript==
/*
Youtube以外でもリンクが動画への直リンクであればVLCやMPC-HC(BE)などで開けると思います
その際はregExpへそのサイトのドメインを追加してください
*/
var OpenPlayer = {

    playerPath: 'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
    playerName: 'VLC Player',
    customArgs: '', // Befehlszeilenargument des Players angeben

    regExp: /youtube\.com|youtu\.be/,

    init: function () {
        var cacm = document.getElementById('contentAreaContextMenu')
        var mi = document.createElement('menuitem');
        mi.setAttribute('label', this.playerName + ' öffnen');
        mi.setAttribute('class', 'menuitem-iconic');
        mi.setAttribute('image', 'moz-icon:file://' + this.playerPath + '?size=16;');
        cacm.addEventListener('popupshowing', function () {
            if (!gContextMenu.target) return;
            cacm.insertBefore(mi, document.getElementById('context-' + ((gContextMenu.onLink) ? 'openlinkintab' : 'openlinkincurrent')));
            mi.setAttribute('oncommand', 'OpenPlayer.launchPlayer(' + (gContextMenu.onLink ? 'gContextMenu.getLinkURL()' : 'gBrowser.currentURI.spec') + ');');
            mi.hidden = !OpenPlayer.regExp.test(gContextMenu.onLink ? gContextMenu.linkURL : gContextMenu.target.ownerDocument.location.href);
        }, false);
    },

    extractYoutubeID: function (url) {
        url = url.replace(/v\=|v\%3D|youtu.be\/|\/v\/|\/embed\/|attribution_link\a\=/ig, 'IDSTART');
        var IDPos = url.indexOf('IDSTART');

        var newUrl = 'https://www.youtube.com/watch?v=' + url.substr(IDPos+7, 11);
        return newUrl;
    },

    launchPlayer: function (videoURL) {
        videoURL = OpenPlayer.extractYoutubeID(videoURL);

        var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
        file.initWithPath(OpenPlayer.playerPath);
        var proc = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
        proc.init(file);
        var args = [videoURL].concat(OpenPlayer.customArgs.split(' '));
        proc.run(false, args, args.length);
    }

};
OpenPlayer.init();
