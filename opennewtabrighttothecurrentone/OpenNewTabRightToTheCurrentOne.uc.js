/* Open new tab right to the current one.uc.js  */

eval("gBrowser.addTab ="+gBrowser.addTab.toString().replace(
'if (!blank)',
'this.moveTabTo(t,this.mCurrentTab._tPos+1);'+
'if (!blank)'));

eval("gBrowser.moveTabTo = " + gBrowser.moveTabTo.toString().replace("this.mTabContainer.childNodes[i].selected = false;"));

/* For each tab opened in background, put the flag "unread" (until they are selected),
   in order to use css properties to change font color, etc. */

gBrowser.addEventListener("TabOpen", function(aEvent) { aEvent.originalTarget.setAttribute("unread", ""); }, false);
gBrowser.addEventListener("TabSelect", function(aEvent) { aEvent.originalTarget.removeAttribute("unread"); }, false);
