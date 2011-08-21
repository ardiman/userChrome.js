    (function() {
      var lastSelection = "";
      var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
      if(!prefs.getPrefType("userChrome.autocopy.autocopyState")) prefs.setIntPref("userChrome.autocopy.autocopyState", 2);

      function autocopyStart(e) {
        lastSelection = getBrowserSelection();
      }

      function autocopyStop(e) {
        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
        var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
        var selection = getBrowserSelection();

        if(autocopyState>0 && selection && selection!=lastSelection) {
          goDoCommand('cmd_copy');

          if(autocopyState>1) {
            var searchbar = document.getElementById('searchbar');
            searchbar.removeAttribute("empty");
            searchbar.value = selection;

            var evt = document.createEvent("Events");
            evt.initEvent("oninput", true, true);
            searchbar.dispatchEvent(evt);
          }
        }
      }

      gBrowser.mPanelContainer.addEventListener("mousedown", autocopyStart, false);
      gBrowser.mPanelContainer.addEventListener("mouseup", autocopyStop, false);
    })();