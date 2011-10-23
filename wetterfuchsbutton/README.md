# Wetterfuchsbutton
Dieses Skript ist auf jeden Fall nicht fuer Anfaenger gedacht, da 3 Zeilen anzupassen sind und das optische Ergebnis durch 
Einbinden von 2 CSS-Dateien verschoenert werden muss.

Das **Ergebnis des Skripts** (mit Bildern fuer Berlin- bzw. Brandenburg-Vorschau):

Im Groben funktioniert das Skript folgendermassen: Nach dem Browserstart gibt es in der Menuebar einen kleinen Wetterbutton. 
Mit einem Linksklick auf den Button oeffnet sich ein Menue mit Untermenues mit einigen deutschen und europaeischen Wetterkarten, 
sowie detaillierten aktuellen deutschen Wetterdaten und einer deutschen Wetterdatenkarte in 6 Tage-Vorschau:

![Screenshot Wetterfuchsbutton Menuebutton](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_menubutton.png)

Mit einem **Links-Doppelklick** auf den Button geht oben links ein kleines Fenster auf, in dem **lokale Wetterinfos** erscheinen. 
Dabei kann man bis zu 4 verschiedene Orte ueber eine kleine Searchbar suchen und waehlen, die aber nur in der aktuellen 
Browsersession verbleiben. Nach dem Neustart gibt es wieder nur die eine eigene fest vergebene Adresse/Ort. Wetter gibts aktuell, 
fuer 2 Tage im 3 Std. Takt, 5 und 10 Tage Vorschau:

![Screenshot Wetterfuchsbutton Doppel-Linksklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_linksdoppelklick.png)

Ueber den **Rechtsklick** gibt es Wetter fuer nur eine vorher selbst **bestimmte Adresse/Ort**. Aktuell mit Details, fuer zwei Tage mit 
Details, 5 Tage Vorschau und umfangreiches Biowetter, sowie aktuelle lokale Warnmeldungen:

![Screenshot Wetterfuchsbutton Rechtsklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_rechtsklick.png)

Mit dem **Mittelklick** auf dem Button erscheint in der linken oberen Ecke ein kleines Fenster mit einer vorher selbst bestimmten 
Wetterdatenkarte seines **Bundeslandes** in 6 Tage-Vorschau:

![Screenshot Wetterfuchsbutton Mittelklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_mittelklick.png)

In allen geoeffenten Wetterfenstern kann mit den Pfeiltasten der Tastatur gescrollt werden. Bei installierter Erweiterung 
"Smooth Wheel" klappt das Scrollen auch mit dem Mausrad.

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils und nehme folgende Anpassungen vor:

### Fuer den Rechtsklick (Wetterkontor Lokalwetter)
Als Erstes geht man auf http://www.wetterkontor.net , sucht ueber die Wettersuche-Searchbar dort nach einem "Wunschort". 
Nach deren Auswahl die URL kopieren und im Script in der **Zeile Nr.23** zwischen die "" hinter `openDialog(` einfuegen.

### Fuer den Doppel-Linksklick (MSN Lokalwetter)
Die gleiche Vorgehensweise fuer die zweite Wetterstation bei http://wetter.msn.com/sitemap.aspx . Nach der Wunschortauswahl 
wird die kopierte URL im Script in die **Zeile Nr.76** zwischen die "" hinter `openDialog(` eingefuegt. 

### Fuer den Mittelklick (Wetterkontor Bundeslandwetter)
Fuer das eigene Bundesland nimmt man dessen Url von http://www.wetterkontor.net und kopiert sie genau auf die gleiche Art und 
Weise, wie die beiden ersten in die **Zeile Nr.87** (Script bitte am besten mit einem "vernuenftigen" Editor bearbeiten, z.B. 
Notepad++).

### Das Aussehen der Wetterfenster
Zum Script gehoeren zwei CSS Dateien, die am einfachsten entweder ueber das UserCSSLoader Script oder die userChrome.css in den 
Firefox eingebunden werden. Falls die Erweiterung "Stylish" eingesetzt wird, muss jeweils die `namespace`-Zeile entfernt werden.