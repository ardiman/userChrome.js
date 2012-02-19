# Lesezeichenmanager
Mit diesem Skript kann man den Lesezeichenmanager per Button in der Menüleiste öffnen.

Soll ein anderer Ordner als "Alle Lesezeichen" geöffnet werden, können folgende Konstanten in Zeile 19 (Spalte 56) anstelle von `AllBookmarks` 
eingesetzt werden:

- `'AllBookmarks'` = Alle Lesezeichen (Auslieferungszustand des Skriptes)
- `'History'` = Chronik
- `'Downloads'` = Downloads
- `'BookmarksMenu'` = Lesezeichen-Menü
- `'BookmarksToolbar'` = Lesezeichen-Symbolleiste
- `'Tags'` = Schlagwörter
- `'UnfiledBookmarks'` = Unsortierte Lesezeichen

Das **Ergebnis des Skripts**:

![Screenshot Lesezeichenmanager](https://github.com/ardiman/userChrome.js/raw/master/lesezeichenmanager/scr_lesezeichenmanager.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.
