// ==UserScript==
// @name comebackDownloadMonitor.uc.js
// @namespace http://d.hatena.ne.jp/Griever/
// @include main
// @compatibility Firefox 4 Beta 7
// @version 0.0.1_mod
// @date 2013-04-06 22:00
// @description ステータスバーのダウンロードモニターを復活させる
// @note DL が一瞬で終わるとチラッと出て消えるのはご愛敬
// @note 4.0b7+Win7+Aero はダウンロード状態が表示できるらしいので不要
// ==/UserScript==
(function(){


  let DownloadMonitorPanel = {
    //////////////////////////////////////////////////////////////////////////////
    //// DownloadMonitorPanel Member Variables

    _panel: null,
    _activeStr: null,
    _pausedStr: null,
    _lastTime: Infinity,
    _listening: false,

    get DownloadUtils() {
      delete this.DownloadUtils;
      Cu.import("resource://gre/modules/DownloadUtils.jsm", this);
      return this.DownloadUtils;
    },

    //////////////////////////////////////////////////////////////////////////////
    //// DownloadMonitorPanel Public Methods

    /**
     * Initialize the status panel and member variables
     */
    init: function DMP_init() {
      // Initialize "private" member variables
      this._panel = document.getElementById("download-monitor");

      // Cache the status strings
      this._activeStr = "1 aktiver Download (#2);#1 aktive Downloads (#2)"; //gNavigatorBundle.getString("activeDownloads1");
      this._pausedStr = "1 pausierender Download;#1 pausierende Downloads"; //gNavigatorBundle.getString("pausedDownloads1");

      gDownloadMgr.addListener(this);
      this._listening = true;

      this.updateStatus();
    },

    uninit: function DMP_uninit() {
      if (this._listening)
        gDownloadMgr.removeListener(this);
    },

    inited: function DMP_inited() {
      return this._panel != null;
    },

    /**
     * Update status based on the number of active and paused downloads
     */
    updateStatus: function DMP_updateStatus() {
      if (!this.inited())
        return;

      let numActive = gDownloadMgr.activeDownloadCount;

      // Hide the panel and reset the "last time" if there's no downloads
      if (numActive == 0) {
        this._panel.hidden = true;
        this._lastTime = Infinity;

        return;
      }

      // Find the download with the longest remaining time
      let numPaused = 0;
      let maxTime = -Infinity;
      let dls = gDownloadMgr.activeDownloads;
      while (dls.hasMoreElements()) {
        let dl = dls.getNext();
        if (dl.state == gDownloadMgr.DOWNLOAD_DOWNLOADING) {
          // Figure out if this download takes longer
          if (dl.speed > 0 && dl.size > 0)
            maxTime = Math.max(maxTime, (dl.size - dl.amountTransferred) / dl.speed);
          else
            maxTime = -1;
        }
        else if (dl.state == gDownloadMgr.DOWNLOAD_PAUSED)
          numPaused++;
      }

      // Get the remaining time string and last sec for time estimation
      let timeLeft;
      [timeLeft, this._lastTime] =
        this.DownloadUtils.getTimeLeft(maxTime, this._lastTime);

      // Figure out how many downloads are currently downloading
      let numDls = numActive - numPaused;
      let status = this._activeStr;

      // If all downloads are paused, show the paused message instead
      if (numDls == 0) {
        numDls = numPaused;
        status = this._pausedStr;
      }

      // Get the correct plural form and insert the number of downloads and time
      // left message if necessary
      status = PluralForm.get(numDls, status);
      status = status.replace("#1", numDls);
      status = status.replace("#2", timeLeft);

      // Update the panel and show it
      this._panel.label = status;
      this._panel.hidden = false;
    },

    //////////////////////////////////////////////////////////////////////////////
    //// nsIDownloadProgressListener

    /**
     * Update status for download progress changes
     */
    onProgressChange: function() {
      this.updateStatus();
    },

    /**
     * Update status for download state changes
     */
    onDownloadStateChange: function() {
      this.updateStatus();
    },

    onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus, aDownload) {
    },

    onSecurityChange: function(aWebProgress, aRequest, aState, aDownload) {
    },

    //////////////////////////////////////////////////////////////////////////////
    //// nsISupports

    QueryInterface: XPCOMUtils.generateQI([Ci.nsIDownloadProgressListener]),
  };



  if ($('download-monitor')) return;
   
  let bar = $('status-bar');
  let icon = document.createElement('statusbarpanel');
  icon.setAttribute('id', 'download-monitor');
  icon.setAttribute('class', 'statusbarpanel-iconic-text');
  icon.setAttribute('tooltiptext', 'Download Manager öffnen');
  icon.setAttribute('hidden', 'true');
  icon.setAttribute('command', 'Tools:Downloads');
  icon.setAttribute('oncommand', 'BrowserDownloadsUI();');
  bar.insertBefore(icon, bar.firstChild);
   
  setTimeout(function(){
    if (!('gDownloadMgr' in window))
      gDownloadMgr = Cc["@mozilla.org/download-manager;1"].getService(Ci.nsIDownloadManager);
    DownloadMonitorPanel.init();
     
    // ダウンロード中の表示をシンプルにする
    // default: "#1 件のダウンロードが中断しています"
    DownloadMonitorPanel._pauseStr = U("#1 unterbrochen");
    // default: "#1 件のダウンロードが進行中です (#2)"
    DownloadMonitorPanel._activeStr = U("1 Download (#2);#1 Downloads (#2)");
   
  }, 8000);
  function $(id) document.getElementById(id);
  function U(text) 1 < 'あ'.length ? decodeURIComponent(escape(text)) : text;
 
})();