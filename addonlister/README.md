# AddonLister
Dieses Skript füllt ein wenig die Lücke, die die Erweiterung "InfoLister" hinterlassen hat.

Nach Installation des Skriptes gibt es einen Button, der 
über das "Anpassen"-Fenster frei positioniert werden kann. Standardmässig erstellt ein Linksklick eine Text-Datei im BBCode-Format, die im 
Editor angezeigt wird (aufgrund möglicher Umlaute sieht man nur so alles korrekt). Ein Mittelklick zeigt die erstellte Datei direkt im Browser - 
tatsächlich ist das nur beim HTML-Format sinnvoll, weil hier ein charset mitgegeben werden kann. Mit einem Rechtsklick wird die Datei erstellt, aber 
nicht angezeigt.

Es können im Konfigurationsabschnitt noch 2 weitere Formate gewählt werden. Dazu bitte den Wert `FORMAT` auf `html` oder `custom` stellen. Alle weiteren 
Konfigurationen sind im Skript ebenfalls mit Kommentar versehen, sodass hier mit einer Ausnahme nicht näher darauf eingegangen wird.

Passe auf jeden Fall den Wert `EXPORTPATH` an.

`TRYGITHUB` steht auf `true` und versucht in dieser Einstellung die Skripte in/mit/von ;) diesem Repository zu verknüpfen (nur für userChrome.js-Skripte).

Ganz grobe Fehler in der Konfiguration werden seit der Version vom 11.03.2015 durch das Skript gemeldet.

## Expertenkonfiguration ##
Wird vielleicht demnächst erläutert ...

Das **Ergebnis des Skripts**:

![Screenshot AddonLister](https://github.com/ardiman/userChrome.js/raw/master/addonlister/scr_addonlister.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und ziehe den Button an die gewünschte Stelle. 