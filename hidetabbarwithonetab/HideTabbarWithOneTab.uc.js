//	HideTabbarWithOneTab.uc.js
//	v. 0.1

Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).setBoolPref("browser.tabs.drawInTitlebar", false);
var tabbar = document.getElementById("TabsToolbar");	
function showHideTabbar (mutations) {
	tabbar.collapsed = (gBrowser.visibleTabs.length == 1);
};			
showHideTabbar();						
var observer = new MutationObserver(showHideTabbar);		
observer.observe(document.querySelector('#tabbrowser-tabs'), {attributes: true});
