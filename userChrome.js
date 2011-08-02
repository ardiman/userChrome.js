/* :::::::: WindowHook :::::::: */

//by Zeniko http://forums.mozillazine.org/viewtopic.php?p=2169699#2169699
//allows userChrome.js to target all windows / not only the main window

  var WindowHook = {
    observe: function(aSubject, aTopic, aData) {
      if(!aSubject._WindowHook) {
        aSubject._WindowHook = this;
        aSubject.addEventListener("load", this.onLoad_window, false);
      }
    },

    onLoad_window: function() {
      this.removeEventListener("load", this._WindowHook.onLoad_window, false);
      var funcs = this._WindowHook.mFuncs[this.document.location.href] || null;
      if(funcs) {
        funcs.forEach(function(aFunc) { aFunc(this); }, this);
      }
      delete this._WindowHook;
    },

    register: function(aURL, aFunc) {
      if(!this.mFuncs) {
        this.mFuncs = {};
        Components.classes["@mozilla.org/observer-service;1"]
          .getService(Components.interfaces.nsIObserverService)
          .addObserver(this, "domwindowopened", false);
      }
      if(!this.mFuncs[aURL]) {
        this.mFuncs[aURL] = [];
      }
      this.mFuncs[aURL].push(aFunc);
    }
  };

userChrome.import("*", "UChrm");
