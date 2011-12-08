(function () {
	if (location != "chrome://mozapps/content/downloads/unknownContentType.xul") return;
	document.querySelector("#mode").addEventListener("select", function () {
		if (dialog.dialogElement("save").selected) {
			if (!document.querySelector("#locationtext")) {
				var locationtext = document.querySelector("#location").parentNode.insertBefore(document.createElement("textbox"), document.querySelector("#location"));
				locationtext.id = "locationtext";
				locationtext.setAttribute("style", "margin-top:-2px;margin-bottom:-3px");
				locationtext.value = document.querySelector("#location").value;
			}
			document.querySelector("#location").hidden = true;
			document.querySelector("#locationtext").hidden = false;
		} else {
			document.querySelector("#locationtext").hidden = true;
			document.querySelector("#location").hidden = false;
		}
	}, false)
	window.addEventListener("dialogaccept", function () {
		if ((document.querySelector("#locationtext").value != document.querySelector("#location").value) && dialog.dialogElement("save").selected) {
			dialog.mLauncher.saveToDisk(dialog.promptForSaveToFile(dialog.mLauncher,window,document.querySelector("#locationtext").value),1);
			dialog.onCancel=function(){};
			document.documentElement.removeAttribute("ondialogaccept");
		}
	}, false);
})()