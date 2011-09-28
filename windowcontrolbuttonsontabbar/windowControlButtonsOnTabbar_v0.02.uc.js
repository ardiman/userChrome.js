// ==UserScript==
// @name           windowControlButtonsOnTabbar.uc.js 
// @namespace      www.slimeden.com
// @description    Move window control buttons to tab bar
// @compatibility  Firefox 3.6.x & 4.*
// @author         Xiao Shan
// @homepage       www.slimeden.com
// @version        0.0.2 - 20110421
// ==UserScript==
(function() {
    buildControlsButtons();
    window.addEventListener("DOMNodeInserted", fixControlsButtons, false); 

    function buildControlsButtons(e) {
        var titleButtons = document.getElementById("window-controls");
        var tabsBar = document.getElementById("TabsToolbar")
        tabsBar.appendChild(titleButtons);
        titleButtons.hidden = false;
        titleButtons.addEventListener("DOMAttrModified", function(e) {
            if(e.attrName == "hidden") {
                this.setAttribute("hidden", false);
            }
        }, false);

        var maxButton = document.getElementById("restore-button");
        maxButton.removeAttribute("oncommand");
        maxButton.removeAttribute("fullscreencontrol");
        maxButton.setAttribute("oncommand", "onTitlebarMaxClick();");
    }

    function fixControlsButtons(e) {
        if(e.target.id == "window-controls") {
            if(e.target.parentNode.id != 'TabsToolbar') {
                var tabsBar = document.getElementById("TabsToolbar")
                tabsBar.appendChild(e.target);
            }
        }
    }
})();
