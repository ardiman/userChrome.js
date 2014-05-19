// ==UserScript==
// @name         resetSearchbar
// @description  検索バーをダブルクリックで文字列消去 & 検索エンジンをリセット
// ==/UserScript==
(function () {

    const clearSearchHistory = false;  // 検索履歴も消去するか

    var searchbar = BrowserSearch.searchBar;
    if (!searchbar) return;

    searchbar.addEventListener("dblclick", function (e) {
        if (e.button !== 0) return;
        if (!searchbar.textbox.focused) return;

        if (searchbar.textbox.value != '') {
            searchbar.value = '';
        }

        searchbar.currentEngine = searchbar.engines[0];

        if (clearSearchHistory) {
            goDoCommand('cmd_clearhistory');
        }

    }, false);

}());
