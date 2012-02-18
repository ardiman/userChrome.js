# Find in Searchbar Highlight
Hiermit wird ein kleiner Button mit der Findbar Funktion rechts neben die Searchbar geschoben, sobald die Lupe in der Searchbar oder z.B. Strg+Enter 
gedrückt wird. Das zu suchende Wort muss in die Searchbar und nach Klick auf den (Stift) Button werden sofort all diese Wörter der Seite farblich 
markiert.

Die Leiste färbt sich rot bei "Ausdruck nicht gefunden" und grün, wenn alle Ausdrücke gefunden wurden.

Es gibt mehrere Möglichkeiten der Bedienung:

- Strg+H = Alle gefundenen Wörter werden markiert
- Strg+Enter, Alt+N = Es wird abwärts gesucht
- Strg+Alt+Enter, Alt+P = Es wird aufwärts gesucht
- Linksklick Lupe = Suche abwärts
- Rechtsklick Lupe = Suche aufwärts
- Mittelklick Lupe = Alle Markierungen werden aufgehoben und das Suchwort aus der Searchbar gelöscht
- Der Stiftbutton markiert und demarkiert alles Gefundene

Die Lupe selbst ruft also nicht mehr die Suchmaschine auf, dazu muss man nun Enter benutzen.

Das **Ergebnis des Skripts**:

![Screenshot Find in Searchbar Highlight](https://github.com/ardiman/userChrome.js/raw/master/findinsearchbarhighlight/scr_findinsearchbarhighlight.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. Passe das Verhalten des Skripts in den Zeilen 30 bis 36 und das Aussehen ab Zeile 206 an 
(s. Kommentare im Code).
