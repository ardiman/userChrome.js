// ==UserScript==
// @name            showLocationModEx.uc.js
// @charset         UTF-8
// @description     显示国旗与IP
// @include         chrome://browser/content/browser.xul
// @author          紫云飞
// @note            version20130516: mod by lastdream2013 
// ==/UserScript==

(function(){
//改这里选择是否加载本地国旗图标库，不存在或路径错误自动切换从网络中读国旗图标
var localFlagPath = "lib\\countryflags.js";  // 注意是相对路径： profile\chrome\lib\countryflags.js
//改这里选择显示国旗图标/IP位置，如果是identity-box为地址栏前端显示，会自动加载隐藏page-proxy-favicon css配合显示效果
var showLocationPos = "identity-box";    	// urlbar-icons   identity-box addon-bar status-bar 等等  

//下面的不知道不要动
var IsUserLocalFlag = false;
localFlagPath.path = localFlagPath.replace(/\//g, '\\');
var FullPath = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("UChrm", Ci.nsILocalFile).path;
if (/^(\\)/.test(localFlagPath)) {
    FullPath = FullPath +localFlagPath;
}
else{
	FullPath = FullPath + "\\" + localFlagPath;
}

var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
file.initWithPath(FullPath);
if (file.exists()) {
	IsUserLocalFlag = true;
	userChrome.import(localFlagPath, "UChrm");
}
        
location == "chrome://browser/content/browser.xul" && gBrowser.addEventListener("DOMWindowCreated", function (event) {

if (  showLocationPos == "identity-box" ){
var cssStr =('\
#page-proxy-favicon,\
#identity-icon-label,\
#identity-icon-country-label {\
 visibility: collapse !important;\
}\
');
var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
document.insertBefore(style, document.documentElement);
}

var self = arguments.callee;
if (!self.showLocation) {
    window.addEventListener("TabSelect", self, false);
    self.showLocation = document.getElementById(showLocationPos);
 
    self.showFlag = self.showLocation.appendChild(document.createElement("image"));
    //单击时复制
    self.showFlag.addEventListener("click", function () {
        Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(self.showFlag.tooltipText);
    }, false);
    
    //self.showFlag.style.width = "16px";
    //self.showFlag.style.Maxheight = "16px";
    if (  showLocationPos == "identity-box" ){
        self.showFlag.style.marginLeft = "4px";
        self.showFlag.style.marginRight = "2px";
    }
    
    //设置等待时国旗图标
    self.showFlag.src = self.flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";
    self.isReqLocationHash = [];
    self.isReqFlagHash = [];
    self.showFlagTooltipHash = [];
    self.showFlagHash = [];
    self.flagPath = 'http://www.razerzone.com/asset/images/icons/flags/'    //备用：self.flagPath = 'http://www.1108.hk/images/ext/'
}
try {
    var host = (event.originalTarget.location || content.location).hostname;
    if (!/tp/.test(content.location.protocol) || !host || self.isReqLocationHash[host]) {
        (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag) && (self.showFlag.tooltipText = "");
        return
    }
    var ip = Components.classes["@mozilla.org/network/dns-service;1"].getService(Components.interfaces.nsIDNSService).resolve(host, 0).getNextAddrAsString();
    var server = (gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Components.interfaces.nsIHttpChannel).getResponseHeader("server").match(/\w+/) || ["\u672A\u77E5"])[0];
    
    if (!self.showFlagTooltipHash[host]) {
        (event.type == "TabSelect" || event.originalTarget == content.document);
        self.isReqLocationHash[host] = true;
        let req = new XMLHttpRequest();
        req.open("GET", 'http://www.cz88.net/ip/index.aspx?ip=' + ip, true);
        req.send(null);
        req.onload = function () {
            if (req.status == 200) {
				var lmsg = req.responseText.match(/"InputIPAddrMessage">([^<]+)/);
				if ( lmsg )
					var location = lmsg[1].replace(/\s*CZ88.NET.*/, "") + " \n";
				else 
					var location = "";
                //设置文字提示内容
                //self.showFlagTooltipHash[host] = location + server + " \n" + ip;
                self.showFlagTooltipHash[host] = server + " \n" + ip;
                host == content.location.hostname && (self.showFlag.tooltipText = self.showFlagTooltipHash[host]);
            }
            self.isReqLocationHash[host] = false;
        }
    } else {
        host == content.location.hostname && (self.showFlag.tooltipText = self.showFlagTooltipHash[host]);
    }
    
    if (!self.showFlagHash[host]) {
        (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
        self.isReqFlagHash[host] = true;
        let req = new XMLHttpRequest();
        req.open("GET", 'http://freegeoip.net/json/' + ip, true);
        req.send(null);
        req.onload = function () {
            if (req.status == 200) {
                //self.showFlagHash[host] = (req.responseText.match(/"country_code": "([^"]+)/) || ["", "CN"])[1].toLocaleLowerCase();
                var responseObj =JSON.parse(req.responseText);
                self.showFlagHash[host] =responseObj.country_code.toLocaleLowerCase();

                host == content.location.hostname;
                 if (IsUserLocalFlag) { self.showFlag.src = CountryFlags[self.showFlagHash[host]];  }
                 else { self.showFlag.src = self.flagPath + self.showFlagHash[host] + ".gif"; }
            }
            self.isReqFlagHash[host] = false;
        }
    } else {
    	        host == content.location.hostname;
                 if (IsUserLocalFlag) { self.showFlag.src = CountryFlags[self.showFlagHash[host]];  }
                 else { self.showFlag.src = self.flagPath + self.showFlagHash[host] + ".gif"; }
    }
} catch (e) {
    (event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag) && (self.showFlag.tooltipText = "");
}
}, false)
})();
