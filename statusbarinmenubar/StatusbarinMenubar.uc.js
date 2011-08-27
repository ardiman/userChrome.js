/* Statusbar in Menubar (or urlbar, choose element thanks to its ID) */
//var statusbar = document.getElementById("status-bar");
var statusbar = document.getElementById("addon-bar");
var menubar = document.getElementById("toolbar-menubar");

menubar.appendChild(statusbar);
statusbar.setAttribute("style", "-moz-appearance: toolbar;");
statusbar.setAttribute("flex", "1");


document.getElementById("urlbar").addEventListener("mouseover",function(){XULBrowserWindow.setOverLink("",null)},false);
