// ==UserScript==
// @name           DOMi_de_Info
// @description    DOM Inspector を利用して SITEINFO を書く
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 10
// @charset        UTF-8
// @include        chrome://inspector/content/inspector.xul
// @version        0.0.1
// @note           自分用で作りが雑だけどキニシナイ
// ==/UserScript==
// copySelectorForUC.uc.js との併用推薦
// https://raw.github.com/Griever/userChromeJS/master/UserCSSLoader/copySelectorForUC.uc.js

(function(){

let { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");

window.DOMi_de_Info = {
	xul: <vbox id="sw-container">
		<hbox id="sw-hbox">
			<button label="check" oncommand="DOMi_de_Info.checkInfo(true);"/>
			<button label="getInfo" oncommand="DOMi_de_Info.getInfo();" hidden="true"/>
			<button label="launch" oncommand="DOMi_de_Info.launch();" tooltiptext="uAutoPagerize で実行してみます"/>
		</hbox>
		<grid id="sw-grid">
			<columns>
				<column />
				<column flex="1"/>
			</columns>
			<rows>
				<row>
					<label value="url"/>
					<textbox id="sw-url"/>
				</row>
				<row>
					<label value="nextLink"/>
					<textbox id="sw-nextLink"/>
				</row>
				<row>
					<label value="pageElement"/>
					<textbox id="sw-pageElement"/>
				</row>
				<row>
					<label value="insertBefore"/>
					<textbox id="sw-insertBefore"/>
				</row>
			</rows>
		</grid>
	</vbox>,

	get uAutoPagerize() {
		let win = Services.wm.getMostRecentWindow("navigator:browser");
		return win ? win.uAutoPagerize : null;
	},
	get viewer() {
		try {
			return document.getElementById("bxDocPanel").mIFrameEl.contentWindow.viewer;
		} catch (e) {}
		return null;
	},
	get contentWindow() {
		return this.viewer ? this.viewer.subject.defaultView : null;
	},
	get contentDocument() {
		return this.viewer ? this.viewer.subject : null;
	},

	init: function(){
		var urlbar = $("bxURLBarContainer");
		var button = document.createElement("toolbarbutton");
		button.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVQ4jWNgoAbg/sb9HxkzMDAwqN1X+4+MGRgYGKwPWv9HxsPJAIoBsbbZLrb9j4yHkwEUA2JtM+4x/o+Mh5MBlAAA1p8ysDmfoUUAAAAASUVORK5CYII=");
		button.setAttribute("oncommand", "DOMi_de_Info.toggle()");
		urlbar.parentNode.insertBefore(button, urlbar);
			window.addEventListener("unload", this, false);
},
	uninit: function() {
		window.removeEventListener("unload", this, false);
		if (!this.nextLink) return;
		this.nextLink.removeEventListener("popupshowing", this, false);
		this.pageElement.removeEventListener("popupshowing", this, false);
		this.insertBefore.removeEventListener("popupshowing", this, false);
	},
	handleEvent: function(event) {
		switch(event.type) {
			case "popupshowing":
				var { currentTarget: textbox, originalTarget: popup } = event;
				if (textbox.localName != "textbox") return;

				if (!popup.hasAttribute("created")) {
					textbox.removeEventListener(event.type, this, false);
					var type = textbox.id.replace("sw-", "");
					popup.setAttribute("created", "true");
					popup.appendChild($E(<>
						<menuseparator />
						<menuitem label={'@class="value" → contains()'}
						          tooltiptext={'class 属性を contains() を使った形式にします'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.NORMAL_TO_CLASS +')'} />
						<menuitem label={'@name="value" → starts-with(@name, "value")'}
						          tooltiptext={'属性を starts-with(@name, "value") にします'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.NORMAL_TO_STARTS +')'} />
						<menuitem label={'@name="value" → ends-with(@name, "value")'}
						          tooltiptext={'属性を substring(@name, string-length(@name) - string-length("value") + 1) = "value" にします'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.NORMAL_TO_ENDS +')'} />
<!--
						<menuitem label={'contains() → @class="value"'}
						          tooltiptext={'contains() で表した class 属性をを @name="value" に戻します'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.CLASS_TO_NORMAL +')'} />
						<menuitem label={'starts-with(@name, "value") → @name="value"'}
						          tooltiptext={'starts-with(@name, "value") を @name="value" に戻します'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.STARTS_TO_NOMARL +')'} />
						<menuitem label={'ends-with(@name, "value") → @name="value"'}
						          tooltiptext={'substring(@name, string-length(@name) - string-length("value") + 1) = "value" を @name="value" に戻します'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.ENDS_TO_NORMAL +')'} />
-->
						<menuseparator />
						<menuitem label={'starts/ends/contains → @name="value"'}
						          tooltiptext={'属性を @name="value" に戻します'}
						          oncommand={'DOMi_de_Info.replaceAttrXPath("'+ type +'", '+ this.SOME_TO_NORMAL +')'} />
					</>));

				}
				break;
		}
	},
	toggle: function(event) {
		let container = $("sw-container");
		if (!container) {
			document.documentElement.appendChild($E(this.xul));
			this.container = $("sw-container");
			this.url = $('sw-url');
			this.nextLink = $('sw-nextLink');
			this.pageElement = $('sw-pageElement');
			this.insertBefore = $('sw-insertBefore');

			this.url.value = "^" + this.contentDocument.location.href.replace(/[()\[\]{}|+.,^$?\\]/g, '\\$&');
			this.nextLink.addEventListener("popupshowing", this, false);
			this.pageElement.addEventListener("popupshowing", this, false);
			this.insertBefore.addEventListener("popupshowing", this, false);
		} else {
			container.hidden = !container.hidden;
		}
	},
	getInfo: function() {
		let uAutoPagerize = this.uAutoPagerize;
		if (!uAutoPagerize) return;
		let [index, info] = uAutoPagerize.getInfo(uAutoPagerize.MY_SITEINFO, this.contentWindow);
		if (index === -1) return alert(index);

		this.url.value = info.url || "";
		this.nextLink.value = info.nextLink || "";
		this.pageElement.value = info.pageElement || "";
		this.insertBefore.value = info.insertBefore || "";
	},
	toJSON: function() {
		var json = "{\n";
		json += "\turl          : '" + this.url.value.replace(/\\/g, "\\\\") + "'\n";
		json += "\t,nextLink    : '" + this.nextLink.value + "'\n";
		json += "\t,pageElement : '" + this.pageElement.value + "'\n";
		if (this.insertBefore.value)
			json += "\t,insertBefore: '" + this.insertBefore.value + "'\n";
		json += "\t,exampleUrl  : '" + this.contentDocument.location.href + "'\n";
		json += "}";
		alert(json);
	},
	launch: function() {
		var uap = this.uAutoPagerize;
		if (!uap) return this.checkInfo(true);
		var win = this.contentWindow;
		if (win.ap) return alert("既に実行されています");

		var i = this.checkInfo();
		if (!i) return;

		var [index, info] = uap.getInfo([i], win);
		if (index === 0) {
			if (win.AutoPagerize && win.AutoPagerize.launchAutoPager)
				win.AutoPagerize.launchAutoPager([i]);
			else alert("SITEINFO は正常ですが、uAutoPagerize は実行できませんでした");
		} else {
			alert("この SITEINFO にはマッチしませんでした");
		}
	},
	checkInfo: function(isAlert) {
		var i = {
			url         : this.url.value,
			nextLink    : this.nextLink.value,
			pageElement : this.pageElement.value,
			insertBefore: this.insertBefore.value
		};
		if (!i.url || !i.nextLink || !i.pageElement)
			return alert("入力値が不正です");
		var logs = [];
		var doc = this.contentDocument;
		try {
			if (!new RegExp(i.url).test(doc.location.href))
				logs.push('url がマッチしません');
		} catch (e) {
			return alert(e);
		}
		if (!doc.evaluate(i.nextLink, doc, null, 9, null).singleNodeValue)
			logs.push('nextLink が見つかりません');
		if (!doc.evaluate(i.pageElement, doc, null, 9, null).singleNodeValue)
			logs.push('pageElement が見つかりません');
		if (logs.length) 
			return alert(logs.join('\n'));
		if (isAlert)
			this.toJSON();
		return i;
	},
	NORMAL_TO_CLASS: 0,
	CLASS_TO_NORMAL: 1,
	NORMAL_TO_STARTS: 2,
	STARTS_TO_NOMARL: 3,
	NORMAL_TO_ENDS: 4,
	ENDS_TO_NORMAL: 5,
	SOME_TO_NORMAL: 6,
	replaceAttrXPath: function(aType, constant) {
		var t = this[aType];
		if (t.selectionStart == t.selectionEnd) {
			t.select();
			var value = t.value;
		} else {
			var value = t.value.substring(t.selectionStart, t.selectionEnd);
		}
		if (!value) return;
		if (!t.editor.insertText) {
			t instanceof Ci.nsIDOMNSEditableElement;
			t.editor.QueryInterface(Ci.nsIPlaintextEditor)
		}
		switch (constant) {
			case this.NORMAL_TO_CLASS : t.editor.insertText(normal2class(value)); break;
			case this.CLASS_TO_NORMAL : t.editor.insertText(class2normal(value)); break;
			case this.NORMAL_TO_STARTS: t.editor.insertText(normal2starts(value)); break;
			case this.STARTS_TO_NOMARL: t.editor.insertText(starts2normal(value)); break;
			case this.NORMAL_TO_ENDS  : t.editor.insertText(normal2ends(value)); break;
			case this.ENDS_TO_NORMAL  : t.editor.insertText(ends2normal(value)); break;
			case this.SOME_TO_NORMAL  : t.editor.insertText(class2normal(starts2normal(ends2normal(value)))); break;
		}
	},
};
window.DOMi_de_Info.init();


// Utility functions.
function normal2class(xpath) {
	return xpath.replace(/@class=\"(.+?)\"/g, function(str, cls) {
		cls = cls.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ");
		for (var i = 0, l = cls.length; i < l; i++) {
			cls[i] = 'contains(concat(" ",normalize-space(@class)," "), " '+ cls[i] +' ")';
		}
		return cls.join(" and ");
	});
}

function class2normal(xpath) {
	let r = /(?:contains\(concat\(\" \"\,normalize\-space\(@class\)\,\" \"\)\, \" .+? \"\)(?: and )?)+/g;
	return xpath.replace(r, function(str) {
		let cls = str.split(' and ').map(function(c) c.replace(/.*\" (.*) \".*/i, '$1') );
		return '@class="'+ cls.join(' ') +'"';
	});
}

function normal2starts(xpath) {
	return xpath.replace(/(@.+?)=\"(.+?)\"/g, function(str, aName, aValue) {
		return 'starts-with('+ aName +', "'+ aValue +'")';
	});
}

function starts2normal(xpath) {
	return xpath.replace(/starts-with\((@.+?)\, \"(.+?)\"\)/g, function(str, aName, aValue) {
		return aName + '="' + aValue + '"';
	});
}

function normal2ends(xpath) {
	return xpath.replace(/(@.+?)=\"(.+?)\"/g, function(str, aName, aValue) {
		return 'substring('+ aName +', string-length(' + aName + ') - string-length("' + aValue + '") + 1) = "' + aValue + '"'
	});
}

function ends2normal(xpath) {
	return xpath.replace(/substring\((@.+?)\, string\-length\(@.+?\) \- string\-length\(\"(.+?)\"\) \+ 1\) = \".+?\"/g, function(str, aName, aValue) {
		return aName + '="' + aValue + '"';
	});
}



function log(){ Application.console.log($A(arguments)); }
function $(id, doc) (doc || document).getElementById(id);
function $A(arr) Array.slice(arr);
function $E(xml, doc) {
	doc = doc || document;
	xml = <root xmlns={doc.documentElement.namespaceURI}/>.appendChild(xml);
	var settings = XML.settings();
	XML.prettyPrinting = false;
	var root = new DOMParser().parseFromString(xml.toXMLString(), 'application/xml').documentElement;
	XML.setSettings(settings);
	doc.adoptNode(root);
	var range = doc.createRange();
	range.selectNodeContents(root);
	var frag = range.extractContents();
	range.detach();
	return frag.childNodes.length < 2 ? frag.firstChild : frag;
}

function addStyle(css, doc) {
	doc = doc || document;
	var pi = doc.createProcessingInstruction(
		'xml-stylesheet',
		'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
	);
	return doc.insertBefore(pi, doc.documentElement);
}



})();
