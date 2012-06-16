location == "chrome://browser/content/browser.xul" && gBrowser.addEventListener("DOMWindowCreated", function (event) {
	var self = arguments.callee;
	if (!self.showFlag) {
		self.showFlag = document.querySelector("#status-bar").appendChild(document.createElement("statusbarpanel")).appendChild(document.createElement("image"));
		document.getAnonymousElementByAttribute(self.showFlag.parentNode, "class", "*").hidden = true;
		self.showFlag.style.width = "16px";
		window.addEventListener("TabSelect", self, false);
		self.showFlag.src = self.flag = "http://www.www.worldcat.org/wcpa/rel20111216/images/flag_red.gif"
		self.isReqHash = [];
		self.showFlagHash = [];
	}
	try {
		var host = (event.originalTarget.location || content.location).hostname;
		if (!/tp/.test(content.location.protocol) || !host || self.isReqHash[host]) {
			(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
			return
		}
		var ip = Components.classes["@mozilla.org/network/dns-service;1"].getService(Components.interfaces.nsIDNSService).resolve(host, 0).getNextAddrAsString();
		if (!self.showFlagHash[host]) {
			(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
			self.isReqHash[host] = true;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://phyxt8.bu.edu/iptool/geoip.php?ip=' + ip, true);
			req.send(null);
			req.onload = function () {
				if (req.status == 200) {
					self.showFlagHash[host] = (req.responseText.match(/[^;]+;[^;]+; ([^;]+);/) || ["", "DE"])[1];
					host == content.location.hostname && (self.showFlag.src = "http://www.1108.hk/images/ext/" + self.showFlagHash[host] + ".gif");
				}
				self.isReqHash[host] = false;
			}
		} else {
			host == content.location.hostname && (self.showFlag.src = "http://www.1108.hk/images/ext/" + self.showFlagHash[host] + ".gif");
		}
	} catch (e) {
		(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
	}
}, false)
