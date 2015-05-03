// ==UserScript==
// @name			SuperDrag.uc.js
// @homepageURL		http://www.cnblogs.com/ziyunfei/archive/2011/12/20/2293928.html
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function(event) {
	var self = arguments.callee;
	if (!event) {
		self.GESTURES = {
			image: {
				U: {
					name: "Bild Url kopieren",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("application/x-moz-file-promise-url"));
					}
				},
				UD: {
					name: "Bild kopieren",
					cmd: function(event, self) {
						(document.popupNode = content.document.createElement('img')).src = event.dataTransfer.getData("application/x-moz-file-promise-url");
						goDoCommand('cmd_copyImageContents');
					}
				},
				D: {
					name: "Bild herunterladen",
					cmd: function(event, self) {
						saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, true, null, document);
					}
				},
				L: {
					name: "Bild in neuem Tab öffnen",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
					}
				},
				R: {
					name: "Google Verschlüsselte Bildersuche",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab('https://encrypted.google.com/searchbyimage?image_url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
					}
				},
			},
			link: {
				U: {
					name: "Link Url kopieren",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
					}
				},
				UD: {
					name: "Linktext, Suchen, markieren und kopieren",
					cmd: function(event, self) {
						var linkTXT = event.dataTransfer.getData("text/x-moz-url").split("\n")[1];
						MGs.FindScroll(linkTXT, false);
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(linkTXT);
					}
				},
				D: {
					name: "Link herunterladen",
					cmd: function(event, self) {
						saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, true, null, document);
					}
				},
				DU: {
					name: "Quellentext der verlinkten Seite anzeigen",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab('view-source:' + event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
					}
				},
				L: {
					name: "Google Linkbeschreibung auf deutsch übersetzen",
					cmd: function(event, self) {
						var div = content.document.documentElement.appendChild(content.document.createElement("div"));
						div.style.cssText = "position:absolute;z-index:1000;border:2px solid #FFF;border-radius:5px;background-color:#3B3B3B;padding: 0px 3px 1px 3px;font-size:12pt;box-shadow: 0px 0px 4px #000;color:#FFF;opacity:0.95;left:" + +(event.clientX + content.scrollX + 10) + 'px;top:' + +(event.clientY + content.scrollY + 10) + "px";
						var xmlhttp = new XMLHttpRequest;
						xmlhttp.open("get", "http://translate.google.de/translate_a/t?client=t&hl=de&sl=auto&tl=de&text=" + event.dataTransfer.getData("text/x-moz-url").split("\n")[1], 0);
						xmlhttp.send();
						div.textContent = eval("(" + xmlhttp.responseText + ")")[0][0][0];
						content.addEventListener("click", function(e) {
							if (e.button == 0) {
							Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(div.textContent);
								goDoCommand("cmd_paste");
							}
							else if (e.button == 2) {
							gBrowser.selectedTab = gBrowser.addTab('https://translate.google.de/#auto/de/' + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
							}
							content.removeEventListener("click", arguments.callee, false);
							div.parentNode.removeChild(div);
						}, false);
					}
				},
				LR: {
					name: "Google Linkbeschreibung auf englisch übersetzen",
					cmd: function(event, self) {
						var div = content.document.documentElement.appendChild(content.document.createElement("div"));
						div.style.cssText = "position:absolute;z-index:1000;border:solid 2px rgb(144,144,144);border-radius:5px;background:-moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%);padding: 0px 3px 1px 3px;font-size: 12pt;color: rgb(66,66,66);left:" + +(event.clientX + content.scrollX + 10) + 'px;top:' + +(event.clientY + content.scrollY + 10) + "px";
						var xmlhttp = new XMLHttpRequest;
						xmlhttp.open("get", "http://translate.google.de/translate_a/t?client=t&hl=de&sl=auto&tl=en&text=" + event.dataTransfer.getData("text/x-moz-url").split("\n")[1], 0);
						xmlhttp.send();
						div.textContent = eval("(" + xmlhttp.responseText + ")")[0][0][0];
						content.addEventListener("click", function(e) {
							if (e.button == 0) {
							Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(div.textContent);
								goDoCommand("cmd_paste");
							}
							else if (e.button == 2) {
							gBrowser.selectedTab = gBrowser.addTab('https://translate.google.de/#auto/en/' + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
							}
							content.removeEventListener("click", arguments.callee, false);
							div.parentNode.removeChild(div);
						}, false);
					}
				},
				R: {
					name: "Google verschlüsselte Suche, des markierten Textes",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab("https://encrypted.google.com/search?q={searchTerms}&hl=de&safe=off&tbo=1&tbs=li:1" + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
					}
				},
				RL: {
					name: "Popup-Fenster automatisch auswählen",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
						document.getElementById("AutoSelect-popup").openPopup(null, null, event.screenX, event.screenY);
					}
				},
			},
			text: {
				U: {
					name: "Markierten Text suchen und in Zwischenablage kopiern",
					cmd: function(event, self) {
						var TXT = event.dataTransfer.getData("text/unicode");
						MGs.FindScroll(TXT, false);
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(TXT);
					}
				},
				D: {
					name: "Markierten Text speichern",
					cmd: function(event, self) {
						[/\s(·|::|-|—|»|\|)\s.*/i, /_[^\[\]【】]+$/].forEach(function(r) {content.document.title = content.document.title.replace(r, "");});
						saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(content.location + '\r\n\r\n' + event.dataTransfer.getData("text/unicode")))), content.document.title + ".txt", null, null, true, null, document);
					}
				},
				L: {
					name: "Google Markierten Text, auf deutsch übersetzten",
					cmd: function(event, self) {
						var div = content.document.documentElement.appendChild(content.document.createElement("div"));
						div.style.cssText = "position:absolute;z-index:1000;border:2px solid #FFF;border-radius:5px;background-color:#3B3B3B;padding: 0px 3px 1px 3px;font-size:12pt;box-shadow: 0px 0px 4px #000;color:#FFF;opacity:0.95;left:" + +(event.clientX + content.scrollX + 10) + 'px;top:' + +(event.clientY + content.scrollY + 10) + "px";
						var xmlhttp = new XMLHttpRequest;
						xmlhttp.open("get", "http://translate.google.de/translate_a/t?client=t&hl=de&sl=auto&tl=de&text=" + event.dataTransfer.getData("text/unicode"), 0);
						xmlhttp.send();
						goDoCommand("cmd_cut");
						for(var i = 0; i < xmlhttp.responseText.length; i++) {
							div.textContent += eval("(" + xmlhttp.responseText + ")")[0][i][0];
							content.addEventListener("click", function(e) {
								if (e.button == 0) {
								Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(div.textContent);
									goDoCommand("cmd_paste");
								}
								else if (e.button == 2) {
								gBrowser.selectedTab = gBrowser.addTab('https://translate.google.de/#auto/de/' + encodeURIComponent(event.dataTransfer.getData("text/unicode")));
								}
								content.removeEventListener("click", arguments.callee, false);
								div.parentNode.removeChild(div);
							}, false);
						};
					}
				},
				LR: {
					name: "Google Markierten Text, auf englisch übersetzen",
					cmd: function(event, self) {
						var div = content.document.documentElement.appendChild(content.document.createElement("div"));
						div.style.cssText = "position:absolute;z-index:1000;border:solid 2px rgb(144,144,144);border-radius:5px;background:-moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%);padding: 0px 3px 1px 3px;font-size: 12pt;color: rgb(66,66,66);left:" + +(event.clientX + content.scrollX + 10) + 'px;top:' + +(event.clientY + content.scrollY + 10) + "px";
						var xmlhttp = new XMLHttpRequest;
						xmlhttp.open("get", "http://translate.google.de/translate_a/t?client=t&hl=de&sl=auto&tl=en&text=" + event.dataTransfer.getData("text/unicode"), 0);
						xmlhttp.send();
						goDoCommand("cmd_cut");
						for(var i = 0; i < xmlhttp.responseText.length; i++) {
							div.textContent += eval("(" + xmlhttp.responseText + ")")[0][i][0];
							content.addEventListener("click", function(e) {
								if (e.button == 0) {
								Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(div.textContent);
									goDoCommand("cmd_paste");
								}
								else if (e.button == 2) {
								gBrowser.selectedTab = gBrowser.addTab('https://translate.google.com/#auto/en/' + encodeURIComponent(event.dataTransfer.getData("text/unicode")));
								}
								content.removeEventListener("click", arguments.callee, false);
								div.parentNode.removeChild(div);
							}, false);
						};
					}
				},
				R: {
					name: "Google verschlüsselte Suche, des markierten Text, in neuem Vordergrundtab",
					cmd: function(event, self) {
						var TXT = event.dataTransfer.getData("text/unicode");
						(/^\s*(?:(?:(?:ht|f)tps?:\/\/)?(?:(?:\w+?)(?:\.(?:[\w-]+?))*(?:\.(?:[a-zA-Z]{2,5}))|(?:(?:\d+)(?:\.\d+){3}))(?::\d{2,5})?(?:\/\S*|$)|data:(text|image)\/[\u0025-\u007a]+)\s*$/.test(TXT) && (gBrowser.selectedTab = gBrowser.addTab(TXT))) || (gBrowser.selectedTab = gBrowser.addTab("https://encrypted.google.com/#q=" + encodeURIComponent(TXT)));
					}
				},
				RL: {
					name: "Popup-Fenster automatisch auswählen",
					cmd: function(event, self) {
						document.getElementById("AutoSelect-popup").openPopup(null, null, event.screenX, event.screenY);
					}
				},
			},
		};
		["dragstart", "dragover", "drop"].forEach(function(type) {
			gBrowser.mPanelContainer.addEventListener(type, self, false);
		});
		window.addEventListener("unload", function() {
			["dragstart", "dragover", "drop"].forEach(function(type) {
				gBrowser.mPanelContainer.removeEventListener(type, self, false);
			});
		}, false);
		return;
	}
	switch (event.type) {
	case "dragstart":
		{
			self.lastPoint = [event.screenX, event.screenY];
			self.sourceNode = event.target;
			self.directionChain = "";
			event.target.localName == "img" && event.dataTransfer.setData("application/x-moz-file-promise-url", event.target.src);
			if (event.dataTransfer.types.contains("application/x-moz-file-promise-url")) {
				self.type = "image";
			} else if (event.dataTransfer.types.contains("text/x-moz-url")) {
				self.type = "link";
			} else {
				self.type = "text";
			}
			break;
		}
	case "dragover":
		{
			if (!self.lastPoint) return;
			Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService).getCurrentSession().canDrop = true;
			var [subX, subY] = [event.screenX - self.lastPoint[0], event.screenY - self.lastPoint[1]];
			var [distX, distY] = [(subX > 0 ? subX : (-subX)), (subY > 0 ? subY : (-subY))];
			var direction;
			if (distX < 10 && distY < 10) return;
			if (distX > distY) direction = subX < 0 ? "L" : "R";
			else direction = subY < 0 ? "U" : "D";
			if (direction != self.directionChain.charAt(self.directionChain.length - 1)) {
				self.directionChain += direction;
				XULBrowserWindow.statusTextField.label = self.GESTURES[self.type][self.directionChain] ? "Geste: " + self.directionChain + " " + self.GESTURES[self.type][self.directionChain].name : "Unbekannt: " + self.directionChain;
				self.cmd = self.GESTURES[self.type][self.directionChain] ? self.GESTURES[self.type][self.directionChain].cmd : "";
			}
			self.lastPoint = [event.screenX, event.screenY];
			break;
		}
	case "drop":
		{
			if (self.lastPoint && event.target.localName != "textarea" && (!(event.target.localName == "input" && (event.target.type == "text" || event.target.type == "password"))) && event.target.contentEditable != "true") {
				event.preventDefault();
				event.stopPropagation();
				self.lastPoint = XULBrowserWindow.statusTextField.label = "";
				self.cmd && self.cmd(event, self);
			}
		}
	}
})()
