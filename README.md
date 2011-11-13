# Einleitung
Hier entsteht eine Sammlung fuer die Firefox-Erweiterung userChrome.js. 

Fast alle Skripte wurden im deutschen Firefox-Forum vorgestellt bzw. dort angepasst.

Fuer GitHub werden die Skripte in Unterordnern mit entsprechenden README-Dateien abgelegt. Es handelt sich dabei um 
Textdateien im markdown-Format mit der Dateiendung `md`. Screenshots bis zum 30.09.2011 wurden im Firefox 6 erstellt. 
Die Ergebnisse der fuer neuere Firefox-Versionen aktualisierten Skripte sehen vielleicht ein wenig anders aus. Die Screenshots 
werden nur bei extremen Unterschieden aktualisiert. 

# Testumgebung
- Win XP SP 3/ Firefox 8 (ab 10.11.2011)
- Win XP SP 3/ Firefox 7 (ab 01.10.2011)
- Win XP SP 3/ Firefox 6 (bis 30.09.2011)

Sollte ein Skript nicht funktionieren, bitte im Quelltext nachschauen, was in der jeweiligen Firefoxversion angepasst 
werden muss bzw. in der Historie des Skriptes stoebern.

# Installation
Zur Aktivierung der Skripte im Firefox muss 

- die **Erweiterung userChrome.js** installiert und lauffaehig sein 
- das jeweilige Skript in den Chrome-Ordner des Profils verschoben werden 

Das Einbinden der uc.js-Dateien und anderer Dateien geschieht mit der beigelegten userChrome.js (diese Datei muss ebenfalls in 
den Chrome-Ordner des Profils) bzw. der Zeile

    userChrome.import("*", "UChrm");

darin.

# Downloads
- die benoetigte Erweiterung userChrome.js: http://userchromejs.mozdev.org/


# Quellen
- http://www.camp-firefox.de/forum/viewtopic.php?f=16&t=90403
- https://github.com/ardiman/userChrome.js
