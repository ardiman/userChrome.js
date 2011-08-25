/*===========????????================*/

var bookmarksMenu = document.getElementById("bookmarksMenu");
var mainContextMenu = document.getElementById("contentAreaContextMenu");
mainContextMenu.insertBefore(bookmarksMenu, mainContextMenu.firstChild);

    /*===========??????????================*/

var menubar = document.getElementById("main-menubar");
var mainContextMenu = document.getElementById("contentAreaContextMenu");
var menu = mainContextMenu.insertBefore(document.createElement("menu"), mainContextMenu.firstChild);
var menupopup = menu.appendChild(document.createElement("menupopup"));
Array.slice(menubar.childNodes).forEach(function(aNode) menupopup.appendChild(aNode));
menu.setAttribute("label", "Main Menu");