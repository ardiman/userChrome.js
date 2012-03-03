// ==UserScript==
// @description  NewTabPlus.uc.js
// @description 新しいタブで開く（空白タブを利用）
// @include		chrome://browser/content/browser.xul
// @include 		chrome://browser/content/bookmarks/bookmarksPanel.xul
// @include 		chrome://browser/content/history/history-panel.xul
// @include 		chrome://browser/content/places/places.xul
// @compatibility	Firefox 4.0
// ==/UserScript==

(function() {

    /* ブックマーク＆履歴を新しいタブで開く */
    try {
  	var str = openLinkIn.toString();
		  str = str.replace('w.gBrowser.selectedTab.pinned',
	        '(!w.isTabEmpty(w.gBrowser.selectedTab) || $&)');
		  str = str.replace(/&&\s+w\.gBrowser\.currentURI\.host != uriObj\.host/,'');
		  eval("openLinkIn = " + str);
    }catch(e){}

    /* URLバーから新しいタブで開く */
    try {
		location=="chrome://browser/content/browser.xul"&&eval("gURLBar.handleCommand="+gURLBar.handleCommand.toString().replace(/^\s*(load.+);/gm,"/^javascript:/.test(url)||content.location=='about:blank'?$1:gBrowser.loadOneTab(url, {postData: postData, inBackground: false, allowThirdPartyFixup: true});"))
    }catch(e){}

    /* 検索バーから新しいタブで開く */
    try {
        var searchbar = document.getElementById("searchbar");
        eval("searchbar.handleSearchCommand="+searchbar.handleSearchCommand.
            toString().replace(/this.doSearch\(textValue, where\);/,
            "if (!gBrowser.webProgress.isLoadingDocument && gBrowser.curren"
            +"tURI.spec=='about:blank') where='current'; else where='tab'; "
            +"$&"));
    }catch(e){}

})();
 
	/* 空白タブが存在する場合利用する */
	function _LoadURL(aTriggeringEvent, aPostData)
	{
		var where = (gBrowser.currentURI.spec!='about:blank' ||
			gBrowser.webProgress.isLoadingDocument) ? 'tab' :'current';
		if (gURLBar.value!='') openUILinkIn(gURLBar.value, where);
		return true;
	}

	/* タブをダブルクリックで閉じる */
	gBrowser.mTabContainer.addEventListener('dblclick', function (event){
	if (event.target.localName == 'tab' && event.button == 0){
		document.getElementById('cmd_close').doCommand();
		}
	}, false);
