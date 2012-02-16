//// Alle Links auf einer Seite werden in neuen Tabs geöffnet ////

(function() {
    function OnClick(e) {
        var href, sURI, target;

        for(target=(e.button==0?e.target:null); target!=null;
            target=target.parentNode) {
            if (!target.localName || target.localName=='A' ||
                target.localName=='a')
                break;
        }
        if (target!=null && target.href!=null) {
            href = target.href; sURI = gBrowser.currentURI.spec;
            gBrowser.loadOneTab(href, {
                    referrerURI: document.documentURIObject,
                    charset: target.charset, postData: null,
                    inBackground: false});
                e.preventDefault();
        }
    }

    try {
        gBrowser.addEventListener('click', OnClick, false);
    }catch(e) {}

})();