# Bing Translator
Markierter Text in einer beliebigen Sprache wird mittels Mittelklick und dem Bing-Übersetzungsdienst automatisch übersetzt. Falls der Text als 
deutsch erkannt wird, erhält man als Ergebnis die englische Übersetzung. Mit einem Klick auf das Übersetzungsergebnis wird der Text in die 
Zwischenablage übernommen und das Fenster geschlosssen - die Übernahme findet nicht statt, wenn man den Schließen-Button des Übersetzungsfensters 
verwendet.

Erhält man ein **leeres Übersetzungsfenster**, muss die Zeile 53 deaktiviert werden. Bei einigen Sonderzeichen kann es zu leicht veränderten 
Ergebnissen kommen (z.T. wird beim Backslash abgeschnitten, Anführungszeichen am Anfang des markierten Textes führen evtl. zu einer Fehlermeldung). 
Formatierungen oder Zeilenumbrüche aus dem Originaltext sind im Ergebnisfenster nicht zu sehen.

Das **Ergebnis des Skripts**:

![Screenshot Bing Translator](https://github.com/ardiman/userChrome.js/raw/master/bingtranslator/scr_bingtranslator.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.