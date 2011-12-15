// ==UserScript==
// @name           FindAfterScroller.uc.js
// @namespace      http://d.hatena.ne.jp/Griever
// @description    ページ内検索をで適度にスクロールする
// @compatibility  Firefox 3.6, 8.0
// @include        main
// @license        MIT License
// @version        0.0.8
// @note           検索結果を 3.6 では真ん中に、8.0 では画面端にならないようにスクロールする
// @note           Firefox 8.0で動くように変更。Firefox 4～7は知らん。
// ==/UserScript==

gFindBar._findAgain_org = gFindBar._findAgain;
gFindBar._find_org = gFindBar._find;

if ('getBoundingClientRect' in document.createRange()) {
	// Fx 4.0
	let replaced = <![CDATA[

if (gFindBar._currentWindow) {
	var controller = gFindBar._getSelectionController(gFindBar._currentWindow);
	var selection = controller.getSelection(controller.SELECTION_NORMAL);
	var margin = gFindBar._currentWindow.innerHeight / 4;
	try {
		var rect = selection.getRangeAt(0).getBoundingClientRect();
		if (rect.top < margin || rect.bottom > gFindBar._currentWindow.innerHeight - margin) {
			selection.QueryInterface(Components.interfaces.nsISelectionPrivate)
			         .scrollIntoView(controller.SELECTION_ANCHOR_REGION, true, 50, 80);
		}
	} catch (e) {  }
}
return res;

	]]>.toString();

	eval("gFindBar._findAgain = " + gFindBar._findAgain_org.toString().replace('return res;', replaced));
	eval("gFindBar._find = " + gFindBar._find_org.toString().replace('return res;', replaced));

} else {
// Fx 3.6
	let replaced = <![CDATA[

if (gFindBar._currentWindow && (res === 0 || res === 2)) {
	var controller = gFindBar._getSelectionController(gFindBar._currentWindow);
	var selection = controller.getSelection(controller.SELECTION_NORMAL);
	selection.QueryInterface(Ci.nsISelection2)
	         .scrollIntoView(controller.SELECTION_ANCHOR_REGION, true, 50, 50);
}
return res;

	]]>.toString();

	eval("gFindBar._findAgain = " + gFindBar._findAgain_org.toString().replace('return res;', replaced));
	eval("gFindBar._find = " + gFindBar._find_org.toString().replace('return res;', replaced));

}
