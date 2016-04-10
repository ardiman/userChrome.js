// ==UserScript==
// @name           RightClickLinkinNewTab.uc.js
// ==/UserScript==
(function() {
	function findLink(element) {
		// Super_start
		if (element.className == 'site-snapshot') {
			return element.parentNode;
		}
		switch (element.tagName) {
			case 'A': return element;
			case 'B': case 'I': case 'SPAN': case 'SMALL':
			case 'STRONG': case 'EM': case 'BIG': case 'SUB':
			case 'SUP': case 'IMG': case 'S':
			case 'FONT':
				var parent = element.parentNode;
				return parent && findLink(parent);
			default:
				return null;
		}
	}

	function findFrames(frame) {
		var frames = frame.frames;
		var fs = {};
		for (var i = 0, len = frames.length; i < len; ++i) {
			var f = frames[i];
			fs[f.name] = f;
			var children = findFrames(f);
			for (k in children) {
				var f = children[k];
				fs[f.name] = f;
			}
		}
		return fs;
	}

	function followLink(args) {
		var link = args.link;
		var window = args.window;
		var href = link.href;
		var target = link.target;
		if (!target || target == '_self') {
			gBrowser.addTab(href);
		} else {
			switch (target) {
			case '_top':
				gBrowser.addTab(href);
				break;
			case '_parent':
				gBrowser.addTab(href);
				break;
			case '_blank':
				gBrowser.selectedTab = gBrowser.addTab(href);
				break;
			default:
				var frames = findFrames(window.top);
				var frame = frames[target];
				if (frame) {
					gBrowser.addTab(href);
				} else {
					gBrowser.selectedTab = gBrowser.addTab(href);
				}
			}
		}
	}

	gBrowser.mPanelContainer.addEventListener('click', function(e) {
		if (e.button == 2 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
			var link = findLink(e.target);
			if (link) {
				var href = link.href;
				if (href && href.match(/^(https?|ftp|chrome):\/\/|^about:/)) {
					e.preventDefault();
					e.stopPropagation();
					document.getElementById("contentAreaContextMenu").hidePopup();
					followLink({link: link, window: e.view});
				}
			}
		}
	}, false);
})();
