// ==UserScript==
// @name                  Firefoxappmenubutton.uc.js
// @namespace        
// @description        ??appmenu????? ?????
// @include               
// @compatibility     Firefox 4.0+
// @author                
// @homepage         
// @version              1.0.0 2012.10.25
// @updateURL         
// @note                   
// @include              chrome://browser/content/browser.xul
// ==/UserScript==

/* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Firefoxappmenubutton :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

(function Firefoxappmenubutton(css) {

    function createBtn() {
        var navigator = document.getElementById("navigator-toolbox");
                if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
                var Btn = document.createElement("toolbarbutton");
                Btn.id = "Firefoxappmenu-button";
                Btn.setAttribute("type", "menu");
                Btn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
                Btn.setAttribute("removable", "true");
                Btn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEOUlEQVQ4jVXUS28TVwAF4DNz52l7JvY4TuzEjpM4QAivpCEkFUioG1SoKpUiVarEou2mf6A/oFKRWnXZVVddVKpQBSsebUlVKGFBKyiIFMjDxHFiMImN3zNjz+Pe6QqJnuWRvrM8HN6IlrnAEV1O6dnogjGgv5vKxY/nJgb725aD4malUn+cv21tlhbpq87fku9VnlV+CF5bYT6rcnOT4UTFCpPLOxg0jk18MTmfOXVoXEskIhLGUgk4PsPG3uiAma0cYPmH5+Ld/C9Kq/zd7ftYvrqCAACEaS2QTyf5Dyq+vvBADUZjU9ETx1NVcV/rDpbtOZRkDV3HwasOhRKI3Gy6kpyffnnes5VR14l+pYQ7f126T3vkowjT92j8p9P7YucX9rhjp5UV4Wj5IlZfmHg6+D5sn8duvQNVUeBCw+KtKgqrRXLqvV5m+oi/IDpyq9pU10jaEI3RJDmXNnoHUnSLN1prQOMFtjYl9Ok6bJ/CEgx4LoNpM9hCCg+f70d3e4d/Z3wzgUh/uGqG/iQfH9Pnj47Kn4uERh0PoIyAQUTMdZDFNv6tAQWaQq3SwMbqOhjzYQyPQ+y6WAivgh/wWGG3c0uIq+RkLELSPqXgOAIi8tA0DWqmH18+2Y91YxJoW1hZfohOrQ6jL4rBYRlQatD3JtGn1ocGgsqsEAnYJHN9wkkE8AM0qhRrZQ7FoThK+hw4ZQQSo4ipGhq1VTRqFTg7bZycfwFZa0EO9JDgSgeFRs0XvTQHWRXQqPp4stRCQZJxNbMPdFiDwlqQZR4RQQVsG91mC6nkK3y4pwrJLCKQElzb0xyhUfd7zCHgeB7MpegPU4xlTSTHS3hCw5gI1zAxzOMai2K52QA6FpJTIzg43QVnMXS4uN/inF2h3HTum03ubGhIkbS4hMheAUQ0oVYXsSAvge/6uJeXsVpMgLYI+kIhvJVrQDS2EbRzKNm5xq6ZXxdeNtnN9U1/rT/tHCIRAchEwFMG31Lw490AS7Uk1i0Dva6JsSjDZ2+3cHbmKQQrCprLBYWlrfXnxfIjEnjoxilG00FwOBSXRS5EEDCKiA7Eh3WQSAJJI4mZFMMns3WcGWsgqphQZiZR80vW4tWVy1dumL8KBaB9p04vDT3uHT9hkhnlSIKnHoWkU+TUJiamuqDCDnhwIJ6NgJmQDjME0Ty9+1Pz6Y3f/Gs7NZiEAkGbobztomq03Vn1WS/aLXOcueXDsyV4JkDtHqhjg6kdRA72II9Q+vvP1sY339MLjwq46TL4BAB6ACsz5IsuSoLlZyXL7RPsQGQ7PudVPdCmg4A6YGFGdy2+df06efDtRXz96GVwxWNwAYB7848kQMwAs1M8zoxI/FxKJFlVhAIVgdsHsxZGcdPCvX+e0z+22+wBA5zX9n9DrzsViMQ4JGIClyY8tIAH8wU0az7KLQd1hwUWAPYm+g9qWAvrlR0DbgAAAABJRU5ErkJggg==)";
                Btn.setAttribute("label","Firefox Appmenü");
                navigator.palette.appendChild(Btn);
                
                if ( !Btn.lastChild ) {
                  var mc = document.getElementById("appmenu-popup");
                  var mcc = mc.cloneNode( true );
                  Btn.appendChild( mcc );
                }
                var bo = document.getBoxObjectFor( Btn );
                Btn.lastChild.showPopup ( Btn, -1, -1, "popup", "bottomleft", "topleft" );
    }
    
    function updateToolbar() {
    var toolbars = document.querySelectorAll("toolbar");
    Array.slice(toolbars).forEach(function (toolbar) {
        var currentset = toolbar.getAttribute("currentset");
        if (currentset.split(",").indexOf("Firefoxappmenu-button") < 0) return;
        toolbar.currentSet = currentset;
        try {
            BrowserToolboxCustomizeDone(true);
        } catch (ex) {
        }
    });
    }
    createBtn();
    updateToolbar();

    addStyle(css);

    function addStyle(css) {
    var pi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
    }
  
})(<![CDATA[
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);

.titlebar-placeholder[type="appmenu-button"],#titlebar #titlebar-content #appmenu-button-container #appmenu-button{display:none !important;}

]]>.toString());