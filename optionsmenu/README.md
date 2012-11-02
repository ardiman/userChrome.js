# Options Menu
Es gibt einen neuen Menüpunkt unter "Extras", über dem man direkt an die Einstellungsoptionen aller installierten 
Add-ons, die diese haben, gelangt. Ausserdem gibt es einen Button, der neben der Searchbar eingesetzt wird.

Durch Anpassung der folgenden Zeilen lässt sich der Dropmarker (s. Pfeil im Screenshot) bzw. das gesamte Puzzle-Symbol daneben ausblenden

    SHOW_BUTTON:		true,
    MENU_BUTTON:		true,

Die Anzeige der Erweiterungen kann über den Wert

    LIST_DISPLAY: 1,

geregelt werden. Mit `0` werden nur die Erweiterungen aufgeführt, die aktiviert sind und Einstellungen besitzen. `1` listet auch Erweiterungen auf, 
die keine Einstellungen ermöglichen. Mit `2` werden außerdem die deaktivierten Erweiterungen berücksichtigt, unabhängig davon, ob sie ein 
Einstellungsfenster besitzen, oder nicht.


Weitere mögliche Anpassungen (z.B. kleineres Puzzlesymbol) werden unter http://www.camp-firefox.de/forum/viewtopic.php?f=16&t=94691 
diskutiert.

Das **Ergebnis des Skripts** ist im Screenshot zu sehen:

![Screenshot Options Menu](https://github.com/ardiman/userChrome.js/raw/master/optionsmenu/scr_optmen.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.