// ==UserScript==
// @name           addBookmarkInLastUsedFolder.uc.js
// @namespace      addBookmarkInLastUsedFolder@ithinc.cn
// @description    Hinzufuegen eines Lesezeichens im zuletzt benutzten Ordner
// @author         ithinc
// @version        1.0.0.1
// @updateURL      https://j.mozest.com/ucscript/script/27.meta.js
// ==/UserScript==

(function addBookmarkInLastUsedFolder() {
  PlacesUtils.__defineGetter__("lastUsedFolderId", function() {
    var annosvc = this.annotations;
    return annosvc.getItemsWithAnnotation(LAST_USED_ANNO)
                  .map(function(aId) [aId, annosvc.getItemAnnotation(aId, LAST_USED_ANNO)])
                  .reduce(function(aFolder, bFolder) aFolder[1] > bFolder[1] ? aFolder : bFolder, [0, 0])[0];
  });

  eval("PlacesCommandHook.bookmarkPage = " + PlacesCommandHook.bookmarkPage.toString()
    .replace("PlacesUtils.unfiledBookmarksFolderId", "PlacesUtils.lastUsedFolderId || $&")
  );

  let cmdAddBookmarkAs = document.getElementById("Browser:AddBookmarkAs");
  cmdAddBookmarkAs.setAttribute("oncommand", cmdAddBookmarkAs.getAttribute("oncommand")
    .replace("PlacesUtils.bookmarksMenuFolderId", "PlacesUtils.lastUsedFolderId || $&")
  );
})();