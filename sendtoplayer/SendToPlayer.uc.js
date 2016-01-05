// ==UserScript==
// @name           SendToPlayer.uc.js (Update für OpenPlayer.uc.js)
// @description    Youtubeなどの動画を外部プレーヤーで開く
// @include        main
// @charset        UTF-8
// @version        0.6 regExpにyoutube以外のサイトを書いた場合に開けなかったのを修正
// @version        0.5 微調整
// @version        0.4 Youtubeにてplaylist内の個別動画を再生できなかったのを修正。menuitemの表示位置を先頭に固定。コマンドライン引数をCUSTOM_ARGSで指定できるように。
// @version        0.3 youtu.be形式の短縮URLリンクに対応
// ==/UserScript==
/*
Youtube以外でもリンクが動画への直リンクであればVLCやMPC-HC(BE)などで開けると思います
その際はregExpへそのサイトのドメインを追加してください
*/
(function() {

	var config = {
		playerPath: 'F:\\Programme\\VideoLAN\\VLC\\vlc.exe',
		playerName: 'Mit VLC Player',
		customArgs: '', // Befehlszeilenargument des Players angeben
		regExp: /youtube\.com|youtu\.be/
	};

	function initOverlay() {
		var cm = document.getElementById('contentAreaContextMenu')
		var mi = cm.insertBefore(document.createElement('menuitem'), cm.firstChild);
		mi.setAttribute('id', 'stplayer');
		mi.setAttribute('label', config.playerName + ' öffnen');
		mi.setAttribute('class', 'menuitem-iconic');
		mi.setAttribute('image', 'moz-icon:file://' + config.playerPath + '?size=16;');
		cm.addEventListener("popupshowing", popupShowing);
	}

	function popupShowing() {
		var mi = document.getElementById("stplayer");
		if (mi) {
			mi.hidden = !config.regExp.test(getLink());
			mi.addEventListener('click', launchPlayer);
		}
	}

	function getLink() {
		var link = gContextMenu.onLink ? gContextMenu.linkURL : gBrowser.currentURI.spec;
		return link;
	}

	function extractId(url) {
		if (config.regExp)
			url = 'https://www.youtube.com/watch?v=' + url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		else
			url = url;
		return url;
	}

	function launchPlayer(event) {
		if (event.button !== 0) {
			return;
		}

		var url = extractId(getLink());

		var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		file.initWithPath(config.playerPath);
		var proc = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
		proc.init(file);
		var args = [url].concat(config.customArgs.split(' '));
		proc.run(false, args, args.length);
	}

	initOverlay();

})();