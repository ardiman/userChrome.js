//	TabCloseMiddleclickOnPage.us.js
//	v. 0.1

function closeThisTab (event) {

   if (event.button == 1 && !Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch).getBoolPref("general.autoScroll")) {
      var link = findLink (event.target);
      if (link == null)
         gBrowser.removeCurrentTab({animate: true});
   };

   function findLink (element) {
      switch (element.tagName) {
         case 'A':
            return element;
         case 'B': case 'I': case 'SPAN': case 'SMALL':
         case 'STRONG': case 'EM': case 'BIG': case 'SUB':
         case 'SUP': case 'IMG': case 'S':
            var parent = element.parentNode;
            return parent && findLink (parent);
         default:
            return null;
      };
   };

};

gBrowser.addEventListener ("click", closeThisTab);