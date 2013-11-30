var AutoClick = {
    enable: true,
    TimeoutID: null,
    ClickTarget : null,

    init: function() {
        var menuitem = document.createElement('menuitem');
        menuitem.setAttribute('id', 'AutoClick');
        menuitem.setAttribute('class', 'menuitem-iconic');
        menuitem.setAttribute('label', AutoClick.enable ? 'AutoClick deaktivieren' : 'AutoClick aktivieren');
        menuitem.addEventListener("click", function(){
            AutoClick.enable = ! AutoClick.enable;
            menuitem.setAttribute('label', AutoClick.enable ? 'AutoClick deaktivieren' : 'AutoClick aktivieren');
        }, false);

        var insPos = document.getElementById('devToolsSeparator');
        insPos.parentNode.insertBefore(menuitem, insPos);
    },

    mouseover: function(ev) {
        if(!AutoClick.enable) return;

        try {
            var localName = ev.target.localName;
        }catch(e) { }
        if (localName.toLowerCase()=='a' && ev.target.
            href.indexOf('javascript:')==-1) {
            this.ClickTarget = ev.target;
            this.TimeoutID = window.setTimeout(AutoClick
                .autoclick, 500);
        }
    },

    mouseout: function(ev) {
        this.ClickTarget = null;
        if (this.TimeoutID) {
            window.clearTimeout(this.TimeoutID);
            this.TimeoutID = null;
        }
    },

    click: function(ev) {
        this.ClickTarget = null;
        return ev.target ? true : false;
    },

    autoclick: function() {
        if (!this.ClickTarget) return;
        if (this.ClickTarget.target == '_blank')
            gBrowser.loadOneTab(this.ClickTarget.href,
                null, null, null, false, true);
        else
            loadURI(this.ClickTarget.href);
        this.ClickTarget = null;
    },

};

AutoClick.init();

document.getElementById('AutoClick').click();

window.addEventListener('mouseover', AutoClick.mouseover, false);
window.addEventListener('mouseout', AutoClick.mouseout, false);
window.addEventListener('click', AutoClick.click, false);