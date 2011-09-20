/*var UserChromeJSEditor = {
	init: function()
	{
		var menuitem = document.createElement("menuitem");
		menuitem.setAttribute("label", "Edit userChrome.js");
		menuitem.setAttribute("accesskey", "u");
		menuitem.setAttribute("oncommand", "UserChromeJSEditor.open();");
		
		var optionsitem = document.getElementById("menu_preferences");
		optionsitem.parentNode.insertBefore(menuitem, optionsitem);
	},

	open: function(aFileName, aAbsolutePath)
	{
		if (!aAbsolutePath)
		{
			var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsILocalFile);
			file.append(aFileName || "userChrome.js");
		}
		else
		{
			file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(aFilePath);
		}
		
		var info = Components.classes["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Components.interfaces.nsIMIMEService).getFromTypeAndExtension("text/plain", "txt");
		try
		{
			var editorPath = gPrefService.getCharPref("extensions.userchrome_js.editor");
		}
		catch (ex)
		{
			var nsIFilePicker = Components.interfaces.nsIFilePicker;
			var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
			
			filePicker.init(window, "Select userChrome.js editor path", nsIFilePicker.modeOpen);
			filePicker.appendFilters(nsIFilePicker.filterApps);
			
			if (filePicker.show() != nsIFilePicker.returnOK)
			{
				return;
			}
			
			editorPath = filePicker.file.path;
			gPrefService.setCharPref("extensions.userchrome_js.editor", editorPath);
		}
		
		try
		{
			var editor = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			editor.initWithPath(editorPath);
			
			info.preferredAction = info.useHelperApp;
			info.preferredApplicationHandler = editor;
			info.launchWithFile(file);
		}
		catch (ex)
		{
			info.preferredAction = info.useSystemDefault;
			info.launchWithFile(file);
		}
	}
};

UserChromeJSEditor.init();*/



(function() {
	var menuitem = document.createElement("menuitem");
	menuitem.setAttribute("label", "Open 'chrome' Folder");
	menuitem.setAttribute("accesskey", "h");
	menuitem.setAttribute("oncommand", 'Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsILocalFile).launch();');
	
	var optionsitem = document.getElementById("menu_preferences");
	optionsitem.parentNode.insertBefore(menuitem, optionsitem);
})();