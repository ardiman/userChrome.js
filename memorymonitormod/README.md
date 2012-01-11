# Memory Monitor Mod
Dieses Skript erstellt eine kleine Anzeige in der Statusbar, die über den momentanen Speicherverbrauch des Browsers informiert. Im Tooltip werden 
einige Werte getrennt aufgeführt. Mit einem Klick auf die Anzeige wird *about:memory* in einem Tab geöffnet. Je nach Speicherauslastung und dem Wert 
von `_maxMemory` verändert sich die Hintergrundfarbe der Anzeige.

Falls gewünscht, kann  mit `_autoRestart: true,` ein automatischer Restart ausgeführt werden (**Vorsicht!** - Hiervon wird abgeraten, da bei 
fehlerhafter Konfiguration der Browser in eine Neustart-Schleife geraten kann).

Das **Ergebnis des Skripts**:

![Screenshot Memory Monitor Mod](https://github.com/ardiman/userChrome.js/raw/master/memorymonitormod/scr_memorymonitormod.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und passe die Konfiguration in den Zeilen 14 bis 22 an.

