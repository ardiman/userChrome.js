//@author slimx
(function() {
    //add label to findbar
    var status = document.getAnonymousElementByAttribute(gFindBar, 'anonid', 'match-case-status');
    var sep = document.createElement("toolbarspacer");
    var count = document.createElement("label");
    count.hidden = true;
    status.parentNode.insertBefore(sep, status);
    status.parentNode.insertBefore(count, status);//findbar-container


    gFindBar.__proto__._foundMatches = count;
    
    gFindBar.__proto__._updateMatchesCount = function(aRes) {
        if (!this._updateMatchCountTimeout)
            window.clearTimeout(this._updateMatchCountTimeout);
        this._updateMatchCountTimeout =
                window.setTimeout(function(aRes, aSelf) {
                    aSelf._updateMatchesCountWorker(aRes);
                }, 0, aRes, this);
    }

    gFindBar.__proto__._updateMatchesCountWorker = function(aRes) {
        var word = this._findField.value;
        if (aRes == this.nsITypeAheadFind.FIND_NOTFOUND || !word) {
            this._foundMatches.hidden = true;
            this._foundMatches.value = "";
        }
        else {
            var matchesCount = this._countMatches(word).toString();
            if (matchesCount != "0") {
                if (matchesCount == "1")
                    this._foundMatches.value = matchesCount + " Treffer";
                else if (matchesCount == "-1") {
                    var matchLimit = 100;
                    this._foundMatches.value = "Ueber 100 Treffer";
                    //                    var key = (matchLimit > 1000) ? "Decrease" : "Increase";
                } else
                    this._foundMatches.value = matchesCount + " Treffer";
                this._foundMatches.hidden = false;
            }
            else {
                this._foundMatches.hidden = true;
                this._foundMatches.value = "";
            }

            window.clearTimeout(this._updateMatchCountTimeout);
        }
    }

    gFindBar.__proto__._countMatches = function(aWord, aWindow) {
        var win = aWindow || this.browser.contentWindow;

        var countFound = 0;
        for (var i = 0, count; win.frames && i < win.frames.length; i++) {
            if ((count = this._countMatches(aWord, win.frames[i])) != -1)
                countFound += count;
            else
                return count;
        }

        var doc = win.document;
        if (!doc || !(doc instanceof HTMLDocument))
            return countFound;

        var body = doc.body;

        var count = body.childNodes.length;
        var searchRange = doc.createRange();
        var startPt = doc.createRange();
        var endPt = doc.createRange();

        searchRange.setStart(body, 0);
        searchRange.setEnd(body, count);

        startPt.setStart(body, 0);
        startPt.setEnd(body, 0);
        endPt.setStart(body, count);
        endPt.setEnd(body, count);

        var retRange = null;
        var finder = Components.classes["@mozilla.org/embedcomp/rangefind;1"]
                .createInstance()
                .QueryInterface(Components.interfaces.nsIFind);

        finder.caseSensitive = this._shouldBeCaseSensitive(aWord);

        var matchLimit = 100;
        while ((retRange = finder.Find(aWord, searchRange, startPt, endPt))) {
            if (this._rangeIsVisible(retRange, win)) {
                if (this._findMode == this.FIND_LINKS) {
                    if (this._rangeStartsInLink(retRange))
                        ++ countFound;
                }
                else
                    ++ countFound;
            }
            if (countFound == matchLimit) {
                countFound = -1;
                break;
            }
            startPt = doc.createRange();
            startPt.setStart(retRange.startContainer, retRange.startOffset + 1);
        }

        return countFound;
    }

    gFindBar.__proto__._rangeIsVisible = function(aRange, aWindow) {
        var node = aRange.startContainer;

        if (node.nodeType == node.ELEMENT_NODE) {
            if (node.hasChildNodes) {
                var childNode = node.childNodes[aRange.startOffset];
                if (childNode)
                    node = childNode;
            }
        }

        while (node && node.nodeType != node.ELEMENT_NODE)
            node = node.parentNode;

        // There is no perfect way to check if a node is visible in JavaScript,
        // so use the best measures we can have
        if (node) {
            var style = aWindow.getComputedStyle(node, "");
            if (style) {
                if (style.visibility == "hidden" ||
                        style.visibility == "collapse" ||
                        style.display == "none")
                    return false;
                if (style.left != "auto" && style.width != "auto")
                    if (style.left < 0 && style.left + style.width < 0)
                        return false;
                if (style.top != "auto" && style.height != "auto")
                    if (style.top < 0 && style.top + style.height < 0)
                        return false;
            }
        }

        return true;
    }

    gFindBar.__proto__._rangeStartsInLink = function(aRange) {
        var isInsideLink = false;

        var node = aRange.startContainer;

        if (node.nodeType == node.ELEMENT_NODE) {
            if (node.hasChildNodes) {
                var childNode = node.childNodes[aRange.startOffset];
                if (childNode)
                    node = childNode;
            }
        }

        const XLink_NS = "http://www.w3.org/1999/xlink";
        do {
            if (node instanceof HTMLAnchorElement) {
                isInsideLink = node.hasAttribute("href");
                break;
            }
            else if (typeof node.hasAttributeNS == "function" &&
                    node.hasAttributeNS(XLink_NS, "href")) {
                isInsideLink = (node.getAttributeNS(XLink_NS, "type") == "simple");
                break;
            }

            node = node.parentNode;
        } while (node);

        return isInsideLink;
    }

    //insert count function to original
    eval("gFindBar._updateCaseSensitivity=" + gFindBar._updateCaseSensitivity.toString().slice(0, -1) + "this._updateMatchesCount();}");
    eval("gFindBar._updateStatusUI=" + gFindBar._updateStatusUI.toString().slice(0, -1) + "this._updateMatchesCount();}");
})();