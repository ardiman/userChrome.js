# AutoPagerize
Dieses Skript basiert auf der gleichnamigen Erweiterung. In der Urlbar erscheint ein neues Symbol, welches Auskunft über die Möglichkeit des 
automatisierten Nachladens von "paginierten" Seiten gibt.

Das Skript lässt sich über Linksklick ab- und anschalten. Über Rechtsklick lassen sich einige Einstellungen vornehmen.

- EIN/AUS: das Skript kann über sein Kontextmenü deaktiviert werden, ein einfacher Linksklick reicht aber auch (s. oben)
- Seiten-Infos zurücksetzen/laden: lädt eine json-Datei aus dem Netz, legt diese später als `uAutoPagerize.json` im Chrome-Ordner ab
- Seitenlinks in neuem Tab öffnen: Es wird versucht, die Links auf der Seite in Tabs zu öffnen
- Beginn: Abstand in Pixeln zu dem "nächste Seite"-Link, ab dem die nächste Seite geladen werden soll
- Nur scrollen: Funktion bisher unbekannt
- Seite zu Chronik hinzufügen: Falls aktiv, werden nachgeladene Seiten in Chronik übernommen
- Testmodus: Gibt Aufschluss über Erkennung der Seite und deren Definition
- SITEINFO Writer starten: die genaue Funktion dieses eingebundenen Skriptes muss noch erforscht werden


Das Symbol und seine Bedeutung:

- grau: das Skript hat für die geöffnete Seite keine Definition gefunden (evtl. wurde die json-Datei auch noch nicht aus dem Netz geladen), ist aber aktiv
- grün: das Skript kann hier die nächste Seite laden, sobald man Richtung Ende der Seite scrollt
- grün+animiert: der Ladevorgang der nächsten Seite findet gerade statt
- blau: kein Nachladen mehr möglich, weil man auf der letzen Seite angelangt ist
- rote Punkte: das Skript wurde deaktiviert

Das **Ergebnis des Skripts**:

![Screenshot AutoPagerize](https://github.com/ardiman/userChrome.js/raw/master/autopagerize/scr_autopagerize.png)

## Installation
Kopiere die beiden uc.js-Dateien in den Chromeordner des Profils, lade nach dem Neustart des Firefox zunächst die Seiten-Infos neu (kann ein wenig 
dauern, nach Erfolg und Neustart des Firefox sollte im Chrome-Ordner eine mindestens 719 kB große Datei namens `uAutoPagerize.json` vorhanden sein).

Ergänze das Skript evtl. mittels [AutoPagerize Find Highlight](https://github.com/ardiman/userChrome.js/tree/master/autopagerizefindhighlight)