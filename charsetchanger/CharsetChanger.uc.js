// ==UserScript==
// @name				Charset Changer
// @description	文字を指定し、各サイト…
// @include			chrome://browser/content/browser.xul
// @version			0.0.1
// ==/UserScript==
gBrowser.addEventListener("DOMContentLoaded", function(event) {
	var aDoc = event.target;
	if (aDoc instanceof HTMLDocument) {
		var gBro = getBrowser().getBrowserForDocument(aDoc);
		if(gBro.webNavigation.loadType == 67108866) return;
		var URL = gBro.currentURI.spec;
		if ( URL.indexOf( "about:" , 0 ) == 0 ) return;

		var LIST = [
			["http://www.daionet.gr.jp/~knok/kakasi/" , "ISO-2022-JP"],
			["http://www.namazu.org/windows/" , "ISO-2022-JP"],
		];

		for (var i=0;i < LIST.length; i++){
			if ( URL.indexOf( LIST[i][0] , 0 ) == 0 ) {

				var aDocCharset = gBro.docShell.QueryInterface(Components.interfaces.nsIDocCharset);

				if (LIST[i][1] && (aDocCharset.charset != LIST[i][1])) {
					aDocCharset.charset = LIST[i][1];
					gBro.webNavigation.reload(nsIWebNavigation.LOAD_FLAGS_CHARSET_CHANGE);
				}

				break;
			}
		}
	}
}, false);