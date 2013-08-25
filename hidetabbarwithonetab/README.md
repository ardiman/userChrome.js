# HideTabbarWithOneTab
Das Skript basiert auf der gleichnamigen Erweiterung. Seit Firefox 23 kann man die Tableiste nicht mehr ausblenden, wenn nur ein 
Tab offen ist. Mit diesem Skipt umgeht man dieses Problem.

Das Skript setzt `browser.tabs.drawInTitlebar` auf `false`, da es sonst bei ausgeblendeter Menüleiste zu einer Überlagerung von 
Titelleiste und Navigationsleiste kommen kann.

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.
