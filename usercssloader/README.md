# User CSS Loader
Das Skript ist in der Lage, die userChrome.css, die userContent.css und das Add-on "Stylish" zusammen zu ersetzen. 
Über ein neues Menü in der Menüleiste werden CSS Styles neu erstellt, geladen, sofort getestet, aus-/eingeschaltet etc.

Das **Ergebnis des Skripts**:

![Screenshot User CSS Loader](https://github.com/ardiman/userChrome.js/raw/master/usercssloader/scr_usercssloader.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. 
Evtl. muss über `about:config` noch der externe Editor definiert (Wert für `view_source.editor.path` eintragen) werden. Bei Bedarf kann in Zeile 54 
ein anderer Dateimanager zum Öffnen des CSS-Ordners eingetragen werden - ein Beispiel für den Eintrag von `vFileManager` ist in der Zeile 
darüber zu sehen. Soll der User CSS Loader als Toolbarbutton erscheinen, stellt man darunter `showAs` auf `button`. Das Icon für den Toolbarbutton 
setzt man dann per CSS ein (Beispiel. s. http://www.camp-firefox.de/forum/viewtopic.php?p=856804#p856804). Mit `showWhere` kann eingestellt 
werden, in welcher Leiste der Button oder das Menü auftauchen soll. 
