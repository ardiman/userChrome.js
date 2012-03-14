// ==UserScript==
// @name           JSCSS_Highlight.uc.js
// @description    Syntax Highlight js and css.
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 10
// @charset        UTF-8
// @include        main
// @version        0.0.1
// @note           
// ==/UserScript==

(function(){

var JS = {};
var CSS = {};
var XML = {};
var BASE = {};


JS.keyword = [
"abstract","boolean","break","byte","case","catch","char","class","const",
"continue","debugger","default","delete","do","double","else","enum","export",
"extends","false","final","finally","float","for","function","goto","if",
"implements","import","in","instanceof","int","interface","long","native","new",
"null","package","private","protected","public","return","short","static",
"super","switch","synchronized","this","throw","throws","transient","true","try",
"typeof","var","void","volatile","while","with",
"let","yield","infinity","NaN","undefined"
];

JS.object = [
"Array","Boolean","Date","Error","EvalError","Function","Number","Object",
"RangeError","ReferenceError","RegExp","String","SyntaxError","TypeError",
"URIError","eval","decodeURI","decodeURIComponent","encodeURI",
"encodeURIComponent","escape","unescape","isFinite","isNaN","parseFloat",
"parseInt"
];

JS.method = [
"addEventListener","removeEventListener","handleEvent","alert","prompt",
"confirm","setTimeout","setInterval","clearTimeout","clearInterval","toString",
"toSource"
];

JS.property = [
"window","document","prototype","callee","caller","event","arguments"
];

JS.hougen = [
"$","jQuery", "opera","chrome", "gBrowser","Components",
"GM_log","GM_addStyle","GM_xmlhttpRequest","GM_openInTab",
"GM_registerMenuCommand","GM_unregisterMenuCommand","GM_enableMenuCommand",
"GM_disableMenuCommand","GM_getResourceText","GM_getResourceURL",
"GM_setValue","GM_getValue","GM_listValues","GM_deleteValue",
"GM_getMetadata","GM_setClipboard","GM_safeHTMLParser","GM_generateUUID"
];

JS.keyword.sort(function(a,b) b.length - a.length);
JS.object.sort(function(a,b) b.length - a.length);
JS.method.sort(function(a,b) b.length - a.length);
JS.property.sort(function(a,b) b.length - a.length);
JS.hougen.sort(function(a,b) b.length - a.length);


CSS.keyword = [
"@import","@charset","@media","@font-face","@page","@namespace","@keyframes",
"(?:\\!important)\\;",
"@-moz-document",
":root",":not","::?before","::?after","::?first-letter","::?first-line",
":link",":visited",":active",":focus",":hover",
":target",":enabled",":disabled",":checked",":default",":empty",
":nth-(?:last-)child",":nth-(?:last-)of-type",":(?:first|last|only)-child",
":(?:first|last|only)-of-type"
];


CSS.property = ['padding','margin','border','background'];
CSS.hougen = [];
var s = getComputedStyle(document.documentElement, null);
for(var i = 0, p; p = s[i]; i++) {
	p[0] === "-" ? CSS.hougen.push(p) : CSS.property.push(p);
}

CSS.colors = [
'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black',
'blanchedalmond','blue','blueviolet','brass','brown','burlywood','cadetblue',
'chartreuse','chocolate','coolcopper','copper','coral','cornflower',
'cornflowerblue','cornsilk','crimson','cyan','darkblue','darkbrown','darkcyan',
'darkgoldenrod','darkgray','darkgreen','darkkhaki','darkmagenta',
'darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen',
'darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink',
'deepskyblue','dimgray','dodgerblue','feldsper','firebrick','floralwhite',
'forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray',
'green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki',
'lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral',
'lightcyan','lightgoldenrodyellow','yellowgreen',

'ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText',
'Highlight','HighlightText','InactiveBorder','InactiveCaption',
'InactiveCaptionText','InfoBackground','InfoText','Menu','MenuText',
'Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText'
];
CSS.property.sort(function(a,b) b.length - a.length);
CSS.hougen.sort(function(a,b) b.length - a.length);
CSS.colors.sort(function(a,b) b.length - a.length);


JS.keyword_r  = '\\b(?:' + JS.keyword.join('|') + ')\\b';
JS.object_r   = '\\b(?:' + JS.object.join('|') + ')\\b';
JS.method_r   = '\\b(?:' + JS.method.join('|') + ')\\b';
JS.property_r = '\\b(?:' + JS.property.join('|') + ')\\b';
JS.hougen_r   = '\\b(?:' + JS.hougen.join('|') + ')\\b';
JS.regexp_r   = "\\\/\(\(\?\:\\\\\.\|\\\[\(\?\:\\\\\.\|\[\^\\\]\]\)\*\\\]\|\[\^\\\/\\n\]\)\{0\,100\}\)\\\/\(\[gimy\]\*\)";
JS.CDATA_r    = "&lt\\;\\!\\\[CDATA\\\[\[\\s\\S\]\*\?\\\]\\\]&gt\\;";

CSS.keyword_r  = '(?:' + CSS.keyword.join('|') + ')';
CSS.property_r = '\\b(?:' + CSS.property.join('|') + ')\\b';
CSS.colors_r   = '\\b(?:' + CSS.colors.join('|') + ')\\b';
CSS.hougen_r   = '(?:' + CSS.hougen.join('|') + ')\\b';
CSS.url_r      = 'url\\([^)]+\\)';

XML.MComment_r = '&lt\\;!--[\\s\\S]+?--&gt\\;';

BASE.URL_r      = '(?:https?|ftp|file|chrome|data):\\/\\/\\/?[a-z0-9](?:[\\w#$%()=~^@:;?_.,\\/+-]|&amp;)+(?:[\\w#$%=:;?_,\\/+-]|&amp;)';
BASE.BASE64_r   = "data:image/[a-zA-Z-]+\;base64\,[a-zA-Z0-9/+]+={0,2}";
BASE.MComment_r = "\\\/\\\*\[\\s\\S\]\*\?\\\*\\\/";
BASE.SComment_r = "\\\/\\\/\.\*";
BASE.string_r   = '"(?:[^\n\"]|\\.|\\\\n)*\"' + '|' +
                  "'(?:[^\n\']|\\.|\\\\n)*\'"


JS.keyword_s  = 'color:#a09;';
JS.object_s   = 'color:#c15;';
JS.method_s   = 'color:#027;';
JS.property_s = 'color:#06a;';
JS.hougen_s   = 'color:#06a;';
JS.regexp_s   = 'color:#c11;';
JS.CDATA_s    = 'color:#c11;';

CSS.keyword_s  = 'color:#a09;';
CSS.property_s = 'color:#06a;';
CSS.hougen_s   = 'color:#06a;';

XML.MComment_s = 'color:#080;';

BASE.MComment_s = 'color:#080;';
BASE.SComment_s = 'color:#080;';
BASE.string_s   = 'color:#c11;';
BASE.URL_s      = '';
BASE.BASE64_s   = 'color:green;';

JS.R_keyword  = new RegExp(JS.keyword_r);
JS.R_object   = new RegExp(JS.object_r);
JS.R_method   = new RegExp(JS.method_r);
JS.R_property = new RegExp(JS.property_r);
JS.R_hougen   = new RegExp(JS.hougen_r);

CSS.R_keyword  = new RegExp(CSS.keyword_r);
CSS.R_property = new RegExp(CSS.property_r);
CSS.R_colors   = new RegExp(CSS.colors_r);
CSS.R_hougen   = new RegExp(CSS.hougen_r);
CSS.R_url      = new RegExp(CSS.url_r);

BASE.R_URL = new RegExp(BASE.URL_r, "g");
BASE.R_BASE64 = new RegExp(BASE.BASE64_r, "g");

JS.R_ALL = new RegExp([
	BASE.MComment_r
	,BASE.SComment_r
	,BASE.string_r
	,JS.CDATA_r
	,JS.keyword_r
	,JS.object_r
	,JS.method_r
	,JS.property_r
	,JS.hougen_r
//	,JS.regexp_r
].join('|'), "g");

CSS.R_ALL = new RegExp([
	BASE.MComment_r
	,BASE.string_r
	,CSS.keyword_r
	,CSS.property_r
	,CSS.colors_r
	,CSS.hougen_r
].join('|'), "g");

XML.R_ALL = new RegExp([
	XML.MComment_r
	,JS.CDATA_r
	,BASE.string_r
].join('|'), "g");

BASE.R_ALL = new RegExp([
	BASE.MComment_r
	,XML.MComment_r
	,BASE.string_r
	,CSS.colors_r
].join('|'), 'g');

function parse(aText, type) {
	aText = aText.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
	if (type == "CSS") aText = CSSParser(aText);
	else if (type == "JS") aText = JSParser(aText);
	else if (type == "XML") aText = XMLParser(aText);
	else aText = EXParset(aText);

	aText = aText.replace(BASE.R_BASE64, '<img src="$&" alt="$&">');
	aText = aText.replace(BASE.R_URL, '<a href="$&" style="'+ BASE.URL_s +'">$&</a>');
	return aText;
}

function JSParser(aText) {
	return aText.replace(JS.R_ALL, function(str, offset, s) {
		if (str.indexOf("//") === 0) 
		{
			return '<span style="'+ BASE.SComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str + '</span>';
		}
		else if (str.indexOf("/") === 0) {
			return '<span style="'+ JS.regexp_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;![CDATA[") === 0) {
			if (CSS.R_keyword.test(str)) return CSSParser(str);
			return '<span style="'+ JS.CDATA_s +'">' + str + '</span>';
		}
		else if (JS.R_keyword.test(str)) {
			return '<span style="'+ JS.keyword_s +'">' + str + '</span>';
		}
		else if (JS.R_object.test(str)) {
			return '<span style="'+ JS.object_s +'">' + str + '</span>';
		}
		else if (JS.R_method.test(str)) {
			return '<span style="'+ JS.method_s +'">' + str + '</span>';
		}
		else if (JS.R_property.test(str)) {
			return '<span style="'+ JS.property_s +'">' + str + '</span>';
		}
		else if (JS.R_hougen.test(str)) {
			return '<span style="'+ JS.hougen_s +'">' + str + '</span>';
		}
		else {
			return str;
		}
	});
}

function XMLParser(aText) {
	return aText.replace(XML.R_ALL, function(str, offset, s) {
		if (str.indexOf("&lt;!--") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;![CDATA[") === 0) {
			let res = JSParser(str.replace("&lt;![CDATA[", "").replace("]]&gt;", ""));
			return "&lt;![CDATA[" + res + "]]&gt;";
		}
		else {
			return str;
		}
	});
}

function CSSParser(aText) {
	return aText.replace(CSS.R_ALL, function(str, offset, s) {
		if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;") + '</span>';
		}
		else if (CSS.R_hougen.test(str)) {
			return '<span style="'+ CSS.hougen_s +'">' + str + '</span>';
		}
		else if (CSS.R_colors.test(str)) {
			return '<span style="color:'+ str +';">' + str + '</span>';
		}
		else if (CSS.R_keyword.test(str)) {
			return '<span style="'+ CSS.keyword_s +'">' + str + '</span>';
		}
		else if (CSS.R_property.test(str)) {
			return '<span style="'+ CSS.property_s +'">' + str + '</span>';
		}
		else {
			return str;
		}
	});
}

function EXParset(aText) {
	return aText.replace(BASE.R_ALL, function(str, offset, s) {
		if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;!--") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;") + '</span>';
		}
		else if (CSS.R_colors.test(str)) {
			return '<span style="color:'+ str +';">' + str + '</span>';
		}
		return str;
	});
}

if (window.JSCSS) {
	window.JSCSS.destroy();
	delete window.JSCSS;
}

var _disabled = true;
window.JSCSS = {
	get disabled () _disabled,
	set disabled (bool) {
		if (_disabled != bool) {
			if (bool) {
				gBrowser.mPanelContainer.removeEventListener("DOMContentLoaded", this, false);
			} else {
				gBrowser.mPanelContainer.addEventListener("DOMContentLoaded", this, false);
			}
		}
		document.getElementById("JSCSS-menuitem").setAttribute("checked", !bool);
		return _disabled = !!bool;
	},
	init: function() {
		var menuitem = document.createElement("menuitem");
		menuitem.setAttribute("id", "JSCSS-menuitem");
		menuitem.setAttribute("label", "JSCSS Highlight");
		menuitem.setAttribute("type", "checkbox");
		menuitem.setAttribute("checked", "true");
		menuitem.setAttribute("autoCheck", "false");
		menuitem.setAttribute("oncommand", "JSCSS.disabled = !JSCSS.disabled;");
		var ins = document.getElementById("devToolsSeparator");
		ins.parentNode.insertBefore(menuitem, ins);

		this.disabled = false;
		window.addEventListener("unload", this, false);
	},
	uninit: function() {
		this.disabled = true;
	},
	destroy: function() {
		this.disabled = true;
		var i = document.getElementById("JSCSS-menuitem");
		if (i) i.parentNode.removeChild(i);
	},
	handleEvent: function(event) {
		switch(event.type){
			case "DOMContentLoaded":
				var doc = event.target;
				if (!/css|javascript|plain/.test(doc.contentType) || 
				    doc.location.protocol === "view-source:"
				) return;
				this.run(doc, 100000);
				break;
			case "unload":
				this.uninit();
				break;
		}
	},
	write: function(pre) {
		var doc = pre.ownerDocument;
		var { contentType, URL } = doc;
		var type = contentType.indexOf('javascript') >= 0 ? 'JS' : 
			contentType.indexOf('css') >= 0 ? 'CSS' : 
			contentType === 'text/plain' && /\.(?:xul|xml)$/.test(URL) ? 'XML' :
			/\.(?:js|jsm|jsee)$/i.test(URL) ? 'JS' :
			/\.(?:css)$/i.test(URL) ? 'CSS' :
			'TXT';
		var html = parse(pre.textContent, type);
		var preRange = doc.createRange();
		preRange.selectNodeContents(pre);
		preRange.deleteContents();
		
		var range = doc.createRange();
		range.selectNodeContents(doc.body);
		var df = range.createContextualFragment(html);
		range.detach();
		preRange.insertNode(df);
		preRange.detach();
	},
	run: function(doc, maxLength) {
		var self = this;
		doc || (doc = content.document);
		var pre = doc.getElementsByTagName('pre')[0];
		if (pre.textContent.length > maxLength) {
			var browser = gBrowser.getBrowserForDocument(doc);
			var notificationBox = gBrowser.getNotificationBox(browser);
			var message = "テキストが長すぎます。強調しますか？（フリーズする危険があります）"
			var buttons = [{
				label: "はい",
				accessKey: "Y",
				callback: function (aNotification, aButton) {
					 self.write(pre);
				}
			}];
			notificationBox.appendNotification(
				message, "JSCSS",
				"chrome://browser/skin/Info.png",
				notificationBox.PRIORITY_INFO_MEDIUM,
				buttons);
			return;
		}
		self.write(pre);
	},
};
JSCSS.init();

})();
