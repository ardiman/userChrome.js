# userChromeJS Verwendung mit Firefox 57

userChromeJS-Skripte konnten  bis Firefox 57 mit einer Erweiterung geladen werden. Nun muss folgendermaßen vorgegangen werden.

Kopiere die 2 Dateien:

- [1. config.js](https://raw.githubusercontent.com/ardiman/userChrome.js/master/_userChrome/config.js)
- [2. userChromeJS.js](https://raw.githubusercontent.com/ardiman/userChrome.js/master/_userChrome/userChromeJS.js)

in den **Firefox Installationsordner**. Je nach Betriebssystem also **C:\Program Files (x86)\Mozilla Firefox** bzw. **C:\Program Files\Mozilla Firefox**

Diese Datei:

- [3. config-prefs.js](https://raw.githubusercontent.com/ardiman/userChrome.js/master/_userChrome/config-prefs.js)

gehört in den Ordner **C:\Program Files (x86)\Mozilla Firefox\defaults\pref** bzw.  **C:\Program Files\Mozilla Firefox\defaults\pref**

Zum Schluss muss die Datei:

- [4. userChrome.js](https://raw.githubusercontent.com/ardiman/userChrome.js/master/_userChrome/userChrome.js)

in den Ordner **chrome* des Firefox-Profilordners, der üblicherweise unter **%appdata%\Mozilla\Firefox\Profiles\xxx.default** zu finden ist

