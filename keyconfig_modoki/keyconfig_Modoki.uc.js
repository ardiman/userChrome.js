// ==UserScript==
// @name           keyconfig_Modoki.uc.js
// @namespace      http://d.hatena.ne.jp/Griever/
// @description    keyconfig(you can define hotkeys with the script)
// @include        main
// ==/UserScript==
(function(){
var keymap = {
'8':'backspace','9':'tab','12':'tenkey5','13':'enter','16':'shift','17':'ctrl','18':'alt',
'19':'pausebreak','20':'shift+capslock','27':'esc','32':'space',
'33':'pageup','34':'pagedown','35':'end','36':'home',
'37':'left','38':'up','39':'right','40':'down','45':'insert','46':'delete',
'48':'0','49':'1','50':'2','51':'3','52':'4','53':'5','54':'6','55':'7','56':'8','57':'9','59':':','61':';',
'65':'a','66':'b','67':'c','68':'d','69':'e','70':'f','71':'g','72':'h','73':'i',
'74':'j','75':'k','76':'l','77':'m','78':'n','79':'o','80':'p','81':'q','82':'r',
'83':'s','84':'t','85':'u','86':'v','87':'w','88':'x','89':'y','90':'z',
'91':'leftwindows','92':'rightwindows',
'96':'0','97':'1','98':'2','99':'3','100':'4','101':'5','102':'6','103':'7','104':'8','105':'9',
'106':'*','107':'+','109':'-','110':'.','111':'/',
'112':'f1','113':'f2','114':'f3','115':'f4','116':'f5','117':'f6',
'118':'f7','119':'f8','120':'f9','121':'f10','122':'f11','123':'f12',
'144':'numlock','145':'scrolllock',
'188':',','190':'.','191':'/','192':'@','219':'[','220':'\\','221':']','222':'^','226':'\\',
'240':'capslock',
};

function $(id){ return document.getElementById(id)}

function keyconfig(e){
    if (/^(input|textarea|select|textbox)$/i.test(e.target.localName)) return;
    var keycode = e.keyCode;
    if (keycode >= 16 && keycode <= 18) return;
    var command = keymap[keycode] + (e.ctrlKey?'+ctrl':'') + (e.shiftKey?'+shift':'') + (e.altKey?'+alt':'');

/* ??????????????+????ctrl·shift·alt???  ?????+ctrl·shift·alt+??????? */
    switch(command){//uc.js??????????
        case '4' : if (gBrowser.sessionHistory.index > 0)
gBrowser.gotoIndex(0); break;//??
        case '5' : var nav = gBrowser.webNavigation;
var hist = nav.sessionHistory;
nav.gotoIndex(hist.count - 1); break;//??
        case '+' : $("cmd_fullZoomEnlarge").doCommand(); break;//?? - ??
        case '-' : $("cmd_fullZoomReduce").doCommand(); break;//?? - ??
       
var ff= document.getElementById("content");
var tab = ff.addTab(myUrl);
ff.selectedTab = tab;break;//??????
        case 'z' : gBrowser.mTabContainer.advanceSelectedTab(-1, true); break;//?????
        case 'x' : gBrowser.mTabContainer.advanceSelectedTab(+1, true); break;//?????
        case 'y': BrowserOpenTab(); break;
            //keyconfig?????????????????????:
        case 'f': gFindBar.hidden ? gFindBar.onFindCommand() : gFindBar.close(); break;//?????
        case '0': FullZoom.reset(); break;//?? - ??
        case 'r': document.getElementById("Browser:ReloadSkipCache").doCommand(); break;//??
        case 's': const bmToolbar = document.getElementById("PersonalToolbar");
bmToolbar.collapsed = !bmToolbar.collapsed; break;//?????
        case 'g': function tbtoggle (thisBTN)
{thisBTN.checked = !thisBTN.checked;
if ( thisBTN.checked )
{gBrowser.setStripVisibilityTo(false);
gBrowser.mPrefs.setBoolPref("browser.tabs.forceHide", true);}
else
{gBrowser.setStripVisibilityTo(true);
gBrowser.mPrefs.setBoolPref("browser.tabs.forceHide", false);}}
tbtoggle(this); break;//???
       
        case 'm': document.getElementById("Browser:ToggleTabView").doCommand(); break;//???
        case 'b': window.minimize(); break;//???;window.setTimeout('window.restore()',600)
        case 'u': var uri = gBrowser.currentURI;if (uri.path == '/')return;var pathList = uri.path.split('/');if (!pathList.pop())pathList.pop();loadURI(uri.prePath + pathList.join('/') + '/'); break;//????
       
        case 'p': Components.classes["@mozilla.org/file/directory_service;1"].
getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).launch(); break;//????
        case 'i': var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);
appStartup.quit(appStartup.eForceQuit | appStartup.eRestart); break;//????
        case 'a': toOpenWindowByType('Add-ons:manager',
'chrome://mozapps/content/extensions/extensions.xul'); break;//????
       
        case 'l': openPreferences(); break;//????
        case 'q': gPrefService.setBoolPref("browser.sessionstore.resume_session_once", true);
goQuitApplication(); break;//????
        case 'd': var tab = gBrowser.mCurrentTab; gBrowser.removeTab(tab); break;//??????
      
        case 'y': document.getElementById("cmd_newNavigatorTab").doCommand();document.getElementById("searchbar").focus();goDoCommand('cmd_selectAll'); break;//????
        case 'o': toOpenWindowByType('pref:pref', 'About:config'); break;//??????about:config
        case 'n': document.getElementById("View:FullScreen").doCommand(); break;//??
   
        case 'v': undoCloseTab(); break;//???????
        case 'h': toggleSidebar('viewHistorySidebar'); break;//?????
      
        case "e":
            const IE_PATH = "C:\\Programme\\Internet Explorer\\iexplore.exe";

var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
file.initWithPath(IE_PATH);
if (!file.exists()) {
  alert("File does not exist: " + IE_PATH);
  return;
}
var process  = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
try {
  var args = [window.content.location.href];
  process.init(file);
  process.run(false, args, args.length);
}
catch (ex) {
  alert("Failed to execute: " + IE_PATH);
} break;
     
        case 'j': goDoCommand('cmd_scrollLineUp');//????
        case 'k': goDoCommand('cmd_scrollLineDown');//????
//
        default: return;
       
    }
    e.preventDefault();
}

gBrowser.mPanelContainer.addEventListener('keydown', keyconfig, false);
})();