(function() {
var menuID = ["view-menu", "frame"];
var menuCmd = ["View:PageSource", "gContextMenu.viewFrameSource();"];
var itemAttr = ["command", "oncommand"];
var doc = ["content.document", "gContextMenu.target.ownerDocument"];

for(var i = 0; i < doc.length; i++) {
var menuPopup = document.getElementById(menuID[i]).getElementsByTagName('menupopup')[0];
var menuItems = menuPopup.getElementsByTagName("menuitem");
for(var j = 0; j < menuItems.length; j++) {
var menuItem = menuItems[j];
if(menuItem.hasAttribute(itemAttr[i]) && menuItem.getAttribute(itemAttr[i]) == menuCmd[i])
menuItem.setAttribute("onclick", "viewSourceInTab(" + doc[i] + ", event);");
}
}

var contextViewSource = document.getElementById("context-viewsource");
contextViewSource.setAttribute("onclick", "viewSourceInTab(content.document, event)");

})();

function viewSourceInTab(aDocument, aEvent) {
try {
gBrowser.mPrefs.getBoolPref("viewSourceInTab.loadInNewTab");
} catch(ex) {
gBrowser.mPrefs.setBoolPref("viewSourceInTab.loadInNewTab", true);
}

try {
gBrowser.mPrefs.getBoolPref("viewSourceInTab.loadInBackground");
} catch(ex) {
gBrowser.mPrefs.setBoolPref("viewSourceInTab.loadInBackground", false);
}

var sourceURL = "view-source:" + aDocument.location.href;
if(aEvent.button == 1) { //middle click
if(gBrowser.mPrefs.getBoolPref("viewSourceInTab.loadInNewTab")) {
var newTab = gBrowser.addTab(sourceURL);
if(!gBrowser.mPrefs.getBoolPref("viewSourceInTab.loadInBackground"))
gBrowser.selectedTab = newTab; //view source in new tab
} else
loadURI(sourceURL); //view source in current tab
} else if(aEvent.button == 2) { //right click
aEvent.stopPropagation();
openWebPanel(aDocument.title, sourceURL); //view source in sidebar
}
closeMenus(aEvent.target);
} 