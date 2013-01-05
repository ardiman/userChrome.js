// ==UserScript==
// @name           ChromeStatusbarModoki.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// @compatibility  Firefox 4
// @version        0.0.9
// @note           0.0.9 Remove E4X
// @note           Firefox 4 正式版に合わせて簡素化した
// ==/UserScript==
// Firefox 3.6 は古い Ver. を使ってください
// https://gist.github.com/300255/4144baa96f7b12d271fd3cc5b8017c038822fa12

(function(css) {
  if (typeof LinkTargetDisplay == "undefined") return;

  // Show/Hide delay. original: 70/150(ms)
  LinkTargetDisplay.DELAY_SHOW = 0;
  LinkTargetDisplay.DELAY_HIDE = 1000;

  // Cut "http://"
  XULBrowserWindow._overLink = "";
  XULBrowserWindow.__defineGetter__("overLink", function() {
    return this._overLink;
  });
  XULBrowserWindow.__defineSetter__("overLink", function(text) {
    if (text && text.indexOf('http://') === 0) {
      text = text.substr(7);
    }
    return this._overLink = text;
  });


  // Hide Animation
  if (!XULBrowserWindow.updateStatusField_org) {
    XULBrowserWindow.updateStatusField_org = XULBrowserWindow.updateStatusField;
  }
  eval("XULBrowserWindow.updateStatusField = " + XULBrowserWindow.updateStatusField_org.toString().replace(
    'field.setAttribute("crop", type == "overLink" ? "center" : "end");',
    'if (text) field.setAttribute("crop", type == "overLink" ? "center" : "end");'
  ));

  XULBrowserWindow.statusTextField.__defineGetter__('label', function() {
    return this.getAttribute("label");
  });
  XULBrowserWindow.statusTextField.__defineSetter__('label', function(str) {
    if (str) {
      this.setAttribute('label', str);
      this.style.opacity = 1;
    } else {
      this.style.opacity = 0;
      
      // 消えたら左側に帰ってきて欲しい
      setTimeout(function(){ XULBrowserWindow.statusTextField.removeAttribute('mirror'); }, 110);
    }
    return str;
  });


  // Statusbar in URLBar
  var urlbarIcons = document.getElementById('urlbar-icons');
  if (urlbarIcons) {
    var statusBar = document.getElementById('status-bar');
    urlbarIcons.insertBefore(statusBar, urlbarIcons.firstChild);
    statusBar.setAttribute('context', '');
  }

  addStyle(css);

  function addStyle(css) {
    var pi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
  }

})('\
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
\
.statusbar-resizerpanel {\
  display: none !important;\
}\
\
');
