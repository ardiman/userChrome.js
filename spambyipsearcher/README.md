# Spam by IP Searcher
Mit dem Skript kann man, nachdem Text auf einer Seite markiert wurde, die darin enthaltene IP auf frei konfigurierbaren Seiten nachschlagen. 
Das Tabverhalten beim Öffnen der Seiten ist über `openServicesInBackground` konfigurierbar (allerdings nicht pro Dienst).

Sind im markierten Text mehrere IPs enthalten, so werden Daten zur zuerst aufgeführten IP abgerufen. Kann im markierten Text keine IP gefunden 
werden, so wird im Meldebereich des Browsers eine kurze Meldung ausgegeben (über `showinstatustime` konfigurierbar).

Die im Array `usedServices` definierten Dienste können einzeln oder gesammelt in Anspruch genommen werden. Damit ein Dienst beim Sammelaufruf 
genutzt wird, muss dieser als`type` den Wert `2` bekommen. Im Menü wird solchen Diensten mittels CSS (s. Zeile 53) ein Symbol vorangestellt.

Das **Ergebnis des Skripts**:

![Screenshot Spam by IP Searcher](https://github.com/ardiman/userChrome.js/raw/master/spambyipsearcher/scr_spambyipsearcher.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils. Passe den Konfigurationsabschnitt zwischen Zeile 11 und 48 an (s. Kommentare dort).