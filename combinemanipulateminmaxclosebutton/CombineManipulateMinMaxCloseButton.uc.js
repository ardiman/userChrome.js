// ==UserScript==
// @name                  CombineManipulateMinMaxCloseButton.uc.js
// @namespace        CombineManipulateMinMaxCloseButton@iwo.uc.js
// @description        最小化最大化关闭合并按钮之可拖动版
// @include               main
// @compatibility     Firefox 4.0+
// @author                iwo
// @homepage         http://g.mozest.com/thread-42468-1-1
// @version              0.0.3.1
// @update              0.0.3.2012.10.11 remove original button context menu
// @update              0.0.2.2012.10.6   tested OK for MinimizeToTray revived  Extension
// @update              0.0.1.2012.09.16         
// @note                   build graggable Fx button reference thread: http://blog.bitcp.com/archives/452
// @updateURL     https://j.mozest.com/ucscript/script/83.meta.js
// @icon          http://j.mozest.com/images/uploads/icons/000/00/00/e44cfc37-36ca-60f6-dc02-04685b74cbe1.jpg
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/00/0102431b-18a1-1fb9-bb17-d47f06336c50.jpg http://j.mozest.com/images/uploads/previews/000/00/00/thumb-0102431b-18a1-1fb9-bb17-d47f06336c50.jpg
// ==/UserScript==

/* :::: 最小化最大化关闭浏览器三合一按钮 :::: */

(function minMaxCloseButton() {
// 添加按钮：
	
		function createBtn() {
	        var navigator = document.getElementById("navigator-toolbox");
			if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
			var BrowserManipulateBtn = document.createElement("toolbarbutton");
			BrowserManipulateBtn.id = "minMaxClose-button";/* 你的扩展 ID */
			BrowserManipulateBtn.setAttribute("type", "button");
			BrowserManipulateBtn.setAttribute("onclick", "BrowserManipulateCombine.onClick(event);");//MinToTray扩展gMinTrayR.minimize();
			BrowserManipulateBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
			BrowserManipulateBtn.setAttribute("removable", "true");
			BrowserManipulateBtn.setAttribute("oncontextmenu","return false");//remove original button context menu
			BrowserManipulateBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVQ4jWNgYGD4jwWTBCg2gBSDSTKcYgNwGUqRzfQzAJcYxQYQBahiAE0SF7pBVEn2VHEJ/VyANQwACylDvQ9eqkEAAAAASUVORK5CYII=)";
			
			const localeString = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale");
			
			const labelText = localeString.indexOf("zh") == -1?"Browser Manipulator":"\u6D4F\u89C8\u5668\u63A7\u5236\u6309\u94AE";//create variable Label & tooltip in languages
			
			const tooltipText = localeString.indexOf("zh") == -1?"Linksklick: Minimieren\nMittelklick: Wiederherstellen\nRechtsklick: Beenden":"\u5DE6\u952E\uFF1A\u6700\u5C0F\u5316\n\u4E2D\u952E\uFF1A\u6062\u590D\n\u53F3\u952E\uFF1A\u5173\u95ED\u6D4F\u89C8\u5668";

			BrowserManipulateBtn.setAttribute("label", labelText);
			BrowserManipulateBtn.setAttribute("tooltiptext", tooltipText);//提示工具条
			
			navigator.palette.appendChild(BrowserManipulateBtn);
		
		}
		
		BrowserManipulateCombine = {
			onClick: function(event) {
				switch(event.button) {
					case 0:
					// Left click
					window.minimize();
					break;
					case 1:
					// Middle click
					onTitlebarMaxClick();
					break;
					case 2:
					// Right click
					BrowserTryToCloseWindow();
					break;
				}
			}
		}
	
// 通过手动更新 toolbar 的 currentSet 特性来添加按钮到 toolbar 里
		function updateToolbar() {
		var toolbars = document.querySelectorAll("toolbar");
		Array.slice(toolbars).forEach(function (toolbar) {
		        var currentset = toolbar.getAttribute("currentset");
		        if (currentset.split(",").indexOf("minMaxClose-button"/* 你的扩展 ID */) < 0) return;
        		toolbar.currentSet = currentset;
        		try {
        		    BrowserToolboxCustomizeDone(true);
        		} catch (ex) {
        		}
    		});
		}

// 运行一次以上的功能函数
	createBtn();
	updateToolbar();

})();