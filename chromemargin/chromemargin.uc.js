// ==UserScript==
// @name           chromemargin.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @description    タイトルバーを枠だけにする
// @include        main
// @compatibility  Firefox 4
// @version        0.0.1
// ==/UserScript==

(function(css){
	// Windows XP and Firefox 4 only
	if (navigator.oscpu !== 'Windows NT 5.1') return;
	if (!document.getElementById('titlebar')) return;

	// タイトルバーを非表示にして、Firefox Button などを一番上のツールバーに挿入する関数
	updateAppButtonDisplay_org = updateAppButtonDisplay;
	updateAppButtonDisplay = function(){
		document.documentElement.setAttribute('chromemargin', '4,-1,-1,-1');
		//document.documentElement.setAttribute('chromemargin', '2,2,2,2');
		document.getElementById('titlebar').hidden = true;

		let toolbars = Array.slice(document.querySelectorAll('#navigator-toolbox > toolbar'));
		let toolbar = toolbars.reduce(function(ret, toolbar){
			if ('menubar' === toolbar.type && toolbar.hasAttribute('autohide'))
				return ret;
			let style = getComputedStyle(toolbar, '');
			if ('fixed' === style.position)
				return ret;
			let {y, height} = toolbar.boxObject
			if (height > 0 && y < ret.y) {
				ret.toolbar = toolbar;
				ret.y = y;
			}
			return ret;
		}, { toolbar: null, y: Infinity }).toolbar;

		if (!toolbar) toolbar = document.getElementById('toolbar-menubar');
		if (document.getElementById('appmenu-button-container').parentNode != toolbar) {
			toolbar.insertBefore(document.getElementById('appmenu-button-container'), toolbar.firstChild);
			toolbar.appendChild(document.getElementById('titlebar-buttonbox'));
		}
	}


	// Firefox Button と閉じるボタンの横でウインドウのドラッグを可能にする
	let tmp = {};
	Components.utils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);

	let ff = document.getElementById('appmenu-button-container');
	ff.WindowDraggingElement = new tmp.WindowDraggingElement(ff, window);
	ff.WindowDraggingElement.dragTags = ["hbox"];
	ff._alive = true;

	let cl = document.getElementById('titlebar-buttonbox');
	cl.WindowDraggingElement = new tmp.WindowDraggingElement(cl, window);
	cl.WindowDraggingElement.dragTags = ["hbox"];
	cl._alive = true;

	TabsOnTop.toggle_org = TabsOnTop.toggle;
	eval("TabsOnTop.toggle = " + TabsOnTop.toggle_org.toString().slice(0, -1) + 'updateAppButtonDisplay();}');

	let toolbox = document.getElementById('navigator-toolbox');
	toolbox.addEventListener('aftercustomization', updateAppButtonDisplay, false);
	
	addEventListener('unload', function(event) {
		toolbox.removeEventListener('aftercustomization', updateAppButtonDisplay, false);
	}, false);

	addStyle(css);

	setTimeout(updateAppButtonDisplay, 1000);

	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})(<![CDATA[
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);

#appmenu-button-container {
  padding: 0px 16px 0px 0px !important;
}

#appmenu-button{
  list-style-image: url("chrome://branding/content/icon16.png") !important;
  min-width: 0px !important;
  padding: 2px !important;
}

#appmenu-button .button-text {
  display: none !important;
}

#titlebar-buttonbox {
  -moz-appearance: none !important;
  -moz-box-align: start !important;
  padding: 0px 0px 0px 16px !important;
}

#titlebar-min,
#titlebar-max,
#titlebar-close {
  -moz-appearance: none !important;
  list-style-image: url("chrome://global/skin/icons/windowControls.png") !important;
  padding: 0px !important;
  margin: 0px !important;
}

#titlebar-min                { -moz-image-region: rect(0, 16px, 16px, 0); }
#titlebar-min:hover          { -moz-image-region: rect(16px, 16px, 32px, 0); }
#titlebar-min:hover:active   { -moz-image-region: rect(32px, 16px, 48px, 0); }
#titlebar-max                { -moz-image-region: rect(0, 32px, 16px, 16px); }
#titlebar-max:hover          { -moz-image-region: rect(16px, 32px, 32px, 16px); }
#titlebar-max:hover:active   { -moz-image-region: rect(32px, 32px, 48px, 16px); }
#titlebar-close              { -moz-image-region: rect(0, 48px, 16px, 32px); }
#titlebar-close:hover        { -moz-image-region: rect(16px, 48px, 32px, 32px); }
#titlebar-close:hover:active { -moz-image-region: rect(32px, 48px, 48px, 32px); }

#main-window[inFullscreen="true"] #titlebar-buttonbox,
#main-window:not([chromemargin]) #titlebar-buttonbox,
#main-window:not([chromemargin]) #appmenu-button-container {
  display: none !important;
}

]]>.toString());