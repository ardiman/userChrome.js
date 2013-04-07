// ==UserScript==
// @name            url-addon-bar
// @namespace       urlAddonBar@zbinlin
// @description     将附加组件栏移到地址栏
// @include         chrome://browser/content/browser.xul
// @author          zbinlin
// @homepage        http://bitcp.com
// @version         0.1.2 修改 按钮图标最宽改为 18px（防止图标撑宽变扁）
// @version         0.1.1 修改 恢复下拉箭头显示（主要是有些下拉菜单必须要下拉箭头才可以显示）
// @version         0.1.0 删除 关闭按钮事件
// @version         0.0.9 修改 将附加组件栏的 min-height 改成 max-height，其值为 22px
// @version         0.0.8 修复 Firefox 10 图标向下偏
// @version         0.0.7 修复 FxChrome 主题的的附加组件栏背景与地址栏背景不一致 bug
// @version         0.0.6 修复 无法还原附加组件栏 bug
// @version         0.0.5 定制工具栏时，自动还原附加组件栏
// @version         0.0.4 隐藏附加组件栏分隔条
// @version         0.0.3 修改附加组件栏按钮背景
// @version         0.0.2 将地址栏的附加组件栏背景改为透明
// @version         0.0.1
// ==/UserScript==

if (location == "chrome://browser/content/browser.xul") {
    (function (win) {
        function $(id) {
            return document.getElementById(id);
        }
        var cssStr = " \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker { \
    border-style: none !important; \
    box-shadow: none !important; \
    padding: 0 0 0 1px !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-menu-dropmarker { \
  display: none !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-icon, \
#urlbar-icons > #addon-bar .toolbarbutton-menubutton-dropmarker > .dropmarker-icon { \
  padding: 0 !important; \
  background: none !important; \
  border-color: transparent !important; \
  box-shadow: none !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-menubutton-dropmarker::before { \
  content: ''; \
  display: -moz-box; \
  width: 0px !important; \
  -moz-margin-end: -1px; \
} \
#urlbar-icons > * { \
    padding: 0 3px !important; \
} \
#urlbar-icons > #addon-bar, \
#urlbar-icons > #addon-bar > #status-bar { \
    -moz-appearance: none !important; \
    height: 18px !important; \
    min-height: 18px !important; \
    border-style: none !important; \
    background: transparent !important; \
    -moz-box-align: center !important; \
    padding: 0 !important; \
    margin: 0 !important; \
    box-shadow: none !important; \
} \
#urlbar-icons > #addon-bar > toolbaritem { \
    -moz-box-align: center !important; \
    -moz-box-pack: center !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-1, \
#urlbar-icons > #addon-bar statusbarpanel, \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button { \
    -moz-appearance: none !important; \
    border-style: none !important; \
    border-radius: 0 !important; \
    padding: 0 3px !important; \
    margin: 0 !important; \
    background: transparent !important; \
    box-shadow: none !important; \
    -moz-box-align: center !important; \
    -moz-box-pack: center !important; \
} \
#urlbar-icons > #addon-bar > .toolbarbutton-1, \
#urlbar-icons > #addon-bar > #status-bar > statusbarpanel { \
    min-width: 18px !important; \
    min-height: 18px !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-icon, \
#urlbar-icons > #addon-bar > #status-bar > statusbarpanel > .statusbarpanel-icon { \
    max-width: 18px !important; \
    padding: 0 !important; \
    margin: 0 !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button, \
#urlbar-icons > #addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button > .toolbarbutton-icon { \
    padding: 0 !important; \
    margin: 0 !important; \
} \
#urlbar-icons > #addon-bar .toolbarbutton-1:not([disabled='true']):hover, \
#urlbar-icons > #addon-bar .toolbarbutton-1:not([disabled='true'])[type='menu-button']:hover, \
#urlbar-icons > #addon-bar .toolbarbutton-1:not([disabled='true'])[open='true'], \
#urlbar-icons > #addon-bar .toolbarbutton-1:not([disabled='true'])[type='menu-button'][open='true'], \
#urlbar-icons > #addon-bar > #status-bar statusbarpanel:not([disabled='true']):hover, \
#urlbar-icons > #addon-bar > #status-bar statusbarpanel:not([disabled='true'])[open='true'] { \
    background-image: -moz-linear-gradient(rgba(242, 245, 249, 0.95), rgba(220, 223, 225, 0.67) 49%, rgba(198, 204, 208, 0.65) 51%, rgba(194, 197, 201, 0.3)) !important; \
} \
#urlbar-icons > #addon-bar #addonbar-closebutton, \
#urlbar-icons > #addon-bar toolbarspring, \
#urlbar-icons > #addon-bar toolbarspacer, \
#urlbar-icons > #addon-bar toolbarseparator, \
#urlbar-icons > #addon-bar > #status-bar > .statusbar-resizerpanel { \
    display: none !important; \
} \
}";


        var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
        var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(cssStr));
        sss.loadAndRegisterSheet(uri,sss.AGENT_SHEET);
        var urlbarIcons = $("urlbar-icons");
        var addonBar = $("addon-bar");
        var browserBottombox = $("browser-bottombox");
        win.urlAddonBar = {
            init: function () {
                this._isInUrlbar = false;
                this.toggleUA();
                win.addEventListener("beforecustomization", this, true);
            },
            handleEvent: function (e) {
                switch (e.type) {
                    case "aftercustomization" :
                        win.removeEventListener(e.type, this, false);
                        break;
                    case "beforecustomization" :
                        win.addEventListener("aftercustomization", this, false);
                        break;
                }
                this.toggleUA();
            },
            toggleUA: function () {
                if (this._isInUrlbar) {
                    browserBottombox.appendChild(addonBar);
                    addonBar.setAttribute("context", "toolbar-context-menu");
                    addonBar.setAttribute("toolboxid", "navigator-toolbox");
                } else {
                    urlbarIcons.insertBefore(addonBar, urlbarIcons.firstChild);
                    addonBar.removeAttribute("context");
                    addonBar.removeAttribute("toolboxid");
                }
                this._isInUrlbar = !this._isInUrlbar;
            }
        };
        win.urlAddonBar.init();
        win.addEventListener("unload", function (e) {
            win.removeEventListener("unload", arguments.callee, false);
            win.removeEventListener("beforecustomization", win.urlAddonBar, true);
            delete win.urlAddonBar;
        }, false);
    })(this);
}