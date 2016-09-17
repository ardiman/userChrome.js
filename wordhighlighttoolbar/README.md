# Word Highlight Toolbar

Ein Skript zum Suchen und Hervorheben von einzelnen Wörtern oder ganzen Zeichenfolgen auf einer Seite, deren Unterseiten und zum Teil auch in neuen Tabs.

Dafür gibt es 2 neue Einträge im Hauptkontextmenü, mit denen man das Markierte hervorheben kann. Das Ergebnis präsentiert sich als eine bunte Toolbar am unteren 
Browserrand. Im Tooltip steht erklärt, was man mit der Maus auf den gefundenen Wörtern in der Toolbar alles anstellen kann (einzeln schließen, rauf und runter 
weitersuchen).

In Zeile 48 des Skriptes lässt sich anpassen, ob die Funktion in der URL-Leiste (POSITION_URLBAR) oder über einen frei verschiebbaren Button (POSITION_MOVABLE) 
aktiviert werden kann.

Automatisches Hervorheben der Ergebnisse einer Suche mit Google, Yahoo, Bing und Duckduckgo gehört ebenfalls zum Skriptumfang. Wenn man einen gegenwärtig 
auskommentierten Skript-Teil hinzunimmt, erfolgt das auch für einige weitere Suchmaschinen, siehe dazu ab Zeile 85 Im Skript. Es wurde beobachtet, dass auf 
Suchergebnisseiten zwar die farbigen Schaltflächen mit den Suchausdrücken, aber keine Hervorhebungen vorhanden sind; Abhilfe schafft eine kleine Änderung im 
Skript, siehe dazu ab Zeile 254. Auf den Suchergebnisseiten von Duckduckgo werden beim Erreichen des Seitenendes automatisch weitere Suchergebnisse nachgeladen; 
mit einem ebenfalls gegenwärtig auskommentierten Skript-Teil erfolgen auch dort die Hervorhebungen, siehe dazu ab Zeile 749.

Rechts unten gibt es noch paar Buttons, mit denen man z.B. selbst ein Wort zum Suchen über ein kleines Popup eingeben kann, woanders die Anzahl der gefundenen Wörter 
aktualisieren oder die ganze Toolbar per Button schließen kann.

Das **Ergebnis des Skripts**:

![Screenshot Word Highlight Toolbar](https://github.com/ardiman/userChrome.js/raw/master/wordhighlighttoolbar/scr_wordhighlighttoolbar.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.

