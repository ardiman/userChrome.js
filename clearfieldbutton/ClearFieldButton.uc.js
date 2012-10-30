// ==UserScript==
// @name                  ClearFieldButton.uc.js
// @namespace        ClearFieldButton@iwo.uc.js
// @description        清空地址栏搜索栏输入框查找栏按钮之可拖动版
// @include               main
// @compatibility     Firefox 4.0+
// @author                iwo
// @homepage        http://http://g.mozest.com/viewthread.php?tid=42587
// @version              0.1.0.2
// @note                   2012.10.26 initiate release
// @note                   Special thanks to Alice0775 & Joji Ikeda for creative splendid ideas
// @note                   build graggable Fx button reference thread: http://blog.bitcp.com/archives/452
// @updateURL     https://j.mozest.com/ucscript/script/84.meta.js
// @icon          http://j.mozest.com/images/uploads/icons/000/00/00/00512025-3216-6d55-b488-226de3b0d73c.jpg
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/00/d89b22c9-cc17-0217-049f-8ad78e2b8bc3.jpg http://j.mozest.com/images/uploads/previews/000/00/00/thumb-d89b22c9-cc17-0217-049f-8ad78e2b8bc3.jpg
// ==/UserScript==

/* :::: 清空地址栏搜索栏输入框查找栏四合一按钮 :::: */

(function clearFieldButton() {
// 添加按钮：
	
		function createBtn() {
	        var navigator = document.getElementById("navigator-toolbox");
			if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
			var ClearFieldBtn = document.createElement("toolbarbutton");
			ClearFieldBtn.id = "clearField-button";/* 你的扩展 ID */
			ClearFieldBtn.setAttribute("type", "button");
			ClearFieldBtn.setAttribute("onclick", "ClearField.onClick(event);");//
			ClearFieldBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
			ClearFieldBtn.setAttribute("removable", "true");
			ClearFieldBtn.setAttribute("oncontextmenu","return false");//去掉Fx原本的右键菜单（按钮定制菜单）
			ClearFieldBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gUaERUFpcy2xQAAAs9JREFUeNqVkj1sW2UUhp/vu9/19bWvHSl2f6KW/LTYiZtCMGoiNYhIBXVArVphsbSiDLQsbXc2NlZWEBJI3ejCRCaEBOqPOgBKKldp1JLIdrix47hthH8Sx/f7GG4wA0PDWY7Okc6j9z16Bf+jIt9EMpl05ttzJ84NHk8f/7yu6j8+bD5sWPsmfM1AKpH67NLkpcKVzJUDylVnS5RG1+PrvtoX4CssacvL08PTHxZGC3jCo0kz2Yq0LrdoBfuCJHeTZ1OvpG5emLwQc6IOZcpUqODjiyrVxEshH1//ZGKx+/uNk7mTmVgiJlZZpUaNFVYomRLloIy4fevLVHdn+0Sr1UyFZwIhQErJVuOFt9Hsvi9j7nv6UOAm3k2gRhS+4/NYPqa4XTT13+rfq7iX/GL6rXc+woAxBgQIIYj0Aip37/FrucLkmTNIIXgw/4Bqqoqf91kbWmOrstXNbeU2VS8IJtIHh4AQYozBaI1z7y7ez7/wYnycP548YXhkhNmZWZaXl3F+cAgGA6Zendq99sa1dWUCTRAEfQCALJWIfHcbd2qKuUKB4uIiSwsLPLdtnGiUw/HDZKNZZsdn42OHxnpKa02v1+sDANT9+1ieB+fPE7Nt3hwYYMxxWHn6lIVOh8SRI8y8PcfowdFdx3KM0jpUorXGGBP+Y2cHslnodmFjA+X7HHj2jMFqldd8H/J5ItlMy3IcBQiljaHX6/UtCSFop9PE5+ex2m1EMgmNBqyuYlUqxE6dgosXIZGI7QnXyphQyT8QKSXt06epuy7JO3eIFotYnQ5sbsLwMFy9CkePhlkIa0gZTN8OgNYaYVl0Z2Z4nsvhPXqEu7SEFY9jzc0h8vn/BFJ1O9vtem19DxLakdJCKYVlSf7KjWNnjmG7MWzPQ/prCPEvIBp1O6pe+/PTzZ9qH+ggcPcCixASIcLkhj2cZbjo+1DKbkxMvn7rb3caLimXY/cAAAAAAElFTkSuQmCC)";
			
			const localeString = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale");
			
			const labelText = localeString.indexOf("zh") == -1?"Eingabefeld löschen":"\u6E05\u7A7A\u5404\u8F93\u5165\u680F";//create variable Label & tooltip in languages
			
			const tooltipText = localeString.indexOf("zh") == -1?"Linksklick: Suchleiste löschen\nMittelklick: Eingabefeld löschen\nRechtsklick: Adressleiste löschen":"\u6E05\u7A7A\u5404\u8F93\u5165\u680F\n\u5DE6\u952E\uFF1A\u641C\u7D22\u680F\n\u4E2D\u952E\uFF1A\u8F93\u5165\u6846\n\u53F3\u952E\uFF1A\u5730\u5740\u680F";

			ClearFieldBtn.setAttribute("label", labelText);
			ClearFieldBtn.setAttribute("tooltiptext", tooltipText);//提示工具条
			
			navigator.palette.appendChild(ClearFieldBtn);

		}
		
		ClearField = {
			onClick: function(event) {
				switch(event.button) {
					case 0:
					// Left click
					(function(){var searchbar = document.getElementById("searchbar"); if (searchbar) { searchbar.textbox.value = ""; var evt = document.createEvent("Events"); evt.initEvent("oninput", true, true); searchbar.dispatchEvent(evt);  searchbar.focus();}})();
					break;
					case 1:
					// Middle click
					(function(){ var theBox = document.commandDispatcher.focusedElement;  if(theBox){theBox.value = "";var evt = document.createEvent("Events");evt.initEvent("oninput", true, true);theBox.dispatchEvent(evt);theBox.focus();} })();
					break;
					case 2:
					// Right click
					(function(){var urlbar = document.getElementById("urlbar");if (urlbar){urlbar.value = "";urlbar.focus();}})();
					break;
				}
			}
		}
		
		function createFindBarClearBtn() {
			var refNode = document.getAnonymousElementByAttribute(gFindBar, 'anonid', 'find-next');
			if (!refNode) return;
			
			const locale = (Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale")).indexOf("zh")==-1;

			var ClearFindbarBtn = document.createElement("toolbarbutton");

			ClearFindbarBtn.setAttribute("id", "clearFindbar-button");
			ClearFindbarBtn.setAttribute("type", "button");
			ClearFindbarBtn.setAttribute("class", "toolbarbutton-1");
			ClearFindbarBtn.setAttribute("oncommand", "clearFindbarTweak.onCommand(event);");
			ClearFindbarBtn.setAttribute("tooltiptext", locale?"Suchleiste löschen":"\u6E05\u7A7A\u67E5\u627E\u680F");//提示工具条

			ClearFindbarBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gUaERUFpcy2xQAAAs9JREFUeNqVkj1sW2UUhp/vu9/19bWvHSl2f6KW/LTYiZtCMGoiNYhIBXVArVphsbSiDLQsbXc2NlZWEBJI3ejCRCaEBOqPOgBKKldp1JLIdrix47hthH8Sx/f7GG4wA0PDWY7Okc6j9z16Bf+jIt9EMpl05ttzJ84NHk8f/7yu6j8+bD5sWPsmfM1AKpH67NLkpcKVzJUDylVnS5RG1+PrvtoX4CssacvL08PTHxZGC3jCo0kz2Yq0LrdoBfuCJHeTZ1OvpG5emLwQc6IOZcpUqODjiyrVxEshH1//ZGKx+/uNk7mTmVgiJlZZpUaNFVYomRLloIy4fevLVHdn+0Sr1UyFZwIhQErJVuOFt9Hsvi9j7nv6UOAm3k2gRhS+4/NYPqa4XTT13+rfq7iX/GL6rXc+woAxBgQIIYj0Aip37/FrucLkmTNIIXgw/4Bqqoqf91kbWmOrstXNbeU2VS8IJtIHh4AQYozBaI1z7y7ez7/wYnycP548YXhkhNmZWZaXl3F+cAgGA6Zendq99sa1dWUCTRAEfQCALJWIfHcbd2qKuUKB4uIiSwsLPLdtnGiUw/HDZKNZZsdn42OHxnpKa02v1+sDANT9+1ieB+fPE7Nt3hwYYMxxWHn6lIVOh8SRI8y8PcfowdFdx3KM0jpUorXGGBP+Y2cHslnodmFjA+X7HHj2jMFqldd8H/J5ItlMy3IcBQiljaHX6/UtCSFop9PE5+ex2m1EMgmNBqyuYlUqxE6dgosXIZGI7QnXyphQyT8QKSXt06epuy7JO3eIFotYnQ5sbsLwMFy9CkePhlkIa0gZTN8OgNYaYVl0Z2Z4nsvhPXqEu7SEFY9jzc0h8vn/BFJ1O9vtem19DxLakdJCKYVlSf7KjWNnjmG7MWzPQ/prCPEvIBp1O6pe+/PTzZ9qH+ggcPcCixASIcLkhj2cZbjo+1DKbkxMvn7rb3caLimXY/cAAAAAAElFTkSuQmCC)";
			
			refNode.parentNode.insertBefore(ClearFindbarBtn, refNode);
			
			// Some codes are from Findbar Basics extension - CatThief - www.tom-cat.com/mozilla. Thanks.
			// Clear button.
			clearFindbarTweak = {
				onCommand: function(event) {
					var findBar = document.getElementById('FindToolbar');
					var findField = document.getElementById('FindToolbar').getElement('findbar-textbox');
					var highlightBtn = findBar.getElement("highlight");
					
					if (findBar.hidden == false) {
						findField.focus();
						findField.select();
						//NG unfortunately
						//goDoCommand('cmd_delete');
						findField.value = "";
						//uncomment below to reuse the code for disable Highlight simultaneously
						//if (findBar.toggleHighlight) {
						//	findBar.toggleHighlight(false);
						//	highlightBtn.removeAttribute("checked");
						//}
					}
					else return;
				}
			}
		
		}
	
// 通过手动更新 toolbar 的 currentSet 特性来添加按钮到 toolbar 里
		function updateToolbar() {
			var toolbars = document.querySelectorAll("toolbar");
			Array.slice(toolbars).forEach(function (toolbar) {
		        var currentset = toolbar.getAttribute("currentset");
		        if (currentset.split(",").indexOf("clearField-button"/* 你的扩展 ID */) < 0) return;
        		toolbar.currentSet = currentset;
        		try {
        		    BrowserToolboxCustomizeDone(true);
        		} catch (ex) {
        		}
    		});
		}

// 运行一次以上的功能函数
		createBtn();
		createFindBarClearBtn();
		updateToolbar();

})();