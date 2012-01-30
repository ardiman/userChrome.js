// ==UserScript==
// @name  MemoryMonitorMod.uc.js
// @compatibility  Firefox 9.*
// @description  Bei Ueberschreitung der maximalen Speicherauslastung kann automatischer Neustart durchgefuehrt werden
// @include  main
// @note  Bezug: about:memory
// @note  http://loda.jp/script/?id=584
// @note  Version auf https://github.com/ardiman/userChrome.js um _autoRestart und Fehlerumgehung bei gfx-surface-image ergaenzt
// ==/UserScript==
var ucjs_MemoryMonitor = {
  // ---------------------------------setting data-----------------------------
  // Update-Intervall[ms]
  _interval: 2000,
  // Neustart bei maximaler Speichernutzung (Achtung! Anpassen an die darunter gewaehlte Speichereinheit)
  _maxMemory: 1500,
  // Speicher-Einheit: B, KB, KiB, MB, MiB, GB, GiB
  _prefix: "MB",
  // Speicher-Einheitanzeige in der Statusbar
  _dPrefix: true,
  // automatischen Restart bei Ueberschreitung von _maxMemory durchfuehren
  _autoRestart: false,
  // --------------------------------------------------------------------------
  interval: null,
  init: function () {
    var memoryPanel = document.createElement("statusbarpanel");
    memoryPanel.id = "MemoryDisplay";
    memoryPanel.setAttribute("label", this.setPrefix(this._dPrefix));
    document.getElementById("status-bar").insertBefore(memoryPanel, null);
    this.start();
    this.interval = setInterval(this.start, this._interval);
  },

  addFigure: function (str) {
    var num = new String(str).replace(/,/g, "");
    while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
  },

  restart: function () {
    var appStartup = Components.interfaces.nsIAppStartup;
    Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(appStartup).quit(appStartup.eRestart | appStartup.eAttemptQuit);
  },

  getSize: function (mem, flag) {
    var pre = 1;
    switch (this._prefix) {      
      case 'KB':
        pre = 1000;
        break;
      case 'KiB':
        pre = 1024;
        break;
      case 'MB':
        pre= 1000 * 1000;
        break;
      case 'MiB':
        pre = 1024 * 1024;
        break;
      case 'GB':
        pre = 1000 * 1000 * 1000;
        break;
      case 'GiB':
        pre = 1024 * 1024 * 1024;
        break;
    }
    if (flag) return mem * pre;
    else return ucjs_MemoryMonitor.addFigure(Math.round(mem / pre));
  },

  setPrefix: function (flag) {
    return (flag) ? " " + this._prefix : "";
  },

  start: function () {
    try {
      const Cc = Components.classes;
      const Ci = Components.interfaces;
      var mgr = Cc["@mozilla.org/memory-reporter-manager;1"].getService(Ci.nsIMemoryReporterManager);
      var e = mgr.enumerateReporters();
      var gMemReporters = {};
      while (e.hasMoreElements()) {
        var mr = e.getNext().QueryInterface(Ci.nsIMemoryReporter);
        gMemReporters[mr.path] = mr;
      }
      var workingSet = gMemReporters["resident"].amount;
	  var commitmentSize=(typeof(gMemReporters["private"])!="undefined" ? gMemReporters["private"].amount : 0);
      var gfxImage=(typeof(gMemReporters["gfx-surface-image"])!="undefined" ? gMemReporters["gfx-surface-image"].amount : 0);
      var restartMemory = ucjs_MemoryMonitor.getSize(ucjs_MemoryMonitor._maxMemory, true);
      var memoryPanel = document.getElementById("MemoryDisplay");
      memoryPanel.setAttribute("label", ucjs_MemoryMonitor.getSize(workingSet) + ucjs_MemoryMonitor.setPrefix(ucjs_MemoryMonitor._dPrefix));
      memoryPanel.setAttribute("onclick", "openUILinkIn('about:memory','tab')");
      memoryPanel.setAttribute("tooltiptext", 
        ((workingSet) ? "resident: " + ucjs_MemoryMonitor.getSize(workingSet) + " " + ucjs_MemoryMonitor._prefix + "\n" : "") + 
        ((commitmentSize) ? "private: " + ucjs_MemoryMonitor.getSize(commitmentSize) + " " + ucjs_MemoryMonitor._prefix + "\n" : "") + 
        ((gfxImage) ? "gfx-surface-image: " + ucjs_MemoryMonitor.getSize(gfxImage) + " " + ucjs_MemoryMonitor._prefix : "")
      );
     if (workingSet > restartMemory) {
        if (memoryPanel.style.backgroundColor == "red" && ucjs_MemoryMonitor._autoRestart) ucjs_MemoryMonitor.restart();
        else memoryPanel.style.backgroundColor = "red";
      } else if (workingSet > restartMemory * 0.8) memoryPanel.style.backgroundColor = "#FF99FF";
      else if (workingSet > restartMemory * 0.6) memoryPanel.style.backgroundColor = "#FFFF99";
      else memoryPanel.style.backgroundColor = "transparent";
    } catch (e) {
      clearInterval(ucjs_MemoryMonitor.interval);
      alert("ucjs_MemoryMonitor Err:" + e);
    }
  }
}

ucjs_MemoryMonitor.init();