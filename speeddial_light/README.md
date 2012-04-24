# Speeddial_light
Ein Skript, anlehnend auf das fast gleichnamige Add-on. Öffnet man einen neuen Tab, lassen sich ausgewählte Webseiten direkt ansurfen.

Standard sind 9 Webseiten (3x3), dieser Wert lässt sich aber beliebig verändern. Dazu muss man in den Zeilen 30 und 31 des Skriptes die prozentuale 
Ausdehnung eines Elementes angeben, will man z.B. 4x4, gibt man je 25% an. Da das Fenster nicht ganz ausgenutzt wird, sollte man etwas kleinere Werte 
verwenden, z.B. 24% reichen schon.

Das **Ergebnis des Skripts**:

![Screenshot Speeddial_light](https://github.com/ardiman/userChrome.js/raw/master/speeddial_light/scr_speeddial_light.png)


## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.

## Hinweis
Speeddial_light stört die Funktion des Skriptes [WebScreenShot](https://github.com/ardiman/userChrome.js/tree/master/webscreenshot).

**Anmerkung**: Das Skript ist seit Firefox 12 überflüssig, wenn man mit dem Ergebnis des Automatismus mittels `browser.newtabpage.enabled` auf 
`true` und `browser.newtab.url` auf `about:newtab` zufrieden ist.