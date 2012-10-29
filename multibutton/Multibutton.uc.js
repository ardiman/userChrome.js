// ==UserScript==
// @name           Multibutton.uc.js
// @namespace        
// @description    多功能按钮
// @include        main
// @compatibility  Firefox 15.0+
// @author         runking/jam
// @homepage   	   https://dl.dropbox.com/u/4865882/runking%40jam.uc.js
// @version        0.0.1.2012.10.10
// @updateURL      https://dl.dropbox.com/u/4865882/runking%40jam.uc.js
//                 已知BUG：
//				   1.打开书签、历史会使菜单栏显出来。（暂时不准备修复）
//				   2.右键打开历史会触动火狐的另一个事件。
//				   3.预留。
// ==/UserScript==

/* :::: 多功能按钮 :::: */

(function minMaxCloseButton() {
// 添加按钮：
	
		function createBtn() {
	        var navigator = document.getElementById("navigator-toolbox");
			if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
			var BrowserManipulateBtn = document.createElement("toolbarbutton");
			BrowserManipulateBtn.id = "Multibutton";/* 你的扩展 ID */
			BrowserManipulateBtn.setAttribute("type", "button");
			BrowserManipulateBtn.setAttribute("onclick", "BrowserManipulate.onClick(event);");
			BrowserManipulateBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
			BrowserManipulateBtn.setAttribute("removable", "true");
			BrowserManipulateBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEXSURBVHjaxFPLasJAFL1TErKri%2FyH3ahduitUEcEWEf9g%2BkHxD1xkUa2vQsX%2BVIQQ8xg9l0yMiekmi144zM29Zw6Tc2eEUorqhPHUfq4l8EA1Qws4F6gUzh%2F8Ek80Wx2sajoeMmPufmGZXfBxZ7Ms8ET2C0mSUBzHNHkf4FMWTsKb0QMH3MxEnaARhiEJIWg86pP7uZU5AYlaEASEqZmmWTYxiiI6nUJefd%2Bnt%2BGrPolEjlqec1cA3qy%2Ff8kwDDoePeq9dBnIUUMPnEoBfakW6x%2ByLIs8z2MgR43dVpUCMSON2Wp3INu2GcjTyRR5VxMbjcf8yHiEy81eG6nHKgu87B44qWFVd%2BBmnHmeFvi%2FtyDqPuezAAMABs2WdpRE3M8AAAAASUVORK5CYII%3D)"; //找到好看的图标自己改吧。
			
			
			const localeString = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale");
			
			const labelText = localeString.indexOf("zh") == -1?"Multibutton":"\u591a\u529f\u80fd\u6309\u94ae";//create variable Label & tooltip in languages
			
			const tooltipText = localeString.indexOf("zh") == -1?"Linksklick: Lesezeichen\nMittelklick: Vor/Zurück Menü \nRechtsklick: Chronik":"\u5de6\u952e\uff1a\u4e66\u7b7e\n\u4e2d\u952e\uff1a\u6807\u7b7e\u5386\u53f2\n\u53f3\u952e\uff1a\u5386\u53f2";

			BrowserManipulateBtn.setAttribute("label", labelText);
			BrowserManipulateBtn.setAttribute("tooltiptext", tooltipText);//提示工具条
			
			navigator.palette.appendChild(BrowserManipulateBtn);
		
		}
		
		BrowserManipulate = {
			onClick: function(event) {
				switch(event.button) {
					case 0:
					// Left click					
					//var BMB_bookmarksPopup = document.getElementById("BMB_bookmarksPopup");BMB_bookmarksPopup.openPopupAtScreen(event.screenX,event.screenY,true);
					
					var bookmarksMenuPopup = document.getElementById("bookmarksMenuPopup");bookmarksMenuPopup.openPopupAtScreen(event.screenX,event.screenY,true); //两个不一样。这个需要把那个带三角的书签栏拖出来。*/
					
					
					
					break;
					case 1:
					// Middle click
					var backForwardMenu = document.getElementById("backForwardMenu");backForwardMenu.openPopupAtScreen(event.screenX,event.screenY,true);

					break;
					case 2:
					// Right click
					
						var goPopup = document.getElementById("goPopup");goPopup.openPopupAtScreen(event.screenX,event.screenY,true);
					
						
					break;
				}
			}
		}
		
	
// 通过手动更新 toolbar 的 currentSet 特性来添加按钮到 toolbar 里
		function updateToolbar() {
		var toolbars = document.querySelectorAll("toolbar");
		Array.slice(toolbars).forEach(function (toolbar) {
		        var currentset = toolbar.getAttribute("currentset");
		        if (currentset.split(",").indexOf("Multibutton"/* ID des Buttons, neben dem der Multibutton positioniert werden soll */) < 0) return;
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
//    autoAddBtn();

})();

document.getElementById('Multibutton').setAttribute('oncontextmenu','return false');