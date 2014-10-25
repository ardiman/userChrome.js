(function() {

   if (location != 'chrome://browser/content/browser.xul')
      return;

   var searchbar = document.getElementById('searchbar');
   var input = document.getAnonymousNodes(document.getAnonymousNodes(searchbar)[2])[0]
               .childNodes[1].childNodes[1];
   var tab = gBrowser.selectedTab;

   gBrowser.tabContainer.addEventListener('TabSelect', function(event) {
      setTimeout(function() {
         tab = event.target;
         if (tab.SearchTerm)
            searchbar.value = tab.SearchTerm
         else
            searchbar.value = '';
      }, 0);
   });

   input.addEventListener('change', function() {
      tab.SearchTerm = searchbar.value;
   });

})();

