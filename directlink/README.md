# Direct Link
Das Skript behandelt **nicht** die klickbaren oder nicht klickbaren HTML-Links. Das Hauptkontextmenue bekommt einen neuen 
Eintrag "Direkt Link" mit einem Untermenue spendiert. Nach dem Markieren einen Wortes wird dieses nach dem Befehl "Oeffnen" 
automatisch zu einem Url umgewandelt und als solcher im neuen Tab geoeffnet. Welche Adresse daraus entsteht, haengt im 
Wesentlichen von der Useragent-Locale, die im deutschen Firefox und System immer de ist, und vor allem von dem Config-String 
`browser.fixup.alternate.suffix` ab. Man kann ausserdem noch bei Wikipedia (de) nachschlagen oder alles dem Zufall 
ueberlassen und "Auf gut Glueck" suchen. Alles geht im neuen Tab auf.

Das **Ergebnis des Skripts**:

![Screenshot Direct Link](https://github.com/ardiman/userChrome.js/raw/master/directlink/scr_directlink.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.
