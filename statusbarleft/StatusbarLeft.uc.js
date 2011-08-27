// ==UserScript==
// @name           ChromeStyle_Statusbar.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// ==/UserScript==

gBrowser.addEventListener("TabSelect", function(event){
	var statusbar = document.getElementById("status-bar");
	statusbar.hidden = true;
	setTimeout(function(){
		statusbar.hidden = false;
	},0);
}, false);


// CSS を書き出すだけなので Stylish に任せることをオススメします。
(function(){
	var style = <![CDATA[

#status-bar {
	position: fixed !important;
	z-index: 1000 !important;
	bottom: 0px !important;
	left: 0px !important;
	overflow-x: hidden !important;
	overflow-y: auto !important;
	padding: 0 !important;
	margin: 0 !important;
	min-height: 0 !important;

	-moz-appearance: none !important;
	border: none !important;
	background-color: #DEEAF8 !important;
	color: #646464 !important;
}

#status-bar { direction: rtl !important; }
#status-bar > * { direction: ltr !important;}

#statusbar-display{
	max-width: 500px !important;
}

#status-bar > statusbarpanel {
	-moz-appearance: none !important;
	border: none !important;
	vertical-align: middle !important;
}

#FindToolbar:not([hidden="true"]) + #status-bar{
	bottom: 25px !important;
}
#status-bar .statusbar-resizerpanel{
	display: none !important;
}

	]]>.toString();
	var sspi = document.createProcessingInstruction(
		'xml-stylesheet',
		'type="text/css" href="data:text/css,' + encodeURI(style) + '"'
	);
	document.insertBefore(sspi, document.documentElement);
	sspi.getAttribute = function(name) {
		return document.documentElement.getAttribute(name);
	};
})();
