# Bing Translator
Markierter Text in einer fast beliebigen Sprache wird mittels Mittelklick und dem Bing-Übersetzungsdienst automatisch übersetzt. Falls der Text als 
deutsch erkannt wird, erhält man als Ergebnis die englische Übersetzung. Mit einem Klick auf das Übersetzungsergebnis wird der Text in die 
Zwischenablage übernommen und das Fenster geschlossen - die Übernahme findet nicht statt, wenn man den Schließen-Button des Übersetzungsfensters 
verwendet.

Sobald mehr als 100 Zeichen markiert wurden, erhält man in der Statusleiste eine Information über den gerade laufenden Übersetzungsvorgang. 
Durch Anpassen der Variable `showStatusFrom` lässt sich dieses Verhalten konfigurieren.

Erhält man ein **leeres Übersetzungsfenster**, muss die Zeile 56 deaktiviert werden. Bei einigen Sonderzeichen kann es zu leicht veränderten 
Ergebnissen kommen (z.T. wird beim Backslash abgeschnitten, bei Satzzeichen kann es zu einer Korrektur, wie z.B. Leerzeichen danach, kommen). 
Formatierungen oder Zeilenumbrüche aus dem Originaltext sind im Ergebnisfenster nicht zu sehen.

Das **Ergebnis des Skripts**:

![Screenshot Bing Translator](https://github.com/ardiman/userChrome.js/raw/master/bingtranslator/scr_bingtranslator.png)

## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.