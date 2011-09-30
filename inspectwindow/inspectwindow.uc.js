/*------------------------------------------------------------------
    Inspect Window
    by LouCypher (aka Zoolcar9)

    Adds sub-menu in Tools menu to inspect an opened chrome window
  ------------------------------------------------------------------*/
    (function() {
    	/*
      if(typeof inspectDOMDocument != "function") {
        var errMsg = "inspectChrome: DOM Inspector is not installed" +
                     "or is disabled";
        throw new Error(errMsg);
        return;
      }*/

      var inspectMenu = document.createElement("menu");
      inspectMenu.setAttribute("label", "Inspect a Window");
      var windowList = inspectMenu.appendChild(document.createElement("menupopup"));
      windowList.id = "inspect-window-list";
      windowList.setAttribute("onpopupshowing", "inspectWindow.showList(this);");
      windowList.setAttribute("oncommand", "inspectWindow.inspect(event);");
// ab Firefox 7:
      var inspectItem = document.getElementById("webDeveloperMenu");
// geht noch im Firefox 6.0:
//    var inspectItem = document.getElementById("menu_inspector");
      inspectItem.parentNode.insertBefore(inspectMenu, inspectItem.nextSibling);

    })();

    var inspectWindow = {
      showList: function(aNode) {
        while(aNode.lastChild) aNode.removeChild(aNode.lastChild);
        var index = 1;
        var enumerator = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                           .getService(Components.interfaces.nsIWindowWatcher)
                           .getWindowEnumerator();
        while(enumerator.hasMoreElements()) {
          var win = enumerator.getNext();
          var mi = aNode.appendChild(document.createElement("menuitem"));
          mi.setAttribute("label", index + " " + win.document.title);
          mi.setAttribute("accesskey", index);
          mi.tooltipText = win.location;
          mi.value = index++;
        }
      },

      inspect: function(aEvent) {
        var windowIndex = parseInt(aEvent.target.value);
        var enumerator = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                           .getService(Components.interfaces.nsIWindowWatcher)
                           .getWindowEnumerator();
        var index = 1;
        while(enumerator.hasMoreElements()) {
          var win = enumerator.getNext();
          if(index++ == windowIndex) {
            inspectDOMDocument(win.document);
            return;
          }
        }
      }
    }
