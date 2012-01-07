# Direct Link
Das Skript behandelt **nicht** die klickbaren oder nicht klickbaren HTML-Links. Das Hauptkontextmenü bekommt einen neuen 
Eintrag "Direkt Link" mit einem Untermenü spendiert. Nach dem Markieren eines Wortes wird dieses nach dem Befehl "Öffnen" 
automatisch zu einem Url umgewandelt und als solcher im neuen Tab geöffnet. Welche Adresse daraus entsteht, hängt im 
Wesentlichen von der Useragent-Locale, die im deutschen Firefox und System immer de ist, und vor allem von dem Config-String 
`browser.fixup.alternate.suffix` ab. Man kann ausserdem noch bei Wikipedia (de) nachschlagen oder alles dem Zufall 
überlassen und "Auf gut Glück" suchen. Alles geht im neuen Tab auf.

Das **Ergebnis des Skripts**:

![Screenshot Direct Link](https://github.com/ardiman/userChrome.js/raw/master/directlink/scr_directlink.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.
