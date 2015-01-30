# RemovePrintTime
Dieses Skript sorgt dafür, dass bei einem Ausdruck die Uhrzeit nicht gedruckt wird, indem die möglichen about:config-Einträge gescannt und ggf. 
die Einstellung "Uhrzeit/Datum" durch das aktuelle Datum ohne Uhrzeit (also "Benutzerdefiniert") ersetzt werden.

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. Passe die Namen der Drucker in Zeile 10 an. Bei Netzwerkdruckern, die bei der Suche nach 
`printer.print` unter `about:config` als `printer.print.\\Servername\Druckerfreigabe` zu sehen sind, müssen die Backslashs verdoppelt werden 
(`\\\\Servername\\Druckerfreigabe`).