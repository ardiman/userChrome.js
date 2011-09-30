# Einleitung
Hier entsteht eine Sammlung fuer die Firefox-Erweiterung userChrome.js. 

Fast alle Skripte wurden im deutschen Firefox-Forum vorgestellt bzw. dort angepasst.

Fuer GitHub werden die Skripte in Unterordnern mit entsprechenden README-Dateien abgelegt. Es handelt sich dabei um 
Textdateien im markdown-Format mit der Dateiendung `md`. Screenshots bis zum 30.09.2011 wurden im Firefox 6 erstellt. 
Die Ergebnisse der fuer neuere Firefox-Versionen aktualisierten Skripte sehen vielleicht ein wenig anders aus. Die Screenshots 
werden nur bei extremen Unterschieden aktualisiert. 

# Testumgebung
Win XP SP 3/ Firefox 7
Win XP SP 3/ Firefox 6

Sollte ein Skript nicht funktionieren, bitte im Quelltext nachschauen, was in der jeweiligen Firefoxversion angepasst 
werden muss bzw. in der Historie des Skriptes stoebern.

# Installation
Zur Installation der Skripte im Firefox muss bei vorhandener Erweiterung userChrome.js das jeweilige Skript in den Chrome-Ordner des Profils verschoben werden.
Das Einbinden der uc.js-Dateien und anderer Dateien geschieht mit der beigelegten userChrome.js bzw. der Zeile

    userChrome.import("*", "UChrm");

darin.

# Downloads
- userChrome.js: http://userchromejs.mozdev.org/


# Quellen
- http://www.camp-firefox.de/forum/viewtopic.php?f=16&t=90403
- https://github.com/ardiman/userChrome.js
