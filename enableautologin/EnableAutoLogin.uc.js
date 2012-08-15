// ==UserScript==
// @name           EnableAutoLogin.uc.js
// @description    Enable Auto Login
// @compatibility  Firefox 2.0+
// @author         GOLF-AT
// @version        1.7.20101027

(function() {
    function ContentLoaded(event) {
        var items = event.target.getElementsByTagName('input');
        for(var i=0; i<items.length; i++) {
            var item = items.item(i);
            if (item.hasAttribute('autocomplete'))
                item.setAttribute('autocomplete', 'on');
            if (item.getAttribute('name').toLowerCase() ==
				'username')
				item.setAttribute('value', '');
            if (item.form!=null && item.form.hasAttribute(
                'autocomplete'))
                item.form.setAttribute('autocomplete', 'on');
            if (item.getAttribute('id')=='answer' && 'display:'
                ==item.getAttribute('style').substr(0,8))
                item.setAttribute('style', 'display:inline');
        }
    }

    function AutoCompleteOn(event) {
        if (event.button==2) return; //right button
        try {
            var target = event.target;
            if (target.localName.toLowerCase() != 'a') {
                target = target.parentNode;
                if (!target || target.localName.toLowerCase()
                    !='a')
                    return;
            }
            var href  = target.getAttribute('href');
            var click = target.getAttribute('onclick');
            if (click.substr(0,9)=='floatwin(' || click.substr
                (0,10)=='showWindow') {
                var enable = 'logging.php?action=login'==href.
                    substr(0,24) || 'register.php'==href.substr
                    (0,12) || 'regist.php'==href.substr(0,10);
                if (!enable) {
                    var pos = href.indexOf('member.php?mod=');
                    if (pos>=0 && ('register'==href.substr(pos
                        +15,8)||'logging'==href.substr(pos+15,
                        7)))
                        enable = true;
                }
                if (enable) {
                    target.removeAttribute('onclick');
                    target.click();
                }
            }
        }catch(e) {}
    }

    try {
        gBrowser.addEventListener('mousedown', AutoCompleteOn, false);
        gBrowser.addEventListener("DOMContentLoaded", ContentLoaded, true);
    }catch(e) {}

})();