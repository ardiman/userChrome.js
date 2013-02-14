// ==UserScript==
// @name			AutoCopyLite.uc.js
// @description		マウスで選択した文字列をクリップボードにコピーします。
// @version			1.0.1c
// @author			y2k
// @include			main
// @namespace		http://tabunfirefox.web.fc2.com/
// @note			19以降で編集可能領域でもコピーされるのをとりあえず修正
// ==/UserScript==

(function() {
var startCopy = false;

window.addEventListener("mousedown", function(e) {
	var localName = e.target.localName;
	if (localName === 'input' || localName === 'textarea' || localName === 'textbox' || localName === 'password') return;
	if ((e.button == 0) && (e.target instanceof HTMLElement))
		startCopy = true;
}, false);

window.addEventListener("mouseup", function(e) {
	if ((e.button == 0) && startCopy) {
		var selection = getBrowserSelection();
		if (selection)
			goDoCommand("cmd_copy");
		startCopy = false;
	}
}, false);
})();
