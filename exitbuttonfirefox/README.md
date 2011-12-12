# Exit Button Firefox
Ein einfacher Button, um Firefox zu schließen. Das Skript setzt den Button ganz ans Ende der Navbar. Der Vorteil hierbei ist, dass man den Button 
zum Schließen des Browsers nach seinen Wünschen überall, bzw. in jede Toolbar einbauen kann. Der Button ist 16x16 groß, damit er überall gut passt. 
Um eine andere Toolbar für den Button zu wählen, braucht man nur im Skript in dieser Zeile 

    <toolbar id="nav-bar">

anstelle von `nav-bar` die richtige ID der anderen gewünschten Toolbar zu schreiben. Auch eine genauere Positionsbestimmung innerhalb der Toolbar 
ist möglich.

Das **Ergebnis des Skripts**:

![Screenshot Exit Button Firefox](https://github.com/ardiman/userChrome.js/raw/master/exitbuttonfirefox/scr_exitbuttonfirefox.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.
