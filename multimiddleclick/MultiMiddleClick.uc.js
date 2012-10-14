// ==UserScript==
// @name           multiMiddleClick.uc.js
// @namespace      http://script.bitcp.com/multimiddleclick
// @description    增强中键导航功能
// @author         zbinlin
// @homepage       http://bitcp.com
// @version        0.2b 修复主页按钮左键单击失效 bug
// @version        0.1b
// ==/UserScript==

var multiMiddleClick = {};

multiMiddleClick.init = function () {
    var backButton = document.getElementById("back-button");
    var forwardButton = document.getElementById("forward-button");

    var homeButton = document.getElementById("home-button");

    var reloadButton = document.getElementById("reload-button");
    var urlbarReloadButton = document.getElementById("urlbar-reload-button");
    var stopButton = document.getElementById("stop-button");
    var urlbarStopButton = document.getElementById("urlbar-stop-button");

    var self = this;
    if (backButton) {
        backButton.onclick = function () {};
        backButton.addEventListener(
            'click',
            function (event) {self.goNumbericURL(event, -1);},
            false
        );
    }
    if (forwardButton) {
        forwardButton.onclick = function () {};
        forwardButton.addEventListener(
            'click',
            function (event) {self.goNumbericURL(event, +1);},
            false
        );
    }

    if (homeButton) {
        var mouseState = 0;
        homeButton.onclick = function (event) {
            if (event.button != 1) BrowserGoHome(event);
        };
        homeButton.addEventListener("mousedown", function (event) {
            if (event.button == 1) {
                mouseState = 1;
                setTimeout(function() {mouseState = 0;}, 300);
            }
        }, true);
        homeButton.addEventListener("mouseup", function (event) {
            if (event.button == 1) self.goURL(mouseState);
        }, true);
    }

    if (reloadButton) {
        reloadButton.onclick = function () {};
        reloadButton.addEventListener("click", function (event) {
            self.reloadSkipCache(event);
        }, false);
    }
    if (urlbarReloadButton) {
        urlbarReloadButton.onclick = function () {};
        urlbarReloadButton.addEventListener("click", function (event) {
            self.reloadSkipCache(event);
        }, false);
    }
    if (stopButton) {
        stopButton.addEventListener("click", function (event) {
            self.reloadSkipCache(event);
        }, false);
    }
    if (urlbarStopButton) {
        urlbarStopButton.addEventListener("click", function (event) {
            self.reloadSkipCache(event);
        }, false);
    }
}

multiMiddleClick.goNumbericURL = function (aEvent, aIncrement) {
    if (aEvent.button != 1)
        return;
    var url = gBrowser.currentURI.spec;
    if (!url.match(/(\d+)(\D*)$/))
        return;
    var num = RegExp.$1;
    var digit = (num.charAt(0) == "0") ? num.length : null;
    num = parseInt(num, 10) + aIncrement;
    if (num < 0)
        return;
    num = num.toString();
    digit = digit - num.length;
    for (var i = 0; i < digit; i++)
        num = "0" + num;
    loadURI(RegExp.leftContext + num + RegExp.$2);
}
multiMiddleClick.goURL = function (flag) {
    if (flag) {
        var uri = gBrowser.currentURI;
        if (uri.path == '/')
            return;
        var pathList = uri.path.split('/');
        if (!pathList.pop())
            pathList.pop();
        loadURI(uri.prePath + pathList.join("/") + "/");
    } else {
        var host = window.content.document.location.host;
        var protocol = window.content.document.location.protocol;
        window.content.document.location = protocol + '//' + host;
    }
}

multiMiddleClick.reloadSkipCache = function (aEvent) {
    if (aEvent.button == 1)
        BrowserReloadSkipCache();
}

if (location == "chrome://browser/content/browser.xul") {
    multiMiddleClick.init();
}