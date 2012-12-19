location == "chrome://browser/content/browser.xul" && gBrowser.addEventListener("DOMWindowCreated", function (event) {
        var self = arguments.callee;
        if (!self.showFlag) {
                self.showFlag = document.querySelector("#status-bar").appendChild(document.createElement("statusbarpanel")).appendChild(document.createElement("image"));
                document.getAnonymousElementByAttribute(self.showFlag.parentNode, "class", "*").hidden = true;
                self.showFlag.style.width = "16px";
                window.addEventListener("TabSelect", self, false);
                self.showFlag.src = self.flag = "http://www.www.worldcat.org/wcpa/rel20111216/images/flag_red.gif"
                self.tooltiptext = "Standort";
                self.isReqHash = [];
                self.showFlagHash = [];
                self.showLocationHash = [];
                self.debug = function(aMsg) {
                                                const Cc = Components.classes;
                                                const Ci = Components.interfaces;
                                                Cc["@mozilla.org/consoleservice;1"]
                                                        .getService(Ci.nsIConsoleService)
                                                        .logStringMessage(aMsg);
                                        };
        }
        function LOG(msg) {
                var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                                                        .getService(Components.interfaces.nsIConsoleService);
                consoleService.logStringMessage(msg);
        }
        try {
                var host = (event.originalTarget.location || content.location).hostname;
                if (!/tp/.test(content.location.protocol) || !host || self.isReqHash[host]) {
                        (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
                        (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.setAttribute("tooltiptext", self.tooltiptext));
                        return
                }
                Components.classes["@mozilla.org/network/dns-service;1"].getService(Components.interfaces.nsIDNSService).asyncResolve(host, 0, {
                        onLookupComplete: function (inRequest, inRecord, inStatus) {
                                var ip = inRecord.getNextAddrAsString();
                                var server = (gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Components.interfaces.nsIHttpChannel).getResponseHeader("server").match(/\w+/) || ["Unbekannt"])[0];
                                if (!self.showFlagHash[host] || !self.showLocationHash[host]) {
                                        (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag) && (self.showFlag.setAttribute("tooltiptext", self.tooltiptext));
                                        self.isReqHash[host] = true;
                                        var httpRequest = new XMLHttpRequest();
                                        httpRequest.open("GET", 'http://phyxt8.bu.edu/iptool/geoip.php?ip=' + ip, true);
                                        httpRequest.send(null);
                                        httpRequest.onload = function () {
                                                if (httpRequest.status == 200) {
                                                        self.showFlagHash[host] = (httpRequest.responseText.match(/[^;]+;[^;]+; ([^;]+);/) || ["", "DE"])[1].toLocaleLowerCase();
                                                        host == content.location.hostname && (self.showFlag.src = "http://www.razerzone.com/asset/images/icons/flags/" + self.showFlagHash[host] + ".gif");
                                                }
                                                self.isReqHash[host] = false;
                                        }

                                        var request = new XMLHttpRequest();
                                        request.open("GET", 'http://www.cz88.net/ip/index.aspx?ip=' + ip, true);
                                        request.send(null);
                                        request.onload = function () {
                                                if (request.status == 200) {
                                                        self.showLocationHash[host] = request.responseText.match(/"InputIPAddrMessage">([^<]+)/)[1].replace(/\s*CZ88.NET.*/, "") + "  " + server + "  " + ip;
                                                        host == content.location.hostname && (self.showFlag.setAttribute("tooltiptext", self.showLocationHash[host]));
                                                }
                                                self.isReqHash[host] = false;
                                        }
                                } else {
                                        host == content.location.hostname && (self.showFlag.src = "http://www.razerzone.com/asset/images/icons/flags/" + self.showFlagHash[host] + ".gif");
                                        host == content.location.hostname && (self.showFlag.setAttribute("tooltiptext", self.showLocationHash[host]));
                                }
                                LOG("self.showFlagHash[" + host + "]: " + self.showFlagHash[host]);
                                LOG("self.showLocationHash[" + host + "]: " + self.showLocationHash[host]);
                                self.debug(self.showFlag.src);
                        }
                }, null);
        } catch (e) {
                (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
                (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.setAttribute("tooltiptext", self.tooltiptext));
        }
}, false)