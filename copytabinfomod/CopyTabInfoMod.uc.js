// ==UserScript==
// @name          Copy Tab Info Mod
// @namespace     https://yuukisakura.appspot.com/CopyTabInfoMod.uc.js
// @description   Copy title and URI from the context menu on tab.
// @include       main
// @compatibility Firefox 3.0+
// @version       2011-04-01
// @author        yuukisakura
// @contributor   Gomita
// @homepage      https://yuukisakura.appspot.com/
// @note          original script by http://www.xuldev.org/misc/ucjs.php
// ==/UserScript==
(function(){
	var CopyTabInfoMod=function(){
		this.ja=/ja/.test(getBrowser().mPrefs.getCharPref("general.useragent.locale"));
		this.menuitems=[
			{},
			{"label":this.ja?"\u30BF\u30A4\u30C8\u30EB\u306E\u30B3\u30D4\u30FC":"Titel kopieren","accesskey":"T","modifiers":"accel,alt,shift","key":"T","command":"title"},
			{"label":this.ja?"\u0055\u0052\u0049\u0020\u306E\u30B3\u30D4\u30FC":"URL kopieren","accesskey":this.ja?"L":"I","modifiers":"accel,alt,shift","key":"U","command":"href"},
			{"label":this.ja?"\u30BF\u30A4\u30C8\u30EB\u3068\u0020\u0055\u0052\u0049\u0020\u306E\u30B3\u30D4\u30FC":"Titel und URL kopieren","accesskey":"O","modifiers":"accel,alt,shift","key":"C","command":"(title?title+\"\\r\\n\":\"\")+href"},
			{"label":this.ja?"\u30A2\u30F3\u30AB\u30FC\u30BF\u30B0\u3092\u4F5C\u6210":"Link kopieren","accesskey":"K","modifiers":"accel,alt,shift","key":"A","command":"\"<a href=\\\"\"+htmlentities(href)+\"\\\" title=\\\"\"+htmlentities(title||href)+\"\\\">\"+htmlentities(title||href)+\"</a>\""},
		];
		return this;
	};
	CopyTabInfoMod.prototype={
		init:function(){
			var tabContextMenu=document.createDocumentFragment();
			var mainKeyset=document.createDocumentFragment();
			for(var i in this.menuitems){
				if(this.menuitems[i]["label"]&&this.menuitems[i]["command"]){
					var menuitem=document.createElement("menuitem");
					menuitem.setAttribute("label",this.menuitems[i]["label"]);
					menuitem.setAttribute("tooltiptext",this.menuitems[i]["label"]);
					this.menuitems[i]["accesskey"]?menuitem.setAttribute("accesskey",this.menuitems[i]["accesskey"]):"";
					(function(i){
						menuitem.addEventListener("command",function(){
							_CopyTabInfoMod.main(_CopyTabInfoMod.menuitems[i]["command"]);
						},false);
					})(i);
					if(this.menuitems[i]["modifiers"]&&this.menuitems[i]["key"]){
						menuitem.setAttribute("key","CopyTabInfoMod-"+i);
						var key=document.createElement("key");
						key.setAttribute("id","CopyTabInfoMod-"+i);
						key.setAttribute("modifiers",this.menuitems[i]["modifiers"]);
						key.setAttribute("key",this.menuitems[i]["key"]);
						key.setAttribute("oncommand","(function(main,command){eval(\"(\"+main+\")(\\\"\"+command+\"\\\")\");})("+_CopyTabInfoMod.main.toString()+",\""+_CopyTabInfoMod.menuitems[i]["command"].replace(/["\\]/g,function(string){
							return {"\"":"\\\\\\\"","\\":"\\\\\\\\"}[string];
						})+"\");");
						mainKeyset.appendChild(key);
					}
				}else{
					var menuitem=document.createElement("menuseparator");
				}
				menuitem.setAttribute("class","CopyTabInfoMod");
				tabContextMenu.appendChild(menuitem);
			}
			"tabContextMenu" in gBrowser?"":gBrowser.tabContextMenu=document.getAnonymousElementByAttribute(gBrowser,"anonid","tabContextMenu");
			gBrowser.tabContextMenu.appendChild(tabContextMenu);
			gBrowser.tabContextMenu.addEventListener("popupshowing",function(event){
				event.target===event.currentTarget?Array.forEach(this.getElementsByClassName("CopyTabInfoMod"),function(element){
					element.hidden=gBrowser.getBrowserForTab(document.popupNode)?false:true;
				}):"";
			},false);
			document.getElementById("mainKeyset").appendChild(mainKeyset);
		},
		main:function(command){
			var htmlentities=function(string){
				return string?Components.classes["@mozilla.org/intl/entityconverter;1"].createInstance(Components.interfaces.nsIEntityConverter).ConvertToEntities(string.replace(/["&<>]/g,function(string){
					return {"\"":"&quot;","&":"&amp;","<":"&lt;",">":"&gt;"}[string];
				}),Components.interfaces.nsIEntityConverter.entityW3C):"";
			};
			var href=gBrowser.getBrowserForTab(typeof event==="object"?gBrowser.selectedTab:document.popupNode).currentURI.spec;
			var title=gBrowser.getBrowserForTab(typeof event==="object"?gBrowser.selectedTab:document.popupNode).contentTitle;
			Components.classes["@mozilla.org/widget/clipboardhelper;1"].createInstance(Components.interfaces.nsIClipboardHelper).copyString(eval(command));
		}
	};
	var _CopyTabInfoMod=new CopyTabInfoMod();
	setTimeout(function(){
		_CopyTabInfoMod.init();
	},0);
})();
