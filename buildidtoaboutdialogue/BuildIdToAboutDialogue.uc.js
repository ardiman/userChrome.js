/** Build-ID im About-Dialog (Über Firefox) **/
var addBuildid = {
  buildid: function (){
    if ("@mozilla.org/xre/app-info;1" in Components.classes &&
        Components.classes["@mozilla.org/xre/app-info;1"]
          .getService(Components.interfaces.nsIXULAppInfo) &&
        Components.classes["@mozilla.org/xre/app-info;1"]
          .getService(Components.interfaces.nsIXULAppInfo).appBuildID)
     var buildid = Components.classes["@mozilla.org/xre/app-info;1"]
                         .getService(Components.interfaces.nsIXULAppInfo).appBuildID;
    return buildid;
  },
  addBuildid: function () {
    var userAgentField = document.getElementById("userAgent");
    if (userAgentField) {
      var ua = userAgentField.value;
      var label = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", 'description');
      label.textContent = ua;
      userAgentField.parentNode.appendChild(label);
    } else {
      ua = navigator.userAgent;
      userAgentField = document.getElementById("rightBox");
      var label = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", 'textbox');
      userAgentField = userAgentField.appendChild(label);
      userAgentField.setAttribute("id", "agent");
      userAgentField.setAttribute("value", ua);
      userAgentField.setAttribute("multiline", true);
      userAgentField.setAttribute("rows", "5");
    }
    var name = Components.classes["@mozilla.org/xre/app-info;1"]
             .getService(Components.interfaces.nsIXULAppInfo).name +
             "/" +
             Components.classes["@mozilla.org/xre/app-info;1"]
             .getService(Components.interfaces.nsIXULAppInfo).version;
    ua.match(/(.*Gecko\/\d+\b)/);
    ua = RegExp.$1 + " " + this.convUA(name) + " ID:" + this.buildid();
    userAgentField.value = this.getBuildSource() + "\n" + ua;
    userAgentField.setAttribute("value", this.getBuildSource() + "\n" + ua);
    window.resizeBy(0, 120);
  },
  convUA: function(ua){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIWebNavigation)
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                       .rootTreeItem
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIDOMWindow);
    var pref = Components.classes['@mozilla.org/preferences-service;1']
                         .getService(Components.interfaces.nsIPrefBranch);
    const kUA = "general.useragent.extra.firefox";
    const kUA2 = "general.useragent.override";
    var UA = navigator.userAgent;
    if (pref.prefHasUserValue(kUA) || pref.prefHasUserValue(kUA2)){
      try {
        var oldId = pref.getCharPref(kUA);
        pref.clearUserPref(kUA);
      } catch (e) {
        oldId = "";
      }
      try {
        var oldId2 = pref.getCharPref(kUA2);
        pref.clearUserPref(kUA2);
      } catch (e) {
        oldId2 = "";
      }
      UA = navigator.userAgent;
      if (!!oldId)
        pref.setCharPref(kUA, oldId);
      if (!!oldId2)
        pref.setCharPref(kUA2, oldId2);
    };
    if (/Firefox/.test(UA))
      return ua;
    if (/4\.0[ab]?.?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'Minefield');
    if (/3\.7[ab]?.?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'Minefield');
    if (/3\.6[ab]?.?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'Namoroka');
    if (/3\.5[ab]?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'Shiretoko');
    if (/3\.1[ab]?.?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'Shiretoko');
    if (/3\.0\.\d[ab]?.?\d?pre/.test(ua))
      ua = ua.replace(/Firefox/, 'GranParadiso');
    return ua;
  },
  copyUA: function (){
    var userAgentField = document.getElementById("userAgent");
    if (!userAgentField)
      userAgentField = document.getElementById("agent");
    Components.classes["@mozilla.org/widget/clipboardhelper;1"]
      .getService(Components.interfaces.nsIClipboardHelper).copyString(userAgentField.value);
  },
  getBuildSource: function (){
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    const ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    const fph = ios.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
    const ds = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);
    var file = ds.get("CurProcD", Ci.nsIFile);
    file.append("application.ini");
    var text = this.readFile(file);
    var SourceRepository = text.match(/SourceRepository=(.*)/)[1];
    var SourceStamp = text.match(/SourceStamp=(.*)/)[1];
    return SourceRepository + "/rev/" + SourceStamp;
  },
  readFile: function (aFile){
        var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].
                                createInstance(Components.interfaces.nsIFileInputStream);
        stream.init(aFile, 0x01, 0, 0);
        var cvstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
                                  createInstance(Components.interfaces.nsIConverterInputStream);
        cvstream.init(stream, "UTF-8", 1024,
                      Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
        var content = "", data = {};
        while (cvstream.readString(4096, data)) {
          content += data.value;
        }
        cvstream.close();
        return content.replace(/\r\n?/g, "\n");
   }
}
addBuildid.addBuildid();
addBuildid.copyUA();