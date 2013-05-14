
/* Private Tool Menus */


[
{
"label" : "Cookies öffnen",
"accesskey": "C",
"oncommand": "window.open('chrome://browser/content/preferences/cookies.xul', 'Browser:Cookies', 'chrome,resizable=yes');"
},
{
"label" : "Passwörter öffnen",
"accesskey": "P",
"oncommand": "window.open('chrome://passwordmgr/content/passwordManager.xul', 'Toolkit:PasswordManager', 'chrome,resizable=yes');"
},
{
"label" : "Zertifikate öffnen",
"accesskey": "Z",
"oncommand": "window.open('chrome://pippki/content/certManager.xul', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=600,height=400');"
},
]
.forEach(function(attrs) {
var menuitem = document.createElement("menuitem");
for (var key in attrs)
menuitem.setAttribute(key, attrs[key]);
document.getElementById("menu_ToolsPopup").insertBefore(menuitem, document.getElementById("menu_preferences"));
});