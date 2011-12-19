# Fish Eye Tabs
Das Skript basiert auf der gleichnamigen Erweiterung. Wenn man viele Tabs offen hat, werden sie in der Tabbar so zusammen gequetscht, dass man nur 
noch ca. die Hälfte des Tabtitels lesen kann. Mit diesem Skript kann man sich den jeweiligen Tab mit dem Mauszeiger in der Tabbar quasi ran zoomen, 
bis der Tab seine volle Breite erreicht hat. Je näher man mit der Maus rankommt, desto breiter wird der Tab. Um diesen Effekt zu erreichen, werden 
die Nachbartabs zu den Rändern hin einfach immer mehr zusammen geschoben. 

Im Addon wird der Tab-Schließen-Button ausgeblendet. Im Skript wurde diese Funktion nicht eingebaut, sodass er nach wie vor auf jedem Tab vorhanden 
ist. Möchte man ihn aber dennoch entfernen, um mehr vom Tabtext sehen/lesen zu können, kann man ihn in den Configs mit passendem Wert (2) bei 
`browser.tabs.closeButtons` ausblenden lassen. Bei Wert (1) ist der Schließenbutton nur beim aktiven Tab vorhanden. Schließen kann man die einzelnen 
Tabs dann immer noch über Maus Mittelklick oder mittels Tab-Kontextmenü.

Das **Ergebnis des Skripts**:

![Screenshot Fish Eye Tabs](https://github.com/ardiman/userChrome.js/raw/master/fisheyetabs/scr_fisheyetabs.png)


## Installation
Kopiere die uc.xul-Datei in den Chromeordner des Profils.