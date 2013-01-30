// Copy Feed URL menuitem
// by pile0nades (with awesome help from Zoolcar9)
// Right-click the feed icon and click Copy Feed URL

(function() {
  var menu = document.getElementById("toolbar-context-menu");

  menu.addEventListener("popupshowing", function(event) {
    if(event.target.id == "toolbar-context-menu") {
      // remove old items before adding new ones
      if(document.getElementById("context-copyfeed-number-0-url-separator") != null) {
        menu.removeChild(document.getElementById("context-copyfeed-number-0-url-separator"));
      }
      for(var i=0; document.getElementById("context-copyfeed-number-" + i + "-url") != null; i++) {
        menu.removeChild(document.getElementById("context-copyfeed-number-" + i + "-url"));
      }

      if(document.popupNode.id == "feed-button") {
        // add feed items and separator
        var feeds = gBrowser.selectedBrowser.feeds;
        var mi = [];
        for(var i=0; i<feeds.length; i++) {
          mi[i] = menu.appendChild(document.createElement("menuitem"));
          mi[i].id = "context-copyfeed-number-" + i + "-url";
          mi[i].setAttribute("label", (feeds.length == 1 ? "Copy Feed URL" : "Copy URL of '" + feeds[i].title +"'"));
          mi[i].setAttribute("oncommand", "cfu_copyFeedURL('" + feeds[i].href + "')");
        }
        var ms = menu.insertBefore(document.createElement("menuseparator"), mi[0]);
        ms.id = mi[0].id + "-separator";
      }
    }
  }, false);
})();

function cfu_copyFeedURL(url) {
  var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
    .getService(Components.interfaces.nsIClipboardHelper);
  gClipboardHelper.copyString(url);
}