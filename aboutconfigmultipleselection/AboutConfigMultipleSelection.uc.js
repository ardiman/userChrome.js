// ==UserScript==
// @name           About:config Multiple Selection
// @version        0.2
// @description    About:config多选操作
// @author         NightsoN
// @include        chrome://browser/content/browser.xul
// ==/UserScript==
window.addEventListener("DOMContentLoaded", function (event) {
    var doc = event.target;
    if (!doc || doc.location.href !== "about:config") return;
    content.document.getElementById("configTree").setAttribute("seltype", "multiple");

    content.window.getSelected = function () {
        var arr = [],
            i = 0,
            k = 0,
            j = content.view.selection.getRangeCount(),
            start = {},
            end = {};
        for (; i < j; i++) {
            content.view.selection.getRangeAt(i, start, end);
            for (k = start.value; k <= end.value; k++) {
                arr.push(content.gPrefView[k]);
            }
        }
        return arr;
    }

    content.window.ResetSelected = function () {
        content.getSelected().forEach(function (i) {
            content.gPrefBranch.clearUserPref(i.prefCol);
        })
    }

    content.window.copyPref = function () {
        var arr = [];
        content.getSelected().forEach(function (i) {
            arr.push(i.prefCol + ';' + i.valueCol);
        });
        content.gClipboardHelper.copyString(arr.join('\n'), document);
    }

    content.window.copyName = function () {
        var arr = [];
        content.getSelected().forEach(function (i) {
            arr.push(i.prefCol);
        });
        content.gClipboardHelper.copyString(arr.join('\n'), document);
    }

    content.window.copyValue = function () {
        var arr = [];
        content.getSelected().forEach(function (i) {
            arr.push(i.valueCol);
        });
        content.gClipboardHelper.copyString(arr.join('\n'), document);
    }

}, true);
