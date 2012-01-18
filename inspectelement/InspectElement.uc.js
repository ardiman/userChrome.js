// ==UserScript==
// @name            inspectElement
// @namespace       inspectElement@zbinlin
// @description     shift + 右键 在 DOM Inspector 中查找并定位到相应的元素节点
// @author          zbinlin
// @homepage        http://www.czcp.co.cc
// @version         0.0.2 将 click 事件由冒泡型改为捕获型
// @version         0.0.1
// ==/UserScript==

Components.utils.import("resource://gre/modules/AddonManager.jsm");

var inspectElement = {
    disabled: true,
    handleEvent: function (e) {
        if (!e.shiftKey || e.button != 2) return;
        e.stopPropagation();
        e.preventDefault();
        var elem = e.originalTarget;
        if (this.disabled) return alert("\u8BF7\u68C0\u67E5 DOM Inspector \u662F\u5426\u5B89\u88C5\u6216\u7981\u7528\u4E86\uFF01");
        window.openDialog("chrome://inspector/content/", "_blank",
                          "chrome, all, dialog=no", elem);
        this.closePopup(elem);
    },
    closePopup: function (elem) {
        var parent = elem.parentNode;
        var list = [];
        while (parent != window && parent != null) {
            if (parent.localName == "menupopup") {
                list.push(parent);
            }
            parent = parent.parentNode;
        }
        var len = list.length;
        if (!len) return;
        list[len - 1].hidePopup();
    }
};

AddonManager.getAllAddons(function (addons) {
    for (i in addons) {
        if (addons[i].id == "inspector@mozilla.org" && addons[i].isActive) {
            inspectElement.disabled = false;
            break;
        }
    }
});

window.addEventListener("click", inspectElement, true);
window.addEventListener("unload", function (e) {
    window.removeEventListener("unload", arguments.callee, false);
    window.removeEventListener("click", inspectElement, true);
}, false);
