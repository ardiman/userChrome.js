// ==UserScript==
// @name        SidebarSwitch
// @include     main
// @include     chrome://browser/content/browser.xul
// @version     1.0.0
// @description サイドバーのタイトル部分をクリックするとパネル切り替えメニューを表示するようにします。
// ==/UserScript==
// @version        2010/08/22 制作。

(function(){

var SidebarSwitch = {
	menu: "",
	init: function(){
		var  element = document.getElementById("viewSidebarMenu");
		var sidebarTitle = document.getElementById("sidebar-title");
		this.menu = element.cloneNode(true);
		this.menu.setAttribute("ID","sidebarSwitchMenu");
		document.getElementById('mainPopupSet').appendChild(this.menu);

		
		sidebarTitle.addEventListener('click', function(){
			SidebarSwitch.menu.openPopup(this, 'after_start', 0, 0, false, true);
		}, false);
	},
}
SidebarSwitch.init();

})();