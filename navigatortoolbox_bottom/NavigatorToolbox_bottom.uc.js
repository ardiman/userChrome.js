// 0.Navigator Toolbox komplett
//try {
//    var vbox = document.createElement('vbox');
//    document.getElementById("navigator-toolbox").parentNode.insertBefore(
//        vbox, document.getElementById("browser-bottombox"));
//    vbox.appendChild(document.getElementById("navigator-toolbox"));
//}catch(e) {}

// 4.Lesezeichenleiste
try {
    var vbox = document.createElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
        vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("PersonalToolbar"));
}catch(e) {}

// 5.Tableiste
try {
    var vbox = document.createElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
        vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("TabsToolbar"));
}catch(e) {} 

// 1.Titelleiste bei deaktivierten Menübar
try {
    var vbox = document.createElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
        vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("titlebar"));
}catch(e) {}

// 2.Menübar
try {
    var vbox = document.createElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
        vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("toolbar-menubar"));
}catch(e) {}

// 3.Navigationsleiste
try {
    var vbox = document.createElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
        vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("nav-bar"));
}catch(e) {}
