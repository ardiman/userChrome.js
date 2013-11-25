// ==UserScript==
// @name                newTabByLongPress.uc.js
// @description         リンクやブックマークを左ボタン長押しで新しいタブに開く
// @include             main
// @version             0.6 リンクを現在のタブの右隣に開くか設定できるように
// ==/UserScript==
(function func() {

    const wait = 500; // Zeit für die Dauer des Tastendruck
    const background = true;    // "false" für das Öffnen im Vordergrund
    const nextToCurrent = true;  // Direkt neben dem aktuellen Tab öffnen

    var opened;

    function isLink(node) {
        while (node) {
            if ((node instanceof HTMLAnchorElement || node instanceof HTMLAreaElement) && node.hasAttribute('href')) {
                if (/^\s*javascript:/.test(node.getAttribute('href')))
                    return false;
                return node.href;
            }
            node = node.parentNode;
        }
        return false;
    }

    function isPlaces(e, node) {
        var ln = node.localName;
        if (
            !('type' in node && node.type == 'menu') && (node._placesNode && PlacesUtils.nodeIsURI(node._placesNode))
            || ln == 'treechildren' && (node.parentNode.id == 'bookmarks-view' || node.parentNode.id == 'historyTree')
           )
        var uri = ln == 'treechildren' ? getTreeInfo(node, e, 'uri') : node._placesNode.uri;
            return uri;
        return null;
    }

    function getTreeInfo(treechildren, e, prop) {
        var tree = treechildren.parentNode;
        var row = {}, column = {}, part = {};
        var tbo = tree.treeBoxObject;
        tbo.getCellAt(e.clientX, e.clientY, row, column, part);
        if (row.value == -1)
            return;
        var node = tree.view.nodeForTreeIndex(row.value);
        if (!PlacesUtils.nodeIsURI(node))
            return;
        return node[prop];
    }

    function handleLongPress(e) {
        setTimeout(function() {
            if (func.removeListener)
                func.removeListener();
        }, 0)

        var node = e.target || e.originalTarget;
        var url = isLink(node) || isPlaces(e, node);
        if (e.button != 0 || !url) return;

        if ((e.type == 'mousedown' && !opened) && (!e.altKey && !e.ctrlKey && !e.shiftKey)) {
            func.timer = setTimeout(function() {
                function cancel(e) {
                    e.preventDefault();
                    e.stopPropagation();
                };

                addEventListener('click', cancel, true);

                func.removeListener = function() {
                    removeEventListener('click', cancel, true)
                };

                gBrowser.loadOneTab(url, {
                    relatedToCurrent: nextToCurrent,
                    inBackground: background,
                    referrerURI: makeURI(content.location.href)
                });

                opened = true;
            }, wait);
        } else {
            clearTimeout(func.timer);
            if (opened && node._placesNode) {
                e.preventDefault();
            }
            opened = false;
        }
    }

        addEventListener('mousedown', handleLongPress, true, gBrowser);
        addEventListener('mouseup', handleLongPress, true, gBrowser);
        addEventListener('dragstart', handleLongPress, true, gBrowser);

})();
