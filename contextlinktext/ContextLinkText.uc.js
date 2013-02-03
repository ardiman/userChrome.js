// ==UserScript==
// @name           Context_LinkText.uc.js
// @namespace      fromst@gmail.com
// @description    ?????????"????????:????????"
// @version        0.0.0.1
// ==/UserScript==
if (location == "chrome://browser/content/browser.xul"){
        var linkTxt = {
                copy: function(aString) {
                        var clipb = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
                        clipb.copyString(aString);
                },

                copyText: function() {
                        this.copy(gContextMenu.linkText());
                },

                openText: function() {
                        gBrowser.loadOneTab(gContextMenu.linkText(), null, null, null, false, false);
                },
               
                searchText: function() {
                        BrowserSearch.loadSearch(gContextMenu.linkText(), true);
                },

                init: function()
                {
                        this.initialized = true;
                        
                        this.mItem = document.createElement("menu");
                        this.mItem.setAttribute("id", "context-LinkTextText");
                        this.mItem.setAttribute("label", "Linktext");
                        
                        var myPopUp = this.mItem.appendChild(document.createElement("menupopup"));
                        myPopUp.setAttribute("id", "LinkTextPopUp");
                        
                        // copy link text
                        var mItemCopy = document.createElement("menuitem");
                        mItemCopy.setAttribute("id", "context-copyLinkTextText");
                        mItemCopy.setAttribute("label", "Linktext kopieren");
                        mItemCopy.setAttribute("oncommand", "linkTxt.copyText();");
                        // open link text
                        var mItemOpen = document.createElement("menuitem");
                        mItemOpen.setAttribute("id", "context-openLinkTextText");
                        mItemOpen.setAttribute("label", "Linktext öffnen");
                        mItemOpen.setAttribute("oncommand", "linkTxt.openText();");
                        // search link text
                        var mItemSearch = document.createElement("menuitem");
                        mItemSearch.setAttribute("id", "context-searchLinkTextText");
                        mItemSearch.setAttribute("label", "Linktext suchen");
                        mItemSearch.setAttribute("oncommand", "linkTxt.searchText();");
                        
                        myPopUp.appendChild(mItemCopy);
                        myPopUp.appendChild(mItemOpen);
                        myPopUp.appendChild(mItemSearch);
                        
                        var contextMenu = document.getElementById("contentAreaContextMenu");
                        contextMenu.insertBefore(this.mItem, document.getElementById("context-copylink"));
                        contextMenu.addEventListener("popupshowing", function() { linkTxt.onPopupShowing(this); }, false);
                },

                onPopupShowing: function(aPopup)
                {
                        var isHidden = !gContextMenu.onLink || gContextMenu.onImage;
                        this.mItem.hidden = isHidden;
                }
        }

        window.setTimeout(function() {
                linkTxt.init();
        });
}