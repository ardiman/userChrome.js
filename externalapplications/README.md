# External Applications
Ermoeglicht den schnellen Zugriff auf externe Anwendungen direkt aus dem Firefox heraus. 
Erspart das Add-On External Application Buttons. Das Script bringt 5 vordefinierte Anwendungen mit, 
u.a. den IE, CMD, Notepad,... und platziert diese als kleine Icons in der Menubar. 

Die Buttons greift das Script aus der Systemvorlage ab, die man mit einem entsprechenden *css Code 
veraendern kann. Man kann nach Belieben die Anwendungen selber und deren Reihenfolge, sowie die Anzahl 
im Script anpassen. Auch der Positionswechsel in eine andere Toolbar scheint problemlos moeglich. 
Es gibt auch immer einen passenden Tooltip dazu. 

Ist es einem zu viel mit den ganzen Buttons in der Leiste, kann man das ganze wunderbar zu einem Menuepunkt zusammenfassen.
Dazu muss man in Zeile 14 den Eintrag von 'button' in 'menu' aendern:
    type: 'button', //'menu' or 'button'

Das **Ergebnis des Skripts** ist in den Screenshots zu sehen:

Als Buttons:

![Screenshot External Applications Buttons](https://github.com/ardiman/userChrome.js/raw/master/externalapplications/scr_ext_apps_btn.png)

Als Menue:

![Screenshot External Applications Menue](https://github.com/ardiman/userChrome.js/raw/master/externalapplications/scr_ext_apps_menu.png)


## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. Passe danach noch die Pfade zu den Anwendungen an, ergaenze das Skript 
um die gewuenschten Anwendungen.