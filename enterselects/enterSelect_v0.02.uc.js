// Enter Select //

(function() {
      // Remember what auto-select if enter was hit after starting a search
      gURLBar.autoSelectOn = null;
      // Keep track of last shown result's search string
      gURLBar.lastSearch = null;

      // Add some helper functions to various objects
      let popup = gURLBar.popup;
      gURLBar.__defineGetter__("trimmedSearch", function() {
        return this.value.replace(/^\s+|\s+$/g, "");
      });
      gURLBar.__defineGetter__("willHandle", function() {
        // Potentially it's a url if there's no spaces
        let search = this.trimmedSearch;
        if (search.match(/ /) == null) {
          try {
            // Quit early if the input is already a URI
            return Cc["@mozilla.org/network/io-service;1"].
              getService(Ci.nsIIOService).newURI(gURLBar.value, null, null);
          }
          catch(ex) {}
    
          try {
            // Quit early if the input is domain-like (e.g., site.com/page)
            return Cc["@mozilla.org/network/effective-tld-service;1"].
              getService(Ci.nsIEffectiveTLDService).
              getBaseDomainFromHost(gURLBar.value);
          }
          catch(ex) {}
        }

        // Check if there's an search engine registered for the first keyword
        let keyword = search.split(/\s+/)[0];
        return Cc["@mozilla.org/browser/search-service;1"].
          getService(Ci.nsIBrowserSearchService).getEngineByAlias(keyword);
      });

      // Wait for results to get added to the popup
      var appendCode  = function() {
        try{
          // Don't bother if something is already selected
          if (this.selectedIndex >= 0)
            return;

          // Make sure there's results
          if (this._matchCount == 0)
            return;

          // Don't auto-select if we have a url
          if (gURLBar.willHandle)
            return;

          // We passed all the checks, so pretend the user has the first result
          // selected, so this causes the UI to show the selection style
          this.selectedIndex = 0;

          // If the just-added result is wha_matchCount == 0t to auto-select, make it happen
          if (gURLBar.autoSelectOn == gURLBar.trimmedSearch) {
            gURLBar.controller.handleEnter(true);

            // Clear out what to auto-select now that we've done it once
            gURLBar.autoSelectOn = null;
          }

          // Remember this to notice if the search changes
          gURLBar.lastSearch = gURLBar.trimmedSearch;
        }catch(e){}
      };
      appendCode = appendCode.toString().replace(/^function.*|}$/g, "");
      try{
        eval("popup._appendCurrentResult = " + popup._appendCurrentResult.toString().replace(/return/, '{'+appendCode+'$&}').replace(/}$/, appendCode+"$&"));
      }catch(e){}

      gURLBar.addEventListener("keydown", function(aEvent) {
        switch (aEvent.keyCode) {
          // For movement keys, unselect the first item to allow editing
          case KeyEvent.DOM_VK_LEFT:
          case KeyEvent.DOM_VK_RIGHT:
          case KeyEvent.DOM_VK_HOME:
            popup.selectedIndex = -1;
            return;

          // We're interested in handling enter (return), do so below
          case KeyEvent.DOM_VK_RETURN:
            break;

          // For anything else, just ignore
          default:
            return;
        }

        // Ignore special key combinations
        if (aEvent.shiftKey || aEvent.ctrlKey || aEvent.metaKey)
          return;

        // Deselect if the selected result isn't for the current search
        if (popup._matchCount != 0 && gURLBar.lastSearch != gURLBar.trimmedSearch) {
          popup.selectedIndex = -1;

          // If it's not a url, we'll want to auto-select the first result
          if (!gURLBar.willHandle) {
            gURLBar.autoSelectOn = gURLBar.trimmedSearch;

            // Don't load what's typed in the location bar because it's a search
            aEvent.preventDefault();
          }

          return;
        }

        // Pretend the user pressed right in the location bar which will cause
        // the selected index to be filled in. If the user has already pressed
        // down to some other selection, it'll just show the same value.
        gURLBar.controller.handleKeyNavigation(KeyEvent.DOM_VK_RIGHT);
      }, false);
})();    
