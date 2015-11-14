//   NewTabOverride.uc.js
//   v. 0.2

(function() {
   if (location != 'chrome://browser/content/browser.xul')
      return;
   const url = 'http://example.com/';
   if (Number(gAppInfo.version.substring(0,2)) < 44)
      NewTabURL.override(url)
   else
      aboutNewTabService.newTabURL = url;
})();
