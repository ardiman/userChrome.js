//      BackToTheFavicon.uc.js

(function() {

   if (location != 'chrome://browser/content/browser.xul')
      return;

   gBrowser.tabContainer.addEventListener('TabAttrModified', function() {
      var icon = document.getElementById('identity-icon');
      var favicon = gBrowser.selectedTab.image;
      if (favicon)
         icon.src = favicon
      else
         icon.removeAttribute('src');
   }, false);

   if (Number(gAppInfo.version.split('.')[0]) >= 51) {
      var css =
         '#urlbar[pageproxystate="valid"] > #identity-box > #identity-icon {opacity: 1} ' +
         '#identity-icon {filter: none}';
      var stylesheet = document.createProcessingInstruction('xml-stylesheet',
         'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
      document.insertBefore(stylesheet, document.documentElement);
   };

})();

