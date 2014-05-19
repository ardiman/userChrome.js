// ==UserScript==
// @name           mouseover open bookmark folder
// @description    ブックマークツールバーのフォルダをマウスオーバーで開く
// @version        1.0
// @author         oflow
// @compatibility  Firefox 24, 29
// @namespace      http://oflow.me/1149
// ==/UserScript==

(function() {
    var personalBookmark = document.getElementById('personal-bookmarks'),
        items = [], folders = [], folder, item, i;

    if (!personalBookmark) return;
    items = personalBookmark.getElementsByClassName('bookmark-item');
    // ブックマークフォルダだけ配列につっこんでイベント監視
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (item.getAttribute('type') == 'menu') {
            folders.push(item);
            item.addEventListener('mouseover', openBookmarkFolder, false);
        } else {
            // フォルダじゃなかったらマウスオーバーで既に開いてるメニューを閉じる
            item.addEventListener('mouseover', closeBookmarkMenu, false);
        }
    }
    function closeBookmarkMenu() {
        folders.forEach(function(folder) {
            folder.open = false;
        });
    }
    function openBookmarkFolder(e) {
        // ブラウザが非アクティブの時は開かない
        if (!!document.querySelector('#main-window:-moz-window-inactive')) return;
        item = e.target;
        // toolbarbutton
        if (item.nodeName == 'toolbarbutton') {
            // 他にメニュー開いてるかもしれないので閉じる
            closeBookmarkMenu();
            item.open = true;
        }
    }
    function d(s) {
        document.getElementById("liberator-message").value = s;
    }
})();
