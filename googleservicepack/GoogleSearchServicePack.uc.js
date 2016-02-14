// ==UserScript==
// @name				GoogleSearch ServicePackL
// @namespace			
// @include				chrome://browser/content/browser.xul
// @author				Luvis
// @compatibility		PaleMoon 26.0.3
// @version				2016.02.13
// @note				2016.02.13 仕様変更に対応 細部修正
// @note				2015.11.06 YouTube,Dailymotion,価格comのサムネイル追加・修正 細部修正
// @note				2015.10.11 switch文に修正
// @note				2013.11.18 / 2014.08.27 / 2014.08.29 / 2015.09.30 細部修正
// @note				2013.10.24 サムネイルでyaplog,YahooBlogを追加
// @note				2013.10.12 jcomのページでサムネイルが表示されないのを修正
// @note				2013.09.11 日本語ドメイン対応 検索オプションの追加と廃止 細部修正
// @note				2013.05.31 仕様変更に対応 オプションの追加と廃止 サムネイル取得先を変更
// ==/UserScript==
// original author : hinano
// based version : 0.0.9 2011/10/06 17:20  仕様の変更に対応。プレビューと地図の非表示機能を追加。
// original url : http://hinano.jottit.com/
// this script based on
// Google+SBM ( http://wildlifesanctuary.blog38.fc2.com/blog-entry-141.html
//              http://d.hatena.ne.jp/kusigahama/20051207#p1
//              http://la.ma.la/blog/diary_200607281316.htm ) and
// Google Search Site-block ( http://note.openvista.jp/2007/filtering-google-result/ ) and
// Google Button Search Now ( http://a-h.parfe.jp/einfach/archives/2006/0106171150.html ) and
// Favicon with Google 2 ( http://d.hatena.ne.jp/mrkn/20061021/1161417780
//                         http://june29.jp/2006/10/18/favicon-greasemonkey/ ) and
// Googleの検索結果にサムネイルを追加していくユーザースクリプト Part2 ( http://oflow.me/archives/1066 )
// UPDATE INFO (Only Japanese) http://hinano.jottit.com/googlesearchservicepack
//

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
	var weaken_mode = false;
	// --- config end ---
	
	var DEBUG = false;
	
	function addServices() {
		if (SBMCounter) services.push(new sbmc());
		if (AddFavicon) services.push(new favicon());
		if (SiteBlock) services.push(new block());
		if (AddThumbnail) services.push(new thumb());
	};
		
	var idnService = Cc["@mozilla.org/network/idn-service;1"].getService(Ci.nsIIDNService);

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
//		var tmpl = '<img class="favicon" width="16" Height="16" src="https://plus.google.com/_/favicon?domain=%s" />';
//		var tmpl = '<img class="favicon" width="16" Height="16" src="https://icons.duckduckgo.com/ip2/%s.ico" />';
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			var doc = linkList[0].ownerDocument;
			var range = doc.createRange();
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				if (link.parentNode.nodeName == 'SPAN') continue;
				var tag = tmpl.replace(/%s/g, idnService.convertUTF8toACE(link.hostname));
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
		var tmpl = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="90" src="http://capture.heartrails.com/small?%u" /></a></div>';
		var tmpla = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="120" src="http://images.amazon.com/images/P/%t.09._AA120_.jpg" /></a></div>';
		var tmplk = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="90" src="http://img1.kakaku.k-img.com/images/productimage/l/%id.jpg" /></a></div>';
		var tmply = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="90" src="http://i.ytimg.com/vi/%id/default.jpg" /></a></div>';
		var tmpln = '<div class="thumbnail"><a href="%s"><img class="thumbnailimg" align="left" width="120" height="90" src="http://tn-skr%num.smilevideo.jp/smile?i=%id" /></a></div>';
		this.init = function(doc) { return; };
		this.load = function(linkList) {
			var doc = linkList[0].ownerDocument;
			var range = doc.createRange();
			for (var i = 0, l = linkList.length; i < l; i++) {
				var link = linkList[i];
				if (link.parentNode.nodeName != 'H3') continue;
				switch (true) {
				case /^http:\/\/www\.amazon\.co\.jp(?:.+)?\/dp\/([0-9A-Z]{10})/.test(link.href) :
					var asin = RegExp.$1;
					var tag = tmpla.replace(/%s/g, link.href).replace(/%t/g, asin);
					break;
				case /^http:\/\/kakaku\.com\/item\/(\w{11})\//.test(link.href) :
					var id = RegExp.$1;
					var tag = tmplk.replace(/%s/g, link.href).replace(/%id/g, id);
					break;
				case /^https?:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/.test(link.href) :
					var id = RegExp.$1;
					var tag = tmply.replace(/%s/g, link.href).replace(/%id/g, id);
					break;
				case /(?:(?:nicovideo\.jp|nicofinder\.net|nicogame\.info|nicomoba\.jp|nicotter\.net|nicotwitter\.com|nico\.tgd\.jp|nicozon\.net|nicosoku\.com|findvid\.net)\/watch\/|nico\.ms\/|nicoviewer\.net\/|nicoco\.net|nico\.oh-web\.jp\/|miterew\.com\/movie\/play\/|nico3\.org\/|nicoapple\.sub\.jp\/|nicogachan\.net\/watch\.php\?v=|t98\.exp\.jp\/s\/|nico\.ayakaze\.com\/player\/sm\/|www\.nico-kara\.info\/niconicos\/detail\/|niconicoplay\.com\/(?:smart\/)?detail\/)(?:sm|nm|so)([0-9]+)/.test(link.href) :
					var id = RegExp.$1;
					var num = parseInt(id)%4 + 1;
					var tag = tmpln.replace(/%num/g, num).replace(/%id/g, id).replace(/%s/g, link.href);
					break;
				case /(ameblo\.jp\/[\w-]+\/|blog\.ap\.teacup\.com\/[\w-]+|blog\.goo\.ne\.jp\/\w+\/?|blog\.livedoor\.jp\/\w+\/|blogs\.yahoo\.co\.jp\/[^/]+|d\.hatena\.ne\.jp\/\w+\/|homepage\d\.nifty\.com\/[^/]+\/|(?:space|www)\.geocities\.(?:co\.)?jp\/[^/]+(?:\/\d+\/)?|members\d?\.jcom\.home\.ne\.jp\/[\w\.-]+\/|\w+\.biglobe\.ne\.jp\/[\w~]+\/|yaplog\.jp\/[\w-]+\/)/.test(link.href) :
					var domain1 = link.protocol + "//" + RegExp.$1;
					var tag = tmpl.replace(/%s/g, link.href).replace(/%u/g, domain1);
					break;
				case /^https?:\/\/[^.]+\.(2ch\.sc|getuploader\.com|syosetu\.com)\//.test(link.href) :
					var domain2 = link.protocol + "//" + RegExp.$1;
					var tag = tmpl.replace(/%s/g, link.href).replace(/%u/g, domain2);
					break;
				case /^https?:\/\/[^.]+\.(atwiki\.jp|deviantart\.com)\//.test(link.href) :
					var domain3 = link.protocol + "//www." + RegExp.$1;
					var tag = tmpl.replace(/%s/g, link.href).replace(/%u/g, domain3);
					break;
				case /^https?:\/\/[^.]+\.2ch\.net\//.test(link.href) :
					var domain4 = "http://2ch.sc" ;
					var tag = tmpl.replace(/%s/g, link.href).replace(/%u/g, domain4);
					break;
				default :
					var tag = tmpl.replace(/%s/g, link.href).replace(/%u/g, link.protocol + "//" + idnService.convertUTF8toACE(link.hostname));
					break;
				};
				var content = link.parentNode.nextSibling;
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
		if (AddThumbnail) styles.push('.s { padding-left:0px; } .st { width:125px !important; } ');
		if (AddThumbnail) styles.push('#rtr .s { padding-left:0; } td > .s { padding-left:0; } .tl { display:inline; }');
	// --- Video Thumbs ---
		// YouTube
		if (AddThumbnail) styles.push('._ygd > ._WCg {top:0px !important; width:120px !important; height:90px !important; }');
		// Dailymotion
		if (AddThumbnail) styles.push('._YQd > a >img {width:120px !important; height:90px !important; }'); 
		// Time
		if (AddThumbnail) styles.push('._YQd { background-color:transparent !important; width:120px !important; height:90px !important; margin-top:8px!important; margin-left: -130px !important; }'); 
		
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
		var result = element.ownerDocument.evaluate('.//h3[@class="r"]/a', element, null, 7, null);
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
		if (!doc.location.href.match(/^https?:\/\/www\.google\..+\/search/)) return;
		if (doc.location.href.match(/tbm=isch/)) return;
		if (!services.length) addServices();
		addStyle(doc);
		initServices(doc);
		var element = doc.evaluate('id("ires")/div[@id="rso"]', doc.body, null, 9, null).singleNodeValue;
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