# Mouse Gestures
Dieses Skript ermöglicht die Benutzung von Mausgesten und erübrigt somit den Einsatz der üblichen Erweiterungen. Die Version auf dieser 
Seite wurde um 2 Konfigurationsmöglichkeiten ergänzt, die man in den Zeilen 64 und 65 findet:

- `this._showinstatus = true;`
- `this._showinstatustime = 750;`

Damit lässt sich  einstellen, ob die ausgeführte Geste oberhalb der Add-on-Bar angezeigt werden soll und falls ja, wie 
lang (in Millisekunden) die Anzeige sichtbar bleibt. Warnmeldungen (z.B. bei unbekannter Geste) werden unabhängig von dieser Einstellung immer 
angezeigt.

Die Übersicht der im Auslieferungszustand aktiven Gesten kann man in der Datei *MouseGesturesManual.html* nachschlagen (Aufruf mit der Geste 
*UDUD* - die Geste kann man sich als *M* für *Manual* vorstellen). Das Handbuch wird als neuer Tab im Vordergrund geöffnet, falls dies im 
Hintergrund geschehen soll, muss die Zeile mit dem zweiten Treffer von *MANUAL_PATH* aktiviert und die Zeile direkt darunter deaktiviert werden.

## Installation
Kopiere die uc.js-Datei und die Datei *MouseGesturesManual.html* in den Chromeordner des Profils.