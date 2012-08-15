// MouseGesturesVisual.uc.js für die userChrome.js

location == "chrome://browser/content/browser.xul" && (function () {
	ucjsMouseGestures = {
		lastX: 0,
		lastY: 0,
		sourceNode: "",
		directionChain: "",
		isMouseDownL: false,
		isMouseDownR: false,
		hideFireContext: false,
		shouldFireContext: false,
		GESTURES: {
			"U": {
				name: "Zum Seitenanfang",
				cmd: function() {
					goDoCommand("cmd_scrollTop");
				}
			},
			"D": {
				name: "Zum Seitenende",
				cmd: function() {
					goDoCommand("cmd_scrollBottom");
				}
			},
			"L<R": {
				name: "Zurück",
				cmd: function() {
					getWebNavigation().canGoBack && getWebNavigation().goBack();
				}
			},
			"L>R": {
				name: "Vor",
				cmd: function() {
					getWebNavigation().canGoForward && getWebNavigation().goForward();
				}
			},
			"UD": {
				name: "Neu laden ohne Cache",
				cmd: function() {
					BrowserReloadSkipCache();
				}
			},
			"DU": {
				name: "Neu laden",
				cmd: function() {
					gBrowser.mCurrentBrowser.reload();
				}
			},
			"DR": {
				name: "Aktuellen Tab schließen",
				cmd: function() {
					gBrowser.removeCurrentTab();
				}
			},
			"LRL": {
				name: "Andere Tabs schließen",
				cmd: function() {
					var browser = getBrowser(); browser.removeAllTabsBut(browser.mCurrentTab);
				}
			},
			"RLR": {
				name: "Alle Tabs neu laden",
				cmd: function() {
					gBrowser.reloadAllTabs(gBrowser.mContextTab);
				}
			},		
			"RL": {
				name: "Geschlossene Tabs wiederherstellen",
				cmd: function() {
					undoCloseTab();
				}
			},
			"LR": {
				name: "Neuen Tab öffnen",
				cmd: function() {
					BrowserOpenTab();
				}
			},
			"RD": {
				name: "Neustart",
				cmd: function() {
					Application.restart();
				}
			},
			"R": {
				name: "Seitenübersetzung Auto DE",
				cmd: function() {
					var service = "http://translate.google.com/translate?sl=auto&tl=de&u=";
	                var serviceDomain = "translate.google.com";
       	            var targetURI = getWebNavigation().currentURI.spec;	
                    var tab = getBrowser().addTab(service + targetURI, null, null);
                    getBrowser().selectedTab = tab;
				}
			},
			"L": {
				name: "Ziehen & Los",
				cmd: function() {
					var str = readFromClipboard();
                    var ss = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);
                    var submission = ss.currentEngine.getSubmission(str, null);
                    gBrowser.loadOneTab(submission.uri.spec, null, null, submission.postData, false, false);
				}
			},
		},
		init: function () {
			var self = this;
			["mousedown", "mousemove", "mouseup", "contextmenu", "DOMMouseScroll", "dragend"].forEach(function (type) {
				gBrowser.mPanelContainer.addEventListener(type, self, true);
			});
			window.addEventListener("unload", function () {
				["mousedown", "mousemove", "mouseup", "contextmenu", "DOMMouseScroll", "dragend"].forEach(function (type) {
					gBrowser.mPanelContainer.removeEventListener(type, self, true);
				});
			}, false);
		},
		handleEvent: function (event) {
			switch (event.type) {
			case "mousedown":
				if(/object|embed/i.test(event.target.localName)) return;
				if (event.button == 2) {
					this.sourceNode = event.target;
					this.isMouseDownR = true;
					this.hideFireContext = false;
					[this.lastX, this.lastY, this.directionChain] = [event.screenX, event.screenY, ""];
				}
				if (event.button == 2 && this.isMouseDownL) {
					this.isMouseDownR = false;
					this.shouldFireContext = false;
					this.hideFireContext = true;
					this.directionChain = "L>R";
					this.stopGesture(event);
				} else if (event.button == 0) {
					this.isMouseDownL = true;
					if (this.isMouseDownR) {
						this.isMouseDownL = false;
						this.shouldFireContext = false;
						this.hideFireContext = true;
						this.directionChain = "L<R";
						this.stopGesture(event);
					}
				}
				break;
			case "mousemove":
				if (this.isMouseDownR) {
					this.hideFireContext = true;
					var [subX, subY] = [event.screenX - this.lastX, event.screenY - this.lastY];
					var [distX, distY] = [(subX > 0 ? subX : (-subX)), (subY > 0 ? subY : (-subY))];
					var direction;
					if (distX < 10 && distY < 10) return;
					if (distX > distY) direction = subX < 0 ? "L" : "R";
					else direction = subY < 0 ? "U" : "D";
					if(!!~content.document.documentElement.toString().indexOf("HTML")){
						var docfrag = document.createDocumentFragment();
						content.xdTrailArea = content.xdTrailArea || content.document.documentElement.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailArea"));
						if (direction == "R") {
							for (var i = this.lastX, j = this.lastY; i <= event.screenX; i += 2)
							docfrag.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot")).style.cssText = "width:5px; height:5px; background: none repeat scroll 0% 0% #FF7400; border: 0px none; position: absolute; z-index: 2147483647; left:" + (content.pageXOffset + i - content.mozInnerScreenX) + "px;top:" + (content.pageYOffset + (subY < 0 ? (j -= 2 * Math.abs(subY / subX)) : (j += 2 * Math.abs(subY / subX))) - content.mozInnerScreenY) + "px;";
						}
						if (direction == "L") {
							for (var i = this.lastX, j = this.lastY; i >= event.screenX; i -= 2)
							docfrag.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot")).style.cssText = "width:5px; height:5px; background: none repeat scroll 0% 0% #FF7400; border: 0px none; position: absolute; z-index: 2147483647; left:" + (content.pageXOffset + i - content.mozInnerScreenX) + "px;top:" + (content.pageYOffset + (subY < 0 ? (j -= 2 * Math.abs(subY / subX)) : (j += 2 * Math.abs(subY / subX))) - content.mozInnerScreenY) + "px;";
						}
						if (direction == "U") {
							for (var i = this.lastY, j = this.lastX; i >= event.screenY; i -= 2)
							docfrag.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot")).style.cssText = "width:5px; height:5px; background: none repeat scroll 0% 0% #FF7400; border: 0px none; position: absolute; z-index: 2147483647; left:" + (content.pageXOffset + (subX < 0 ? (j -= 2 * Math.abs(subX / subY)) : (j += 2 * Math.abs(subX / subY))) - content.mozInnerScreenX) + "px;top:" + (content.pageYOffset + i - content.mozInnerScreenY) + "px;";
						}
						if (direction == "D") {
							for (var i = this.lastY, j = this.lastX; i <= event.screenY; i += 2)
							docfrag.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot")).style.cssText = "width:5px; height:5px; background: none repeat scroll 0% 0% #FF7400; border: 0px none; position: absolute; z-index: 2147483647; left:" + (content.pageXOffset + (subX < 0 ? (j -= 2 * Math.abs(subX / subY)) : (j += 2 * Math.abs(subX / subY))) - content.mozInnerScreenX) + "px;top:" + (content.pageYOffset + i - content.mozInnerScreenY) + "px;";
						}
						content.xdTrailArea.appendChild(docfrag);
					}
					if (direction != this.directionChain.charAt(this.directionChain.length - 1)) {
						this.directionChain += direction;
						XULBrowserWindow.statusTextField.label = this.GESTURES[this.directionChain] ? "Geste: " + this.directionChain + " - " + this.GESTURES[this.directionChain].name : "Unbekannte Geste: " + this.directionChain;
					}
					this.lastX = event.screenX;
					this.lastY = event.screenY;
				}
				break;
			case "mouseup":
				if (event.ctrlKey && event.button == 2) {
					this.isMouseDownL = false;
					this.isMouseDownR = false;
					this.shouldFireContext = false;
					this.hideFireContext = false;
					this.directionChain = "";
					event.preventDefault();
					XULBrowserWindow.statusTextField.label = "Geste abbrechen";
					break;
				}
				if (this.isMouseDownR && event.button == 2) {
					if (this.directionChain) this.shouldFireContext = false;
					this.isMouseDownR = false;
					this.directionChain && this.stopGesture(event);
				} else if (event.button == 0 && this.isMouseDownL) {
					this.isMouseDownL = false;
					this.shouldFireContext = false;
				}
				if(content.xdTrailArea){
					content.xdTrailArea.parentNode.removeChild(content.xdTrailArea);
					content.xdTrailArea = content.document.documentElement.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailArea"));
				}
				break;
			case "contextmenu":
				if (this.isMouseDownL || this.isMouseDownR || this.hideFireContext) {
					var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
					var contextmenu = pref.getBoolPref("dom.event.contextmenu.enabled");
					pref.setBoolPref("dom.event.contextmenu.enabled", true);
					setTimeout(function () {
						pref.setBoolPref("dom.event.contextmenu.enabled", contextmenu);
					}, 10);
					event.preventDefault();
					event.stopPropagation();
					this.shouldFireContext = true;
					this.hideFireContext = false;
				}
				break;
			case "DOMMouseScroll":
				if (this.isMouseDownR) {
					event.preventDefault();
					event.stopPropagation();
					this.shouldFireContext = false;
					this.hideFireContext = true;
					this.directionChain = "W" + (event.detail > 0 ? "+" : "-");
					this.stopGesture(event);
				}
				break;
			case "dragend":
				this.isMouseDownL = false;
			}
		},
		stopGesture: function (event) {
			(this.GESTURES[this.directionChain] ? this.GESTURES[this.directionChain].cmd(this, event) & (XULBrowserWindow.statusTextField.label = "") : (XULBrowserWindow.statusTextField.label = "Unbekannte Geste: " + this.directionChain)) & (this.directionChain = "");
		}
	};
	ucjsMouseGestures.init()
})()
