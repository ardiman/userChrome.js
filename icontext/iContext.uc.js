// ==UserScript==
// @name           iContext.uc.js
// @description    冗長な右クリックメニューをアイコン化してみるテスト
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 10
// @charset        UTF-8
// @include        main
// @version        下書き2
// @note           使いにくいのでボツ
// ==/UserScript==

(function(css){

/*
{
	command   : "実行したい要素の id"
	,oncommand: "JS を書く"
	,text     : "マウスオーバー時の説明文。省略するとcommandで指定した要素のlabelになる"
	,label    : "ボタンの文字。基本アイコンなので使わない"
	,image    : "ボタンのアイコン。標準アイテムには CSS でアイコンが付けてある"
	,icon     : "star,save,back,forwardなど。アイコンを消す場合はnone"
}
command か oncommand が必須
基本的にプロパティがそのまま属性になる

*/

const PAGE = 
[{ command: 'context-bookmarkpage' }
,{ command: 'context-savepage' }
,{
	text: 'URL kopieren'
	,oncommand: 'Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString(content.location.href);'
	,icon: 'copy'
}
,{ command: 'context-sendpage' }
,{ command: 'context-viewsource' }
,{ command: 'context-viewinfo' }
,{ command: 'context-viewbgimage', label: "G", icon: "none" }
,null//折り返し
,{ command: 'context-back' }
,{ command: 'context-forward' }
,{ command: 'context-reload' }
,{ command: 'context-stop' }
,{ oncommand: 'BrowserGoHome(event);', text: "Startseite öffnen", icon: "home" }
];

const LINK = 
[{
	text: 'Link im aktuellen Tab öffnen'
	,icon: 'blank'
	,oncommand: 'document.getElementById("context-openlinkincurrent").doCommand(); closeMenus(event.target);'
	,onclick: 'checkForMiddleClick(document.getElementById("context-openlinkintab"), event);'
}
,{
	text: 'Link in neuem Tab öffnen'
	,icon: 'newtab'
	,oncommand: 'document.getElementById("context-openlinkintab").doCommand(); closeMenus(event.target);'
}
,{ command: 'context-openlink' }
,{ command: 'context-copylink' }
,{ command: 'context-bookmarklink' }
,{ command: 'context-savelink' }
,{ command: 'context-sendlink' }
];

const IMAGE = 
[{ command: 'context-viewimage' }
,{ command: 'context-saveimage' }
,{ command: 'context-copyimage-contents' }
,{ command: 'context-copyimage' }
,{ command: 'context-viewimageinfo' }
,{ command: 'context-sendimage' }
,{ command: 'WebScreenShotOnImage', label: "64", icon: "none" }
];

//const SELECTION = 
//[{ command: 'context-searchselect'}
//,{ command: 'context-viewpartialsource-selection'}
//];

if (window.giContext) {
	window.giContext.destroy();
	delete window.giContext;
}

window.giContext = {
	originalIDs: [],
	init: function() {
		this.style = addStyle(css);
		let contextmenu = document.getElementById("contentAreaContextMenu");

		for (var i = 0, len = PAGE.length; i < len; i++) {
			this.add("PAGE", PAGE[i]);
		};
		for (var i = 0, len = LINK.length; i < len; i++) {
			this.add("LINK", LINK[i]);
		};
		for (var i = 0, len = IMAGE.length; i < len; i++) {
			this.add("IMAGE", IMAGE[i]);
		};
		//for (var i = 0, len = SELECTION.length; i < len; i++) {
		//	this.add("SELECTION", SELECTION[i]);
		//};
		//Services.search.getEngines({}).forEach(function(engine, i) {
		//	if (i%6===0) this.add("SELECTION", null)
		//	this.add("SELECTION", {
		//		text: engine.name + " で検索"
		//		,oncommand: [
		//			'var selText = gContextMenu.browser.contentWindow.getSelection().toString();'
		//			,'if (!selText) return;'
		//			,'var engine = Services.search.getEngineByName("'+ engine.name +'") || Services.search.getEngineByAlias("'+engine.alias+'");'
		//			,'if (!engine) return;'
		//			,'openUILink(engine.getSubmission(selText).uri.spec, event);'
		//		].join('\n')
		//		,image: engine.iconURI ? engine.iconURI.spec : ''
		//	});
		//}, this);

		contextmenu.addEventListener("popupshowing", this, false);
		contextmenu.addEventListener("popupshown", this, false);
		window.addEventListener("unload", this, false);
	},
	uninit: function() {
		let contextmenu = document.getElementById("contentAreaContextMenu");

		contextmenu.removeEventListener("popupshowing", this, false);
		contextmenu.removeEventListener("popupshown", this, false);
		window.removeEventListener("unload", this, false);
		var a = ["PAGE","LINK","IMAGE","SELECTION","PAGE_LINK","TAB","ALLTAB"];
		for (var i = 0, len = a.length; i < len; i++) {
			let container = this[a[i]+"_CONTAINER"];
			if (container)
				container.removeEventListener("click", this, false);
		};
	},
	destroy: function() {
		this.uninit();
		if (this.style) this.style.parentNode.removeChild(this.style);
		Array.slice(document.getElementsByClassName('icontext-box'))
		     .forEach(function(elem){ elem.parentNode.removeChild(elem); });
		Array.slice(document.querySelectorAll('[icontext-hidden]'))
		     .forEach(function(elem){ elem.removeAttribute('icontext-hidden'); });
	},
	handleEvent: function(event) {
		switch(event.type){
			case "popupshowing":
				let { onLink, onImage, onVideo, onAudio, isTextSelected, onTextInput } = gContextMenu;
				if (this.LINK_CONTAINER)
					this.LINK_CONTAINER.collapsed = !onLink;
				if (this.IMAGE_CONTAINER)
					this.IMAGE_CONTAINER.collapsed = !onImage;
				if (this.SELECTION_CONTAINER)
					this.SELECTION_CONTAINER.collapsed = !isTextSelected;

				if (this.PAGE_CONTAINER) 
					this.PAGE_CONTAINER.collapsed = (onLink || onImage || onVideo || onAudio || isTextSelected || onTextInput);
				if (this.PAGE_LINK_CONTAINER)
					this.PAGE_LINK_CONTAINER.collapsed = (onImage || onVideo || onAudio || isTextSelected || onTextInput);
				break;
			case "popupshown":
				Array.slice(event.target.querySelectorAll('.icontext-box'))
					.forEach(function(elem){
						elem.setAttribute("maxwidth", elem.boxObject.width);
					});
				break;
			case "click":
				var node = event.target;
				if (node.localName != 'button' || node.getAttribute("disabled") == "true")
					return;
				if (event.button == 0)
					setTimeout(closeMenus, 50, event.currentTarget);
				break;
			case "unload":
				this.uninit();
				break;
		}
	},
	add: function(aType, aObj) {
		aType = !aType ? "PAGE" : aType.toUpperCase();
		var container = this[aType + "_CONTAINER"];
		if (!container) {
			container = document.createElement('vbox');
			container.className = "icontext-box";
			container.setAttribute("ordinal", "0");
			container.setAttribute("icontext_type", aType);
			var label = container.appendChild(document.createElement("label"));
			label.setAttribute("default_text", label.textContent = 
				aType == "PAGE" ? "Seite…" : 
				aType == "LINK" ? "Link…" : 
				aType == "IMAGE" ? "Bild…" :
				aType == "SELECTION" ? "Auswahl…" :
				aType == "PAGE_LINK" ? "Seite oder Link…" : 
				aType == "TAB" ? "Tab…" : 
				aType == "ALLTAB" ? "Alle Tabs…" : 
				aType);
			label.setAttribute("crop", "end");

			container.appendChild(document.createElement("hbox"));
			let popup = aType.indexOf("TAB") >= 0 ?
				document.getElementById("tabContextMenu"):
				document.getElementById("contentAreaContextMenu");
			popup.appendChild(container);
			this[aType + "_CONTAINER"] = container;
			container.addEventListener('click', this, false);
		}

		let box = container.lastChild;
		if (!aObj || !aObj.command && !aObj.oncommand) {
			if (box.hasChildNodes())
				container.appendChild(document.createElement("hbox"));
			return;
		}

		// menuitemだとdisabledやlabelが継承されないのでbuttonを使う
		// buttonだとメニューが閉じないのはクリックを監視して対処する
		let item = box.appendChild(document.createElement('button'));
		item.setAttribute("flex", "1");
		if (aObj.command) {
			let org = document.getElementById(aObj.command);
			if (org && org.localName.indexOf("menu") == 0) {
				this.originalIDs.push(aObj.command)
				org.setAttribute('icontext-hidden', 'true');
			}
			// commandで属性を継承させた後で属性を付け直したいので先につける
			item.setAttribute("command", aObj.command);
			delete aObj.command;
			aObj.text || (aObj.text = item.getAttribute('label'));
		}

		for (let n in aObj)
			item.setAttribute(n, aObj[n]);

		aObj.onclick || item.setAttribute('onclick', 'checkForMiddleClick(this, event);');
		item.setAttribute('onmouseover', 'this.parentNode.parentNode.firstChild.value = this.getAttribute("text")');
		item.setAttribute('onmouseout', 'var a = this.parentNode.parentNode.firstChild; a.value = a.getAttribute("default_text");');
		//aObj.onclick || (aObj.onclick = 'checkForMiddleClick(this, event);');
		//aObj.onmouseover = 'this.parentNode.parentNode.firstChild.value = this.getAttribute("text") || this.getAttribute("label");';
		//aObj.onmouseout = 'var a = this.parentNode.parentNode.firstChild; a.value = a.getAttribute("default_text");';

		//buttonのlabelをtextに変え、labelは削除or書き換え
		item.setAttribute("text", aObj.text || item.getAttribute("label"));
		aObj.label ? item.setAttribute("label", aObj.label) : item.removeAttribute('label');

		item.removeAttribute("accesskey")
		item.classList.add("icontext-button");


		
	},
};







setTimeout(function() {
	window.giContext.init();
}, 1500);


function $(id) { return document.getElementById(id); }
function $$(exp, doc) { return Array.prototype.slice.call((doc || document).querySelectorAll(exp)); }
// http://gist.github.com/321205
function $A(args) { return Array.prototype.slice.call(args); }
function U(text) 1 < 'あ'.length ? decodeURIComponent(escape(text)) : text;
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
function addStyle(css) {
	var pi = document.createProcessingInstruction(
		'xml-stylesheet',
		'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
	);
	return document.insertBefore(pi, document.documentElement);
}


})(<![CDATA[
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");

.icontext-box {
	background-color: #f1f5fb;
}
.icontext-box * {
	padding: 0px;
	margin: 0px;
	border: none;
}

.icontext-button {
	min-width: 26px !important;
	min-height: 26px !important;
}


.icontext-button:not([label]) > hbox > label,
.icontext-button[icon="none"] > hbox > image,
[icontext-hidden="true"]:not(button),
#context-sep-stop,
#context-sep-viewbgimage,
#context-sep-copylink,
#context-sep-copyimage
  { display: none !important; }


.icontext-button:-moz-any([command^="context-bookmark"], [icon="star"]) {
	list-style-image: url("chrome://browser/skin/places/editBookmark.png");
	-moz-image-region: rect(0px, 16px, 16px, 0px);
}
.icontext-button:-moz-any([command^="context-save"], [icon="save"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC50lEQVQ4jY2Q21MbBRhH9z+iIRurjv4XvsqlCYQFtNJYIGk7OuNDx4EO1tFpy7VJNCkVrUKhZkN1cHCaALZQB4dL7pEmoblCuptssnt8gOn41OHhPJ7z++YTxJ7AgLlH/soiyRsWSS6KUlATJdmw9MpYpBPe7gvy7kfLvNMv81avXHrvorwu2hc+EARBECySPLGVUNhKqNQaBmrDQKnrlF81OSxrFI4aKHUdVdN5WWkQz9WM5Wf5xofXw3nRPm8VRCm4sxVX+Gw2h6IZKJqOdSRE8bjBYaXBkdKk1jCoKE1S+Tr7mRqBzSLLm3ne/zhQE0QpWN6MK1zzZ6koTSpKE+tIiFxFo1htoGo6Sl0nW9aIZmvsv1BxepL8sV3CbF8yBFEKahvRV1zzZ8iWNbJlja7RMLmyxnFNp6YZlKpN4rk6+xmV3QOVIXeCeysZRPsigijJRjhS5aovQzJfJ5mvky7UKVabqJrOsapzUNBeyzsHCoMzMbyP/8XcvYBg6ZV5slvl6vcvsI6EsI2G6b4Rpu/mOv031+kZW8M2EsL6PxwTe0wHkpi75hEskszqzhEubxqnJ43Tm8blTeHypHB5kgy7kwzOxLk8HcMxFWVgYh/HZIQ7D6OYbT+fBFa2j05kT/pUTOHyphh2Jxm6m2BwJsanUzEckxEuje9xaXyXbx7s0Wr96STw+HkZpyd1SvL1+tDdBIPTMS5PR3FMRhgY3+WT2ztcvP0PN+5v03phDsEiBZA3SzjdKWoN40z0f/s3X/qeY+q8j3C+V+bR0xLD7iSqZnD99843otR1pK+f8YXnKaaOWYTzfTKLG0Wcp4GVyG9vRKnr2Mf+4vOpDUwdfgSLFDDm1wo43YkzX2AbXePKeJiWNp8hiFIgNvfnS+ZWD8/8gyt3QgzfekJLu68giPZfx8z2R4vmnqWiaF9CtD/E3L2AuesXWm0PaLX+iOnCD5g6ZzF13ONcu5+WNp9xru27Sku7f/U/n64QFJ0JfmcAAAAASUVORK5CYII=");
}
.icontext-button:-moz-any([command^="context-copy"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHUlEQVQ4jZWSUYrCQBBES++xi3cQ43k80grexT8RlXznGpEgJDqZ7h6o/UnCaMasO1A/w/C6qqYB4BvACkCW0ALAHH+clapKCIGxvPfcbrc/n0CyEALbtmXTNLzdbizLkiEEOue42+16yDTAe0/nHOu65vV6HZyYGQGsOxezTmOAmdF7z8fjwbquWRQF9/s98zwngE0HSXaTxdN6J4fDgarKT7rJ4gc95Hg88tNustcpIsLT6cSpbkII7OKMAarK8/nMVDdVVQ1ORgAzo5lRVXm5XEaxnHNDnEkHZsY8z0d3IkLnHO/3+xNggfEKrwFsUtFEhG3bPgEQLUivOYB1ypmqDt8bA17PLNVNrH8BUhKRBsDyHeBdN7GWAL5+AXSfOyX5jHKEAAAAAElFTkSuQmCC");
}
.icontext-button:-moz-any([command^="context-send"], [icon="send"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACV0lEQVQ4jcWT3UtTcRzGz7/jlXddFFQSYm84CCIQISS6LCHQ6I3SpvhyhC5aBRVRQuUgNMuIfDnOJm46ceS7m9N5pm5nZ7p5dnbO7/zO9/d0MS/sPvCBz+XzgefikaRjz4NXU8rT3sV8o2+O3+iJUIMcoevyDNV3TVNdZ5iudYToavsUXfFOkqc1SJdbJtxLLYpVc3dArfDIivSsbyluOyQKpgvm4h+cI3AX4AS4BBglDm3fpqpmf0y692ZeHJQ4fN9UxNMMe6bAWoYQ1wgJnZDMEVL7ArsFgZIDbGoM3r4trKYKqO0OCanRFwXjhIHZAnzfVSQyDAVL/FPUDAHLAVSdofPLFp4P56EXbXi6Q5Bu9kTAOGF+m/A1UpZsagwmAzRDIFcUYBzYzjHI/SrejufxY9lFzjgU1LWFwThhOU1Y2CH4J3Po6ItD1RkYL+/f2WNo/xTH67EclJgLJXZE4HkYBOOElQwhmmQYnM7iY1DHyyEV67sWEmkLL4ZU9E7o+BzUEFizMblxKJBDkKqbArA54Y/K8HNORzRpY2mXMLJYxLuxDN6PZTAyX8TCDiGcsNA/ncXvmA39wIanOwzp5K1RYTIXw1EdSymGDV1gIyuQyArEsgLxrMC6JhDTCCtpwuymjcEZDWrWQG3XlJAq6z8k9gybUrop8iZHweIwLI6izWEyFyZzUWIuLObCcsroBYtmVjNWVZN/XarwyEplQ//+idu/nFPNo/zMfYWffTTOzz0e59VPArzGG+DnvQF+oa3MxfYJp6Z1uHj6jj9Z4ZGV437Sf8hf1IBPDl2Qkw0AAAAASUVORK5CYII=");
}
.icontext-button:-moz-any([command="context-viewsource"], [command="context-viewpartialsource-selection"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACAklEQVQ4jY2Tz2sTURSFr/4TIijoQkTBVUrWUlCDbgoK0lCLFBH8gTtrIy5cZNEWRI2LWigFpVCktFhEoWAUrRBiQdomaSI2JqaJ6USaTGYy897Le+Nx4TgYSVoPfMvzweVyiH5nHxH5iMi/AweIaDe1iY9zrkspHaUU2sE5RyQSedhJ4pdSOo1GA5ZledTrddRqNWiaBqUUiqkZZKbO48vzMJYnTmAlcqSfiGgXEfmVUmCMQQgBxhgYYzBNE7quo1KpwCzOoRwdhL76AjBLqK3OIDZ6crNFIITwYIzBtm0YhoHNz9Oort2F2JhH+e0o7MQsVH4RiclLrEUgpfRullKCcw59YwHV5B049iLs7DVsfbyO9NMBfHoc1N+MBA63CP7FKL1GNTEEh8VgrfeDFYIw1kIoPOnBlcDBPrfbXlBKzqG8NOiWL4B960U9eRvZ8dOwSkm4b20vKKXmkV64Ccd+B5YbAC/0QU8MYX0sAEP7CqVUZ0H6/RRSL0NYeXUfxfg5WLkgtpZvITvRA+tHDpzz7QXPhrsBI4/M+FlEQ3vxYSyA2L1TML9nwDnfWRC+fAwi9ggi/gDx8HHMXj2EaiGJZrPpsa2gt3sPhi8eRXTkDJamb6Cu5SGlbKGT4GenHbTBcQVeuoQQllKq45j+LgshTHe9XvYTUdd/zPkPPrdDvwBzfHXHWIsRUwAAAABJRU5ErkJggg==");
}
.icontext-button:-moz-any([command="context-viewinfo"], [command="context-viewimageinfo"], [icon="info"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACtElEQVQ4ja2T20/ScRjG+Vv02gv4dlNb86K5VgwwybYO5DBNPFzgStIUK8WAMCSIQxMxDA9QpGKJSlDgz7SQCYim/nJgBm1tdQMeluXTRRuszXnRerb38vls7/M+L4Pxv1WsXcxn66NStiZKn1CF0oXKYLpQOUcfV76VHmv35h9q5uhi/JNd4VR1bxi9vgSc1Cac1CYsnjiEhjmQZk+K2TzBP9B8WhfjF6kWMqrRVbhDKZgnE5A5PuDO0DI0rlU4/BvocMZAakYyzLrhvyHsrmheUWcoqRpdhet9Ci1Dy2i0RTA4/QmDgQ00WMOQPInA+modsqdhkAp7sqC8Py8LKNLMt1Z1hzAW/IImWwyS3jCu9Sxga3cPW7t7EPcEITYHIXkcgu11HBeUEyDn+1qzgML7QdriSUDronG9dwH1PSGIu4Po863D6ltHjYn6M8ZpyBwRGCZXQErNdBZwVEZtD7/7jKa+MMTmedQ+mkWNkQIA7AMQ6QOo0r1Blc6POmMADioOUqLbzgKOtPi2n89uosEaRo2JQrVhGiL9NGKJ78js7KGyy4cKtRdX1F6IHnhhn4mD8DQ5AJFO0d0eGopnS6g1zkL0MICr2jdYjH9DZucHyu9NoVw5AaHSjRtmClp3FISnzq1AGsZbBRofBv0J1OopiDR+uIMb+PlrH/sAwh+/QiAbg0DmgulFDKU3nSA8dS7EgmpnHhHZk7ftC7B61lCp8UKomsRlxTgE7S5cahvBxbZhdNpDaLTNgMVVJAvY8twZGQwGg1k2wGeetWRaBoKwTK1A0h2AUPkSZR1jqNd7YXBFIOmjQDjtGSZHfnAbmfwePuGbUudujUI7voT+AI3+wBq6xqI40+QA4cpSTI7sYHM2j2JtPinRSVnFGprFU6RZ3LtpwpXThCuXklMthz/Tv+g3HdPOfoYYAaMAAAAASUVORK5CYII=");
}
.icontext-button:-moz-any([command="context-back"], [icon="back"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 18px, 18px, 0);
}
.icontext-button:-moz-any([command="context-forward"], [icon="forward"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 36px, 18px, 18px);
}
.icontext-button:-moz-any([command="context-stop"], [icon="stop"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 54px, 18px, 36px);
}
.icontext-button:-moz-any([command="context-reload"], [icon="reload"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 72px, 18px, 54px);
}
.icontext-button:-moz-any([command="Browser:Home"], [icon="home"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 90px, 18px, 72px);
}
.icontext-button:-moz-any([icon="download"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 108px, 18px, 90px);
}
.icontext-button:-moz-any([icon="history"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 126px, 18px, 108px);
}
.icontext-button:-moz-any([icon="bookmark"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 144px, 18px, 126px);
}
.icontext-button:-moz-any([icon="print"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 162px, 18px, 144px);
}
.icontext-button:-moz-any([command="context-openlinkintab"], [icon="newtab"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 180px, 18px, 162px);
}
.icontext-button:-moz-any([icon="newwindow"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 198px, 18px, 180px);
}
.icontext-button:-moz-any([icon="copy"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 234px, 18px, 216px);
}
.icontext-button:-moz-any([icon="paste"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 252px, 18px, 234px);
}
.icontext-button:-moz-any([icon="fullscreen"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 270px, 18px, 252px);
}
.icontext-button:-moz-any([icon="zoomout"], [icon="plus"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 288px, 18px, 270px);
}
.icontext-button:-moz-any([icon="zoomin"], [icon="minus"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 306px, 18px, 288px);
}
.icontext-button:-moz-any([icon="sync"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 324px, 18px, 306px);
}
.icontext-button:-moz-any([icon="feed"]) {
	list-style-image: url("chrome://browser/skin/Toolbar.png"); -moz-image-region: rect(0, 342px, 18px, 324px);
}
.icontext-button:-moz-any([icon="feedorange"]) {
	list-style-image: url("chrome://browser/skin/feeds/feedIcon16.png");
}

.icontext-button:-moz-any([command="context-openlinkincurrent"], [icon="blank"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEUlEQVQ4jZWTW27CQAxFTdfRSt0DiH0WIbFDEAGUMJN47LHp7UfDKDxSmiudv7lHskcm+s07Ec2JaPmCTyJ6oyeZi0hjZhd3xzNEBKvV6mtMsjSzS9u26LqucD6fUdc19vs93B273Q7r9fpBMiOipbsjpQRVRUoJKSXEGNE0DaqqgruDmdG2LTabzVVyK1DVQkoJzIwQAg6Hw8NI/U5mNwIzKw/MDCJSRjkej6iqCtvtdlxwz1ASQkBd1zidTv8XDCXMjBgjQgjTBO6OnDNUFcwMZp4uMLOyXBH5n8DMCjln5JwhItMF1/KQSb/wjDHB9197uOPSC0oWqtq5++gxDcuqGvvrLfkgogW9Pucr875DP1s1i/OTwNbrAAAAAElFTkSuQmCC");
}
.icontext-button:-moz-any([command="context-openlink"], [icon="app"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIUlEQVQ4jaXRzUtUURjH8fNfzOxaumnRIgf6EyRIcVGI1GiT1Tg0mYwwjghSYjajE6KFYiImKdlmBi0cLQwhsBd6sTGstFWkqKXdebn3zrnnfltcNVtl9oPf5iw+POd5hPjflAZHA7HEcjYyskTjvSUahz8RHlqkYXCB0ECa+jvzXOl7w+Xe1wRvvSTQ/Zxw32y2NDgaEEIIcW1sWXVNrvKvDcafKiGEEJGRJQ7SmugMQgghGoc/c5CcbXvsAOG7HwEwpYUhLXRTktUlml5gK2fyPaOztplnZT3H17UMX1Y0ALytqW1gaBGAglIULAtTWuQLkpzhQD/zkh9Zg3VNZ21LZ3UjD8DplkcO0DC4AIClFFIpCkphWha6tMiZkqwhyegSLSfZzBTY0AwAKpsnHCA0kHYA20YqtQuZSmFYzpd2IG0bAqhoSjpAff+7XWCncs80hlKYUjIx94BQr5eazhNU3SihLFznAMHbrxwAUHsgadvOXpQi8WyElrEqxtM9vP2WIj7l52T8MMW17g5xqfvF7mnsbUTtmcaybaqjJSTe3yTxoQuA2PQ54tPn8fjdugh0zf315scjR3iY7v/jLTnfg6fWjSirG71/oXOWmugMvutPqGqd4szVSSqbx6loSnIqkuBY4BDRVDVtKS8AbZPe3xPsJ0cvulrLY0V0pHwk53voSPkojxU5O9hviv2udo/fpXlq3Xj8Lq3Y72oXQohfrdS0QnwwoU4AAAAASUVORK5CYII=");
}
.icontext-button:-moz-any([command="context-viewimage"], [icon="jpg"]) {
	list-style-image: url("moz-icon://.jpg?size=16");
}
.icontext-button:-moz-any([command="context-copyimage-contents"], [icon="images"]) {
	list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUElEQVQ4jYWS30tTcQDF909Fc2+OO0tjDmE1K4pELzrmnG7DMExnLyNDV/RjD1mhY/vu3g0jsojCJ9+CHqLIl3FJ6+pt3m3f+73rfkfkTg9O3arhgc/r4cPh2C5OZRd8k5ImBAi1iw0Gj3H6Ce0NZxK2drlwXf5RUJQ6M02YVQ5W5SixGvZYDXuMQysb6A5JlbYFQoBQg5nw3uxB5PHIEcO3F+CbXIEnmkfHEKm3NXOIhJpVjkjSj6X3C3jyIYFnH+/hSiyLgqLgRDOHSKhR5Zh6GsLy5/tY+XRATzgDg5nYCEbxNZ445s4DvLkxi6LBIQRkanOIhJYYR8+8gKvJOPqnUzgznkKHSCAE83CKGbhGsnCNSHCHJCw9eo3tRBJapVFgFwnVDY5ziS70z6RO1PZGc9hOJLFbsSAEJGo7PZimOuXoCJyCa2wZBjNxOfYQs+m3R9wi7zA0u4iiweEJEnwRr2Gn1CiwD6apTi1savsQgnmYVY5Y6hXyBYbnyk+82PqFl99+Iy6vQ6tweMayUIYHoB4WdI2SraJeBmUcXcE8jCpHXF7HmlrH2vf9I+LyOnYrFtyjaaxd8kHVLTj9ErX1RbLz7nF5QwhI1DFE6iXGcX4mjbCkICwpmMgUMJEpwDudwk7Jgjuyik1tH6rODwqaczioby6HaF5twTeXg1qy0BtdRZnVUCwb6A7JrQ89HLRzIAbfXK6FzoEYVN1Cp1+qO/0SPRuSaN9E9m6rQdOgm1r9L9poN6d5UGrWUDFrKDPeoI12c5oHdfr/5X/afwDntYTcCZeBqgAAAABJRU5ErkJggg==");
}
.icontext-button:-moz-any([command="context-searchselect"], [icon="search"]) {
	list-style-image: url("chrome://global/skin/icons/Search-glass.png");
	-moz-image-region: rect(0px, 16px, 16px, 0px);
}



]]>.toString());
