# Simple Session Manager
Skript zum Speichern mehrerer Browser Sitzungen. Im Extra Menü gibt es dafür ein Untermenü, in dem man die Sitzungen speichern, wiederherstellen, 
löschen, umbenennen und verwalten kann.

Jede Aktion wird von einem Alert Popup begleitet, in dem man etwas auswählen, umbenennen oder löschen kann. Die Sitzungen werden in einer Datei 
namens "simple_session_manager.json" im Chromeordner automatisch angelegt. In der zweiten Scriptzeile (Nr.9) kann man mit 0, 1 oder 2 selbst 
bestimmen, wie die Sitzungswiederherstellung zu erfolgen hat. Im neuen Fenster, durch Überschreiben der aktuell geöffneten Seite oder die 
aktuelle Seite wird einfach als ein zusätzlicher Tab an die Wiederherstellung gehängt.

Das **Ergebnis des Skripts**:

![Screenshot Simple Session Manager](https://github.com/ardiman/userChrome.js/raw/master/simplesessionmanager/scr_simplesessionmanager.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.