// ==UserScript==
// @name           allowTab.uc.js
// @description    タブごとに画像や JS の有効/無効を切り替える
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @compatibility  Firefox 4
// @version        0.0.1
// ==/UserScript==

var allowTab = {
	list : ["allowImages", "allowJavascript", "allowMetaRedirects", "allowPlugins", "allowSubframes"],
	init: function(){
		this.popup = document.getElementById('tabContextMenu') || 
		             document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu");
		this.popup.appendChild(document.createElement('menuseparator'));

		this.menuitems = this.list.map(function(type){
			var menuitem = document.createElement('menuitem');
			menuitem.setAttribute("type", "checkbox");
			menuitem.setAttribute("autocheck", "false");
			menuitem.setAttribute("checked", "true");
			menuitem.setAttribute("label", type);
			menuitem.setAttribute("id", type);
			menuitem.setAttribute("onclick", "if (event.button===1) { allowTab.onCommand(event); this.setAttribute('checked', this.getAttribute('checked') != 'true'); }");
			menuitem.setAttribute("oncommand", "allowTab.onCommand(event);");
			return this.popup.appendChild(menuitem);
		}, this);

		this.separator = this.popup.appendChild( document.createElement('menuseparator') );
		this.popup.addEventListener('popupshowing', this, false);
	},
	uninit: function(){
		this.popup.removeEventListener('popupshowing', this, false);
	},
	destroy: function() {
		this.uninit();
		this.separator.parentNode.removeChild(this.separator);
		this.menuitems.forEach(function(e){ e.parentNode.removeChild(e); });
	},
	handleEvent : function(event){
		switch(event.type){
			case 'popupshowing':
				if (event.target != event.currentTarget) return;

				var tab = document.popupNode || this.popup.triggerNode;
				if (tab.localName != 'tab')
					tab = gBrowser.mCurrentTab;

				var docShell = tab.linkedBrowser.docShell;
				this.menuitems.forEach(function(m){
					m.setAttribute("checked", docShell[m.id]);
				}, this);
				break;
		}
	},
	onCommand: function(event) {
		var command = event.currentTarget.id;
		var tab = document.popupNode || this.popup.triggerNode;
		if (tab.localName != 'tab')
			tab = gBrowser.mCurrentTab;

		var docShell = tab.linkedBrowser.docShell;
		docShell[command] = !docShell[command];
	}
}

allowTab.init();


// 新しタブでリンクを開いた際に設定を受け継がせる
if (window.openLinkIn) {
	window.openLinkIn_org = openLinkIn;
	eval("openLinkIn = " + openLinkIn_org.toString().replace(
		/browser\.loadOneTab.*/,
		"let own = browser.mCurrentTab;let tab = $&" + <![CDATA[
		if (aReferrerURI) {
			let ownShell = own.linkedBrowser.docShell;
			let docShell = tab.linkedBrowser.docShell;
			["allowImages", "allowJavascript", "allowMetaRedirects", "allowPlugins", "allowSubframes"]
			.forEach(function(a){
				docShell[a] = ownShell[a];
			});
		}
		]]>.toString()
	));
}
