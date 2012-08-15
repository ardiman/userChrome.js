// ==UserScript==
// @name          SelectSearchInTextArea.uc.js
// @DATE          
// @include       main
// ==/UserScript==
/*textarea等でも文字列選択して右クリック→検索できるようにする */
(function() {
eval('getBrowserSelection = ' + getBrowserSelection.toString().replace(
'var selection = focusedWindow.getSelection().toString();',
'var el = document.commandDispatcher.focusedElement;var  selection = focusedWindow.getSelection();if(selection && !selection.toString()){if(el && (el.type == "text" || el.type == "textarea") && "selectionStart" in el && el.selectionStart != el.selectionEnd){var offsetStart = Math.min(el.selectionStart, el.selectionEnd);var offsetEnd = Math.max(el.selectionStart, el.selectionEnd);selection = el.value.substr(offsetStart, offsetEnd-offsetStart);}}selection = selection.toString();'
));
})(); 
/*右クリック→検索の時に
中クリックもしくはshiftキー押しながらで
入力ダイアログを表示して編集してから検索*/
(function() {
BrowserSearch.loadSearchOriginal = BrowserSearch.loadSearch;
BrowserSearch.loadSearch = function(searchText, useNewTab, e) {
if (e && (e.shiftKey || e.button == 1)) {
var inputtext = prompt("Enter search word", searchText);
if (inputtext)
this.loadSearchOriginal(inputtext, useNewTab);
else return;
}
else
this.loadSearchOriginal(searchText, useNewTab);
}
document.getElementById("context-searchselect").setAttribute("oncommand",
"BrowserSearch.loadSearch(getBrowserSelection(), true, event);");
document.getElementById("context-searchselect").setAttribute("onclick",
"checkForMiddleClick(this, event)");
})();