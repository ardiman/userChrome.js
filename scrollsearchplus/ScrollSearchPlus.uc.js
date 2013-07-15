// ==UserScript==
// @name           Scroll Search Plus 搜索增强
// @include        chrome://browser/content/browser.xul
// ==/UserScript==

(function() {
	var searchMenu = document.getElementById("context-searchselect");
	searchMenu.className = "menuitem-iconic";
	
	// update icon when opening context menu 打开右键菜单时更新图标
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function(event) {
		if (!gContextMenu || !gContextMenu.isTextSelected)
			return;
		var ss = Cc["@mozilla.org/browser/search-service;1"]
		         .getService(Ci.nsIBrowserSearchService);
		var engine = document.getElementById("searchbar") ? 
		             ss.currentEngine : ss.defaultEngine;
		if (engine.iconURI)
			document.getElementById("context-searchselect").setAttribute("src", engine.iconURI.spec);
	}, false);
	
	// enable to change the engine with scroll wheel 右键菜单 允许鼠标滚轮切换搜索引擎
	searchMenu.addEventListener("DOMMouseScroll", function(event) {
		var searchBar = document.getElementById("searchbar");
		    searchBar.selectEngine(event, event.detail > 0);
		// update label 更新搜索标签
		var menu = event.originalTarget;
		var label = gNavigatorBundle.getFormattedString(
			"contextMenuSearchText",
			[searchBar.currentEngine.name, getBrowserSelection(16)]
		);
		menu.setAttribute("label", label);
		// update icon 更新图标
		var iconURI = searchBar.currentEngine.iconURI;
		if (iconURI)
			menu.setAttribute("src", iconURI.spec);
		else
			menu.removeAttribute("src");
	}, false);
	
	// enable to search with middle-click on menu 允许鼠标中间点击搜索
	searchMenu.addEventListener("click", function(event) {
		if (event.button == 1) {
			event.target.doCommand();
			event.target.parentNode.hidePopup();
		}
	}, false);
	var searchBar = document.getElementById("searchbar");
	// enable to search with middle-click on searchbar 搜索栏中 允许鼠标滚轮切换搜索引擎
	searchBar.addEventListener("DOMMouseScroll", function(event) {
        this.selectEngine(event, (event.detail > 0));
    }, true);
	
    // right click the search engine button to clear the search box 搜索栏中 右键单击搜索图标清除搜索文字
	document.getAnonymousElementByAttribute(searchBar, "anonid", "searchbar-engine-button")
	.addEventListener("click", function(event) {
		if (event.button == 2) {
		    event.preventDefault();
            event.stopPropagation();
	        searchBar.value = "";
			searchBar.doCommand();
		}
	}, false);
	
	
	//以下为自行添加整合的其他相关脚本
	//鼠标移动到搜索栏自动聚焦 SearchbarGetElementByIdWhenMouseOver.uc.js
	document.getElementById("searchbar").addEventListener("mouseover",
    function(e) { document.getAnonymousElementByAttribute(document
    .getElementById("searchbar"), "class", "searchbar-textbox").
    select(); }, false);
	
	//更换搜索引擎后立即搜索 switchsearchandgo.uc.js
	(function() {
		var searchbar = document.getElementById("searchbar");
		eval("searchbar.select = " + searchbar.select.toString().replace(/}$/,
			"if (this.getAttribute('empty') != true && this.textbox.value.length)\
			this.textbox.onTextEntered();\
			}")
		);
	})();

	//在搜索后自动弹回browser.search.defaultenginename中设置的搜索引擎并清空搜索框 UndoSearchEngine.uc.js
	(function() {
		var sb = BrowserSearch.searchBar;
		if(sb) {
			sb.handleSearchCommand_original = sb.handleSearchCommand;
			sb.handleSearchCommand = function(e) {
				this.handleSearchCommand_original(e);
				setTimeout(function() {
					var ss = Cc['@mozilla.org/browser/search-service;1'].getService(Ci.nsIBrowserSearchService);
				
					ss.currentEngine = ss.defaultEngine;
					//清空搜索框关键字
					document.getElementById('searchbar').value = '';
				}, 1500);
			};
		}
	})();

}());


