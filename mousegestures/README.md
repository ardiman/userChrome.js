# Mouse Gestures
Dieses Skript ermöglicht die Benutzung von Mausgesten und erübrigt somit den Einsatz der üblichen Erweiterungen. Die Version auf dieser 
Seite wurde um 3 Konfigurationsmöglichkeiten ergänzt, die man in den Zeilen 64 bis 66 findet:

- `this._showinstatus = true;`
- `this._showinstatustime = 750;`
- `this._focusonopenedtab = true;`

Mit den ersten beiden Punkten lässt sich  einstellen, ob die ausgeführte Geste oberhalb der Add-on-Bar angezeigt werden soll und falls ja, wie 
lang (in Millisekunden) die Anzeige sichtbar bleibt. Warnmeldungen (z.B. bei unbekannter Geste) werden unabhängig von der erstgenannten Einstellung 
immer für die gewählte Dauer angezeigt.

`_focusonopenedtab` beeinflusst das Verhalten von Gesten, die Tabs öffnen. 

Die Übersicht der im Auslieferungszustand aktiven Gesten kann man in der Datei *MouseGesturesManual.html* nachschlagen (Aufruf mit der Geste 
*UDUD* - die Geste kann man sich als *M* für *Manual* vorstellen). Das Handbuch wird als neuer Tab im Vordergrund geöffnet, falls dies im 
Hintergrund geschehen soll, muss die Zeile mit dem zweiten Treffer von *MANUAL_PATH* aktiviert und die Zeile direkt darunter deaktiviert werden.

## Installation
Kopiere die uc.js-Datei und die Datei *MouseGesturesManual.html* in den Chromeordner des Profils.