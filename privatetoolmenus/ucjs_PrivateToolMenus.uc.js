
/* Private Tool Menus */


[
	{
		"label"    : "Show Cookies",
		"accesskey": "K",
		"oncommand": "window.open('chrome://browser/content/preferences/cookies.xul', 'Browser:Cookies', 'chrome,resizable=yes');"
	},
	{
		"label"    : "Show Passwords",
		"accesskey": "P",
		"oncommand": "window.open('chrome://passwordmgr/content/passwordManager.xul', 'Toolkit:PasswordManager', 'chrome,resizable=yes');"
	},
	{
		"label"    : "View Certificates",
		"accesskey": "E",
		"oncommand": "window.open('chrome://pippki/content/certManager.xul', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=600,height=400');"
	},
]
.forEach(function(attrs) {
	var menuitem = document.createElement("menuitem");
	for (var key in attrs)
		menuitem.setAttribute(key, attrs[key]);
	document.getElementById("menu_ToolsPopup").insertBefore(menuitem, document.getElementById("sanitizeItem"));
});
