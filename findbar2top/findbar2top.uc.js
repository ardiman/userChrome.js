XPCOMUtils.defineLazyGetter(window, "gFindBar", function() {
  let XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  let findbar = document.createElementNS(XULNS, "findbar");
  findbar.setAttribute("browserid", "content");
  findbar.id = "FindToolbar";
  //let panel = getBrowser().mPanelContainer;
  //panel.parentNode.insertBefore(findbar, panel);
  gBrowser.parentNode.insertBefore(findbar, gBrowser);

  // Force a style flush to ensure that our binding is attached.
  findbar.clientTop;
  window.gFindBarInitialized = true;
  return findbar;
});
