# View Source Modoki
Mit diesem Skript kann man sich aus dem Kontextmenü heraus über den vorher selbst bestimmten Editor den Quelltext einer Seite anschauen.

Mit Quelltext sind alle Dokumente einer Seite gemeint, aus denen die Seite besteht (html, ccs, js). Im Quelltextfenster kann aus allen Dokumenten 
zusammen ausgewählt werden. In `about:config` müssen der Wert `view_source.editor.external` auf `true` gestellt und beim String 
`view_source.editor.path` der Pfad zum eigenen Editor angegeben werden. Am Anfang des Skriptes gibt es einen kleinen CSS Code für die userChrome.ccs 
als Beispiel, falls man damit im Firefox das Quelltextfenster etwas größer und übersichtlicher gestalten möchte.

Das **Ergebnis des Skripts**:

![Screenshot View Source Modoki](https://github.com/ardiman/userChrome.js/raw/master/viewsourcemodoki/scr_viewsourcemodoki.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und passe die oben genannten Werte in `about:config` an.
