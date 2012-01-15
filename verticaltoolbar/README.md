# Vertical Toolbar
Ein interessantes Skript für die Besitzer von Widescreens, oder je nach Bedarf auch für kleinere Bildschirme. 
Das Skript erstellt eine neue zusätzliche vertikale Toolbar, mit vordefinierten, gängigen Menüpunkten 
(Lesezeichen, Chronik, neues Fenster/Tab, Downloads, Kopieren, Einfügen, Drucken, etc.). 
Die Reihenfolge, Browserposition: links, rechts, oben, unten, geteilt 
(in diesem Beispiel: Toolbar links, geteilt, grosse Buttons) der Optionen kann am Anfang des Skriptes verändert werden. 
Wenn man noch etwas anderes haben will, kann man es natürlich dazu packen. Nur wie diese Option in der Skriptsprache des 
Firefox genannt wird, sollte man wissen. Hilfreich dabei ist das Add-on "DOM Inspector". 

Die Standard-Buttons, deren Id man in dem Array `currentSet`hinzufügen will, müssen über 
`Ansicht/Symbolleisten/Anpassen` von der normalen Menüleiste entfernt werden. Andere Funktionen müssen ggf. über 
längere Skriptanweisungen programmiert werden. In dieser Version des Skriptes gibt es ab Zeile 78 zwei Beispiele.

Das **Ergebnis des Skripts**:

![Screenshot Vertical Toolbar](https://github.com/ardiman/userChrome.js/raw/master/verticaltoolbar/scr_verttoolbar.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.

