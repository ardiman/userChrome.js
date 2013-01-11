// ==UserScript==
// @name           colorfulTab.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @version        ä¸‹æ›¸ã1
// @compatibility  Firefox 4
// ==/UserScript==

(function(css_temp){

// ä½¿ã†è‰²ã®æ•° default:10, min:2, max:15
const PALETTE_LENGTH = 10; 

// ãƒ‰ãƒ¡ã‚¤ãƒ³æ¯Žã«è‰²ã‚’å¤‰ãˆã‚‹ã‹ã€‚ default:false
const DOMAIN = false;


if (window.colorfulTab) {
  window.colorfulTab.destroy();
}


window.colorfulTab = {
  PALETTE_LENGTH: PALETTE_LENGTH,
  DOMAIN: DOMAIN,

  init: function() {
    if (typeof this.PALETTE_LENGTH != "number" || 
        this.PALETTE_LENGTH > 15 || 
        this.PALETTE_LENGTH < 2) {
      this.PALETTE_LENGTH = 10;
    }
    var css = [];
    for(var i = 0, c = 0; c < 360; i++, c += this.PALETTE_LENGTH) {
      let s = css_temp.replace(/\%COLOR\%/g, parseInt(c, 10)).replace(/\%NUMBER\%/g, i);
      css.push(s);
    }   
    this.css = css.join('\n\n');
    this.style = addStyle(this.css);

    if (this.DOMAIN) {
      gBrowser.mPanelContainer.addEventListener("DOMContentLoaded", this, false);
    } else {
      gBrowser.mTabContainer.addEventListener("TabOpen", this, false);
    }
    
    this.setColorAllTabs();
  },
  uninit: function() {
    if (this.DOMAIN) {
      gBrowser.mPanelContainer.removeEventListener("DOMContentLoaded", this, false);
    } else {
      gBrowser.mTabContainer.removeEventListener("TabOpen", this, false);
    }
  },
  destroy: function() {
    Array.forEach(gBrowser.mTabs, function(e) e.removeAttribute("colorful"));
    this.style.parentNode.removeChild(this.style);
    this.uninit();
  },
  handleEvent: function(event) {
    switch(event.type){
    case "DOMContentLoaded":
      var win = event.target.defaultView;
      if (win != win.parent) return;

      var index = gBrowser.getBrowserIndexForDocument(event.target);
      if (index === -1) return;

      var host = win.location.host;
      if (!host) return gBrowser.mTabs[index].removeAttribute("colorful");

      var num = 0;
      for (var i = 0, len = host.length; i < len; i++) {
        num += host.charCodeAt(i);
      };
      
      this.setColor(gBrowser.mTabs[index], num%this.PALETTE_LENGTH);
      break;
    case "TabOpen":
      this.setColor(event.target, Math.floor(Math.random() * this.PALETTE_LENGTH));
      break;
    }
  },
  setColor: function(tab, num) {
    if (typeof num == "number") {
      tab.setAttribute("colorful", num);
    } else {
      tab.removeAttribute("colorful");
    }
  },
  setColorAllTabs: function() {
    Array.slice(gBrowser.mTabs).forEach(function(tab) {
      if (this.DOMAIN) {
        var host = tab.linkedBrowser.contentWindow.location.host
        if (!host) return gBrowser.mTabs[index].removeAttribute("colorful");

        var num = 0;
        for (var i = 0, len = host.length; i < len; i++) {
          num += host.charCodeAt(i);
        };
        this.setColor(tab, num%this.PALETTE_LENGTH);
      } else {
        this.setColor(tab, Math.floor(Math.random() * this.PALETTE_LENGTH));
      }
    }, this);
  }
};

window.colorfulTab.init();


function $(id) { return document.getElementById(id); }
function addStyle(css) {
  var pi = document.createProcessingInstruction(
    'xml-stylesheet',
    'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
  );
  return document.insertBefore(pi, document.documentElement);
}

})('\
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
.tabbrowser-tab[colorful="%NUMBER%"] {\
  color: #000 !important;\
  background-image:\
    -moz-linear-gradient(center bottom, rgba(26, 26, 26, 0.4) 1px, transparent 1px),\
    -moz-linear-gradient(hsla(%COLOR%,100%,75%,.3), hsla(%COLOR%,100%,65%,.3) 40%, hsla(%COLOR%,100%,55%,.3) 50%, hsla(%COLOR%,100%,50%,.3)),\
    -moz-linear-gradient(-moz-dialog, -moz-dialog) !important;\
}\
.tabbrowser-tab[colorful="%NUMBER%"]:hover {\
  color: #000 !important;\
  background-image:\
    -moz-linear-gradient(center bottom, rgba(26, 26, 26, 0.4) 1px, transparent 1px),\
    -moz-linear-gradient(hsla(%COLOR%,100%,75%,.5), hsla(%COLOR%,100%,65%,.5) 40%, hsla(%COLOR%,100%,55%,.5) 50%, hsla(%COLOR%,100%,50%,.5)),\
    -moz-linear-gradient(-moz-dialog, -moz-dialog) !important;\
}\
.tabbrowser-tab[colorful="%NUMBER%"][selected="true"] {\
  color: #000 !important;\
  background-image:\
    -moz-linear-gradient(hsla(%COLOR%,100%,75%,.7), hsla(%COLOR%,100%,65%,.7) 40%, hsla(%COLOR%,100%,55%,.7) 50%, hsla(%COLOR%,100%,50%,.7)),\
    -moz-linear-gradient(-moz-dialog, -moz-dialog) !important;\
}\
\
');
