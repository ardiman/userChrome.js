// ==UserScript==
// @name saveas.uc.js
// @include chrome://mozapps/content/downloads/unknownContentType.xul
// ==/UserScript==

(function(){
        var saveas = document.getAnonymousElementByAttribute(document.querySelector("*"), "dlgtype", "extra1");
        saveas.setAttribute("hidden", "false");
        saveas.setAttribute("label", "Speichern als");
        saveas.setAttribute("oncommand", 'var mainwin=Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");mainwin.eval("("+  mainwin.internalSave.toString().replace("let ","").replace("var fpParams","fileInfo.fileExt=null;fileInfo.fileName=aDefaultFileName;var fpParams")+ ")")(dialog.mLauncher.source.asciiSpec,null,dialog.mLauncher.suggestedFileName);close()')
})();