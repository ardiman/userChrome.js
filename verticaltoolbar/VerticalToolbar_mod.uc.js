// ==UserScript==
// @name         Vertical Toolbar(mod)
// @namespace    http://www.xuldev.org/
// @description  Adds vertical toolbar to browser window.
// @include      main
// @author       Gomita
// @version      1.0.20080201
// @homepage     http://www.xuldev.org/misc/ucjs.php
// @Note		アドオンを開くボタンを追加
// @Note		SidebarButton が別途必要
// @Note		SidebarButton でアドオンの disp が trueである事が必要(default)
// @Note		アドオンを開くボタンの挿入位置はコメントアウトを入れ替える
// @Note		default は大きいボタンで履歴の後に挿入
// ==/UserScript==
(function() {
	var mode = "icons";	// "icons", "text" or "full"
	var size = "large";	// "small" or "large"
	// array of toolbar item id, "separator", "spring" and "spacer".
	var currentSet = [
		"new-tab-button",
		"new-window-button",
		"fullscreen-button",
		"separator",
		"bookmarks-button",
		"history-button",
		"downloads-button",
		"separator",
		"rdr-button",
		"greasemonkey-tbb",
		"btn_sessionmanager",
		"spring",
		"cut-button",
		"copy-button",
		"paste-button",
		"separator",
		"print-button",
	];
	var toolbox = document.createElement("toolbox");
	document.getElementById("browser").insertBefore(
		toolbox, document.getElementById("sidebar-box")
	);
	toolbox.palette = document.getElementById("navigator-toolbox").palette;
	var toolbar = document.createElement("toolbar");
	toolbox.appendChild(toolbar);
	toolbar.id = "vertical-toolbar";
	toolbar.className = "chromeclass-toolbar";
	toolbar.setAttribute("mode", mode);
	toolbar.setAttribute("iconsize", size);
	toolbar.setAttribute("orient", "vertical");
	toolbar.setAttribute("flex", "1");
	currentSet.forEach(function(id){ toolbar.insertItem(id); });
	if (currentSet.indexOf("spacer") < 0 && currentSet.indexOf("separator") < 0)
		return;
	// Thanks - http://nanto.asablo.jp/blog/2007/04/22/1459018
	var style = <![CDATA[
		toolbar[orient="vertical"] > toolbarspacer { height: 15px; }
		toolbar[orient="vertical"] > toolbarseparator {
			-moz-appearance: none !important;
			margin: 0.2em 2px;
			border-bottom: 1px solid ThreeDHighlight;
			border-top: 1px solid ThreeDShadow;
			height: 2px;
			border-left: none;
			border-right: none;
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

// -------------------- ここから -----------------------------------------------------------------------
	var addonButton = document.createElement("toolbarbutton");
	addonButton.id = "viewAdd-onsSidebar-Button";	// sidebarbotton アドオン の id
	addonButton.setAttribute("tooltiptext", "Addons");
	addonButton.setAttribute("type", "checkbox");
	addonButton.setAttribute("observes", "viewAdd-onsSidebar");	// sidebarbotton アドオン の id
	addonButton.setAttribute("autoCheck", "false");
	addonButton.setAttribute("oncommand", "toggleSidebar('viewWebPanelsSidebar');");
	addonButton.setAttribute("style", "padding-left: 6px !important;padding-right: 0px !important;");
	if (size == "small" ) {
		addonButton.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwOC8xMS8wNdiEE10AAAAldEVYdFNvZnR3YXJlAE1hY3JvbWVkaWEgRmlyZXdvcmtzIE1YIDIwMDSHdqzPAAADFElEQVR4nGWTy2tcZRjGn+8y58wl5yQzmZnMZC4poRvdqBFFEWxp6T6CtKi4FcGFm/bvMIjgRjdFwYVY3LkQLILdNFpTFZJo22RaO0mmc3Jmzpzbd3Uh0Vqf3W/x/Hh54SGtDR8nWW5333dLpQ1tLTIjAMASa4k2ahCFxxfyWbaLJ8Ifhxmyd893L8AvechNBqFzwuFg8+DH/g/jvTMe3P8J6ONQyMnl6/vfXacOAy0TeJ6HYT60u6PtT5e0f+3JMgDwhInnEP0NafhwWzTUtRdWXjq72uiDWoqd8e9BsB9+BIIllNBzOd9miqYnAtL5omXP989BaQFYgnKhjLVTz2JveheEACUyh1v3t8AIwx+TO7i3d/fFCpyb/1zQLDVxrv8qags1zESEg+QA9+MBNDQSmWBiQ/RaTbi0CGkE9uN7x5XFUvWQBa/5qvINF0bgp4OfcWPzRrC2vFabK5YAB1BGwRiFTGdIVYoid5HoFKRgy3LOXnnKf/qdw9mDHVZYZ1cehIPPB/uDtwIzfnnZ73SdYgGpTiCNhDACQkukKkHLW0LsZuu9evdsp9zGMD6qs+IZsiGi7EtOWRiKMKr5jdeb83VEYgqpBXItIW2OTKeIVYSV+b4nkCIVM4RpCs4MTU4eogSG0igInSLXGYSRkEZAGgVtDBIdQ1mFIB9jwdRgYUBp3fmE+nwdABYb3tuUWsxkBEoYHFoAoxTS5BA6Q81dRJ5Z1HgTnDFoq8Cqlxa+Pt1YvXSoRo3OQu9ix2+WwtkUh5MAQTRBkubghkFrhWmcYevO7cuJjFue4y8FyQicEoplv0044+/57hyCdIKd0e6v0yi4KifkW7eKN+a9xYur9VMrUTqGGxau6kJ+8ze5/YGjycfcwGAij4GyAByNwaM/zfjo+M2ycX8pcAARbj2Uo61qufoZIwyybHpOzL8vxOR5C4Aqo8HAQXKGWZSiP98mzXb9K+bQNgCYin2l22h92KhUIa0EsbD/2cJxFmJzeBsEFBYWlIAkMj1tqeq64MOMyGceZWEtPsoxEzHgAhD/Cv4CPpmS94tvKfEAAAAASUVORK5CYII=)";
	} else {
		addonButton.style.listStyleImage = "url(data:image/png;base64,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)";
	}
// ---------------------- 履歴(history-button)の後に挿入-------------------------------------------
	toolbar.insertBefore(addonButton, document.getElementById("history-button").nextSibling);
// ---------------------- ツールバーの末尾に挿入---------------------------------------------------
//	toolbar.appendChild(addonButton);
// -------------------- ここまで -----------------------------------------------------------------------
}());
