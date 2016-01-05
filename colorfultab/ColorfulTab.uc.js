// ==UserScript==
// @name           Colorful Tabs
// @author         Palatoo Young
// @include        main
// @description    Colorful Tabs for Firefox
// @version        0.1
// ==/UserScript==

location.href === 'chrome://browser/content/browser.xul' && (function(){

    'use strict';

    if(typeof colorfulTab !== 'undefined') return;

    var ctxt = (function(){
        const canvas = document.createElementNS('http://www.w3.org/1999/xhtml','canvas');
        document.documentElement.appendChild(canvas);
        canvas.width = 16;
        canvas.height = 16;
        canvas.style.display = 'none';
        return canvas.getContext('2d');
    })();

    var colorfulTab = {       
    
        init : function(){
            colorfulTab.insertCSS();
            gBrowser.addTabsProgressListener({
                onLinkIconAvailable : function onLinkIconAvailable(aBrowser){
                    var tab = colorfulTab.getTabForBrowser(aBrowser);               
                    var img = new Image,data;
                    img.src = tab.getAttribute('image');

                    img.onload = function(){
                        ctxt.drawImage(img,0,0,16,16);
                        data = ctxt.getImageData(0, 0, 16, 16).data;
                        colorfulTab.averageColorValue(data,tab);
                    }             
                }
            });    
        },       
               
        averageColorValue : function(data,tab){
            var r = 0,g = 0,b = 0,a = 0;
            Array.prototype.forEach.call(data,function(i,j){
                var color = (j+1) % 4;
                switch (color){
                    case 1:
                        r += i;
                        break;
                    case 2:
                        g += i;
                        break;
                    case 3:
                        b += i;
                        break;
                    case 0:
                        a += i;
                        break;
                }
            });
            tab.style.setProperty('background',
                'rgba('+parseInt(r/256)+','+parseInt(g/256)+','+parseInt(b/256)+','+parseInt(a/256)+')',
                'important');
        },
        
        getTabForBrowser : function(browser) {
            var mTabs = gBrowser.mTabContainer.childNodes;
            for (var i=0; i<mTabs.length; i++) {
                if (mTabs[i].linkedBrowser == browser) {
                    return mTabs[i];
                }
            }
            return null;
        },
        
        insertCSS : function(){
        var cssText = (function(){
/*
#TabsToolbar {
background: transparent !important;
margin-bottom: 0 !important;
margin-top: -1px !important;
}
#TabsToolbar .tab-background{
margin: 0 !important;
background: transparent !important;
}
#TabsToolbar .tab-background-start,
#TabsToolbar .tab-background-end{
display: none !important;
}
#TabsToolbar .tab-background-middle{
margin: -4px -2px !important;
background: transparent !important;
}
#TabsToolbar .tabbrowser-tab:after,
#TabsToolbar .tabbrowser-tab:before{
display: none !important;
}
#TabsToolbar .arrowscrollbox-scrollbox {
padding: 0px !important;
}
#TabsToolbar .tabs-newtab-button,
#TabsToolbar .tabbrowser-tab{
color: #ffffff !important;
height: 30px !important;
-moz-border-image: none !important;
border:none!important;
border-style: solid !important;
border-color: rgba(0,0,0,.2) !important;
border-width: 1px 0 0 1px !important;
text-shadow: 0 0 4px rgba(255,255,255,.75) !important;
padding: 4px 2px !important;
background-clip: padding-box !important;
transition: background-color 1.5s ease 0s !important;
}
#TabsToolbar .tabbrowser-tab[first-tab][last-tab],
#TabsToolbar .tabbrowser-tab[last-visible-tab]{
border-right-width: 1px !important;
}
#TabsToolbar .tabbrowser-tab[afterselected]{
border-left-color: rgba(0,0,0,.25) !important;
}
#TabsToolbar .tabbrowser-tab[selected]{
background-clip: padding-box !important;
border-color: rgba(0,0,0,.25) !important;
color: #ffffff;
box-shadow:0 2.5px 0 0 #ffffff inset !important;
}
#TabsToolbar .tabs-newtab-button:hover,
#TabsToolbar .tabbrowser-tab:hover:not([selected]){
box-shadow:0 1.5px 0 0 #ffffff inset !important;
background-image: none !important;
}
#TabsToolbar .tabs-newtab-button{
border-width: 1px 1px 0 0 !important;
margin: 0 !important;
width: auto !important;
padding: 0 5px !important;
}
*/}).toString();
        cssText = cssText.replace(/\r|\n/ig,'');
        cssText = cssText.substring(cssText.indexOf('/*')+2,cssText.length-3);
        var css = 'data:text/css,/*colorfulTab*/' + encodeURIComponent(cssText);

        var sss = Components.classes['@mozilla.org/content/style-sheet-service;1']
            .getService(Components.interfaces.nsIStyleSheetService);
        var ios = Components.classes['@mozilla.org/network/io-service;1']
            .getService(Components.interfaces.nsIIOService);
        var uri = ios.newURI(css, null, null);
        sss.loadAndRegisterSheet(uri, sss.USER_SHEET);          
        }
    }

    window.colorfulTab = colorfulTab;
    colorfulTab.init();
    
}());