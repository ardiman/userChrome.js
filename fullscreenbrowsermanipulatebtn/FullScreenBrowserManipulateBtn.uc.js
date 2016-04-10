// ==UserScript==
// @name           FullScreenBrowserManipulateBtn.uc.js
// @homepageURL    https://github.com/Drager-oos/userChrome/blob/master/userBtn/FullScreenBrowserManipulateBtn.uc.js
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function() {
	var FSBMBtn = {
		init: function() {
			$("window-controls").appendChild($C("button", {
				id: "FS-min",
				tooltiptext: "Minimieren",
				style: "list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATCAYAAACORR0GAAAAIElEQVQ4jWNgGAWjYBSMgsENNDQ0/uPDQ8+iUTAKqAoAQiAXcehWZP0AAAAASUVORK5CYII='); margin: 0px 1px 0px 0px; min-width: 26px; max-width: 26px; background: none;",
				oncommand: "window.minimize();",
			}));
			$("window-controls").appendChild($C("button", {
				id: "FS-max",
				tooltiptext: "Maximieren",
				style: "list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAYAAABlcqYFAAAALklEQVQ4jWNgGAVDEmhoaPzHh+niAIoNIOSDoWMJIblRSwafJRSDAc+Eo2BoAwBSdUfIdR+94AAAAABJRU5ErkJggg=='); margin: 0px 1px 0px 0px; min-width: 25px; max-width: 25px; background: none;",
				oncommand: "BrowserFullScreen();",
			}));
			$("window-controls").appendChild($C("button", {
				id: "FS-close",
				tooltiptext: "Schließen",
				style: "list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAATCAYAAAAEaoRHAAAAOElEQVRIie3UoRIAAAQEUf//0xSKpHFjX5Q23DADgHWepvczeuD54OLNds+YbLBMuNymZb8HgCcCOGxnmRIixesAAAAASUVORK5CYII='); margin: 0px 3px 0px 0px; min-width: 45px; max-width: 45px; background: #3B3B3B; opacity:0.95;",
				oncommand: "BrowserTryToCloseWindow();",
			}));
		}
	};
	var css = '\
		#FS-min,\
		#FS-max,\
		#FS-close {\
		-moz-appearance:none;\
		border:none;\
		display:-moz-box;\
		-moz-box-pack:center;\
		padding:0px;\
		}\
		#FS-min:hover {\
		list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATCAYAAACORR0GAAAAHUlEQVQ4jWNgGAWjYBSMgsEN/hMAQ8+iUTAKqAoAGsQ/wb4l19gAAAAASUVORK5CYII=")!important;\
		background:#3665B3!important;\
		}\
		#FS-max:hover {\
		list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAYAAABlcqYFAAAAK0lEQVQ4jWNgGAVDEvwnAOjiAIoNIOSDoWMJIblRSwafJRSDAc+Eo2BoAwDhusM9yjJALAAAAABJRU5ErkJggg==")!important;\
		background:#3665B3!important;\
		}\
		#FS-close:hover {opacity:0.8!important;}\
		#FS-min:hover:active, #FS-max:hover:active {background:#3D6099!important;}\
		#FS-close:hover:active {opacity:0.9!important;}\
		#main-window[inFullscreen="true"] .titlebar-placeholder[type="caption-buttons"],\
		#minimize-button,\
		#restore-button,\
		#close-button\
		{display:none!important;}\
		'.replace(/[\r\n\t]/g, '');;
	FSBMBtn.style = addStyle(css);
	FSBMBtn.init();

	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})();
