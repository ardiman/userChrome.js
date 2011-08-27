// ==UserScript==
// @name           ChromeStatusbarModoki.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// @version        0.0.2
// ==/UserScript==
(function(){
	var display = document.getElementById('statusbar-display');
	var tooltip = document.createElement('tooltip');
	tooltip.setAttribute('id', 'chrome-tooltip');
	tooltip.setAttribute('onmouseover', 'event.currentTarget.hidePopup();');
	var label = tooltip.appendChild(document.createElement('label'));
	label.setAttribute('id', 'chrome-tooltip-label');
	label.setAttribute('crop', 'end');// end or center.
	document.getElementById('mainPopupSet').appendChild(tooltip);

	tooltip.timer = null;
	tooltip.open = function(text){
		this.firstChild.setAttribute('value', text);
		if (this.state == 'open')
			return;
		// タイトルバー非表示で位置がずれる問題の修正
		var y = Math.abs(window.innerHeight - screen.availHeight) <= 4?
			gBrowser.clientHeight - 4:
			gBrowser.clientHeight;
		this.openPopup(gBrowser, 'before_start', 0, y);
		
		// タイマー処理
		if (this.timer)
			clearTimeout(this.timer);
		var self = this;
		this.timer = setTimeout(function(){
			self.hidePopup();
			self.timer = null;
		}, 5000);
	}

	// ステータスバーを監視
	display.addEventListener('DOMAttrModified', function(event){
		if (event.attrName != 'value') return;
		var text = event.newValue;
		if (text != '' && text != XULBrowserWindow.defaultStatus){
			tooltip.open(text);
		}
	}, false);


	// ステータスパネルをメニューバー内に
	var statusBar = document.getElementById('status-bar');
	statusBar.setAttribute('context', '');
	display.hidden = true;
	var insert = document.getElementById('search-container') || document.getElementById('urlbar-container');
	insert.parentNode.insertBefore(statusBar, insert.nextSibling);

	document.insertBefore(document.createProcessingInstruction(
	'xml-stylesheet',
	'type="text/css" href="data:text/css,' + encodeURI(
	<![CDATA[

		#chrome-tooltip {
			font-family: sans-serif !important;
			font-size: 10pt !important;
			white-space: nowrap !important; 

			-moz-appearance: none !important;
			background-color: #D2E1F6 !important;
			color: #646464 !important;
			border: 1px solid rgba(192, 192, 192, .2) !important;

			min-width: 20em !important;
			max-width: 60em !important;
			padding: 0 4px !important;
			margin: 0 !important;

		}
		#chrome-tooltip-label {
			margin: 0 !important;
		}

		#main-window:not([active="true"]) #chrome-tooltip{
			visibility: collapse !important;
		}

		#status-bar,
		#status-bar statusbarpanel {
			-moz-appearance: none !important;
			background-color: transparent !important;
			border: none !important;
		}

		#statusbar-display,
		#statusbar-progresspanel,
		.statusbar-resizerpanel
		{ display: none !important; }

	]]>.toString()
	) + '"'), document.documentElement);

})();
