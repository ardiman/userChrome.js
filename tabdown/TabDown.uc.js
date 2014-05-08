// ==UserScript==
// @name           标签栏down
// @namespace     tab@zhaibr.cc
// @description    适用火狐29新界面
// @version        1.0.20140311.1
// @updateURL     https://j.mozest.com/ucscript/script/117.meta.js
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/01/b4b4793a-06bd-339e-53ad-b889e719304b.jpg http://j.mozest.com/images/uploads/previews/000/00/01/thumb-b4b4793a-06bd-339e-53ad-b889e719304b.jpg
// ==/UserScript==
var tab = document.getElementById("TabsToolbar");
var nav = document.getElementById("nav-bar");
var tit = document.getElementById("toolbar-menubar");
var tool = document.getElementById("navigator-toolbox");
/* var book = document.getElementById("PersonalToolbar"); */ //neu
tool.insertBefore(nav,tab);
nav.appendChild(tit);
/* tab.appendChild(book); */ //neu
