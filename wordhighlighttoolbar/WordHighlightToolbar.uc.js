// ==UserScript==
// @name           WordHighlightToolbar.uc.js
// @description    word highlight toolbar.
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 12
// @charset        UTF-8
// @include        main
// @version        0.0.2
// @note           0.0.2 試験的に要素をまたいでいても強引にハイライトできるようにした
// @note           0.0.2 キーボード操作に対応した( N or Shift+N )
// @note           0.0.2 フレーム読み込み時にもちゃんとハイライトするようにした
// @note           0.0.2 次のワード検索時に折り返したらビープ音を鳴らすようにした
// @note           0.0.2 次のワード検索後うまく文字選択できなくなるのを修正
// @note           0.0.2 ↑の弊害で"AA"を検索時に"AAAAAA"で引っかかるorz
// @note           0.0.2 AutoPagerize.user.js で継ぎ足しのハイライトができてなかったのを修正
// @note           0.0.2 タブを背面に複数開いた際にワードが引き継がれないのを修正
// @note           0.0.2 UI を弄りまくった
// @note           0.0.2 キーワードの取得を見なおした
// ==/UserScript==

(function(CSS){
"use strict";

if (window.gWHT) {
	window.gWHT.destroy();
	delete window.gWHT;
}

window.gWHT = {
	GET_KEYWORD: true, // キーワードを自動取得する [default:true]
	SITEINFO: [
		/**
			url     URL。正規表現。keyword, input が無い場合は $1 がキーワードになる。
			keyword キーワード。スペース区切り。省略可。
			input   検索ボックスの CSS Selector。
		**/
		{
			url: '^https?://\\w+\\.google\\.[a-z.]+/search',
			input: 'input[name="q"]'
		},
		{
			url: '^http?://[\\w.]+\\.yahoo\\.co\\.jp/search',
			input: 'input[name="p"]'
		},
		{
			url: '^https?://\\w+\\.bing\\.com/search',
			input: 'input[name="q"]'
		},
		{
			url: '^http://[\\w.]+\\.nicovideo\\.jp/(?:search|tag)/.*',
			input: '#search_united, #bar_search'
		},
//		{// MICROFORMAT
//			url: '^https?://.*[?&](?:q|word|keyword|search|query|search_query)=([^&]+)',
//			input: 'input[type="text"]:-moz-any([name="q"],[name="word"],[name="keyword"],[name="search"],[name="query"],[name="search_query"]), input[type="search"]'
//		},
	],
	toolbars: {},
	getWins: function(win) {
		var wins = win.frames.length ? [win].concat(Array.slice(win.frames)) : [win];
		return wins.filter(function(win) this.checkDoc(win.document), this);
	},
	checkDoc: function(doc) {
		if (!(doc instanceof HTMLDocument)) return false;
		if (!doc.body || !doc.body.hasChildNodes()) return false;
		if (doc.body instanceof HTMLFrameSetElement) return false;
		return true;
	},
	getFocusedWindow: function () {
		var win = document.commandDispatcher.focusedWindow;
		return (!win || win == window) ? content : win;
	},
	getRangeAll: function (win) {
		var sel = (win || this.getFocusedWindow()).getSelection();
		var res = [];
		if (sel.isCollapsed) return res;

		for(var i = 0, l = sel.rangeCount; i < l; i++) {
			res.push(sel.getRangeAt(i));
		}
		return res;
	},
	getBrowserSelection: function (win) {
		return this.getRangeAll(win).join(" ").trim();
	},
	init: function() {
		this.xulstyle = addStyle(CSS);

		var bb = document.getElementById("appcontent");
		this.container = bb.appendChild(document.createElement("vbox"));
		this.container.setAttribute("id", "wordhighliht-toolbar-box");

		var sep = document.getElementById("context-viewpartialsource-selection");
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
		
//		menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
//		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight-split");
//		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
//		menuitem.setAttribute("label", "Zusammen hervorheben");
//		menuitem.setAttribute("oncommand", "gWHT.highlightWordSplit();");
//		menuitem.style.display = "none";
//		
//		menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
//		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight-input");
//		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
//		menuitem.setAttribute("label", "この入力欄のワードをハイライト");
//		menuitem.setAttribute("oncommand", "gWHT.highlightWordInput();");
//
//		menuitem = sep.parentNode.insertBefore(document.createElement("menuitem"), sep);
//		menuitem.setAttribute("id", "wordhighliht-toolbar-highlight-recovery");
//		menuitem.setAttribute("class", "menuitem-iconic wordhighliht-toolbar-icon");
//		menuitem.setAttribute("label", "ハイライトを直す");
//		menuitem.setAttribute("oncommand", "gWHT.recoveryItems();");

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
		$$('[id^="wordhighliht-toolbar-"]').forEach(function(elem) elem.parentNode.removeChild(elem));
		this.uninit();
		if (this.xulstyle) this.xulstyle.parentNode.removeChild(this.xulstyle);
	},
	handleEvent: function(event) {
		switch(event.type) {
			case "DOMContentLoaded":
				var doc = event.target;
				if (!/^(?:http|file|chrome|jar|resource|data:text)/.test(doc.URL)) return;
				if (!this.checkDoc(doc)) return;
				var win = doc.defaultView;
				// フレームでは既存のワードをハイライトする
				if (win != win.parent) {
					if (win.top.document.readyState != "complete") return;
					var tab = gBrowser._getTabForContentWindow(win.top);
					var toolbar = this.getToolbar(tab);
					if (!toolbar) return;
					var temp = toolbar.items.slice();
					if (!temp.length) return;

					var gh = function () {
						temp.shift().highlight(win);
						if (temp.length)
							win.setTimeout(gh, 10);
					};
					gh();
					return;
				}
				var tab = gBrowser._getTabForContentWindow(win);
				if (!tab) return;
				var keywords = this.GET_KEYWORD ? this.getKeyword(this.SITEINFO, doc) : [];
				this.launch(tab, keywords);
				break;
			case "TabSelect":
				var selectedId = event.target.linkedPanel;
				for (let [linkedPanel, cls] in Iterator(this.toolbars)) {
					cls.toolbar.hidden = !(selectedId === linkedPanel);
				}
				break;
			case "TabClose":
				var tab = event.target;
				var toolbar = this.toolbars[tab.linkedPanel];
				if (toolbar) toolbar.destroy();
				delete this.toolbars[tab.linkedPanel];
				break;
			case "TabOpen":
				var tab = event.target;
				this.lastOpenedTab = tab;
				this.lastOwnerTab = tab.owner || gBrowser.mCurrentTab;
				break;
			case "popupshowing":
				if (event.target != event.currentTarget) return;
				var {isTextSelected, onTextInput, target} = gContextMenu;
				gContextMenu.showItem("wordhighliht-toolbar-highlight", isTextSelected);
				//gContextMenu.showItem("wordhighliht-toolbar-highlight-split", isTextSelected);
				gContextMenu.showItem("wordhighliht-toolbar-highlight-auto", isTextSelected);
				//gContextMenu.showItem("wordhighliht-toolbar-highlight-input", 
				//	onTextInput && !(target instanceof HTMLTextAreaElement));
				//var toolbar = this.getToolbar();
				//gContextMenu.showItem("wordhighliht-toolbar-highlight-recovery", 
				//	(!toolbar || !toolbar.items.length) && target && 
				//	target.ownerDocument.querySelector('.wordhighliht-toolbar-span'));
				break;
			case "unload":
				this.uninit();
				break;
		}
	},
	launch: function(aTab, keywords) {
		var toolbar = this.toolbars[aTab.linkedPanel];
		var hasRef = !!aTab.linkedBrowser.docShell.referringURI;
		var owntab = this.lastOwnerTab;
		var isNewtab = aTab == this.lastOpenedTab;
		this.lastOwnerTab = null;
		this.lastOpenedTab = null;

		// target="_blank" などは元のタブのワードを継承する
		newtabflag:if (isNewtab && hasRef) {
			let ownbar = this.toolbars[owntab.linkedPanel];
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
		var win = this.getFocusedWindow();
		var words = aWord ? [aWord+""] : this.getRangeAll(win).map(function(r) r.toString());
		if (!words.length) return;
		this.addWord(words, aTab);
		win.getSelection().removeAllRanges();
	},
	highlightWordSplit: function(aWord, aTab) {
		var win = this.getFocusedWindow();
		var words = (aWord || this.getBrowserSelection(win)).split(/[\u3000\u3001\u3002\uFF1A\uFF1B;:,\s]+/g);
		if (!words.length) return;
		this.addWord(words, aTab);
		win.getSelection().removeAllRanges();
	},
	highlightWordAuto: function(aWord, aTab) {
		var win = this.getFocusedWindow();
		var words = (aWord || this.getBrowserSelection(win)).match(this.tangoReg);
		if (!words || !words.length) return;
		this.addWord(words, aTab);
		win.getSelection().removeAllRanges();
	},
	highlightWordInput: function(aWord, aTab) {
		var elem = document.commandDispatcher.focusedElement;
		if (!elem || !elem.value || !(elem instanceof HTMLInputElement)) return;
		var words = this.clean(elem.value);
		if (!words.length) return;
		this.addWord(words, aTab);
	},
	addWord: function(aWord, aTab) {
		var words;
		if (!aWord) {
			words = prompt("", "");
			if (!words || !/\S/.test(words)) return;
			words = [words];
		} else if (Array.isArray(aWord)) {
			words = aWord.filter(function(e,i,a) e && a.indexOf(e) === i);
		} else {
			words = [aWord+""];
		}
		if (!words.length) return;

		var toolbar = this.addToolbar(aTab || gBrowser.mCurrentTab);
		words.sort(function(a, b) b.length - a.length).forEach(function(str) toolbar.addWord(str, false));
		toolbar.goHighlight();
	},
	get tangoReg() {
		if (this._tangoReg) return this._tangoReg;
		var arr = [
			"[\\u4E00-\\u9FA0]{2,}" // 漢字
			,"[\\u4E00-\\u9FA0][\\u3040-\\u309F]+" // 漢字１文字＋ひらがな
			,"[\\u30A0-\\u30FA\\u30FC]{2,}" // カタカナ
			,"[\\uFF41-\\uFF5A\\uFF21-\\uFF3A\\uFF10-\\uFF19]{2,}" // 全角英数数字（小文字、大文字、数字）
			,"[\\w%$\\@#+]{5,}"
			,"\\d[\\d.,]+"
			,"\\w[\\w.]+"
		];
		return this._tangoReg = new RegExp(arr.join('|'), 'g');
	},
	get kukuriReg() {
		if (this._kukuriReg) return this._kukuriReg;
		var obj = {
			'"': '"',
			"'": "'",
			'\uFF3B': '\uFF3D',//［］
			'\u3010': '\u3011',//【】
			'\u300E': '\u300F',//『』
			'\uFF08': '\uFF09',//（）
			'\u201D': '\u201D',// ””
			'\u2019': '\u2019',// ’’
		};
		var arr = Object.keys(obj).map(function(key) '\\' + key + '[^\\n\\'+ obj[key] +']{2,}\\' + obj[key]);
		return this._kukuriReg = new RegExp(arr.join('|'), 'g');
	},
	getKeyword: function (list, aDoc) {
		if (!list) list = this.SITEINFO;
		var locationHref = aDoc.location.href;

		for (let [index, info] in Iterator(list)) {
			try {
				var exp = info.url_regexp || (info.url_regexp = new RegExp(info.url));
				if ( !exp.test(locationHref) ) continue;
				if (info.keyword)
					return Array.isArray(info.keyword) ? info.keyword : info.keyword.split(/\s+/);
				if (info.input) {
					var input = aDoc.querySelector(info.input);
					if (input && input.value && /\S/.test(input.value))
						return this.clean(input.value);
				} else if (RegExp.$1) {
					try {
						return this.clean(decodeURIComponent(RegExp.$1));
					} catch (e) {}
					return this.clean(RegExp.$1);
				}
			} catch(e) {
				log('error at ' + e);
			}
		}
		return [];
	},
	clean: function clean(str) {
		var res = [];
		var kukuri = str.match(this.kukuriReg);
		if (kukuri) {
			[].push.apply(res, kukuri.map(function(w) w.slice(1,-1)));
			str = str.replace(this.kukuriReg, ' ');
		}
		str = (' ' + str + ' ').replace(/\s\-\S+|(?:(?:all)?(?:inurl|intitle|intext|inanchor)|link|cache|related|info|site|filetype|daterange|movie|weather|blogurl)\:\S*|\s(?:AND|OR)\s/g, ' ');
		var tango = str.match(/\S{2,}/g);
		if (tango) {
			[].push.apply(res, tango.sort(function(a,b) b.length - a.length));
		}
		return res.filter(function(e,i,a) e && a.indexOf(e) === i);
	},
	recoveryItems: function() {
		// 戻る進むでツールバーと実際のハイライトの整合性が取れない時用
		var hoge = {};
		var wins = this.getWins(content);
		var toolbar = this.addToolbar(gBrowser.mCurrentTab);
		wins.forEach(function(win){
			Array.slice(win.document.getElementsByClassName('wordhighliht-toolbar-span')).forEach(function(elem){
				var res = /wordhighliht-toolbar(\d+)/.exec(elem.className);
				if (!res || res[1] in hoge) return;
				hoge[ res[1] ] = elem.textContent.toLowerCase();
			});
		});
		Object.keys(hoge).forEach(function(key){
			var o = toolbar.items.filter(function(o) o.word.toLowerCase() == hoge[key])[0];
			if (o) {
				if (o.index != key) {
					toolbar.addWord(hoge[key], true);
				}
			} else {
				wins.forEach(function(win){
					Array.slice(win.document.getElementsByClassName('wordhighliht-toolbar' + key)).forEach(function(elem){
						var range = win.document.createRange();
						range.selectNodeContents(elem);
						var df = range.extractContents();
						elem.parentNode.replaceChild(df, elem);
						range.detach();
					});
				});
				toolbar.addWord(hoge[key], true);
			}
		});
		toolbar.goHighlight(true);
	},
};

window.gWHT.ToolbarClass = function() { this.init.apply(this, arguments) };
window.gWHT.ToolbarClass.prototype = {
	items: [],
	styles: [
		 'background-color: hsl( 60, 100%, 75%); color: #000;'
		,'background-color: hsl(120, 100%, 75%); color: #000;'
		,'background-color: hsl(180, 100%, 75%); color: #000;'
		//,'background-color: hsl(240, 100%, 75%); color: #000;'
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
		this.toolbar.setAttribute("hidden", "true");

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

		this.browser.addEventListener("GM_AutoPagerizeNextPageLoaded", this, true, true);
		this.browser.addEventListener("keypress", this, true);
	},
	destroy: function() {
		this.addbutton.removeEventListener("command", this, false);
		this.reloadbutton.removeEventListener("command", this, false);
		this.closebutton.removeEventListener("command", this, false);
		this.browser.removeEventListener("GM_AutoPagerizeNextPageLoaded", this, true);
		this.browser.removeEventListener("keypress", this, true);
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
					temp.shift().highlight(win, range);
					if (temp.length)
						win.setTimeout(gh, 10);
				}
				win.setTimeout(gh, 10);
				break;
			case "command":
				if (event.currentTarget === this.closebutton)
					return this.destroy();
				if (event.currentTarget == this.addbutton) {
					var word = prompt("Bitte geben Sie den gewünschten Text zum Hervorheben", gWHT.getBrowserSelection());
					if (!word || !/\S/.test(word)) return;
					var o = this.addWord(word, false);
					o.highlightAll();
					return;
				}
				if (event.currentTarget === this.reloadbutton) {
					gWHT.recoveryItems();
					return;
				}
				break;
			case "keypress":
				if (event.target instanceof HTMLTextAreaElement || 
						event.target instanceof HTMLSelectElement || 
						event.target instanceof HTMLInputElement && (event.target.mozIsTextField(false)))
					return;
				var {keyCode, charCode, ctrlKey, shiftKey, altKey} = event;
				if (charCode === 78 && !ctrlKey && !altKey) {
					this.findSpan(shiftKey, event.view);
					event.preventDefault();
					event.stopPropagation();
				} else if (charCode === 110 && !ctrlKey && !altKey) {
					this.findSpan(shiftKey, event.view);
					event.preventDefault();
					event.stopPropagation();
				}
				return;
				// Alt+(ctrl)+1~9
				//if (charCode >= event.DOM_VK_1 && charCode <= event.DOM_VK_9 && altKey && !shiftKey) {
				//	var o = this.items[charCode - event.DOM_VK_1];
				//	if (!o) return;
				//	o.find(ctrlKey);
				//	event.preventDefault();
				//	event.stopPropagation();
				//}
				break;
		}
	},
	indexOf: function(aWord) {
		// aWord が既にあるかを確認する
		var low = aWord.toLowerCase();
		for (let i = 0, len = this.items.length; i < len; i++) {
			if (low === this.items[i].word.toLowerCase()) return i;
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
		if (!aWord || !/\S/.test(aWord)) return;
		var index = this.indexOf(aWord);
		if (index >= 0) return;
		index = this.newIndexOf();
		var o = new gWHT.ItemClass(aWord, this, index, this.styles[index%this.styles.length], isAuto);
		this.items.push(o);
		this.toolbar.hidden = gBrowser.mCurrentTab != this.tab;
		return o;
	},
	goHighlight: function(isAll) {
		var temp = this.items.filter(function(o) (isAll || o.length === 0));
		if (!temp.length) return;

		// タイマーを掛けないと取りこぼす
		var win = this.browser.contentWindow;
		var gh = function() {
			temp.shift().highlightAll();
			if (temp.length)
				win.setTimeout(gh, 0);
		};
		win.setTimeout(gh, 0);
		this.toolbar.hidden = gBrowser.mCurrentTab != this.tab;
	},
	destroyAutoWord: function(keywords) {
		this.items.slice().forEach(function(obj) {
			if (!obj.isAuto) return;
			if (keywords && keywords.indexOf(obj.word) >= 0) return;
			obj.destroy();
		}, this);
	},
	findSpan: function(isPrev, aWin) {
		var win = aWin || gWHT.getFocusedWindow();
		var doc = win.document;
		var tw = win.whtw || (win.whtw = this.createTreeWalker(doc));
		var sel = win.getSelection();
		// ツリーの現在地を最後にクリックした位置に合わせる
		if (sel.focusNode)
			tw.currentNode = isPrev ? sel.anchorNode : sel.focusNode;
		sel.removeAllRanges();

		var node;
		if (isPrev) {
			node = tw.previousNode();
			if (!node) {
				tw.currentNode = doc.body.lastChild;
				node = tw.previousNode();
			}
		} else {
			node = tw.nextNode();
			if (!node) {
				tw.currentNode = doc.body;
				node = tw.nextNode();
			}
		}
		if (!node) return;

		var range = doc.createRange();
		range.selectNode(node);
		sel.addRange(range);
		sel.QueryInterface(Ci.nsISelectionPrivate)
			.scrollIntoView(Ci.nsISelectionController.SELECTION_ANCHOR_REGION, true, 50, 50);
		range.detach();

		var anchor = doc.evaluate('descendant-or-self::a[@href]|ancestor-or-self::a[@href]',
			node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (anchor && !/^mailto/.test(anchor.href)) {
			anchor.focus();
		}
		node.style.setProperty('outline', '3px solid #36F', 'important');
		win.setTimeout(function() {
			node.style.removeProperty('outline');
		}, 400);
		sel.collapse(node, 0);
	},
	createTreeWalker: function(doc) {
		return doc.createTreeWalker(
			doc.body, NodeFilter.SHOW_ELEMENT, this.twFilter.bind(this), false);
	},
	twFilter: function(node) {
		if (node.mozMatchesSelector('.wordhighliht-toolbar-span') && node.offsetHeight) {
			return NodeFilter.FILTER_ACCEPT;
		}
		return NodeFilter.FILTER_SKIP;
	},
};

window.gWHT.ItemClass = function() { this.init.apply(this, arguments); }
window.gWHT.ItemClass.prototype = {
	FIND_FOUND   : 0,
	FIND_NOTFOUND: 1,
	FIND_WRAPPED : 2,
	TYPE: Ci.nsISelectionController.SELECTION_ACCESSIBILITY,
	finder: Cc["@mozilla.org/embedcomp/rangefind;1"].createInstance().QueryInterface(Ci.nsIFind),
	sound: Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound),
	css: ['font: inherit !important;'
		,'margin: 0px !important;'
		,'padding: 0px !important;'
		,'border: none !important;'
	].join(' '),
	_length: 0,
	get length() this._length,
	set length(val) {
		this.button.setAttribute("length", +val);
		return this._length = (+val);
	},
	getWins: function() gWHT.getWins(this.browser.contentWindow),
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

		this.button = document.createElement("toolbarbutton");
		this.button.setAttribute("label", this.word);
		this.button.setAttribute("style", this.color);
		this.button.setAttribute("length", "0");
		this.button.setAttribute("class", [
			"wordhighliht-toolbar-item",
			"wordhighliht-toolbar" + this.index,
			(this.isAuto ? "auto" : "user")].join(' ')
		);
		this.button.setAttribute("tooltiptext", [
			'Mausrad runter, oder Linksklick zum Weitersuchen',
			'Shift + Linksklick, oder Mausrad zum vorherigen Wort',
			'Mittelklick auf Mausrad zum Löschen'].join('\n')
		);
		this.tb.box.appendChild(this.button);
		this.button.addEventListener("command", this, false);
		this.button.addEventListener("DOMMouseScroll", this, false);
		this.button.addEventListener("click", this, false);
	},
	destroy: function() {
		this.button.removeEventListener("DOMMouseScroll", this, false);
		this.button.removeEventListener("click", this, false);
		this.button.removeEventListener("command", this, false);
		this.lowlightAll();

		var index = this.tb.items.indexOf(this);
		if (index >= 0)
			this.tb.items.splice(index, 1);

		this.button.parentNode.removeChild(this.button);
	},
	handleEvent: function(event) {
		switch(event.type){
			case "DOMMouseScroll":
				this.find(event.detail < 0);
				event.preventDefault();
				event.stopPropagation();
				break;
			case "command":
				this.find(event.shiftKey);
				break;
			case "click":
				if (event.button != 1) return;
				event.preventDefault();
				event.stopPropagation();
				this.destroy();
				break;
		}
	},
	find: function(isBack) {
		var res;
		if (this.fastFind.searchString != this.word) {
			res = this.fastFind.find(this.word, false);
			if (isBack) {
				res = this.fastFind.findAgain(isBack, false);
			}
		} else {
			res = this.fastFind.findAgain(isBack, false);
		}
		if (res === this.FIND_NOTFOUND)
			return this.sound.beep();
		if (res === this.FIND_WRAPPED)
			this.sound.beep();
		var win = this.fastFind.currentWindow;
		if (!win) return;
		var sel = win.getSelection();
		var node = sel.getRangeAt(0).startContainer;
		var span = node.parentNode;
		if (!span.classList.contains('wordhighliht-toolbar-span')) return;
		sel.collapse(node, 1);
		span.style.setProperty('outline', '4px solid #36F', 'important');
		win.setTimeout(function () {
			span.style.removeProperty('outline');
		}, 400);
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

		var cls = "wordhighliht-toolbar" + this.index ;
		var cls2 = "wordhighliht-toolbar-span " + (this.isAuto ? "auto" : "user");
		var len = 0;
		for (var retRange = null; 
		     retRange = finder.Find(this.word, range, sRange, eRange); 
		     sRange = retRange.cloneRange(), sRange.collapse(true)) {
			var pare = retRange.startContainer.parentNode;
			if (pare.mozMatchesSelector(this.throughSelector)) {
				if (pare.classList.contains(cls))
					++len;
				continue;
			}
			var pare = retRange.endContainer.parentNode;
			if (pare.mozMatchesSelector(this.throughSelector)) {
				if (pare.classList.contains(cls))
					++len;
				continue;
			}
			let span = doc.createElementNS("http://www.w3.org/1999/xhtml", "font");
			span.setAttribute("style", this.css + this.color);
			span.setAttribute("class", cls2 + " " + cls);
			try {
				retRange.surroundContents(span);
				++len;
				continue;
			} catch (e) {}
			try {
				// 範囲内の要素を細切れにしてでも強調する。行儀が悪い
				span.appendChild(retRange.extractContents());
				retRange.insertNode(span);
				++len;
				continue;
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
			range.detach();
		};
		this.getWins().forEach(function(w){
			Array.slice(w.document.getElementsByClassName("wordhighliht-toolbar" + this.index)).forEach(rm, this);
			w.document.body.normalize();
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
  list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4jWNgGBTg6dOi/6RgrAb8/19PFB7EBlAUBoMDFD0t+k8qxjCgngQ4SA2gKAwGDAAAM3SE/usVkKQAAAAASUVORK5CYII=");
}

.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-up,
.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-down{
  min-width: 16px;
}

.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-up > .autorepeatbutton-icon,
.wordhighliht-toolbar-arrowscrollbox > .autorepeatbutton-down > .autorepeatbutton-icon {
  -moz-transform: rotate(-90deg);
}

.wordhighliht-toolbar-toolbar .tabs-closebutton {
  padding: 0px 3px !important;
}
.wordhighliht-toolbar-toolbar .tabs-closebutton > .toolbarbutton-icon {
  -moz-padding-end: 0px !important;
  -moz-padding-start: 0px !important;
}
.wordhighliht-toolbar-item.user {
  font-weight: bold !important;
}
.wordhighliht-toolbar-item {
  -moz-appearance: none !important;
  -moz-box-align: center !important;
  padding: 2px 3px !important;
  margin: 0px 0px 0px 3px !important;
  border: 1px solid rgba(0,0,0,.2) !important;
  border-radius: 0 10px 0 10px / 0 10px 0 10px  !important;
}
.wordhighliht-toolbar-item:hover {
  border: 1px outset rgba(0,0,0,.6) !important;
}
.wordhighliht-toolbar-item:hover:active {
  border: 1px inset rgba(0,0,0,.4) !important;
}
.wordhighliht-toolbar-item[length]:after {
  content: "(" attr(length) ")" !important;
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
/*
#statusbar-display { left: auto !important; }
*/
]]>.toString());