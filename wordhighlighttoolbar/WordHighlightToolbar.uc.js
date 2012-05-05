// ==UserScript==
// @name           WordHighlightToolbar.uc.js
// @description    word highlight toolbar.
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 12
// @charset        UTF-8
// @include        main
// @version        0.0.1
// @note           とりあえず公開
// @note           キーボード操作、大文字小文字の区別などは未定…
// ==/UserScript==

(function(CSS){
"use strict";

if (window.gWHT) {
	window.gWHT.destroy();
	delete window.gWHT;
}

window.gWHT = {
	SITEINFO: [
		/**
			url     URL。正規表現。keyword, input が無い場合は $1 がキーワードになる。
			keyword キーワード。スペース区切り。省略可。
			input   検索ボックスの CSS Selector。省略可。
		**/
		{
			url: '^http://d\\.hatena\\.ne\\.jp/Griever/$',
			keyword: 'uAutoPagerize UserScriptLoader UserCSSLoader .uc.js'
		},
		{
			url: '^https?://\\w+\\.google\\.[a-z.]+/search',
			input: 'input[name="q"]'
		},
		{
			url: '^http?://[\\w.]+\\.yahoo\\.co\\.jp/search',
			input: 'input[name="p"]'
		},
		{// MICROFORMAT
			url: '^https?://.*[?&](?:q|word|keyword|query|search_query)=([^&]+)',
			input: 'input[type="text"]:-moz-any([name="q"],[name="word"],[name="keyword"],[name="query"],[name="search_query"])'
		},
	],
	toolbars: {},
	getWins: function(win) {
		var wins = win.frames.length ? [win].concat(Array.slice(win.frames)) : [win];
		return wins.filter(this.checkWin, this);
	},
	checkWin: function(win) {
		if (!/^(?:http|file)/.test(win.location.href)) return false;
		var doc = win.document;
		if (!doc.body || !doc.body.hasChildNodes()) return false;
		if (doc.body instanceof HTMLFrameSetElement) return false;
		if (doc.querySelector('meta[http-equiv="refresh"]')) return false;
		return true;
	},
	getFocusedWindow: function () {
		var win = document.commandDispatcher.focusedWindow;
		return (!win || win == window) ? content : win;
	},
	getBrowserSelection: function () {
		var sel = this.getFocusedWindow().getSelection();
		var str = '';
		if (sel.isCollapsed) return str;

		for(var i = 0, l = sel.rangeCount; i < l; i++) {
			str += sel.getRangeAt(i) + ' ';
		}
		return str.trim();
	},
	init: function() {
		this.xulstyle = addStyle(CSS);
		var bb = document.getElementById("appcontent");
		this.container = bb.appendChild(document.createElement("vbox"));
		this.container.setAttribute("id", "wordhighliht-toolbar-box");
		
		var sep = document.getElementById("context-sep-viewsource");
		var menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight");
		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
		menuitem.setAttribute("label", "Hervorheben");
		menuitem.setAttribute("oncommand", "gWHT.highlightWord();");

		menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight-auto");
		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
		menuitem.setAttribute("label", "Getrennt hervorheben");
		menuitem.setAttribute("oncommand", "gWHT.highlightWordAuto();");
		
		menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight-split");
		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
		menuitem.setAttribute("label", "Zusammen hervorheben");
		menuitem.setAttribute("oncommand", "gWHT.highlightWordSplit();");
		menuitem.style.display = "none";

		gBrowser.mPanelContainer.addEventListener("DOMContentLoaded", this, false);
		gBrowser.mTabContainer.addEventListener("TabOpen", this, false);
		gBrowser.mTabContainer.addEventListener("TabSelect", this, false);
		gBrowser.mTabContainer.addEventListener("TabClose", this, false);
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this, false);
		window.addEventListener("unload", this, false);
	},
	uninit: function() {
		gBrowser.mPanelContainer.removeEventListener("DOMContentLoaded", this, false);
		gBrowser.mTabContainer.removeEventListener("TabOpen", this, false);
		gBrowser.mTabContainer.removeEventListener("TabSelect", this, false);
		gBrowser.mTabContainer.removeEventListener("TabClose", this, false);
		document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing", this, false);
		window.removeEventListener("unload", this, false);
	},
	destroy: function() {
		for (let [key, val] in Iterator(this.toolbars)) {
			val.destroy();
		}
		
		["wordhighliht-toolbar-box","wordhighliht-toolbar-highlight","wordhighliht-toolbar-highlight-auto", "wordhighliht-toolbar-highlight-split"].forEach(function(id){
			var elem = $(id);
			if (elem) elem.parentNode.removeChild(elem);
		}, this);
		this.uninit();
		if (this.xulstyle) this.xulstyle.parentNode.removeChild(this.xulstyle);
	},
	handleEvent: function(event) {
		switch(event.type) {
			case "DOMContentLoaded":
				var doc = event.target;
				var win = doc.defaultView;
				if (win != win.parent) return; // フレームでは自動実行しない
				if (!this.checkWin(win)) return;

				var tab = gBrowser._getTabForContentWindow(win.top);
				if (!tab) return;
				var keyword = this.getKeyword(this.SITEINFO, doc);
				var keywords = keyword.trim().split(/[\s\+\|\(\)]+/).map(function(e){
					let a = e[0], b = e[e.length-1];
					if (a === '"' && b === '"' || a === "'" && b === "'") {
						return e.slice(1, -1);
					}
					return e;
				}).filter(function(e,i,a) e && a.indexOf(e) === i);
				this.launch(tab, keywords);
				break;
			case "TabSelect":
				var selectedId = event.target.linkedPanel;
				for (let [linkedPanel, cls] in Iterator(this.toolbars)) {
					cls.toolbar.hidden = !(selectedId === linkedPanel) || cls.items.length === 0;
				}
				break;
			case "TabClose":
				var tab = event.target;
				var toolbar = this.toolbars[tab.linkedPanel];
				if (toolbar) toolbar.destroy();
				delete this.toolbars[tab.linkedPanel];
				break;
			case "TabOpen":
				this.lastOpenedTab = event.target;
				break;
			case "popupshowing":
				gContextMenu.showItem($("wordhighliht-toolbar-highlight"), gContextMenu.isTextSelected);
				gContextMenu.showItem($("wordhighliht-toolbar-highlight-split"), gContextMenu.isTextSelected);
				gContextMenu.showItem($("wordhighliht-toolbar-highlight-auto"), gContextMenu.isTextSelected);
				break;
			case "unload":
				this.uninit();
				break;
		}
	},
	launch: function(aTab, keywords) {
		var toolbar = this.toolbars[aTab.linkedPanel];
		var hasRef = !!aTab.linkedBrowser.docShell.referringURI;
		var isNewtab = aTab == this.lastOpenedTab;
		this.lastOpenedTab = null;

		// target="_blank" などは元のタブのワードを継承する
		newtabflag:if (isNewtab && hasRef) {
			let own = aTab.owner;
			if (!own) break newtabflag;
			let ownbar = this.toolbars[own.linkedPanel];
			if (!ownbar || !ownbar.items.length) break newtabflag;

			toolbar = this.addToolbar(aTab);
			ownbar.items.forEach(function(obj) toolbar.addWord(obj.word, obj.isAuto));
		}

		// Bookmark等から開かれた場合、新たなワードがある場合は古いワードは削除
		if (toolbar && (!hasRef || keywords.length))
			toolbar.destroyAutoWord();

		// 新たなワードがあるならそれを追加する
		if (keywords.length) {
			if (!toolbar)
				toolbar = this.addToolbar(aTab);
			keywords.forEach(function(word) toolbar.addWord(word, true));
		}
		if (toolbar)
			toolbar.goHighlight(true);
	},
	getToolbar: function(aTab) {
		return this.toolbars[(aTab || gBrowser.mCurrentTab).linkedPanel];
	},
	addToolbar: function(aTab) {
		return this.toolbars[aTab.linkedPanel] ||
			 (this.toolbars[aTab.linkedPanel] = new this.ToolbarClass(aTab));
	},
	highlightWord: function(aWord, aTab) {
		var word = aWord || this.getBrowserSelection();
		if (!word || !/\S/.test(aWord)) return;
		var tab = aTab || gBrowser.mCurrentTab;
		var toolbar = this.addToolbar(tab);
		toolbar.addWord(word, false).highlightAll();
		tab.linkedBrowser.contentWindow.getSelection().removeAllRanges();// 雑
	},
	highlightWordSplit: function(aWord, aTab) {
		var word = aWord || this.getBrowserSelection();
		if (!word || !/\S/.test(aWord)) return;
		var words = word.split(/[\u3000\u3001\u3002\uFF1A\uFF1B;:,\s]+/g);
		if (!words.length) return;

		var tab = aTab || gBrowser.mCurrentTab;
		var toolbar = this.addToolbar(tab);
		words.sort(function(a, b) b.length - a.length).forEach(function(str) toolbar.addWord(str, false));
		toolbar.goHighlight();
		tab.linkedBrowser.contentWindow.getSelection().removeAllRanges();
	},
	highlightWordAuto: function(aWord, aTab) {
		var word = aWord || this.getBrowserSelection();
		if (!word || !/\S/.test(aWord)) return;

		var words = word.match(this.tangoReg);
		if (!words) return;
		words = words.map(function(w) w.toLowerCase()).filter(function(e,i,a) a.indexOf(e) === i);
		if (!words.length) return;

		var tab = aTab || gBrowser.mCurrentTab;
		var toolbar = this.addToolbar(tab);
		words.sort(function(a, b) b.length - a.length).forEach(function(str) toolbar.addWord(str, false));
		toolbar.goHighlight();
		tab.linkedBrowser.contentWindow.getSelection().removeAllRanges();
	},
	get tangoReg() {
		if (this._tangoReg) return this._tangoReg;
		var arr = [
			"[\\u4E00-\\u9FA0]{2,}" // 漢字
			,"[\\u4E00-\\u9FA0][\\u3040-\\u309F]+" // 漢字１文字＋ひらがな
			,"[\\u30A0-\\u30FA\\u30FC]{2,}" // カタカナ
			,"[\\uFF41-\\uFF5A\\uFF21-\\uFF3A\\uFF10-\\uFF19]{2,}" // 全角英数数字（小文字、大文字、数字）
			,"[\\w+\\-]{3,}"
			,"\\d+\\.\\d+\\w*"
			,"[\\w]{2,}"
		];
		return this._tangoReg = new RegExp(arr.join('|'), 'g');
	},
	getKeyword: function (list, aDoc) {
		if (!list) list = this.SITEINFO;
		var locationHref = aDoc.location.href;

		for (let [index, info] in Iterator(list)) {
			try {
				var exp = info.url_regexp || (info.url_regexp = new RegExp(info.url));
				if ( !exp.test(locationHref) ) continue;
				if (info.keyword)
					return info.keyword;
				if (info.input) {
					var input = aDoc.querySelector(info.input);
					if (input && input.value && /\S/.test(input.value))
						return this.clean(input.value);
				}
				if (RegExp.$1 && /\S/.test(RegExp.$1))
					return this.clean(RegExp.$1);
			} catch(e) {
				log('error at ' + e);
			}
		}
		return '';
	},
	clean: function clean(str) {
		str = losslessDecodeURI({ spec:str });
		str = str.replace(/(?:(?:\s?(?:site|(?:all)?in(?:url|title|anchor|text)):|(?:\s|^)-|[()])\S*|(\s)OR\s)/g,'$1');
		str = (' ' + str + ' ').replace(/\s+[\w!\"\'\(\)\[\]\{\}#$%&=^~\\|`;:<>?/+*-]\s+/g, ' ').trim();
		str = str.replace(/%[0-9a-f]{2}/gi, "");
		return str
	},
};

window.gWHT.ToolbarClass = function() { this.init.apply(this, arguments) };
window.gWHT.ToolbarClass.prototype = {
	items: [],
	styles: [
		 'background-color: hsl( 60, 100%, 75%); color: #000;'
		,'background-color: hsl(120, 100%, 75%); color: #000;'
		,'background-color: hsl(180, 100%, 75%); color: #000;'
		,'background-color: hsl(240, 100%, 75%); color: #000;'
		,'background-color: hsl(300, 100%, 75%); color: #000;'
		,'background-color: hsl(360, 100%, 75%); color: #000;'
		,'background-color: hsl( 30, 100%, 75%); color: #000;'
		,'background-color: hsl( 90, 100%, 75%); color: #000;'
		,'background-color: hsl(150, 100%, 75%); color: #000;'
		,'background-color: hsl(210, 100%, 75%); color: #000;'
		,'background-color: hsl(270, 100%, 75%); color: #000;'
		,'background-color: hsl(330, 100%, 75%); color: #000;'
	],
	init: function(aTab) {
		this.tab = aTab;
		this.browser = this.tab.linkedBrowser;
		this.linkedPanel = this.tab.linkedPanel;
		this.items = [];

		this.toolbar = document.createElement("hbox");
		this.toolbar.setAttribute("linkedPanel", this.linkedPanel);
		this.toolbar.setAttribute("class", "wordhighliht-toolbar-toolbar");
		this.toolbar.setAttribute("flex", "1");
		this.toolbar.setAttribute("hidden", gBrowser.mCurrentTab != this.tab);

		this.box = this.toolbar.appendChild(document.createElement("arrowscrollbox"));
		this.box.setAttribute("class", "wordhighliht-toolbar-arrowscrollbox");
		this.box.setAttribute("flex", "1");

		this.reloadbutton = this.toolbar.appendChild(document.createElement("toolbarbutton"));
		this.reloadbutton.setAttribute("class", "wordhighliht-toolbar-reloadbutton");
		this.reloadbutton.setAttribute("tooltiptext", "Markierte Wörter nachladen");
		this.reloadbutton.addEventListener("command", this, false);

		this.addbutton = this.toolbar.appendChild(document.createElement("toolbarbutton"));
		this.addbutton.setAttribute("class", "wordhighliht-toolbar-addbutton");
		this.addbutton.setAttribute("tooltiptext", "Wort hinzufügen");
		this.addbutton.addEventListener("command", this, false);

		this.closebutton = this.toolbar.appendChild(document.createElement("toolbarbutton"));
		this.closebutton.setAttribute("class", "tabs-closebutton");
		this.closebutton.addEventListener("command", this, false);

		var box = document.getElementById("wordhighliht-toolbar-box");
		box.appendChild(this.toolbar);

		this.browser.addEventListener("GM_AutoPagerizeNextPageLoaded", this, true);
	},
	destroy: function() {
		this.addbutton.removeEventListener("command", this, false);
		this.reloadbutton.removeEventListener("command", this, false);
		this.closebutton.removeEventListener("command", this, false);
		this.browser.removeEventListener("GM_AutoPagerizeNextPageLoaded", this, true);
		this.items.slice().forEach(function(o) o.destroy());
		this.toolbar.parentNode.removeChild(this.toolbar);
		delete gWHT.toolbars[this.linkedPanel];
	},
	handleEvent: function(event) {
		switch(event.type){
			case "GM_AutoPagerizeNextPageLoaded":
				if (!this.items.length) return;
				var doc = event.target;
				var win = doc.defaultView;
				// AutoPagerizeの最後の区切り以降のRangeを取得
				var sep = doc.querySelectorAll('.autopagerize_page_separator, .autopagerize_page_info');
				sep = sep[sep.length-1];
				if (!sep) return;
				var range = doc.createRange();
				range.setStartAfter(sep);
				range.setEndAfter(sep.parentNode.lastChild);

				var temp = this.items.slice();
				var gh = function () {
					var o = temp.shift();
					o.highlight(win, range);
					if (temp.length)
						win.setTimeout(gh, 10);
				}
				win.setTimeout(gh, 10);
				break;
			case "command":
				if (event.currentTarget === this.closebutton)
					return this.destroy();
				if (event.currentTarget == this.addbutton) {
					var word = prompt("Bitte geben Sie den gewünschten Text zum Hervorheben", getBrowserSelection());
					if (!word || !/\S/.test(word)) return;
					this.addWord(word, false).highlightAll();
					return;
				}
				if (event.currentTarget === this.reloadbutton) {
					this.goHighlight(true);
					return;
				}
		}
	},
	indexOf: function(aWord) {
		// aWord が既にあるかを確認する
		for (let i = 0, len = this.items.length; i < len; i++) {
			let o = this.items[i];
			if (o && o.word == aWord) return i;
		};
		return -1
	},
	newIndexOf: function() {
		// index プロパティの欠番を探す
		var arr = [];
		this.items.forEach(function(o) arr[o.index] = true);
		var res = arr.length;
		for (var i = 0, len = arr.length; i < len; i++) {
			if (!arr[i]) return i;
		};
		return this.items.length;
	},
	addWord: function(aWord, isAuto) {
		var index = this.indexOf(aWord);
		if (index >= 0) return;
		index = this.newIndexOf();
		var o = new gWHT.ItemClass(aWord, this, index, this.styles[index%this.styles.length], isAuto);
		this.items.push(o);
		return o;
	},
	goHighlight: function(isAll) {
		var temp = this.items.filter(function(o) (isAll || o.length === -1));
		if (!temp.length) return;

		// タイマーを掛けないと取りこぼす
		var win = this.browser.contentWindow;
		var gh = function() {
			var o = temp.shift();
			o.highlightAll();
			if (temp.length)
				win.setTimeout(gh, 10);
		};
		gh();
		
	},
	destroyAutoWord: function(keywords) {
		this.items.slice().forEach(function(obj) {
			if (!obj.isAuto) return;
			if (keywords && keywords.indexOf(obj.word) >= 0) return;
			obj.destroy();
		}, this);
	},
};

window.gWHT.ItemClass = function() { this.init.apply(this, arguments); }
window.gWHT.ItemClass.prototype = {
	SELECTION_OFF                       : 0, // OFF,HIDDEN,ON は fastFind.setSelectionModeAndRepaint で使う？
	SELECTION_HIDDEN                    : 1, 
	SELECTION_ON                        : 2, 
	SELECTION_NONE                      : 0, // 
	SELECTION_NORMAL                    : 1, // 通常の選択範囲（content.getSelection() で取得可能）
	SELECTION_SPELLCHECK                : 2, // 赤波の下線（スペルチェック）
	SELECTION_IME_RAWINPUT              : 4, // 文字色の破線（下線）
	SELECTION_IME_SELECTEDRAWTEXT       : 8, // 選択状態と同じ色（content.getSelection() では取得不可）
	SELECTION_IME_CONVERTEDTEXT         : 16, // 4 と同じ？
	SELECTION_IME_SELECTEDCONVERTEDTEXT : 32, // 8 と同じ？
	SELECTION_ACCESSIBILITY             : 64, // 変化無し？
	SELECTION_FIND                      : 128, // ページ内検索のハイライト
	FIND_FOUND   : 0,
	FIND_NOTFOUND: 1,
	FIND_WRAPPED : 2,
	TYPE: Ci.nsISelectionController.SELECTION_ACCESSIBILITY,
	finder: Cc["@mozilla.org/embedcomp/rangefind;1"].createInstance().QueryInterface(Ci.nsIFind),
	css: ['font: inherit !important;'
		,'margin: 0px !important;'
		,'padding: 0px !important;'
		,'border: none !important;'
	].join(' '),
	get length() +this.button.getAttribute("length"),
	set length(val) {
		this.button.setAttribute("length", +val);
		return val;
	},
	getWins: function() {
		var win = this.browser.contentWindow;
		var wins = win.frames.length ? [win].concat(Array.slice(win.frames)) : [win];
		return wins.filter(this.checkWin, this);
	},
	checkWin: function(win) {
		if (!/^(?:http|file|chrome|jar)/.test(win.location.href)) return false;
		var doc = win.document;
		if (doc.contentType.indexOf('text') != 0) return;
		if (!doc.body || !doc.body.hasChildNodes()) return false;
		if (doc.body instanceof HTMLFrameSetElement) return false;
		return true;
	},
	init: function(aWord, aToolbar, aIndex, aColor, isAuto) {
		this.word = aWord;
		this.tb = aToolbar;
		this.index = aIndex;
		this.color = aColor;
		this.isAuto = isAuto;
		this.browser = this.tb.browser;
		this.finder.findBackwards = true; /* 後ろから前に向かって検索するか */
		this.finder.caseSensitive = false;/* 大文字小文字を区別するか */
		this.fastFind = this.browser.fastFind;

		this.hbox = this.tb.box.appendChild(document.createElement("hbox"));
		this.hbox.setAttribute("class", "wordhighliht-toolbar-itembox " + (this.isAuto ? "auto" : "user"));
		this.hbox.setAttribute("style", this.color);
		this.hbox.addEventListener("DOMMouseScroll", this, false);
		this.hbox.addEventListener("click", this, false);

		this.button = this.hbox.appendChild(document.createElement("toolbarbutton"));
		this.button.setAttribute("label", this.word);
		this.button.setAttribute("length", "-1");
		this.button.setAttribute("class", "wordhighliht-toolbar-item");
		this.button.setAttribute("tooltiptext", [
			'Mausrad runter, oder Linksklick zum Weitersuchen',
			'Shift + Linksklick, oder Mausrad zum vorherigen Wort',
			'Mittelklick auf Mausrad zum Löschen'].join('\n')
		);
		this.button.addEventListener("command", this, false);

		this.close = this.hbox.appendChild(document.createElement("toolbarbutton"));
		this.close.setAttribute("class", "tabs-closebutton");
		this.close.addEventListener("command", this, false);
	},
	destroy: function() {
		this.hbox.removeEventListener("DOMMouseScroll", this, false);
		this.hbox.removeEventListener("click", this, false);
		this.button.removeEventListener("command", this, false);
		this.close.removeEventListener("command", this, false);
		this.lowlightAll();

		var index = this.tb.items.indexOf(this);
		if (index >= 0)
			this.tb.items.splice(index, 1);

		this.hbox.parentNode.removeChild(this.hbox);
	},
	handleEvent: function(event) {
		switch(event.type){
			case "DOMMouseScroll":
				this.find(event.detail < 0);
				event.preventDefault();
				event.stopPropagation();
				break;
			case "command":
				if (event.currentTarget == this.button) {
					this.find(event.shiftKey);
				} else if (event.currentTarget == this.close) {
					this.destroy();
				}
				break;
			case "click":
				if (event.button != 1 || event.currentTarget != this.hbox) return;
				event.preventDefault();
				event.stopPropagation();
				this.destroy();
				break;
		}
	},
	find: function(isBack) {
		if (this.fastFind.searchString != this.word)
			this.fastFind.find(this.word, false);
		var res = this.fastFind.findAgain(isBack, false);
		if (res === this.FIND_NOTFOUND) return;
		var win = this.fastFind.currentWindow;
		if (!win) return;
		var span = win.getSelection().getRangeAt(0).startContainer.parentNode;
		if (!span.classList.contains('wordhighliht-toolbar-span')) return;
		span.style.setProperty('outline', '5px solid #66F', 'important');
		win.setTimeout(function () {
			span.style.removeProperty('outline');
		}, 400);
		// SELECTION_HIDDEN で見えないけど選択された状態にできる
		this.fastFind.setSelectionModeAndRepaint(this.SELECTION_HIDDEN);
	},
	throughSelector: ['script','style','textarea','input','select','.wordhighliht-toolbar-span'].map(function(w) w+', '+w+' *').join(','),
	highlight: function(aWindow, aRange) {
		var win = aWindow;
		var doc = win.document;
		var controller = this._getSelectionController(win);
		if (!controller) return;
		var sel = controller.getSelection(this.TYPE);
		var finder = this.finder;

		var range = aRange;
		if (!range) {
			range = doc.createRange();
			range.selectNodeContents(doc.body);
		}
		var sRange = range.cloneRange();
		sRange.collapse(false);
		var eRange = range.cloneRange();
		eRange.collapse(true);

		var cls = 'wordhighliht-toolbar'+this.index;
		var throughSelector = this.throughSelector;
		var len = 0;
		for (var retRange = null; 
		     retRange = finder.Find(this.word, range, sRange, eRange); 
		     sRange = retRange.cloneRange(), sRange.collapse(true)) {
			var pare = retRange.startContainer.parentNode;
			if (pare.mozMatchesSelector(throughSelector)) {
				if (pare.classList.contains(cls))
					len++;
				continue;
			}
			try {
				let span = doc.createElementNS("http://www.w3.org/1999/xhtml", "font");
				span.setAttribute("style", this.css + this.color);
				span.setAttribute("class", "wordhighliht-toolbar-span " + cls);
				retRange.surroundContents(span);
				len++;
			} catch (e) {}
		}
		this.length += len;
	},
	highlightAll: function() {
		this.length = 0;
		this.getWins().forEach(function(w) this.highlight(w), this);
		this.tb.toolbar.hidden != this.tab == gBrowser.mCurrentTab;
	},
	lowlightAll: function() {
		var rm = function(elem){
			var range = document.createRange();
			range.selectNodeContents(elem);
			var df = range.extractContents();
			elem.parentNode.replaceChild(df, elem);
		};
		this.getWins().forEach(function(w){
			Array.slice(w.document.getElementsByClassName("wordhighliht-toolbar" + this.index)).forEach(rm, this);
		}, this);
	},
	_getSelectionController : function _getSelectionController(aWindow) {
		if (!aWindow.innerWidth || !aWindow.innerHeight) {
			return null;
		}
		var docShell = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShell);
		var controller = docShell.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsISelectionDisplay).QueryInterface(Ci.nsISelectionController);
		return controller;
	},
};



window.gWHT.init();


function $(id) { return document.getElementById(id); }
function $$(exp, doc) { return Array.prototype.slice.call((doc || document).querySelectorAll(exp)); }
// http://gist.github.com/321205
function $A(args) { return Array.prototype.slice.call(args); }
function U(text) 1 < 'あ'.length ? decodeURIComponent(escape(text)) : text;
function log() { Application.console.log($A(arguments).join(', ')); }
function addStyle(css) {
	var pi = document.createProcessingInstruction(
		'xml-stylesheet',
		'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
	);
	return document.insertBefore(pi, document.documentElement);
}

})(<![CDATA[

.wordhighliht-toolbar-icon {
  list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgGDTg6VOG/9euEYefPmX4j6GZHAw3AGbq///EYZhrsRrw8+cxvJgiA8h2AVleIDsMKA7EgTGA4oREcVIeUAAAP+Xk2I6ZppUAAAAASUVORK5CYII=");
}

.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-up,
.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-down{
  min-width: 16px;
}

.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-up > .autorepeatbutton-icon,
.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-down > .autorepeatbutton-icon {
  -moz-transform: rotate(-90deg);
}

.wordhighliht-toolbar-toolbar .tabs-closebutton > .toolbarbutton-icon {
  -moz-padding-end: 0px !important;
  -moz-padding-start: 0px !important;
}
.wordhighliht-toolbar-itembox.user {
  font-weight: bold !important;
}
.wordhighliht-toolbar-item {
  -moz-appearance: none !important;
  padding: 0px 0px 0px 3px !important;
}
.wordhighliht-toolbar-item[length]:after {
  content: "(" attr(length) ")" !important;
}
.wordhighliht-toolbar-item[length="-1"]:after {
  content: "(?)" !important;
}
.wordhighliht-toolbar-item > .toolbarbutton-icon {
  margin: 0px !important;
}

.wordhighliht-toolbar-reloadbutton,
.wordhighliht-toolbar-addbutton {
  -moz-appearance: none !important;
  padding: 0px 3px !important;
  border: none !important;
  list-style-image: url("chrome://browser/skin/Toolbar.png");
}
.wordhighliht-toolbar-reloadbutton {
  -moz-image-region: rect(0pt, 72px, 18px, 54px);
}
.wordhighliht-toolbar-addbutton {
  -moz-image-region: rect(0pt, 306px, 18px, 288px);
}
.wordhighliht-toolbar-reloadbutton:hover,
.wordhighliht-toolbar-addbutton:hover {
  background-image: -moz-linear-gradient(bottom, transparent, rgba(0,0,0,.15)),
                    -moz-linear-gradient(bottom, transparent, rgba(0,0,0,.15) 30%),
                    -moz-linear-gradient(bottom, transparent, rgba(0,0,0,.15) 30%);
  background-position: left, left, right;
  background-size: auto, 1px 100%, 1px 100%;
  background-repeat: no-repeat;
}

.wordhighliht-toolbar-arrowscrollbox[hidden="true"] ~ *,
.wordhighliht-toolbar-arrowscrollbox:empty,
.wordhighliht-toolbar-arrowscrollbox:empty ~ * {
  visibility: collapse;
}
]]>.toString());