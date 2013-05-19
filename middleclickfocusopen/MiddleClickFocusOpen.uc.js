// ==UserScript==
// @name                middle click focus open tab
// @id                  middleClickFocusOpen@zbinlin
// @namespace           http://script.mozcp.com/middle-click-focus-open
// @description         中键打开新标签页时，按单击中键时长来决定前台（即立即切换到新标签页）还是后台打开新标签页
// @include             chrome://browser/content/browser.xul
// @author              zbinlin
// @homepage            http://mozcp.com
// @supportURL          http://blog.mozcp.com/
// @contributionURL     https://me.alipay.com/zbinlin
// @contributionAmount  ￥2.00
// @version             0.0.1 初始化
// @version             0.0.2 添加 {ctrl + 中键} 在当前页打开，{shift + 中键} 在前台新标签页打开
// @version             0.0.3 修复 在“恢复关闭标签”菜单中功能失效
// @version             0.0.4 修复 与使用中键关闭当前标签页冲突
// @version             0.0.5 修复 由于 Fx 中中键关闭标签页时没有触发 click 事件导致的问题
// ==/UserScript==

"use strict";
if (location.href.contains("chrome://browser/content/browser.xul")) {
    (function (window, undefined) {

var document = window.document;

window.Services || Components.utils.import("resource://gre/modules/Services.jsm");

var MiddleClickFocusOpen = {
    timeout: 500, // 按下中键时长阈值
    state: false,
    inBackground: false,
    inCurrent: false,
    _BRANCHROOT: "uc.middleClickFocusOpen.",
    handleEvent: function (evt) {
        switch (evt.type) {
            case "mousedown":
                if (1 === evt.button) {
                    this._stay = this.state = true;
                    this._end = Date.now() + this.timeout;
                    this.inCurrent = evt.ctrlKey;
                }
                break;
            case "mouseup":
                if (1 === evt.button) {
                    this._stay = this.inBackground = (Date.now() <= this._end) && !evt.shiftKey && "tab" !== evt.target.localName;
                    let self = this;
                    setTimeout(function () {
                        self.reset();
                    }, 500);
                }
                break;
            case "click":
                let self = this;
                setTimeout(function () {
                    self.reset();
                }, 0);
                break;
            case "popuphiding":
                if (this._stay && "menupopup" === evt.target.localName) {
                    evt.preventDefault();
                }
                break;
            case "DOMContentLoaded":
                window.removeEventListener(evt.type, this, evt.bubbles);
                window.addEventListener("unload", this, false);
                window.addEventListener("mousedown", this, true);
                window.addEventListener("mouseup", this, true);
                window.addEventListener("click", this, false);
                window.addEventListener("popuphiding", this, true);
                this.register();
                break;
            case "unload":
                this.unregister();
                window.removeEventListener(evt.type, this, evt.bubbles);
                window.removeEventListener("mousedown", this, true);
                window.removeEventListener("mouseup", this, true);
                window.removeEventListener("click", this, false);
                window.removeEventListener("popuphiding", this, true);
                break;
        }
    },
    register: function () {
        var ps = Services.prefs;
        this._branch = ps.getBranch(this._BRANCHROOT);
        if (!("addObserver" in this._branch)) {
            this._branch.QueryInterface(Components.interfaces.nsIPrefBranch);
        }
        this._branch.addObserver("", this, false);
    },
    unregister: function () {
        this._branch.removeObserver("", this);
    },
    observe: function (aSubject, aTopic, aData) {
        switch (aData) {
            case "timeout":
                let defaultTimeout = 500;
                try {
                    this.timeout = this._branch.getIntPref(aData) || defaultTimeout;
                } catch (ex) {
                    Components.reportError("userChromeJS :: middleClickFocusOpen :: uc.middleClickFocusOpen.timeout :: TypeError\n" + ex);
                    this.timeout = defaultTimeout;
                }
                break;
        }
    },
    reset: function () {
        this.state = false;
        this._stay = false;
        this.inCurrent = false;
        this.inBackground = false;
    }

};
var openLinkIn = window.openLinkIn;
window.openLinkIn = function _openLinkIn(url, where, params) {
    if (MiddleClickFocusOpen.inCurrent) {
        where = "current";
    } else if (MiddleClickFocusOpen.state) {
        where = "tab";
        params.inBackground = MiddleClickFocusOpen.inBackground;
    }
    openLinkIn(url, where, params);
};
"object" === typeof window.gBrowser && Object.defineProperty(window.gBrowser, "selectedTab", {
    get: function () {
        return this.mCurrentTab;
    },
    set: function (val) {
        MiddleClickFocusOpen.inBackground || (this.mTabBox.selectedTab = val);
        //return this.mTabBox.selectedTab;
    },
    configurable: true,
    enumerable: true
});

window.addEventListener("DOMContentLoaded", MiddleClickFocusOpen, true);

    })(window);
}
