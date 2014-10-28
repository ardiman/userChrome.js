(function (){
    var contextMenu = document.getElementById("contentAreaContextMenu");
    var translate = document.createElement("menuitem");
    translate.setAttribute("id", "context-translate");
    translate.setAttribute("label", "Übersetzen");
    translate.setAttribute("oncommand","_translate()");
	
    contextMenu.insertBefore(translate, document.getElementById("context-sep-viewbgimage"));
})();


function _translate() {
    var t = getBrowserSelection();
    var e = (document.charset || document.characterSet);
	var href = content.location;
    if (t != '') {
        gBrowser.loadOneTab('http://translate.google.com/translate_t?hl=de-DE#auto|de-DE|' + t, null, null, null, false, false);
    } else {
        gBrowser.loadOneTab('http://translate.google.com/translate?u=' + escape(href) + '&hl=de-DE&ie=' + e + '&sl=auto&tl=de-DE', null, null, null, false, false);
    };
}


