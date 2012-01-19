// ==UserScript==
// @name            diabled auto focus input element
// @namespace       http://script.bitcp.com/diabledFocus
// @description     禁止载入网页后自动聚焦到输入框
// @author          zbinlin
// @homepage        http://bitcp.com
// @version         0.0.4 添加 禁止 textarea 元素自动聚焦（同时还可以直接添加其他元素禁止自动聚焦）
// @version         0.0.3 修复 禁止使用 select 方法聚焦到输入框
// @version         0.0.2 更改 监控标签载入方式
// @version         0.0.1
// ==/UserScript==

if (location == "chrome://browser/content/browser.xul") {
    (function () {

        var disabledFocus = {
            resume: true,
            handleEvent: function (win) {
                var elems_proto_ = {};
                ("HTMLInputElement" in win && "prototype" in win.HTMLInputElement) && (elems_proto_["input"] = win.HTMLInputElement.prototype);
                ("HTMLTextAreaElement" in win && "prototype" in win.HTMLTextAreaElement) && (elems_proto_["textarea"] = win.HTMLTextAreaElement.prototype);
                for (i in elems_proto_) {
                    var focus = "__" + i + "Focus__";
                    var select = "__" + i + "Select__";
                    var proto = elems_proto_[i];
                    (focus in win) || (win[focus] = proto.focus);
                    (select in win) || (win[select] = proto.select);

                    function log(w1, w2) {
                        var str = "diabledFocusForInput.uc.js:\n  " + w1 + " element:  " + w2 + " mothed is disabled!";
                        try {
                            win.console.warn(str);
                        } catch(ex) {
                            Cu.reportError(str);
                        }
                    }
                    proto.focus = (function (i) {
                        return function () {
                            log(i, "focus");
                        }
                    })(i);
                    proto.select = (function (i) {
                        return function () {
                            log(i, "select");
                        }
                    })(i);
                }
                // 载入后延时恢复，如果发现无法禁止自动聚焦，可适当延长（主要是网速原因）
                // 如果要禁止恢复，可将上面 resume 的值改变 false
                if (this.resume) {
                    var tid = setTimeout(function () {
                        for (i in elems_proto_) {
                            var focus = "__" + i + "Focus__";
                            var select = "__" + i + "Select__";
                            var proto = elems_proto_[i];
                            proto.focus = win[focus];
                            proto.select = win[select];
                            delete win[focus];
                            delete win[select];
                        }
                    }, 5000); // 默认为 5s
                    win.addEventListener("unload", function () {
                        win.removeEventListener("unload", arguments.callee, false);
                        tid && clearTimeout(tid);
                    }, false);
                }
            },
            onLocationChange: function (aBrowser, webProgress, request, location) {
                var win = aBrowser.contentWindow.wrappedJSObject;
                this.handleEvent(win);
            }
        }
        /*
        if (gBrowser) {
            gBrowser.addEventListener("DOMContentLoaded", disabledFocus, true);
            window.addEventListener("unload", function () {
                window.removeEventListener("unload", arguments.callee, false);
                gBrowser.removeEventListener("DOMContentLoaded", disabledFocus, true);
            }, false);
        }
        */
        gBrowser.addTabsProgressListener(disabledFocus);
        
    })();
}
