// Console in Tab.....................................................
document.getElementById("javascriptConsole").setAttribute("oncommand", 'getBrowser (). selectedTab = getBrowser (). addTab ("chrome://global/content/console.xul")');
document.getElementById("appmenu_errorConsole").setAttribute("oncommand", 'getBrowser (). selectedTab = getBrowser (). addTab ("chrome://global/content/console.xul")');

// fuer Benutzer der Erweiterung "Web Developer"
// document.getElementById("webdeveloper-error-console-toolbar").setAttribute("oncommand", 'getBrowser (). selectedTab = getBrowser (). addTab ("chrome://global/content/console.xul")');
