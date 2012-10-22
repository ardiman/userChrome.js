// ==UserScript==
// @name         Open Add-on Folder
// @description  Add "Add-on Folder" to Add-on Manager
// @author       GOLF-AT
// @version      1.0.20100717
// ==/UserScript==

var OpenAddonFolder = {

    ContentLoaded : function() {
      try {
          var popup = gBrowser.contentWindow.document.getElementById(
              "addonitem-popup");
          if (popup && !popup.hasAttribute('OpenAddonFolder')) {
              popup.setAttribute('OpenAddonFolder', 'true');
              var menuitem = document.createElement("menuitem");
              //menuitem.setAttribute("id", "open_addon_folder");
              menuitem.setAttribute("label", "Addon-Ordner öffnen");
              menuitem.setAttribute("oncommand", "Services.wm.get"+
                  "MostRecentWindow('navigator:browser').document"+
                  ".defaultView.OpenAddonFolder.OpenFolder()");
              popup.appendChild(menuitem);
          }
      }catch(e) {}
    },
    
    OpenFolder : function() {
        var dir = Components.classes['@mozilla.org/file/directory_service;1'
            ].getService(Components.interfaces.nsIProperties).get('ProfD',
            Components.interfaces.nsILocalFile);
        var Addons = gBrowser.contentWindow.document.getElementById(
            'addon-list').childNodes;
        for(var i=0; i<Addons.length; i++) {
            if (Addons[i].getAttribute('current') == 'true') {
                dir.append('extensions');
                dir.append(Addons[i].getAttribute('value'));
                if (dir.exists()) dir.reveal();
                return;
            }
        }
    },

};

document.addEventListener("DOMContentLoaded", OpenAddonFolder.ContentLoaded, false);
