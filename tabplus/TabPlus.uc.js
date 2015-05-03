// ==UserScript==
// @name				TabPlus
// @description			标签管理
// @modby	          	feiruo
// @charset       		UTF-8
// @include				chrome://browser/content/browser.xul
// @include				chrome://browser/content/bookmarks/bookmarksPanel.xul
// @include				chrome://browser/content/history/history-panel.xul
// @include				chrome://browser/content/places/places.xul
// @include        		chrome://mozapps/content/downloads/unknownContentType.xul
// @include        		chrome://mozapps/content/downloads/downloads.xul
// @id              	[5C5BB610]
// @startup       		window.TabPlus_mod.init();
// @shutdown      		window.TabPlus_mod.onDestroy(true);
// @homepageURL   		https://github.com/feiruo/userchromejs/
// @version      		0.2
// @note 				新しいタブで開く（空白タブを利用）
// @note 				新标签打开（智能利用空白标签）
// @note				必要なものだけ使って不要であれば削除するなりコメントアウトして下さい
// @note				不需要的功能请自行注释掉
// ==/UserScript==
(function() {
	if (window.TabPlus_mod) {
		window.TabPlus_mod.onDestroy();
		delete window.TabPlus_mod;
	}

	var TabPlus_mod = {
		gURLBar: gURLBar.handleCommand.toString(),
		openLinkIn: openLinkIn.toString(),
		whereToOpenLink: whereToOpenLink.toString(),
		cKBOnMCa: BookmarksEventHandler.onClick.toString(),
		cKBOnMCb: checkForMiddleClick.toString(),
		cdbt: gBrowser.mTabProgressListener.toString(),
		tab_hover: null,
	};

	TabPlus_mod.init = function() {
		this.urlbarNewTab(true); //Adressleiste - Link in neuem Tab öffnen
		this.historyNewTab(true); //Lesezeichen, Verlauf und Suchleiste in neuem Tab öffnen		
		this.ldblclickC(true); //Mit Doppelklick auf Tab, Tab schließen 
		this.mouseScroll(true); //Tab wechseln mit Scrollrad
		this.rclickC(true); //Mit Rechstklick auf Schließenkreuz, Schlagwort hinzufügen
		//this.mMousedownR(true); //Mittleren  Teil der Tab-Leiste freilassen, um geschlossene Tabs wiederherstellen
		//this.mMousedownP(true); //Tab sperren
		//this.nearTab(true); //Neuen Tab neben aktuellen Tab öffnen
		//------------------------------------------------
		this.whereToOpen(true); // Mittlere Maustaste, Fokus invertieren
		this.KeepBookmarksOnMiddleClick(true); // Lesezeichenkontextmenü nicht mit Mitteltaste/ Scrollrad schießen
		this.closeDownloadBankTab(true); // Bei Download leeren Tab automatisch schließen
		this.tabfocus(true); // Bei Mouseover Tab in den Vordergrund holen
	};

	TabPlus_mod.onDestroy = function(isOk) {
		this.urlbarNewTab(false);
		this.historyNewTab(false);
		this.whereToOpen(false);
		this.ldblclickC(false);
		this.mouseScroll(false);
		this.rclickC(false);
		this.mMousedownR(false);
		this.mMousedownP(false);
		this.ldblclickR(false);
		this.ldblclickRU(false);
		this.nearTab(false);
		this.cOLTab(false);
		this.KeepBookmarksOnMiddleClick(false);
		this.closeDownloadBankTab(false);
		this.tabfocus(false);
	};

	//--------------------------------------------------------------------------

	TabPlus_mod.urlbarNewTab = function(isOk) {
		if (isOk) {
			try {
				location == "chrome://browser/content/browser.xul" && eval("gURLBar.handleCommand=" + this.gURLBar.replace(/^\s*(load.+);/gm, "if(/^javascript:/.test(url)||isTabEmpty(gBrowser.selectedTab)){loadCurrent();}else{this.handleRevert();gBrowser.loadOneTab(url, {postData: postData, inBackground: false, allowThirdPartyFixup: true});}"));
			} catch (e) {}
		} else {
			try {
				location == "chrome://browser/content/browser.xul" && eval("gURLBar.handleCommand=" + this.gURLBar);
			} catch (e) {}
		}
	};

	TabPlus_mod.historyNewTab = function(isOk) {
		if (isOk) {
			try {
				eval('openLinkIn=' + this.openLinkIn.replace('w.gBrowser.selectedTab.pinned', '(!w.isTabEmpty(w.gBrowser.selectedTab) || $&)').replace(/&&\s+w\.gBrowser\.currentURI\.host != uriObj\.host/, ''));
			} catch (e) {}
		} else {
			try {
				eval('openLinkIn=' + this.openLinkIn);
			} catch (e) {}
		}
	};

	TabPlus_mod.whereToOpen = function(isOk) {
		if (isOk) {
			try {
				eval('whereToOpenLink=' + this.whereToOpenLink.replace(' || middle && middleUsesTabs', '').replace('if (alt', 'if (middle && middleUsesTabs) return shift ? "tab" : "tabshifted"; $&'));
			} catch (e) {}
		} else {
			try {
				eval('whereToOpenLink=' + this.whereToOpenLink);
			} catch (e) {}
		}
	};

	TabPlus_mod.ldblclickC = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('dblclick', TabPlus_mod.ldblclickC.acction, true);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('dblclick', TabPlus_mod.ldblclickC.acction, true);
			} catch (e) {}
		}
	};
	TabPlus_mod.ldblclickC.acction = function(event) {
		if (event.target.localName == 'tab' && event.button == 0)
			gBrowser.removeTab(event.target);
	};

	TabPlus_mod.mouseScroll = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('DOMMouseScroll', TabPlus_mod.mouseScroll.acction, true);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('DOMMouseScroll', TabPlus_mod.mouseScroll.acction, true);
			} catch (e) {}
		}
	};
	TabPlus_mod.mouseScroll.acction = function(event) {
		this.advanceSelectedTab(event.detail > 0 ? +1 : -1, true);
	};

	TabPlus_mod.rclickC = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('click', TabPlus_mod.rclickC.acction, true);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('click', TabPlus_mod.rclickC.acction, true);
			} catch (e) {}
		}
	};
	TabPlus_mod.rclickC.acction = function(event) {
		if (event.target.localName == "tab" && event.button == 2 && !event.ctrlKey) {
			gBrowser.removeTab(event.target);
			event.stopPropagation();
			event.preventDefault();
		}
	};

	//--------------------------------------------------------------------------

	TabPlus_mod.mMousedownR = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('mousedown', TabPlus_mod.mMousedownR.acction, false);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('mousedown', TabPlus_mod.mMousedownR.acction, false);
			} catch (e) {}
		}
	};
	TabPlus_mod.mMousedownR.acction = function(event) {
		if (event.target.localName != 'tab' && event.button == 1) {
			document.getElementById('History:UndoCloseTab').doCommand();
		}
	};

	TabPlus_mod.mMousedownP = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('click', TabPlus_mod.mMousedownP.acction, true);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('click', TabPlus_mod.mMousedownP.acction, true);
			} catch (e) {}
		}
	};
	TabPlus_mod.mMousedownP.acction = function(event) {
		if (event.target.localName == "tab" && event.button == 1 && !event.ctrlKey) {
			var subTab = event.originalTarget;
			while (subTab.localName != "tab") {
				subTab = subTab.parentNode;
			}
			if (subTab.pinned) {
				gBrowser.unpinTab(subTab);
			} else {
				gBrowser.pinTab(subTab);
			}
			event.stopPropagation();
			event.preventDefault();
		}
	};

	TabPlus_mod.ldblclickR = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('dblclick', TabPlus_mod.ldblclickR.acction, true);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('dblclick', TabPlus_mod.ldblclickR.acction, true);
			} catch (e) {}
		}
	};
	TabPlus_mod.ldblclickR.acction = function(event) {
		if (event.target.localName == 'tab' && event.button == 0) {
			getBrowser().getBrowserForTab(event.target).reload();
		}
	};

	TabPlus_mod.ldblclickRU = function(isOk) {
		if (isOk) {
			try {
				gBrowser.mTabContainer.addEventListener('dblclick', acction, false);
			} catch (e) {}
		} else {
			try {
				gBrowser.mTabContainer.removeEventListener('dblclick', acction, false);
			} catch (e) {}
		}
	};
	TabPlus_mod.ldblclickRU.acction = function(event) {
		if (event.target.localName == 'tab' && event.button == 0) {
			if (event.target.hasAttribute("busy")) {
				document.getElementById('cmd_close').doCommand();
			} else {
				getBrowser().getBrowserForTab(event.target).reload();
			}
		}
	};

	TabPlus_mod.nearTab = function(isOk) {
		if (isOk) {
			try {
				gBrowser.tabContainer.addEventListener("TabOpen", TabPlus_mod.nearTab.acction, false);
			} catch (e) {}
		} else {
			try {
				gBrowser.tabContainer.removeEventListener("TabOpen", TabPlus_mod.nearTab.acction, false);
			} catch (e) {}
		}
	};
	TabPlus_mod.nearTab.acction = function(event) {
		try {
			if (!gBrowser) return;
		} catch (e) {
			return;
		}
		var tab = event.target;
		gBrowser.moveTabTo(tab, gBrowser.mCurrentTab._tPos + 1);
	};

	TabPlus_mod.cOLTab = function(isOk) {
		if (isOk) {
			try {
				gBrowser.tabContainer.addEventListener("TabClose", TabPlus_mod.cOLTab.acction, false);
			} catch (e) {}
		} else {
			try {
				gBrowser.tabContainer.removeEventListener("TabClose", TabPlus_mod.cOLTab.acction, false);
			} catch (e) {}
		}
	};
	TabPlus_mod.cOLTab.acction = function(event) {
		try {
			if (!gBrowser) return;
		} catch (e) {
			return;
		}
		var tab = event.target;
		if (tab.linkedBrowser.contentDocument.URL == 'about:blank') return;
		if (tab._tPos <= gBrowser.mTabContainer.selectedIndex) {
			if (tab.previousSibling) {
				gBrowser.mTabContainer.selectedIndex--;
			}
		}
	};

	//--------------------------------------------------------------------------

	TabPlus_mod.KeepBookmarksOnMiddleClick = function(isOk) {
		if (isOk) {
			try {
				eval('BookmarksEventHandler.onClick =' + this.cKBOnMCa.replace('node.hidePopup()', ''));
				eval('checkForMiddleClick =' + this.cKBOnMCb.replace('closeMenus(event.target);', ''));
			} catch (e) {}
		} else {
			try {
				eval('BookmarksEventHandler.onClick =' + this.cKBOnMCa);
				eval('checkForMiddleClick =' + this.cKBOnMCb);
			} catch (e) {}
		}
	};

	TabPlus_mod.closeDownloadBankTab = function(isOk) {
		if (isOk) {
			try {
				eval("gBrowser.mTabProgressListener = " + this.cdbt.replace(/(?=var location)/, '\
                if (aWebProgress.DOMWindow.document.documentURI == "about:blank"\
                && aRequest.QueryInterface(nsIChannel).URI.spec != "about:blank") {\
                aWebProgress.DOMWindow.setTimeout(function() {\
                !aWebProgress.isLoadingDocument && aWebProgress.DOMWindow.close();\
                }, 100);\
                }\
                '));
			} catch (e) {}
		} else {
			try {
				location == eval("gBrowser.mTabProgressListener=" + this.cdbt);
			} catch (e) {}
		}
	};

	TabPlus_mod.tabfocus = function(isOk) {
		if (isOk) {
			try {
				gBrowser.tabContainer.addEventListener("mouseout", TabPlus_mod.tabfocus.onMouseOut, false);
				gBrowser.tabContainer.addEventListener("mouseover", TabPlus_mod.tabfocus.onMouseOver, false);
			} catch (e) {}
		} else {
			try {
				gBrowser.tabContainer.removeEventListener("mouseover", TabPlus_mod.tabfocus.onMouseOver, false);
				gBrowser.tabContainer.removeEventListener("mouseout", TabPlus_mod.tabfocus.onMouseOut, false);
			} catch (e) {}
		}
	};
	TabPlus_mod.tabfocus.onMouseOver = function(event) {
		this.tab_hover = setTimeout(function() {
			gBrowser.selectedTab = event.target;
		}, 250);
	};
	TabPlus_mod.tabfocus.onMouseOut = function() {
		clearTimeout(this.tab_hover);
	};

	TabPlus_mod.init();
	window.TabPlus_mod = TabPlus_mod;
})();