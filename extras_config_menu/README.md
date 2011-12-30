# Extras Config Menu
Blendet standardmäßig neben der Adressleiste einen Button zum schnellen Zugriff auf die wichtigsten Konfigurationsdateien und -ordner ein. Stellt 
zusätzlich die userChromeJS-Skripte aus dem Chrome-Ordner zur Auswahl, um sie im Editor öffnen zu können.

Es ist möglich, diese Funktion nur als Menüpunkt unter "Extras" zur Verfügung zu stellen. Dazu muss die Variable `warpmenuto` in `'menu'` geändert 
werden (s. auch Kommentare im Konfigurationsabschnitt des Skripts). 

Ist etwas anderes als `menu` oder `urlbar` gewünscht, so sollte es sich hierbei **nicht um die id eines Elements handeln, dass 
durch ein anderes userChromeJS-Skript generiert** wird, außerdem ist **nicht die id einer Leiste** wie Menü- (id=`toolbar-menubar`) oder 
Navigationsleiste (id=`nav-bar`) zu nehmen, sondern ein Element auf einer dieser Leisten (also z.B. `helpMenu`, damit der Button auf der 
Menüleiste neben dem Menüpunkt "Hilfe" erscheint). Das Gleiche gilt, wenn man den Button in die Add-On-Bar verlagern möchte.

Das **Ergebnis des Skripts**:

- entweder ein Button neben der Adressleiste (oder einen anderem Element):

![Screenshot Extras Config Menu als Button](https://github.com/ardiman/userChrome.js/raw/master/extras_config_menu/scr_extras_config_menu_btn.png)

- oder als Menü unter "Extras":

![Screenshot Extras Config Menu als Menue](https://github.com/ardiman/userChrome.js/raw/master/extras_config_menu/scr_extras_config_menu_men.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. Passe in der Datei noch den Pfad zum Editor (Variable `TextOpenExe`) und zum Dateimanager 
(falls gewünscht - `vFileManager` kann auch leer bleiben, in dem Fall wird der Dateimanager des Sytems benutzt) und die gewünschte Darstellung/den Ort 
(Variable `warpmenuto`) an.


## Anmerkung
Linuxbenutzer müssen sehr wahrscheinlich die Ordner anders öffnen. Dazu müssen sicherlich die Zeilen, in denen Pfade zusammengesetzt werden behandelt 
werden (Ausschau nach doppelten bzw. z.T. 4fachen Vorkommen vom Backslash halten). Ursprünglich lagen hier uc.xul-Dateien. Durch das Umschreiben 
ins uc.js-Format sind diese Varianten nicht mehr nötig und wurden deshalb gelöscht.