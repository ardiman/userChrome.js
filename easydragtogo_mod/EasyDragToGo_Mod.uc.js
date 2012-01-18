// Bilder, Links, Übersetzung gehen in neuem Tab im Vordergrund auf

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
                                var t = content.getSelection().toString();
                                if (distX > distY) direction = subX < 0 ? "L" : "R";
                                else direction = subY < 0 ? "U" : "D";
                                if (event.dataTransfer.types.contains("application/x-moz-file-promise-url")) {
                                                if (direction == "L") {
                                                //Bild speichern[links]
                                                saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"));
                                                return;
                                        }
                                        if (direction == "R") {
                                                //Bild in neuem Tab öffnen[rechts]
                                        gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
                                                return;
                                        }
                                } else if (getBrowserSelection()){
                                                if (direction == "R") {
                                        //Ausgewählten Text mit Google suchen[rechts]
                                        gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/search?q=" + t);
                                        return;
                                        }
                                        if (direction == "L") {
                                        //Google Übersetzung aller Sprachen ins Deutsche des ausgewählten Textes[links]
                                        gBrowser.selectedTab = gBrowser.addTab("http://translate.google.com/translate_t?hl=de-DE#auto|de-DE|"+t);
                                        return;
                                        }
                                        if (direction == "D") {
                                                //Ausgewählen Text speichern[runter]
                                                saveImageURL("data:text/plain;charset=UTF-8;base64," + btoa(unescape(encodeURIComponent(event.dataTransfer.getData("text/unicode")))), event.dataTransfer.getData("text/unicode").slice(0, 5) + ".txt");
                                                return;
                                        }
                                        if (direction == "U") {
                                                //Identifizierung von Text-URLs und Öffnen in neuem Tab[hoch]
                                                /^([a-z]+:\/\/)?([a-z]([a-z0-9\-]*\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-z][a-z0-9_]*)?$/.test(event.dataTransfer.getData("text/unicode")) && (gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode")));
                                                return;
                                        }
                                } else if (event.dataTransfer.types.contains("text/x-moz-url")) {
                                        //Link in neuem Tab öffnen[alle Seiten]
                                        gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
                                }
                                self.startPoint = 0;
                        }
                }
        }
})()