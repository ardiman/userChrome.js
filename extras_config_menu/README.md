# Extras Config Menu
Blendet standardmäßig neben der Adressleiste einen Button zum schnellen Zugriff auf die wichtigsten Konfigurationsdateien und -ordner ein. Stellt 
zusätzlich die userChromeJS-Skripte aus dem Chrome-Ordner zur Auswahl, um sie im Editor öffnen zu können. Außerdem ist es ab Version 1.0.20120103 
möglich, einige about:-Seiten zu öffnen (ggf. das Array `abouts` im Konfigurationsabschnitt erweitern). Falls das Skript "Add Restart Button" 
(das genannte Skript muss mindestens in Version 1.0.20120105mod vorliegen) installiert ist, wird außerdem eine Möglichkeit zum Neustart angeboten.

Ein Mittelklick auf den Button bzw. ein Doppelklick auf den Menüpunkt öffnet direkt `about:config`.

Seit Version  1.0.20120101 kann versucht werden, per Mittelklick das userChromeJS-Skript in diesem Projekt zu öffnen (dies funktioniert aufgrund der 
Benennung nicht bei allen Skripten!). Mit Rechtsklick findet eine Suche auf GitHub statt (es gibt nur Treffer, wenn der Dateiname z.B. in 
Kommentarabschnitten der Skripte vorhanden ist. Eine direkte Suche nach Dateinamen ist nicht möglich).

Es ist möglich, diese Funktion nur als Menüpunkt unter "Extras" zur Verfügung zu stellen. Dazu muss die Variable `warpmenuto` in `'menu'` geändert 
werden (s. auch Kommentare im Konfigurationsabschnitt des Skripts). 

Ist etwas anderes als `menu` oder `urlbar` gewünscht, so sollte es sich hierbei **nicht um die id eines Elements handeln, dass 
durch ein anderes userChromeJS-Skript generiert** wird, außerdem ist **nicht die id einer Leiste** wie Menü- (id=`toolbar-menubar`) oder 
Navigationsleiste (id=`nav-bar`) zu nehmen, sondern ein Element auf einer dieser Leisten (also z.B. `helpMenu`, damit der Button auf der 
Menüleiste neben dem Menüpunkt "Hilfe" erscheint). Das Gleiche gilt, wenn man den Button in die Add-On-Bar verlagern möchte.

Das **Ergebnis des Skripts**:

- entweder ein Button neben der Adressleiste (Auslieferungszustand des Skriptes):

![Screenshot Extras Config Menu als Button neben Adressleiste](https://github.com/ardiman/userChrome.js/raw/master/extras_config_menu/scr_extras_config_menu_btn.png)

- oder als Menü unter "Extras" (`warpmenuto:'menu'`):

![Screenshot Extras Config Menu als Menue](https://github.com/ardiman/userChrome.js/raw/master/extras_config_menu/scr_extras_config_menu_men.png)

- oder als Button neben dem Hilfemenü (`warpmenuto:'helpMenu'`) mit Zugriff auf den UserScriptLoader-Ordner (`gmOrdner:2`) und UserCSSLoader-Ordner 
(`cssOrdner:1`) und Verlagerung der about:Seiten direkt ins Menü (`abouts: ['0','about:about','about:addons','about:cache','about:config','about:support']`):

![Screenshot Extras Config Menu als Button neben Hilfe](https://github.com/ardiman/userChrome.js/raw/master/extras_config_menu/scr_extras_config_menu_btn2.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. 

Passe in der Datei noch den Pfad zum Editor (Variable `TextOpenExe`) und zum Dateimanager 
(falls gewünscht - `vFileManager` kann auch leer bleiben, in dem Fall wird der Dateimanager des Sytems benutzt) und die gewünschte Darstellung/den Ort 
(Variable `warpmenuto`) an. Werden die uc.js- und uc.xul-Dateien nicht richtig sortiert (wurde bereits unter Linux beobachtet), dann muss die 
Variable `sortScripts` auf `1` gesetzt werden.

Benutzer, die kein Greasemonkey installiert haben oder stattdessen das userChromeJS-Skript "UserScriptLoader" benutzen, können die Variable 
`gmOrdner` anpassen. Ähnliches gilt für Benutzer des Skriptes "UserCSSLoader" und die Variable `cssOrdner`. Mögliche Werte und ihre Bedeutung stehen 
als Kommentar im Konfigurationsbereich.

Falls man die about:-Seiten nicht zur Verfügung gestellt haben möchte, muss das entsprechende Array so deklariert werden: `abouts: [],`. Will man die 
about:-Seiten nicht in einem Untermenü darstellen, muss der erste Eintrag des Arrays `'0'` sein.

Wird `showNormalPrefs` auf `1` gesetzt, so können auch die Firefox-Einstellungen über dieses Menü geöffnet werden.

`enableScriptsToClip` auf `1` bietet die Möglichkeit, die Liste der eingebundenen Skripte in die Zwischenablage zu übernehmen. Falls der Wert auf 
`2` oder `3` gesetzt wird, werden die Skripte nummeriert (2=getrennt bzw. 3=durchgängig).

`enableRestart` auf 1 erzwingt den Neustart-Eintrag im Menü. Dies kann nützlich sein, wenn man das Skript "Add Restart Button" installiert hat, dieses 
aber nicht automatisch erkannt wird (wurde unter Linux beobachtet).
