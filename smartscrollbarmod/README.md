# SmartScrollbar_mod
Reduziert die Scrollbar auf einen grünen Strich, horizontal wie vertikal. Farbe und Dicke sind natürlich änderbar. Da man die horizontale Scrollbar 
wohl eher mal greifen will, kann man die beiden Werte hier z.B. auf 6px ändern.

Über das Extras-Menu lässt sich die Scrollbar de-/aktivieren, übernommen wird dies nach einem Reload des Tabs. Wird der Wert

    const HIDE_START     = true;

auf `false` gesetzt, so ist die Einstellung unter Extras (s. Screenshot) nach Neustart des Browser zunächst aus.

Anmerkung: Es wird nur die Scrollbar im Browserfenster verändert, in Einstellungsfenstern verbleibt die Original-Bildlaufleiste.

Das **Ergebnis des Skripts**:

![Screenshot SmartScrollbar_mod](https://github.com/ardiman/userChrome.js/raw/master/smartscrollbarmod/scr_smartscrollbarmod.png)


## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.