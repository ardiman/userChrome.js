// ==UserScript==
// @name           StatusbarInURLBar3.uc.js
// @namespace      
// @include        main
// @compatibility  Firefox 4.0b7
// @note           Firefox 3.6, 4.0b6 点击这里
// ==/UserScript==

(function(){
	if (!isElementVisible(gURLBar)) return;//アドレスバーが無かったらストップ
	var urlbarIcons = document.getElementById('urlbar-icons');
	var statusBar = document.getElementById('status-bar');

	statusBar.setAttribute("context", "");//ツールバーのコンテキストメニューがでないように
	urlbarIcons.insertBefore(statusBar, urlbarIcons.firstChild);

	var style = <![CDATA[

#status-bar {
  min-height: 18px !important;
  margin: 0px !important;
  border: none !important;
  background-color: transparent !important;
}
/*
.urlbar-textbox-container-children {
  opacity: 1 !important;
  -moz-transition: none !important;
}

.urlbar-origin-label {
  display: none !important;
}

.urlbar-over-link-box {
  background-image: none !important;
  padding-left: 4px !important;
}
*/

	]]>.toString();
	var sspi = document.createProcessingInstruction(
		'xml-stylesheet',
		'type="text/css" href="data:text/css,' + encodeURI(style) + '"'
	);
	document.insertBefore(sspi, document.documentElement);
	sspi.getAttribute = function(name) {
		return document.documentElement.getAttribute(name);
	};
})()