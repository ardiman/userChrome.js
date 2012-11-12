# Wetterfuchsbutton
Dieses Skript ist auf jeden Fall nicht für Anfänger gedacht, da einige Zeilen anzupassen sind und das optische Ergebnis durch 
Einbinden von 2 CSS-Dateien verschönert werden muss.

Im Groben funktioniert das Skript folgendermassen: Nach dem Browserstart muss der Button "Wetterfuchs" über "Anpassen" in die gewünschte 
Leiste gezogen werden. Mit einem Linksklick auf den Button öffnet sich ein Menü mit Untermenüs mit einigen deutschen und europäischen Wetterkarten, 
sowie detaillierten aktuellen deutschen Wetterdaten und einer deutschen Wetterdatenkarte in 6 Tage-Vorschau usw. Sobald ein Panel angezeigt wird, 
öffnet ein Mittelklick darauf die Adresse in einem extra Tab.

Das **Ergebnis des Skripts** (mit Bildern für Berlin- bzw. Brandenburg-Vorschau) mit ausgeblendetem Dropmarker (s. unten):

![Screenshot Wetterfuchsbutton Menue](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_menu.png)

Mit einem **Links-Doppelklick** auf den Button öffnet ein Panel, in dem **lokale Wetterinfos** erscheinen. 

![Screenshot Wetterfuchsbutton Doppel-Linksklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_linksdoppelklick.png)

Über den **Rechtsklick** gibt es Wetter für nur eine vorher selbst **bestimmte Adresse/Ort**. Aktuell mit Details und - sofern man scrollen kann 
(s. unten) - für zwei Tage mit Details, 5 Tage Vorschau und umfangreiches Biowetter, sowie aktuelle lokale Warnmeldungen:

![Screenshot Wetterfuchsbutton Rechtsklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_rechtsklick.png)

Mit dem **Mittelklick** auf dem Button erscheint ein Panel mit einer vorher selbst bestimmten Wetterdatenkarte seines **Bundeslandes** in 
6 Tage-Vorschau:

![Screenshot Wetterfuchsbutton Mittelklick](https://github.com/ardiman/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_mittelklick.png)

In allen geöffneten Wetterfenstern kann mit den Pfeiltasten der Tastatur gescrollt werden. Bei installierten Erweiterungen wie z.B. 
"Smooth Wheel" oder "Yet Another Smooth Scrolling" klappt das Scrollen auch mit dem Mausrad.

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und füge den Button über "Anpassen" zur gewünschten Symbolleiste hinzu.

Die zu öffnenden Seiten werden im Objekt `urlobj` ab **Zeile 10** angegeben. Neben dem Bezeichner werden die Adresse (url), Breite (width) und 
Höhe (width) eingetragen. Anhand des Bezeichners ist zu erkennen, welche Aktion bzw. welcher Menüpunkt definiert wird. Es folgt eine Auswahl der 
Bezeichner, die angepasst werden sollten.

### Für den Rechtsklick (Wetterkontor Lokalwetter)
Als Erstes geht man auf http://www.wetterkontor.net , sucht über die Wettersuche-Searchbar dort nach einem "Wunschort". Nach deren Auswahl die URL 
kopieren und im Objekt `urlobj` den Bezeichner `MO_Rechtsklick` suchen, anschliessend die Adresse zwischen den `""` hinter `url:` einfügen.

### Für den Doppel-Linksklick (MSN Lokalwetter)
Die gleiche Vorgehensweise für die zweite Wetterstation bei http://wetter.msn.com/sitemap.aspx . Nach der Wunschortauswahl wird die kopierte URL für 
den Bezeichner `MO_Doppelklick` eingetragen.

### Für den Mittelklick (Wetterkontor Bundeslandwetter)
Für das eigene Bundesland nimmt man dessen Url von http://www.wetterkontor.net und kopiert sie genau auf die gleiche Art und Weise, wie die beiden 
ersten, dieses Mal verändert man den Eintrag des Bezecihners `MO_Mittelklick`.

### Regionales Wetter
Hier lauten die Bezeichner `RE_WetterAktuell`, `RE_Vorhersage`, `RE_Wetterwarnungen`, `RE_RegenradarAktuell` und `RE_RegenradarPrognose`.

## Das Aussehen der Wetterfenster
Zum Skript gehören zwei CSS Dateien, die am einfachsten entweder über das "UserCSSLoader" Skript oder die userChrome.css in den 
Firefox eingebunden werden. Falls die Erweiterung "Stylish" eingesetzt wird, muss jeweils die `namespace`-Zeile entfernt werden.

## Ausblenden des Dropmarkers
Wer den Menüdropmarker am Button nicht haben möchte, muss ihn mit einem separaten CSS Code ausblenden:

    @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
    @-moz-document url(chrome://browser/content/browser.xul) {
      #wetterfuchs-toolbarbutton > dropmarker {
        display: none;
      }
    }

Benutzer anderer Themes wie z.B. "Silvermel" probieren es hiermit:

    @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
    @-moz-document url(chrome://browser/content/browser.xul) {
      #wetterfuchs-toolbarbutton .toolbarbutton-menu-dropmarker {
        display: none;
      }
    }