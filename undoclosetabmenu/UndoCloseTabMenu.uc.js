location == "chrome://browser/content/browser.xul" && (function() {

    var tabContext = gBrowser.tabContainer.contextMenu;
    var refNode = document.getElementById('context_closeTab');

    var uctMenu = tabContext.insertBefore(document.createElement('menu'), refNode);
    uctMenu.setAttribute('label', 'Kürzlich geschlossene Tabs'); //'\u6700\u8fd1\u9589\u3058\u305f\u30bf\u30d6'
    uctMenu.setAttribute('type', 'menu');
    uctMenu.setAttribute('class', 'menu-iconic');
    uctMenu.setAttribute('image', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUklEQVQ4ja2Sz0/ScRjHP0XzZuvWqb/gu2514mLr5MW51pKt5aCJOFNBVH4ViMgPvyoqJGCokxKE7xf5+huBUEce2hw/vyAgaK1rhw7dWuvzdICaCpdcz/a+PNvr/Tzv5/NB6H9XU2vrrcERUnAlmCcQ3JnfibM6q8v/zzC/p//uUoT94j78DI6dxFfSHY6ZlsMxgysUG10K7imt7rn2bukDhND1GrhHMdrk2st/e/fhE16KncHCwSl+s1cGR7SEZyMnYAkV8dRuASZ38nhoxkNzudzG8zzHQu3HXbEzWDw4Bed+GRzREtgiJbCGT2B6twiTwQKMb+fBtHUMho0cSKbc6wihG38dHra03Da5tg/nomVse1+C1+ETPBMqgjlYwOPbeRjbOsbGzWPQr+ewbi0LWobFT0WSxxdicLncRpXVG7CEiqB2bua6FIbhTllF3WqzRUMdfdeuZUHDsKAOsPDCtLiBELp2wYQgiAaJwT4rJRfoy3cSqiaUrwIsfrmaAaU/g8W2jSJBEA31HoTDe/b83uVml2Fer/JnQEGnQU6locfKFGoMhEqyRTrtsYvNHrt4Ytne+0cWP6WgEj9ldBoPUSkY8KVwx4iNqYnQN7ZAateyMFzNWVk3DXI6DTIqBYO+FEi9SZC447+e8Dtba/+D0UmqAyyoVjNY5c+AnE7jKogHvEmQeJNYvJLAfKXZUzd/l95Jns9ZWTdZmbqSgN63H3+0y4zO5ubmm/WOh/h9Kp5I52BEOgcjHHEwHVUJNDZfe7/W8Kit7T5CiFMXvmr9BgUaYJEai8kVAAAAAElFTkSuQmCC');
    uctMenu.appendChild(document.createElement('menupopup')).addEventListener('popupshowing', function(e) {
        var target = e.target;

        while (target.firstChild)
            target.removeChild(target.firstChild);

        var ss = Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore);
        var closedTabs = JSON.parse(ss.getClosedTabData(window));
        closedTabs.map(function(item, id) {
            var mi = target.appendChild(document.createElement('menuitem'));
            mi.setAttribute('label', item.title);
            mi.setAttribute('image', item.image ? 'moz-anno:favicon:' + item.image : '');
            mi.setAttribute('class', 'menuitem-iconic bookmark-item');
            mi.setAttribute('oncommand', 'undoCloseTab(' + id + ')');
        });
    }, false);

})();
