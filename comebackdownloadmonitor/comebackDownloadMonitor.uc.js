// ==UserScript==
// @name           comebackDownloadMonitor.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// @compatibility  Firefox 4 Beta 7
// @version        0.0.1
// @description    ステータスバーのダウンロードモニターを復活させる
// @note           DL が一瞬で終わるとチラッと出て消えるのはご愛敬
// @note           4.0b7+Win7+Aero はダウンロード状態が表示できるらしいので不要
// ==/UserScript==

(function(){
	if ($('download-monitor')) return;

	let bar = $('status-bar');
	let icon = document.createElement('statusbarpanel');
	icon.setAttribute('id', 'download-monitor');
	icon.setAttribute('class', 'statusbarpanel-iconic-text');
	icon.setAttribute('tooltiptext', 'Open Download Manager.');
	icon.setAttribute('hidden', 'true');
	icon.setAttribute('command', 'Tools:Downloads');
	icon.setAttribute('oncommand', 'BrowserDownloadsUI();');
	bar.insertBefore(icon, bar.firstChild);

	setTimeout(function(){
		if (!gDownloadMgr)
			gDownloadMgr = Cc["@mozilla.org/download-manager;1"].getService(Ci.nsIDownloadManager);
		DownloadMonitorPanel.init();

		// ダウンロード中の表示をシンプルにする
		// default: "#1 件のダウンロードが中断しています"
		DownloadMonitorPanel._pauseStr = U("中断 #1 件");
		// default: "#1 件のダウンロードが進行中です (#2)"
		DownloadMonitorPanel._activeStr = U("1 aktiver Download (#2);#1 aktive Downloads (#2)");

	}, 8000);
	
	function $(id) document.getElementById(id);
	function U(text) 1 < 'あ'.length ? decodeURIComponent(escape(text)) : text;

})();

