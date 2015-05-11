// ==UserScript==
// @name           mouseover open bookmark folder
// @description    ブックマークツールバーのフォルダをマウスオーバーで開く
// @version        1.1
// @include        main
// @compatibility  Firefox 31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/1149
// ==/UserScript==

(function() {
    var bookmarkFolder = {
        toolbar: document.getElementById('PlacesToolbarItems'),
        init: function() {
            this.toolbar.addEventListener('mouseover', this, false);
            window.addEventListener('unload', this, false);
        },
        uninit: function() {
            this.toolbar.removeEventListener('mouseover', this, false);
            window.removeEventListener('unload', this, false);
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'mouseover':
                    this.open(e.target);
                    break;
                case 'unload':
                    this.uninit();
                    break;
            }
        },
        open: function(item) {
            switch (item.nodeName) {
                case 'toolbarbutton':
                    this.close(item);
                    if (item.getAttribute('type') == 'menu') {
                        item.open = true;
                    }
                    break;
            }
        },
        close: function(item) {
            var items = document.querySelectorAll('#PlacesToolbarItems > toolbarbutton[type="menu"]');
            for (var i = 0; i < items.length; i++) {
                if (items[i] != item) {
                    items[i].open = false;
                }
            }
        }
    };
    bookmarkFolder.init();
})();
