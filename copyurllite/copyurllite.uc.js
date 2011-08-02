// ==UserScript==
// @name           Copy URL Lite+
// @version        1.4.0
// @description    Like Copy URL+ extention.
// @author         Shinya
// @homepage       http://www.code-404.net/article/2007/07/15/copy-url-lite
// @namespace      http://www.code-404.net/
// @compatibility  Firefox 2.0 3.0
// @include        chrome://browser/content/browser.xul
// @note           
// ==/UserScript==

/* Copy URL Lite
 *   nanto_vi (TOYAMA Nao), 2006-12-26
 *
 * Copy URL and extra informations from the context menu.
 *
 * http://nanto.asablo.jp/blog/2006/12/31/1083170
 */

(function(){
  
  var locale = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
  locale = locale.getCharPref("general.useragent.locale");
  
  var mMenus = [
    {
      // URI ohne Markierung
      label: locale.indexOf("ja") == -1 ? "BB URI" : "\u30bf\u30a4\u30c8\u30eb\u3068 URI",
      accesskey: "C",
      text: '[url=%URL%]%TITLE% (Klick mich)[/url]'
    },
    {
      // URI mit Markierung
      label: locale.indexOf("ja") == -1 ? "BB Selection, URI" :
        "\u30bf\u30a4\u30c8\u30eb\u3068\u9078\u629e\u3057\u305f\u90e8\u5206\u3068 URI",
      accesskey: "S",
      text: '[url=%URL%]%SEL% (Klick mich)[/url]',
      condition: "select"
    },
    {
      // Link ohne Markierung
      label: locale.indexOf("ja") == -1 ? "BB Link" :
        "\u9078\u629e\u3057\u305f\u90e8\u5206\u3068\u30ea\u30f3\u30af\u5148 URI",
      accesskey: "S",
      text: '[url=%RLINK%]%RLINK% (Klick mich)[/url]',
      condition: "link"
    },
    {
      // Link mit Markierung
      label: locale.indexOf("ja") == -1 ? "BB Selection, Link" :
        "\u9078\u629e\u3057\u305f\u90e8\u5206\u3068\u30ea\u30f3\u30af\u5148 URI",
      accesskey: "S",
      text: '[url=%RLINK%]%SEL% (Klick mich)[/url]',
      condition: "select-link"
    },
    {
      // ???
      label: "separator",
    },
    {
      // ????
      label: locale.indexOf("ja") == -1 ? "Titel" : "\u30bf\u30a4\u30c8\u30eb",
      accesskey: "T",
      text: '%TITLE%'
    },
    {
      // URI
      label: "URI",
      accesskey: "U",
      text: '%URL%'
    },
    {
      // ???? - URI
      label: locale.indexOf("ja") == -1 ? "Titel - URI" : "\u30bf\u30a4\u30c8\u30eb - URI",
      accesskey: "I",
      text: '%TITLE% - %URL%%EOL%'
    },
    {
      // ???? URI
      label: locale.indexOf("ja") == -1 ? "Link URI" :
        "\u30ea\u30f3\u30af\u5148 URI",
      accesskey: "L",
      text: '%RLINK%',
      condition: "link"
    },
    {
      // ???
      label: "separator",
    },
    {
      // HTML
      label: "HTML",
      accesskey: "H",
      text: '<a href="%URL_HTMLIFIED%">%TITLE_HTMLIFIED%</a>'
    },
    {
      // HTML(title)
      label: "HTML(title)",
      accesskey: "A",
      text: '<a href="%URL_HTMLIFIED%" title="%TITLE_HTMLIFIED%"></a>'
    },
    {
      // ????????? URI
      label: locale.indexOf("ja") == -1 ? "Encoded Link URI" :
        "\u30ea\u30f3\u30af\u5148\u30a8\u30f3\u30b3\u30fc\u30c9 URI",
      accesskey: "E",
      text: '%RLINK_HTMLIFIED%',
      condition: "link"
    },
    {
      // ???????
      label: "separator",
      condition: "select"
    },
    {
      // ??
      label: locale.indexOf("ja") == -1 ? "Block Quote" : "\u5f15\u7528",
      accesskey: "B",
      text: '<blockquote cite="%URL_HTMLIFIED%" title="%TITLE_HTMLIFIED%">%EOL%<p>%SEL_HTMLIFIED%</p>%EOL%</blockquote>%EOL%',
      condition: "select"
    },
    {
      // ???????
      label: locale.indexOf("ja") == -1 ? "Inline Quote" : "\u30a4\u30f3\u30e9\u30a4\u30f3\u5f15\u7528",
      accesskey: "Q",
      text: '<q cite="%URL_HTMLIFIED%" title="%TITLE_HTMLIFIED%">%SEL_HTMLIFIED%</q>',
      condition: "select"
    },
    {
      // ???????
      label: "separator",
      condition: "link-image"
    },
    {
      // ?????
      label: locale.indexOf("ja") == -1 ? "Image Link" : "\u753b\u50cf\u30ea\u30f3\u30af",
      accesskey: "B",
      text: '<a href="%RLINK_HTMLIFIED%"><img src="%IMAGE_URL_HTMLIFIED%" alt="%IMAGE_ALT_HTMLIFIED%" /></a>',
      condition: "link-image"
    }
  ];
  
  init: {
    var contextMenu = document.getElementById("contentAreaContextMenu");
    var separator = document.getElementById("context-sep-properties");
    
    var menu = document.createElement("menu");
    menu.id = "copyurllite";
    menu.setAttribute("label", "Copy URL Lite+");
    menu.setAttribute("accesskey", "U");
    menu.className = "menu-iconic";
    menu.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAnEAAAJxABlGlRGQAAAAd0SU1FB9QGGAEvLH6QQPAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCBWMy4wOKSzs%2BUAAALoSURBVDhPjZJLTBNRFIYHiAaMIT4CiogLF0ajcWUwrjXiwrgDhGhMfCFWIyQaDZGIhBhBkTdYRUyDIYIgzzSIiAYQsRRoLa%2FSlvJomRampQItBWbu750xEFlAPJkz58zi%2F%2Bb8516fgoqpxG2Bm%2Fb6b2aC%2Ff19g7YG%2BO3keYQ5XItTIL7R0RE7BpmNorKZqxUEAkIIlngC%2BmCZvpp%2FsCiudfbnfOCPbQjIKzPHspwXYoiAhSVKoFH%2FZRiP89VIyeu2MszNoHUh9591h7X1OhZEmYeK5yjLaOfR0DGD900WlFSPIl1ubGzp8bysapmpK22YvrYWti9zS%2B1Xa6eXB1wegtlFoFmzgF69FyJ0cRmYdQvSZGOsG2VKK1Eo3Q9TW%2BG3AvJ5V28ompolmOQIuHlAZVpGu3YOgiCsWvNSkHNuEU%2BKupD%2BZhh3M1SJjE%2BbjwQpKNPKtKZ5WDhgfEqA2giUNjphc3ilpbrp3%2Be9BM55AV06Fp3aMbyrMwxFXG4LlAApuR0RrT12sC7gdaEN2Vl25FZOw2DxUDG1Rjck2rO7aF2gp0Tn%2Bq51keT83oMSIPb2h3Blm0UoltvBHICUV2VGdPb9BjcHsDPUmhuYpHWC2rQ4ALXejdTC7gsS4MiptEPln0Y5eaZ5FSCL06P8MwurQ4CJFTA6TWC2ExgnBRho9o3weJTz84UEOLpHef9evIqTJ7SvApJi23Envgcl8kmYbAT6CTEFjIgQ%2Bj0wRvD0lVrJHA%2FrvL4y9nq1KN%2BGgXGCX2YCnVlAP%2B21JoJshUb3X4D8XBt0VKTW81AN8ug20H6YILdUw0oWdu1nz4fst8ZEhlQ8WJlCFpyXce5ETfXzDCtUQwJ6zaBCujx6xCr938xWaLHmVp4JVSasAMT%2B7KWCKy1qD9p1Ar5plvCxhUNxlQlZCq2HXqi%2BuKTqhjWAf%2Fch9iejMmIepDcN3EquqYqRKdKibry9GHn1Tfjp2JxQv92R2xnmcMAftGCCCifLktsAAAAASUVORK5CYII%3D");
    contextMenu.insertBefore(menu, separator);
    
    var menuPopup = document.createElement("menupopup");
    menu.appendChild(menuPopup);
    
    for(var i = 0, menu; menu = mMenus[i]; i++){
      var menuItem;
      if(menu.label == "separator"){
        menuItem = document.createElement("menuseparator");
      }
      else{
        menuItem = document.createElement("menuitem");
        menuItem.setAttribute("label", menu.label);
        if("accesskey" in menu) menuItem.setAttribute("accesskey", menu.accesskey);
        menuItem.culMenu = menu;
        menuItem.addEventListener("command", copyText, false);
      }
      menuItem.id = "copyurllite-menu-" + i;
      menuPopup.appendChild(menuItem);
    }
  
    contextMenu.addEventListener("popupshowing", setMenuDisplay, false);
  }
  
  function copyText(aEvent){
    
    function htmlEscape(text) {
      text = text.replace(/&/g, "&amp;");
      text = text.replace(/>/g, "&gt;");
      text = text.replace(/</g, "&lt;");
      text = text.replace(/"/g, "&quot;");
      return text;
    }
    
    function convertText(text){
      text = text.replace(/%URL_HTMLIFIED%/g, url_html);
      text = text.replace(/%URL%/g, url);
      text = text.replace(/%TITLE_HTMLIFIED%/g, title_html);
      text = text.replace(/%TITLE%/g, title);
      if(gContextMenu.isTextSelected){
        text = text.replace(/%SEL_HTMLIFIED%/g, sel_html);
        text = text.replace(/%SEL%/g, sel);
      }
      if(gContextMenu.onLink){
        text = text.replace(/%RLINK_HTMLIFIED%/g, link_html);
        text = text.replace(/%RLINK%/g, link);
      }
      if(gContextMenu.onImage){
        text = text.replace(/%IMAGE_URL_HTMLIFIED%/g, imageUriHtml);
        text = text.replace(/%IMAGE_URL%/g, imageUri);
        text = text.replace(/%IMAGE_ALT_HTMLIFIED%/g, imageAltHtml);
        text = text.replace(/%IMAGE_ALT%/g, imageAlt);
        text = text.replace(/%IMAGE_TITLE_HTMLIFIED%/g, imageTitleHtml);
        text = text.replace(/%IMAGE_TITLE%/g, imageTitle);
      }
      text = text.replace(/%EOL%/g, eol);
      return text;
    }
    
    var text = aEvent.target.culMenu.text;
    var win = content.document;
    var title = win.title;
    var title_html = htmlEscape(title);
    var url = win.location.href;
    var url_html = htmlEscape(url);
    if(gContextMenu.isTextSelected){
      var sel = content.getSelection().toString();
      var sel_html = htmlEscape(sel);
    }
    if(gContextMenu.onLink){
      var link = gContextMenu.getLinkURL().toString();
      var link_html = htmlEscape(link);
    }
    if(gContextMenu.onImage){
      var imageUri = gContextMenu.imageURL;
      var imageUriHtml = htmlEscape(imageUri);
      var imageAlt = gContextMenu.target.alt;
      var imageAltHtml = htmlEscape(imageAlt);
      var imageTitle = gContextMenu.target.title;
      var imageTitleHtml = htmlEscape(imageTitle);
    }
    var eol = "\r\n";
    
    Cc["@mozilla.org/widget/clipboardhelper;1"]
      .getService(Ci.nsIClipboardHelper).copyString(convertText(text));
  }
  
  function setMenuDisplay(){
    for (var i = 0, menu; menu = mMenus[i]; i++)
      document.getElementById("copyurllite-menu-" + i).hidden =
        menu.condition == "select" ?
          !gContextMenu.isTextSelected :
        menu.condition == "link" ?
          !gContextMenu.onLink :
        menu.condition == "image" ?
          !gContextMenu.onImage :
        menu.condition == "select-link" ?
          !(gContextMenu.isTextSelected && gContextMenu.onLink) :
        menu.condition == "select-image" ?
          !(gContextMenu.isTextSelected && gContextMenu.onImage) :
        menu.condition == "link-image" ?
          !(gContextMenu.onLink && gContextMenu.onImage) :
        menu.condition == "select-link-image" ?
          !(gContextMenu.isTextSelected && gContextMenu.onLink && gContextMenu.onImage) : false;
  }
  
})();