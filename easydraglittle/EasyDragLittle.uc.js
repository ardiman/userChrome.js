// EasyDragLittle.uc.js Script für die userChrome.js

location == "chrome://browser/content/browser.xul" && (function(event) {
	var self = arguments.callee;
	if (!event) {
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
			self.startPoint = [event.screenX, event.screenY];
			self.sourceNode = event.target;
			event.target.localName == "img" && event.dataTransfer.setData("application/x-moz-file-promise-url", event.target.src);
			break;
		}
	case "dragover":
		{
			self.startPoint && (Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService).getCurrentSession().canDrop = true);
			break;
		}
	case "drop":
		{
			if (self.startPoint && event.target.localName != "textarea" && (!(event.target.localName == "input" && (event.target.type == "text" || event.target.type == "password"))) && event.target.contentEditable != "true") {
				event.preventDefault();
				event.stopPropagation();
				var [subX, subY] = [event.screenX - self.startPoint[0], event.screenY - self.startPoint[1]];
				var [distX, distY] = [(subX > 0 ? subX : (-subX)), (subY > 0 ? subY : (-subY))];
				var direction;
				if (distX > distY) direction = subX < 0 ? "L" : "R";
				else direction = subY < 0 ? "U" : "D";
				if (event.dataTransfer.types.contains("application/x-moz-file-promise-url")) {
					if (direction == "U") {
						//Bild in neuem Tab öffnen[hoch]
						gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
						return;
					}
					if (direction == "D") {
						//Bild in neuem Tab öffnen[runter]
						gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
						return;
					}
					if (direction == "L") {
						//Bild herunterladen[links]
						saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), 0, 0, 0, 1);
						return;
					}
					if (direction == "R") {
						//Suche nach ähnlichen Bildern mit Google[rechts]
						gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/searchbyimage?image_url=" + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
						return;
					}
				} else if (event.dataTransfer.types.contains("text/x-moz-url")) {
					//Link in neuem Tab öffnen[alle Seiten]
					gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
				} else {
					//Suchfeld Suche nach markiertem Text mit der ausgewählten Suchmaschine[alle Seiten]
					gBrowser.selectedTab = gBrowser.addTab();
					BrowserSearch.loadSearch(event.dataTransfer.getData("text/unicode"), false);
				}
				self.startPoint = 0;
			}
		}
	}
})()
