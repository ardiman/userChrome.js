// ==UserScript==
// @name             ToggleMenubarOnTabbar.uc.js
// @description    タブバー上のダブルクリックでメニューバーの表示を切り替え
// @description    middle-click-undo-close-tab.uc.js に FireGestures公式サイトのスクリプトを追加
// @version          1.0
// @author           
// @compatibility  Firefox 18
// @namespace    https://github.com/oflow/userchromejs/blob/master/middle-click-undo-close-tab.uc.js
// ==/UserScript==

(function() {
    var ToggleMenubar = function(e) {
        // 左ダブルクリックのみ
        if (e.button != 0) {
            return;
        }
        // タブバー・ツールボタンでのクリックのみ
        if (e.target.localName != 'tabs' && e.target.localName != 'toolbarbutton') {
            return;
        }
            // http://www.xuldev.org/firegestures/getscripts.php?lang=ja
            var menubar = document.getElementById("toolbar-menubar");
            menubar.collapsed = !menubar.collapsed;

//        undoCloseTab(0);
        e.preventDefault();
        e.stopPropagation();
    }
    // 新規タブ追加ボタン
    //    document.getElementById('new-tab-button').onclick = ucjsUndoCloseTab;

    // タブバー
    gBrowser.mTabContainer.addEventListener('dblclick', ToggleMenubar, true);

    window.addEventListener('unload', function() {
        gBrowser.mTabContainer.removeEventListener('click', ToggleMenubar, true);
        window.removeEventListener('unload', arguments.callee, false);
    }, false);
})();
