location=="chrome://mozapps/content/downloads/unknownContentType.xul"&&(function (s) {
	s.value = dialog.mLauncher.source.spec;
	s.setAttribute("crop", "center");
	s.setAttribute("tooltiptext", dialog.mLauncher.source.spec);
	s.addEventListener("dblclick", function(){ Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(dialog.mLauncher.source.spec)} , false)
})(document.querySelector("#source"))
