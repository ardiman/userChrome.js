// ==UserScript==
// @name           auto reset searchbar
// @namespace      http://oflow.me/archives/337
// @description    Web検索したらキーワードをクリアして一番上の検索エンジンに戻す
// @compatibility  Firefox 4.0, 5.0.1, 6.0.2
// @author         oflow
// @version        1.0.20110920
// ==/UserScript==

(function() {
    // handleSearchCommandにちょっと付け足すだけ
    var func = BrowserSearch.searchBar.handleSearchCommand.toString()
                   .replace(/^\s*function.+{/, '').replace(/}\s*$/, '');
    
    var code = ['textBox.value="";',
                'var searchbar = BrowserSearch.searchBar;',
                'searchbar.currentEngine = searchbar.engines[0];'
               ].join('');

    // Focus zurück auf die Suchleiste
    // code += 'searchbar.focus();';

    // Zeitverzögerung vor dem Löschen in der Suchleiste
    // code = 'setTimeout(function(){' + code + '},2000);';

    func += code;
    BrowserSearch.searchBar.handleSearchCommand = new Function('aEvent', func);
})();
