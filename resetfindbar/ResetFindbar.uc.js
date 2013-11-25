// ==UserScript==
// @name         resetFindbar
// @description  ページ内検索バーのテキストボックス内をダブルクリックで文字列消去
// @include      main
// @version      0.2  文字列がない時にダブルクリックした場合は検索バーを閉じるように
// ==/UserScript==
(function() {

    function resetFindbar() {
        var findField = gFindBar._findField;
        findField.addEventListener('dblclick', function(e) {
            if (e.button != 0) return;
            if (findField.value != '') {
                findField.value = '';
                gFindBar.onFindAgainCommand(false);
            } else if (!findField.select()) {
               gFindBar.close();
            }
        }, false);
    }

    gBrowser.addEventListener("DOMContentLoaded", resetFindbar, false);

}());
