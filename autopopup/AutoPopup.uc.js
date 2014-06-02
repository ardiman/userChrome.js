// ==UserScript==
// @name AutoPopup.uc.js
// @description Auto popup menulist/menupopup/Panelpopup
// @compatibility Firefox 2.0+
// @author GOLF-AT
// @version 2.0.0.20131119

(function() {
    var PopElt = null;    var DropElt = null;
    var PopTimer = null;  var HideTimer = null;
    var AlwaysPop = false;  var nDelay = 200;
   
    function IsNewMenuBtn(elt) {
        try {
            return elt.id=='PanelUI-menu-button';
        }catch(e) {
            return false;
        }
    }
   
    function AutoPopup()
    {
        PopTimer = null;
        if (DropElt) {
            if (DropElt.localName=='dropmarker' ||
                IsNewMenuBtn(DropElt))
                PopElt = DropElt;
            else {
                var v = null;
                try {
                    v = DropElt.ownerDocument.
                        getAnonymousNodes(DropElt);
                }catch(ex) {}
                if (v!=null && v.length!=0 && v[0].
                    localName=='menupopup')
                    PopElt = v[0];
                else
                    PopElt = DropElt.childNodes[0];
            }
   
            if (IsNewMenuBtn(PopElt)) {
                PanelUI.show(); return;
            }
            try {
                PopElt.showPopup(PopElt.parentNode,
                    -1, -1, 'popup', 'bottomleft',
                    'topleft');
            }catch(e) { PopElt = null; }
        }
    }
   
    function HidePopup()
    {
        try {
            if (PopElt.localName=='dropmarker')
                PopElt.parentNode.closePopup();
            else if (IsNewMenuBtn(PopElt))
                PanelUI.hide();
            else
                PopElt.hidePopup();
        }catch(e) {}
        HideTimer = null; DropElt = null;
        PopElt = null;
    }
   
    function MouseOver(e)
    {
        if (!AlwaysPop && !document.hasFocus())
            return;
   
        if (IsButton(e.target)) {
            type = e.target.getAttribute('type');
            if (type == 'menu-button') {
                if (e.originalTarget!=e.target)
                    return;
            }
            /*else {
                if (type != 'menu') return;
            }*/
        }
   
        if (HideTimer) {
            window.clearTimeout(HideTimer);
            HideTimer = null;
        }
        try {
            if ('PopupAutoComplete'==e.target.id.
                substr(0,17))
                return;
            for(var elt=e.target; elt!=null; elt=
                elt.parentNode) {
                if (elt.localName=='popup' || elt.
                    localName=='menupopup')
                    return;
            }
        }catch(ex) {}
   
        if (IsNewMenuBtn(PopElt)) {
            if (e.target != PopElt) HidePopup();
        }
        else if (PopElt != null) {
            if (DropElt!=null && e.target==DropElt)
                return;
            try {
                if (PopElt.localName != 'dropmarker'
                    ) {
                    for(var elt=e.target; elt!=null;
                        elt=elt.parentNode) {
                        if (elt == PopElt) return;
                    }
                }
            }catch(ex) {}
            HidePopup();
        }
        DropElt = e.target;
        PopTimer = setTimeout(AutoPopup, nDelay);
    }
   
    function MouseOut(e)
    {
        if (PopTimer) {
            window.clearTimeout(PopTimer);
            PopTimer = null;
        }
        if (!HideTimer && PopElt && !IsNewMenuBtn(e.
            target))
            HideTimer = window.setTimeout(HidePopup,
                500);
    }
   
    function IsButton(elt) {
        try {
            return elt.localName=='toolbarbutton' || elt
                .localName=='button';
        }catch(e) { return false; }
    }
   
    function IsMenuButton(elt) {
        if (IsNewMenuBtn(elt)) return true;
   
        if (!IsButton(elt)) return false;
        for(var i=0; i<2; i++) {
            try {
                var nodes = i==0x01 ? elt.childNodes : elt.
                    ownerDocument.getAnonymousNodes(elt);
                if (nodes!=null && nodes.length && nodes[0]
                    .localName=='menupopup')
                    return true;
            }catch(e) {}
        }
        return false;
    }
   
    function EnumElement(elt) {
        try {
            if (elt.localName == 'prefpane') {
                elt.addEventListener('paneload', function(e) {
                    setTimeout(function() { EnumElement(e.
                        target); }, 100);
                    }, false);
            }
            else if(elt.id=='sidebar' && !elt.hasAttribute(
                'AutoPopup')) {
                elt.setAttribute('AutoPopup', true)
                elt.addEventListener('SidebarFocused',
                    function(e) { EnumElement(elt); }, false);
            }
            else if(elt.id == 'editBookmarkPanel')
                return;
        }catch(e) {}
   
        for(var i=0; i<2; i++) {
            var nodes = null;
            try {
                if (elt.localName == 'browser') {
                    i = 1;
                    nodes = elt.contentDocument.childNodes;
                }
                else
                    nodes = i==0x01 ? elt.childNodes : elt.
                        ownerDocument.getAnonymousNodes(elt);
            }catch(e) { nodes = null; }
            if (nodes == null) continue;
   
            for(var n=0; n<nodes.length; n++) {
                try {
                    var node = nodes[n];
                    if ('PopupAutoComplete'==node.getAttribute(
                        'id').substr(0,17) || 'menupopup'==node
                        .localName || node.localName=='popup')
                        ;
                    else if (node.localName != 'dropmarker') {
                        if (node.localName=='menu' && 'menubar'
                            ==node.parentNode.localName)
                            ;
                        else if(!IsMenuButton(node))
                            node = null;
                    }
                    else if(node.getAttribute('type')=='menu') {
                        node = node.parentNode;
                        if (!node.firstChild || node.firstChild.
                            localName!='menupopup')
                            continue;
                    }
                    if (node == null) {
                        EnumElement(nodes[n]); continue;
                    }
                    if (node.hasAttribute('command')) continue;
   
                    node.addEventListener('mouseout', MouseOut,
                        false);
                    node.addEventListener('mouseover',MouseOver,
                        false);
                }catch(e) {}
            }
        }
    }
   
    setTimeout(function() { EnumElement(document); }, 100);
})();
