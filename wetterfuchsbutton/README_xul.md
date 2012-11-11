# Wetterfuchsbutton
**Dies ist die Anleitung für das nicht mehr weiter entwickelte Skript im ux.xul-Format. Bitte nur noch die uc.js-Variante einsetzen!**

Dieses Skript ist auf jeden Fall nicht für Anfänger gedacht, da 3 Zeilen anzupassen sind und das optische Ergebnis durch 
Einbinden von 2 CSS-Dateien verschönert werden muss.

Das **Ergebnis des Skripts** (mit Bildern für Berlin- bzw. Brandenburg-Vorschau):

Im Groben funktioniert das Skript folgendermassen: Nach dem Browserstart gibt es in der Menubar einen kleinen Wetterbutton. 
Mit einem Linksklick auf den Button öffnet sich ein Menü mit Untermenüs mit einigen deutschen und europäischen Wetterkarten, 
sowie detaillierten aktuellen deutschen Wetterdaten und einer deutschen Wetterdatenkarte in 6 Tage-Vorschau:

![Screenshot Wetterfuchsbutton Menuebutton](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_menubutton.png)

Mit einem **Links-Doppelklick** auf den Button geht oben links ein kleines Fenster auf, in dem **lokale Wetterinfos** erscheinen. 
Dabei kann man bis zu 4 verschiedene Orte über eine kleine Searchbar suchen und wählen, die aber nur in der aktuellen 
Browsersession verbleiben. Nach dem Neustart gibt es wieder nur die eine eigene fest vergebene Adresse/Ort. Wetter gibts aktuell, 
für 2 Tage im 3 Std. Takt, 5 und 10 Tage Vorschau:

![Screenshot Wetterfuchsbutton Doppel-Linksklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_linksdoppelklick.png)

Über den **Rechtsklick** gibt es Wetter für nur eine vorher selbst **bestimmte Adresse/Ort**. Aktuell mit Details, für zwei Tage mit 
Details, 5 Tage Vorschau und umfangreiches Biowetter, sowie aktuelle lokale Warnmeldungen:

![Screenshot Wetterfuchsbutton Rechtsklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_rechtsklick.png)

Mit dem **Mittelklick** auf dem Button erscheint in der linken oberen Ecke ein kleines Fenster mit einer vorher selbst bestimmten 
Wetterdatenkarte seines **Bundeslandes** in 6 Tage-Vorschau:

![Screenshot Wetterfuchsbutton Mittelklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_mittelklick.png)

In allen geöffneten Wetterfenstern kann mit den Pfeiltasten der Tastatur gescrollt werden. Bei installierter Erweiterung 
"Smooth Wheel" klappt das Scrollen auch mit dem Mausrad.

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils und nehme folgende Anpassungen vor:

### Für den Rechtsklick (Wetterkontor Lokalwetter)
Als Erstes geht man auf http://www.wetterkontor.net , sucht über die Wettersuche-Searchbar dort nach einem "Wunschort". 
Nach deren Auswahl die URL kopieren und im Skript in der **Zeile Nr.23** zwischen die "" hinter `openDialog(` einfügen.

### Für den Doppel-Linksklick (MSN Lokalwetter)
Die gleiche Vorgehensweise für die zweite Wetterstation bei http://wetter.msn.com/sitemap.aspx . Nach der Wunschortauswahl 
wird die kopierte URL im Skript in die **Zeile Nr.76** zwischen die "" hinter `openDialog(` eingefügt. 

### Für den Mittelklick (Wetterkontor Bundeslandwetter)
Für das eigene Bundesland nimmt man dessen Url von http://www.wetterkontor.net und kopiert sie genau auf die gleiche Art und 
Weise, wie die beiden ersten in die **Zeile Nr.87** (Skript bitte am besten mit einem "vernünftigen" Editor bearbeiten, z.B. 
Notepad++).

### Das Aussehen der Wetterfenster
Zum Skript gehören zwei CSS Dateien, die am einfachsten entweder über das UserCSSLoader Skript oder die userChrome.css in den 
Firefox eingebunden werden. Falls die Erweiterung "Stylish" eingesetzt wird, muss jeweils die `namespace`-Zeile entfernt werden.