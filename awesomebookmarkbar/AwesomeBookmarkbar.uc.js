// ==UserScript==
// @name           	AwesomeBookmarkbar.uc.js
// @description   	智能书签工具栏
// @author         	feiruo
// @compatibility  	Firefox 24.0
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id 				[73FCA65B]
// @inspect         window.AwesomeBookmarkbar
// @startup      	window.AwesomeBookmarkbar.init();
// @shutdown     	window.AwesomeBookmarkbar.onDestroy();
// @optionsURL		about:config?filter=AwesomeBookmarkbar.
// @config 			window.AwesomeBookmarkbar.openPref();
// @reviewURL		http://bbs.kafan.cn/thread-1726260-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS
// @downloadURL		https://github.com/feiruo/userChromeJS/AwesomeBookmarkbar.uc.js
// @note         	点击地址栏显示书签工具栏。
// @note         	地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。
// @note       		左键点击书签后自动隐藏书签工具栏。
// @version      	0.3.1	2015.04.17 10:00 	更多功能，表达能力略微提升.
// @version      	0.3		2015.04.11 20:00 	绘制UI设置界面.
// @version      	0.2.1 	去除鼠标移到地址栏自动显示书签工具栏
// @version      	0.2 	增加鼠标移到地址栏自动显示书签工具栏，移出隐藏
// ==/UserScript== 
location == "chrome://browser/content/browser.xul" && (function() {
	if (window.AwesomeBookmarkbar) {
		window.AwesomeBookmarkbar.onDestroy();
		delete window.AwesomeBookmarkbar;
	}

	var AwesomeBookmarkbar = {
		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("userChromeJS.AwesomeBookmarkbar.");
		},
		get Window() {
			var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
			return windowsMediator.getMostRecentWindow("AwesomeBookmarkbar:Preferences");
		},

		init: function() {
			var ins = $("devToolsSeparator");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "AwesomeBookmarkbar_set",
				label: "AwesomeBookmarkbar Einstellungen",
				oncommand: "AwesomeBookmarkbar.openPref();",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByklEQVQ4jZ2Rz4sSYRjHn2yxYmlpqYV+LOye6uCtS3uu6LBFMJCJgviC0jonfxzUndMrHvI9hDiOh/eVGUE3kIEQHEedlx1eh7nVn1D/wF5rLwX9uCQsgRP6uTw8D3w/fOEBuIAQYkMIsXFhv+X7/rYQYt913XsQhGma14QQR67rItM0wwAAnuc9FkKczufzj57nPQsUOI6zyTn/wDnvTSaTKwAAs9ks6zjOD8757+l02hkOhzeWCjDGIdu292zb3vvbKDwej19alnUyGo18y7Ke9Hq9zWX5SwAA0Wj08mLqun4dAKDf798ZDAYHgfUNw3hoGMaxYRgZAABd1193u13R6XSCgwsopSnG2C9Kqd9ut28zxiTG2Dml1FdVdScwjDEOqar6VFXVsaZpx5qm3cQYh1qtVq7ZbL5tNBpvCCG7/21BCNnFGG/9c3tFCDmv1+vvMcbLP7CMSqWyXavVTqrV6k+M8TuE0NWVJaVS6a6iKDNFUb6Xy+XS4lMrkcvlHhSLxU+FQuFbPp9HKwsAAGRZPpBl+Us2mz3LZDKHa0nS6fRzhNBZKpX6nEwmH60lSSQSKB6Pf43FYmQtQSQSCUuS9EKSpPsAAH8A5AfFG6aqwRIAAAAASUVORK5CYII=",
				class: "menuitem-iconic",
			}), ins);

			this.loadSetting();
			this.prefs.addObserver('', this.PrefsObs, false);
			window.addEventListener("unload", function() {
				AwesomeBookmarkbar.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.AddListener(false, 2, "click", "UClick_S", "Show");
			this.AddListener(false, 2, "click", "UClick_H", "Hide");
			this.AddListener(false, 2, "dblclick", "UDblclick_S", "Show");
			this.AddListener(false, 2, "dblclick", "UDblclick_H", "Hide");
			this.AddListener(false, 2, "blur", "UBlur_H", "Hide");
			this.AddListener(false, 2, "keydown", "UKey_H", "keyHide");
			this.AddListener(false, 2, "mouseover", "UMove_S", "MShow");
			this.AddListener(false, 2, "mouseout", "UMouseout_H", "MHide");
			this.AddListener(false, 0, "mouseover", "PMouseover_S", "MShow");
			this.AddListener(false, 0, "mouseout", "PMouseout_H", "MHide");
			this.AddListener(false, 0, "command", "PersonalToolbarClick0", "PHide");
			this.AddListener(false, 0, "click", "PersonalToolbarClick1", "PHide");
			this.AddListener(false, 1, "command", "PersonalToolbarClick2", "PHide");
			this.ShowToolbar(true);
			this.prefs.removeObserver('', this.PrefsObs, false);
			if (this.Window) this.Window.close();
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		PrefsObs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'PClick_H':
					case 'PMouseover_S':
					case 'PMouseout_H':
					case 'UClick_H':
					case 'UMouseout_H':
					case 'UKey_H':
					case 'UBlur_H':
					case 'UDblclick_S':
					case 'UDblclick_H':
					case 'UClick_S':
					case 'UMove_S':
					case 'LShow':
					case 'Hide_Time':
					case 'Show_Time':
						AwesomeBookmarkbar.loadSetting(data);
						break;
				}
			}
		},

		loadSetting: function(type) {
			if (!type || type === "LShow") {
				this.LShow = this.getPrefs(0, "LShow");
				if (type) return;
				this.ShowToolbar(this.LShow);
			}

			if (!type || type === "Hide_Time")
				this.Hide_Time = this.getPrefs(1, "Hide_Time");

			if (!type || type === "Show_Time")
				this.Show_Time = this.getPrefs(1, "Show_Time");

			if (!type || type === "UClick_S")
				this.AddListener(this.getPrefs(0, "UClick_S"), 2, "click", "UClick_S", "Show");

			if (!type || type === "UClick_H")
				this.AddListener(this.getPrefs(0, "UClick_H"), 2, "click", "UClick_H", "Hide");

			if (!type || type === "UDblclick_S")
				this.AddListener(this.getPrefs(0, "UDblclick_S"), 2, "dblclick", "UDblclick_S", "Show");

			if (!type || type === "UDblclick_H")
				this.AddListener(this.getPrefs(0, "UDblclick_H"), 2, "dblclick", "UDblclick_H", "Hide");

			if (!type || type === "UBlur_H")
				this.AddListener(this.getPrefs(0, "UBlur_H"), 2, "blur", "UBlur_H", "Hide");

			if (!type || type === "UKey_H")
				this.AddListener(this.getPrefs(0, "UKey_H"), 2, "keydown", "UKey_H", "keyHide");

			if (!type || type === "UMove_S")
				this.AddListener(this.getPrefs(0, "UMove_S"), 2, "mouseover", "UMove_S", "Show");

			if (!type || type === "UMouseout_H") {
				this.AddListener(this.getPrefs(0, "UMouseout_H"), 2, "mouseout", "UMouseout_H", "Hide");
				this.AddListener(this.getPrefs(0, "UMouseout_H"), 0, "mouseover", "PMouseover_S", "Show");
			}

			if (!type || type === "PMouseout_H")
				this.AddListener(this.getPrefs(0, "PMouseout_H"), 0, "mouseout", "PMouseout_H", "Hide");

			if (!type || type === "PClick_H") {
				this.AddListener(this.getPrefs(0, "PClick_H"), 0, "command", "PersonalToolbarClick0", "PHide");
				this.AddListener(this.getPrefs(0, "PClick_H"), 0, "click", "PersonalToolbarClick1", "PHide");
				this.AddListener(this.getPrefs(0, "PClick_H"), 1, "command", "PersonalToolbarClick2", "PHide");
			}
		},

		/*****************************************************************************************/
		AddListener: function(enable, tag, action, name, command) {
			if (tag === 0)
				tag = $("PersonalToolbar");
			if (tag === 1)
				tag = $("placesCommands");
			if (tag === 2)
				tag = gURLBar;
			tag.removeEventListener(action, AwesomeBookmarkbar["Listener_" + name], false);

			if (!enable) return;

			(function(name, command) {
				AwesomeBookmarkbar["Listener_" + name] = function(e) {
					AwesomeBookmarkbar.Listener(e, command);
				};
			})(name, command);

			tag.addEventListener(action, AwesomeBookmarkbar["Listener_" + name], false);
		},

		Listener: function(e, command) {
			var Tid = e.target.parentNode.id,
				paid;
			if (Tid == 'notification-popup-box' || Tid == 'identity-box' || Tid == 'urlbar-display-box' || Tid == 'urlbar-icons')
				paid = true;
			switch (command) {
				case "Show":
					if (paid) return;
					this.ShowToolbar(true);
					break;
				case "Hide":
					if (paid) return;
					this.ShowToolbar(false);
					break;
				case "PHide":
					if (e.button == 2 || e.button == 1 || (e.button == 0 && !(e.metaKey || e.shiftKey || e.ctrlKey))) return;
					this.ShowToolbar(false);
					break;
				case "keyHide":
					if (window.event ? e.keyCode : e.which)
						this.ShowToolbar(false);
					break;
			}
		},

		ShowToolbar: function(show) {
			var Bar = $("PersonalToolbar");
			var time;
			if (show) {
				show = true;
				time = this.Show_Time;
			} else {
				show = false;
				time = this.Hide_Time;
			}
			setTimeout(function() {
				setToolbarVisibility(Bar, show);
			}, time);
		},

		/*****************************************************************************************/
		getPrefs: function(type, name, val) {
			switch (type) {
				case 0:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
						this.prefs.setBoolPref(name, false);
					return this.prefs.getBoolPref(name);
					break;
				case 1:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
						this.prefs.setIntPref(name, 0);
					return this.prefs.getIntPref(name);
					break;
				case 2:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
						this.prefs.setCharPref(name, "");
					return this.prefs.getCharPref(name);
					break;
			}
		},

		openPref: function() {
			if (this.Window)
				this.Window.focus();
			else {
				var option = this.option();
				window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + option, '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
			}
		},

		option: function() {
			xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
					<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="AwesomeBookmarkbar_Settings"\
					ignorekeys="true"\
					title="AwesomeBookmarkbar Einstellungen"\
					buttons="accept,cancel,extra1"\
					ondialogextra1="Resets();"\
					windowtype="AwesomeBookmarkbar:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="PClick_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.PClick_H"/>\
							<preference id="PMouseout_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.PMouseout_H"/>\
							<preference id="UClick_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.UClick_H"/>\
							<preference id="UMouseout_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.UMouseout_H"/>\
							<preference id="UKey_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.UKey_H"/>\
							<preference id="UBlur_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.UBlur_H"/>\
							<preference id="UDblclick_S" type="bool" name="userChromeJS.AwesomeBookmarkbar.UDblclick_S"/>\
							<preference id="UDblclick_H" type="bool" name="userChromeJS.AwesomeBookmarkbar.UDblclick_H"/>\
							<preference id="UClick_S" type="bool" name="userChromeJS.AwesomeBookmarkbar.UClick_S"/>\
							<preference id="UMove_S" type="bool" name="userChromeJS.AwesomeBookmarkbar.UMove_S"/>\
							<preference id="LShow" type="bool" name="userChromeJS.AwesomeBookmarkbar.LShow"/>\
							<preference id="Hide_Time" type="int" name="userChromeJS.AwesomeBookmarkbar.Hide_Time"/>\
							<preference id="Show_Time" type="int" name="userChromeJS.AwesomeBookmarkbar.Show_Time"/>\
						</preferences>\
						<script>\
							function Resets() {\
								$("PClick_H").value = false;\
								$("PMouseout_H").value = false;\
								$("UClick_H").value = false;\
								$("UMouseout_H").value = false;\
								$("UKey_H").value = false;\
								$("UBlur_H").value = false;\
								$("UDblclick_S").value = false;\
								$("UClick_S").value = false;\
								$("UDblclick_H").value = false;\
								$("UMove_S").value = false;\
								$("LShow").value = false;\
								$("Hide_Time").value = 0;\
								$("Show_Time").value = 0;\
								opener.AwesomeBookmarkbar.ShowToolbar();\
							}\
							function $(id) document.getElementById(id);\
						</script>\
						<groupbox>\
							<checkbox id="LShow" label="Beim Firefoxstart Lesezeichenleiste anzeigen" preference="LShow"/>\
						</groupbox>\
						<hbox>\
							<groupbox>\
								<caption label="Lesezeichenleiste ausblenden"/>\
									<row align="center">\
										<label value="Ausblendenverzögerung："/>\
										<textbox id="Hide_Time" type="number" preference="Hide_Time" style="width:125px" tooltiptext="In Millisekunden！"/>\
									</row>\
									<checkbox id="UClick_H" label="Klick auf Adressleiste" preference="UClick_H"/>\
									<checkbox id="UDblclick_H" label="Doppelklick auf Adressleiste" preference="UDblclick_H"/>\
									<checkbox id="UKey_H" label="Beliebigen Tastendruck in Adressleiste" preference="UKey_H"/>\
									<checkbox id="UBlur_H" label="Wenn Adressleiste den Fokus verliert (Seite anklicken)" preference="UBlur_H"/>\
									<checkbox id="UMouseout_H" label="Maus aus Adressleiste bewegen" preference="UMouseout_H"/>\
									<checkbox id="PMouseout_H" label="Maus aus Lesezeichenleiste bewegen" preference="PMouseout_H"/>\
									<checkbox id="PClick_H" label="Nach Klick auf Lesezeichenleiste" preference="PClick_H"/>\
							</groupbox>\
							<groupbox>\
								<caption label="Lesezeichenleiste einblenden"/>\
									<row align="center">\
										<label value="Einblendenverzögerung："/>\
										<textbox id="Show_Time" type="number" preference="Show_Time" style="width:125px" tooltiptext="In Millisekunden!"/>\
									</row>\
									<checkbox id="UDblclick_S" label="Doppelklick auf Adressleiste" preference="UDblclick_S"/>\
									<checkbox id="UClick_S" label="Klick auf Adressleiste" preference="UClick_S"/>\
									<checkbox id="UMove_S" label="Maus in die Adressleiste bewegen" preference="UMove_S"/>\
							</groupbox>\
						</hbox>\
						<hbox flex="1">\
							<button dlgtype="extra1" label="Standardeinstellungen wiederherstellen" />\
							<spacer flex="1" />\
							<button dlgtype="accept"/>\
							<button dlgtype="cancel"/>\
						</hbox>\
					</prefpane>\
					</prefwindow>\
          			';
			return encodeURIComponent(xul);
		},
	};

	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	AwesomeBookmarkbar.init();
	window.AwesomeBookmarkbar = AwesomeBookmarkbar;
})();