    // ==UserScript==
    // @name        always show reloadimage context in images
    // @namespace   asrcii@zbinlin[AT]gmail
    // @description ???????“??????”
    // @author      zbinlin
    // @version     0.0.0.0.0.0.0
    // ==/UserScript==

    if (location == "chrome://browser/content/browser.xul") {
        try {
            var cacm = document.getElementById("contentAreaContextMenu");
            var crl = document.getElementById("context-reloadimage");
            function reloadImage(e) {
                var elm = gContextMenu.target || document.popupNode
                            || e.target.parentNode.triggerNode;
                if (!elm) return;
                var token = '\?^token_';
                var tokenID = Math.round(Math.random() * 100000000) + '^';
                var src = elm.src;
                var pattern = /(.*)\?\^token_\d{1,9}\^$/;
                if (pattern.test(src)) {
                    if (e.ctrlKey) {
                        elm.src = pattern.exec(src)[1];
                        return;
                    }
                    src = pattern.exec(src)[1] + token + tokenID;
                } else {
                    src += (token + tokenID);
                }
                elm.src = src;
            };
            cacm.addEventListener("popupshowing", function (event) {
                //this.removeEventListener("popupshowing", arguments.callee, false);
                if (!gContextMenu.onImage && !gContextMenu.target.src) return;
                crl.setAttribute("hidden", "false");
                crl.setAttribute('oncommand', "reloadImage(event);");
                return;
            }, false);
        } catch (err) {
            Components.utils.reportError(err.message);
        }
    }