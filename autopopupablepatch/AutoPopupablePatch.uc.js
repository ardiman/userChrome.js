// ==UserScript==
// @name			AutoPopupablePatch.uc.js
// @namespace		AutoPopupablePatch@iwo.uc.js
// @description		让Stylish按钮的下拉菜单可以AutoPopup化
// @include			main
// @compatibility	        Firefox 18.0+
// @author			iwo
// @homepage		http://g.mozest.com/thread-27440-1-1
// @version			0.0.1.1
// @note				2013.01.28 initiate release version 0.0.1 for Stylish Only
// @note				It'll help more popupmenus to support AutoPopup.uc.js
// @updateURL     https://j.mozest.com/ucscript/script/94.meta.js
// @icon          http://j.mozest.com/images/uploads/icons/000/00/00/865bf886-db26-715d-adda-02e74f529fdc.jpg
// ==/UserScript==

/* :::: Stylish按钮菜单AutoPopup补丁 :::: */

(function () {
	var stylishBtn = document.getElementById("stylish-toolbar-button");
	if (!stylishBtn) return;
	var menupopup = document.getElementById("stylish-popup");
	if (!menupopup) return;

	stylishBtn.setAttribute("popup", "");//取消原来的下拉菜单
	stylishBtn.insertBefore(menupopup, stylishBtn.firstChild);

})();