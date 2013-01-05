// ==UserScript==
// @name         Open Add-on Folder
// @description  Add "Add-on Folder" to Add-on Manager
// @author       GOLF-AT
// @version      1.2.20121015
// ==/UserScript==

var OpenAddonFolder = {

    ContentLoaded : function(e) {
      try {
          popup = e.target.getElementById("addonitem-popup");
          if (popup && !popup.hasAttribute('OpenAddonFolder')) {
              popup.addEventListener("popupshowing", OpenAddonFolder
                  .onPopupShowing, true);
              popup.setAttribute('OpenAddonFolder', 'true');
              menuitem = document.createElement("menuitem");
              menuitem.setAttribute("id", "open_addon_folder");
              menuitem.setAttribute("label", "Addon-Ordner öffnen");
              menuitem.setAttribute("oncommand", "Services.wm.get"+
                  "MostRecentWindow('navigator:browser').document"+
                  ".defaultView.OpenAddonFolder.OpenFolder()");
              popup.insertBefore(menuitem, e.target.getElementById(
                  "menuitem_about"));
          }
      }catch(ex) {}
    },
    
    OpenFolder : function() {
        Addons = gBrowser.contentWindow.document.getElementById(
            'addon-list').childNodes;

        const cc = Components.classes;
        dir = cc['@mozilla.org/file/directory_service;1'].
            getService(Components.interfaces.nsIProperties).get(
            'ProfD',Components.interfaces.nsILocalFile);
        for(var i=0; i<Addons.length; i++) {
            if (Addons[i].getAttribute('current') != 'true')
                continue;
            dir.append('extensions');
            dir.append(Addons[i].getAttribute('value'));
            if (!dir.exists()) dir.initWithPath(dir.path+'.xpi');
            if (dir.exists()) dir.reveal();
            return;
        }
    },

    onPopupShowing : function(e) {
        var selItemId = gBrowser.contentDocument.getElementById(
            "categories").getAttribute('last-selected');
        var menuitem = gBrowser.contentDocument.getElementById(
            "open_addon_folder");
        if (menuitem)
            menuitem.hidden = selItemId=='category-userscript' ||
                selItemId=='category-plugin';
    },
};

if (document.getElementById('main-window'))
    document.addEventListener("DOMContentLoaded", OpenAddonFolder.
        ContentLoaded, false);
