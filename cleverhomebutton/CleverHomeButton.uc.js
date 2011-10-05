// ==UserScript==
// @name CleverHomeButton.uc.js
// @include main
// ==/UserScript==
function ucjs_BrowserGoHome2(){
  var homePages = gHomeButton.getHomePage().split("|");
  var foundTab = null;
  homePages.filter(function(url){
    var browsers = gBrowser.browsers;
    for(var i = 0, browser; browser = browsers[i]; i++){
      if(browser.currentURI.spec == url){
        if(!foundTab || gBrowser.tabContainer.selectedIndex == i) foundTab = gBrowser.tabs[i];
        return false;
      }
    }
    return true;
  }).forEach(function(url){
    var newTab;
    if(isTabEmpty(gBrowser.selectedTab)){
      gBrowser.loadURI(url);
      newTab = gBrowser.selectedTab;
    }else{
      newTab = gBrowser.addTab(url, { skipAnimation:true });
    }
    if(!foundTab) foundTab = newTab;
  });
  if(foundTab) gBrowser.selectedTab = foundTab;
}
document.getElementById("home-button").setAttribute("onclick", "ucjs_BrowserGoHome2()"); 