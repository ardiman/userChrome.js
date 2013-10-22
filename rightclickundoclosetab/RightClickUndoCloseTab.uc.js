// ==UserScript==
// @name           right-click-undo-close-tab
// @description    新しいタブボタンを右クリックで閉じたタブを元に戻す
// @include        main
// ==/UserScript==
(function () {

    gBrowser.mTabContainer.addEventListener('click', function (e) {
        if (e.button != 2) return;
        if (e.originalTarget.className != 'tabs-newtab-button') return;
        e.preventDefault();
        e.stopPropagation();
        undoCloseTab(0);
    }, false);

})();
