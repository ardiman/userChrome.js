// ==UserScript==
// @name           livebookmarkMenu.uc.js
// @namespace      livebookmarkMenu.uc.js
// @description    
// @include        main
// @compatibility  Firefox 4.*
// @author         ume8866@gmail.com
// @version        2011/03/26
// @version        2011/04/01
// ==/UserScript==

// userChrome.css For the visited item color
//      menuitem.VisitedFeedItem{
//        opacity:0.5;
//      }

var livebookmarkMenu = {

  init: function() {
    if (typeof PlacesViewBase != "undefined")
    {
//      alert("start");
      let LBMCommand = PlacesViewBase.prototype._mayAddCommandsItems;
      PlacesViewBase.prototype._mayAddCommandsItems = function (aPopup)
      {
        if (aPopup == this._rootElt) return;

        let itemId = aPopup._placesNode.itemId;
        if (itemId != -1 && PlacesUtils.itemIsLivemark(itemId))
        {
          livebookmarkMenu.LBM_Pop(aPopup);
          return;
        }
        LBMCommad.apply(this, arguments);
      }
    }
  },

  LBM_Pop: function(aPopup) {
  var theFolder = aPopup.parentNode;
  if (!theFolder.getAttribute("livemark")) return;
  livebookmarkMenu.LBM_Items(aPopup);
  },

  LBM_Items: function(aPopup) {
    var child = aPopup.firstChild;
    while (child)
    {
      let menuitem = child;
      let place = menuitem._placesNode ? menuitem._placesNode : menuitem.node;

      if (place)
      {
        //History
        if (place.accessCount > 0 && menuitem.className.indexOf("VisitedFeedItem") < 0) {
          menuitem.className += " VisitedFeedItem";
        }
        
        //favicon
        let url = PlacesUtils._uri(place.uri);
        if (url.scheme == "http" && !place.icon) {
          menuitem.setAttribute( "image", "http://s2.googleusercontent.com/s2/favicons?domain_url=http://" + url.host );
//          menuitem.setAttribute( "image", "http://localhost:8080/f/cache/" + url.host + "/favicon.ico");
//          menuitem.setAttribute( "image", "http://" + url.host + "/favicon.ico");
//          menuitem.setAttribute( "label", "http://" + url.host + "/favicon.ico");//テスト用
        }
      }else{
        aPopup.removeChild(child);
      }
      child = child.nextSibling;
    }
  }
}

livebookmarkMenu.init();
