
/* Google Search Service Pack */

// Google Search Site-block 
// Google Button Search Now 
// Favicon with Google 2 

(function() {
	// --- config start ---
	// リンクの横に各ソーシャルブックマーク登録数を表示
	var SBMCounter = true;
	
	// リンクの横にfaviconを表示
	var AddFavicon = true;
	
	// 指定したURLを検索結果から隠す
	var SiteBlock = true;
	
	// 検索結果にサムネイルを表示
	var AddThumbnail = true;
	
	// サムネイルの表示位置　trueでリンクの前に表示　falseでリンクの下に表示
	var ThumbnailTop =false;
	
	// 表示するソーシャルブックマークを登録
	var sbms = [
		{
			label: 'hatena',
			entry: 'http://b.hatena.ne.jp/entry/',
			image: 'http://b.hatena.ne.jp/entry/image/',
			imageHeight: '13px'
		},
	/*
		{
			label: 'livedoor',
			entry: 'http://clip.livedoor.com/page/',
			image: 'http://image.clip.livedoor.com/counter/',
			imageHeight: '12px'
		},
	
		{
			label: 'Yahoo',
			entry: 'http://bookmarks.yahoo.co.jp/url/',
			image: 'http://num.bookmarks.yahoo.co.jp/image/shortsmall/',
			imageHeight: '13px'
		}
	*/
	];
	
	// 各文字列が含まれるリンクをブロックします
	var filter_str = [ 
		'yokaranu.site.com',
		'jamana.site.com'
	];
	
	// ブロックした時にtrueで薄く表示　falseで完全に消します
	var weaken_mode = true;
	// --- config end ---
	
	var DEBUG = false;
	
	function addServices() {
		if (SBMCounter) services.push(new sbmc());
		if (AddFavicon) services.push(new favicon());
		if (SiteBlock) services.push(new block());
		if (AddThumbnail) services.push(new thumb());
	};
		
	// ===== SBMCounter Start =====
	function sbmc() {
		var tmpl = '<span class="sbm"><a href="%entry%%url%" title="%label%"><img class="sbmimg" src="%image%%url%" style="max-height:%height%;" /></a></span>';
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			var doc = linkList[0].ownerDocument;
			var range = doc.createRange();
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				if (link.parentNode.nodeName == 'SPAN') continue;
				var tag = '';
				for (var j = 0; j < sbms.length; j++)
					tag += tmpl.replace(/%entry%/, sbms[j].entry).replace(/%label%/, sbms[j].label).replace(/%image%/, sbms[j].image).replace(/%height%/, sbms[j].imageHeight);
				tag = tag.replace(/%url%/g, link.href);
				link.parentNode.insertBefore(range.createContextualFragment(tag), link.nextSibling);
			};
			range.detach();
		};
	};
	// ===== SBMCounter End =====
	
	// ===== AddFavicon Start =====
	function favicon() {
		var tmpl = '<img class="favicon" width="16" Height="16" src="http://www.google.com/s2/favicons?domain=%s" />';
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			var doc = linkList[0].ownerDocument;
			var range = doc.createRange();
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				if (link.parentNode.nodeName == 'SPAN') continue;
				var tag = tmpl.replace(/%s/g, link.hostname);
				link.parentNode.insertBefore(range.createContextualFragment(tag), link);
			};
			range.detach();
		};
	};
	// ===== AddFavicon End =====
	
	// ===== SiteBlock Start =====
	function block() {
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				for (var j = 0; j < filter_str.length; j++) {
					if (link.href.indexOf(filter_str[j]) != -1) {
						link.parentNode.parentNode.parentNode.className += (weaken_mode) ? ' weaken' : ' block';
						break;
					};	
				};
			};
		};
	};
	// ===== SiteBlock End =====

	// ===== AddThumbnail Start =====
	function thumb() {
		var tmpl = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="90" src="http://open.thumbshots.org/image.pxf?url=%s" /></a></div>';
		var tmpla = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="120" src="http://images-jp.amazon.com/images/P/%t.09._AA120_.jpg" /></a></div>';
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			var doc = linkList[0].ownerDocument;
			var range = doc.createRange();
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				if (link.parentNode.nodeName != 'H3') continue;
				if (link.hostname == 'www.amazon.co.jp') {
					var asin = link.href.match(/\/dp\/([0-9A-Z]{10})/);
					var tag = (asin) ? tmpla.replace(/%t/g, asin[1]) : tmpl;
					tag = tag.replace(/%s/g, link.href);
				} else {
					var tag = tmpl.replace(/%s/g, link.href);
				};
				if (ThumbnailTop) {
					var content = link.parentNode;
				} else {
					var content = null;
				};
				link.parentNode.parentNode.insertBefore(range.createContextualFragment(tag), content);
			};
			range.detach();
		};
	};
	// ===== AddThumbnail End =====
	
	var services = [];
	
	function addStyle(doc) {
		var style = doc.createElement('style');
		style.type = 'text/css';
		var styles = [
			'.sbmimg { border:none; margin:0 2px; vertical-align:middle; }',
			'.favicon { margin-right:4px; vertical-align:middle; }',
			'.weaken .s, .weaken .thumbnail, .block { display:none !important; } .weaken a { color:#ccc; }',
			'.g, hr { clear:left; }',
			'.thumbnailimg { border:1px solid #BBB; margin:8px 8px 8px 0px; }'
		];
		if (AddThumbnail) styles.push('.s { padding-left:128px; } #rtr .s { padding-left:0; } td > .s { padding-left:0; } .tl { display:inline; }');
		if (AddThumbnail && ThumbnailTop) styles.push('.weaken h3 { padding-left:128px; }');
		style.appendChild(doc.createTextNode(styles.join(' ')));
		doc.getElementsByTagName('head')[0].appendChild(style);
		style = null;
	};
	
	function log(str) {
		if(DEBUG && Firebug)Firebug.Console.log(str);
	};
		
	function initServices(doc) {
		for (var i = 0; i < services.length; i++) {
			services[i].init(doc);
		};
	};
		
	function request(element) {
		var result = element.ownerDocument.evaluate('.//a[@class="l"]', element, null, 7, null);
		var linkList = [];
		for (var i = 0, l = result.snapshotLength; i < l; i++) {
			linkList[i] = result.snapshotItem(i);
		};
		log(linkList);
		if (linkList.length < 1) return;
		for (var i = 0; i < services.length; i++) {
			services[i].load(linkList);
		};
	};
	
	function onPageLoad(aEvent) {
		var doc = aEvent.originalTarget;
		var win = doc.defaultView;
		if (!win) return;
		if (doc.nodeName != "#document") return;
		if (win.frameElement) return;
		if (!doc.location.href.match(/^http:\/\/www\.google\..*\/search\?/)) return;
		if (!services.length) addServices();
		addStyle(doc);
		initServices(doc);
		var element = doc.evaluate('id("ires")/ol', doc.body, null, 9, null).singleNodeValue;
		if (element) {
			var clone = element.cloneNode(true);
			request(clone);
			element.parentNode.replaceChild(clone, element);
			doc.addEventListener('AutoPagerize_DOMNodeInserted', function (evt) {
				request(evt.target);
			}, false);
		};
	};
	
	var appcontent = document.getElementById('appcontent');
	if (appcontent) {
		appcontent.addEventListener('DOMContentLoaded', onPageLoad, false);
	};
})();