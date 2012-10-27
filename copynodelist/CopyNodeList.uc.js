// ==UserScript==
// @name				Copy Node List
// @namespace	http://pomefox.blog79.fc2.com/blog-entry-93.html
// @description    コンテキストメニューのノードリストをクリップボードにコピーするメニュー
// @author			Pome
// @compatibility	Firefox 16
// @version			2012.10/13d
// @include			main
// ==/UserScript==
var ucjs_copymenulist = {

    // 出力される一覧からラベル名を取り除く: true, [false]
    LABEL_OFF: false,

    MENUS: [
        { id: "contentAreaContextMenu", label: "Kontextmenu" },
        { id: "tabContextMenu", label: "Tab Kontextmenu" },
        { id: "-" },
        { id: "appmenuPrimaryPane", label: "App Menu links" },
        { id: "appmenuSecondaryPane", label: "App Menu rechts" },
        { id: "-" },
        { id: "menu_FilePopup", label: "Datei" },
        { id: "menu_EditPopup", label: "Bearbeiten" },
        { id: "menu_viewPopup", label: "Ansicht" },
        { id: "goPopup", label: "Chronik" },
        { id: "bookmarksMenuPopup", label: "Lesezeichen" },
        { id: "menu_ToolsPopup", label: "Extras" },
        { id: "menu_HelpPopup", label: "Hilfe" },
    ],
    init:function() {
        var toolmenu = document.getElementById("menu_ToolsPopup");
        var menu = document.createElement("menu");
        menu.setAttribute("id", "ucjs_copymenulist_menu");
        menu.setAttribute("label", "Menüliste kopieren");
        toolmenu.appendChild(menu);
        var popup = document.createElement("menupopup");
        menu.appendChild(popup);

        for (var i = 0; i < this.MENUS.length; i++) {
            var menuitem = null;
            if(this.MENUS[i].id == "-") {
                menuitem = document.createElement("menuseparator");
                menuitem.className = "ucjs_copymenulist_sep";
            }else{
                menuitem = document.createElement("menuitem");
                menuitem.id = "ucjs_copymenulist_" + this.MENUS[i].id;
                menuitem.setAttribute("label", decodeURIComponent(escape(this.MENUS[i].label)));
                menuitem.setAttribute("oncommand", 'ucjs_copymenulist.copyText("' + this.MENUS[i].id + '");');
            }
            popup.appendChild(menuitem);
        }
    },
    copyText:function(id) {
        var list = []; targetpopup = document.getElementById(id);
        for (var i=0; i<targetpopup.childNodes.length; i++) {
            var selector = null, listitem = [];
            if(!!targetpopup.childNodes[i].id){
                selector = "#" + targetpopup.childNodes[i].id;
            }else{
                if(!!targetpopup.childNodes[i-1].id){
                    selector = "#" + targetpopup.childNodes[i-1].id + " + " + targetpopup.childNodes[i].tagName;
                }else{
                    if (id = "goPopup" && list[list.length-1][1] == "#startHistorySeparator + menuseparator"){
                        list.push(["menuitem", "#startHistorySeparator + menuseparator ~ menuitem"], ["menuseparator", "#goPopup > menuseparator:last-child"]);
                        break;
                    }
                    selector = list[list.length-1][1] + " + " + targetpopup.childNodes[i].tagName;
                }
            }
            if(!this.LABEL_OFF && !!targetpopup.childNodes[i].label){
                selector = selector + '[label="' + targetpopup.childNodes[i].label + '"]';
            }
            listitem.push(targetpopup.childNodes[i].tagName);
            listitem.push(selector);
            list.push(listitem);
        }
        var text = "";
        for (var i=0; i<list.length; i++) {
            if(list[i][0] == "menuseparator"){
                text = text + "\n" + list[i][1] + ",\n\n";
            }else{
                text = text + list[i][1] + ",\n";
            }
        }
        Components.classes["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Components.interfaces.nsIClipboardHelper)
        .copyString(text);

        //alert(decodeURIComponent(escape("Copy to Clipboard !"))); alertはなし
    },
};
ucjs_copymenulist.init();
