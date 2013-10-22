/* UndoCloseTabMenu.uc.js */

location == "chrome://browser/content/browser.xul" && (function () {
    var menu = document.createElement('menu');
    var ucMenu = document.getElementById('tabContextMenu').insertBefore(menu, null);
    ucMenu.setAttribute('label', 'Kürzlich geschlossene Tabs'); 
    ucMenu.setAttribute('type', 'menu');
    ucMenu.setAttribute('image', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUklEQVQ4ja2Sz0/ScRjHP0XzZuvWqb/gu2514mLr5MW51pKt5aCJOFNBVH4ViMgPvyoqJGCokxKE7xf5+huBUEce2hw/vyAgaK1rhw7dWuvzdICaCpdcz/a+PNvr/Tzv5/NB6H9XU2vrrcERUnAlmCcQ3JnfibM6q8v/zzC/p//uUoT94j78DI6dxFfSHY6ZlsMxgysUG10K7imt7rn2bukDhND1GrhHMdrk2st/e/fhE16KncHCwSl+s1cGR7SEZyMnYAkV8dRuASZ38nhoxkNzudzG8zzHQu3HXbEzWDw4Bed+GRzREtgiJbCGT2B6twiTwQKMb+fBtHUMho0cSKbc6wihG38dHra03Da5tg/nomVse1+C1+ETPBMqgjlYwOPbeRjbOsbGzWPQr+ewbi0LWobFT0WSxxdicLncRpXVG7CEiqB2bua6FIbhTllF3WqzRUMdfdeuZUHDsKAOsPDCtLiBELp2wYQgiAaJwT4rJRfoy3cSqiaUrwIsfrmaAaU/g8W2jSJBEA31HoTDe/b83uVml2Fer/JnQEGnQU6locfKFGoMhEqyRTrtsYvNHrt4Ytne+0cWP6WgEj9ldBoPUSkY8KVwx4iNqYnQN7ZAateyMFzNWVk3DXI6DTIqBYO+FEi9SZC447+e8Dtba/+D0UmqAyyoVjNY5c+AnE7jKogHvEmQeJNYvJLAfKXZUzd/l95Jns9ZWTdZmbqSgN63H3+0y4zO5ubmm/WOh/h9Kp5I52BEOgcjHHEwHVUJNDZfe7/W8Kit7T5CiFMXvmr9BgUaYJEai8kVAAAAAElFTkSuQmCC');
    var mp = document.createElement('menupopup');
    ucMenu.appendChild(mp).addEventListener('popupshowing', function () { onpopupshowing(this) }, false);

    function onpopupshowing (aParent) {
        var target = aParent;

        while (target.firstChild)
            target.removeChild(target.firstChild)

        var ss = Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore);
        var closedTabs = JSON.parse(ss.getClosedTabData(window));
        closedTabs.map(function (item, id) {
            var mi = target.appendChild(document.createElement('menuitem'));
            mi.setAttribute('label', item.title);
            mi.setAttribute('image', item.image ? 'moz-anno:favicon:' + item.image : '');
            mi.setAttribute('class', 'menuitem-iconic bookmark-item');
            mi.setAttribute('oncommand', 'undoCloseTab(' + id + ')');
        });
    }

})();
