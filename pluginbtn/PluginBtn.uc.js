location == "chrome://browser/content/browser.xul" && (function() {
	var TYPE = 0; // 0: Schaltfläche  2: Eintrag in Extras Menü
	if (TYPE == 0) {
		var Icon = $("nav-bar-customization-target").appendChild($C("toolbarbutton", {
			id: "Plugin-button",
			class: "toolbarbutton-1",
			type: "menu",
		}));
	}
	else if (TYPE == 2) {
		var dTS = $("devToolsSeparator");
		var Icon = dTS.parentNode.insertBefore($C("menu", {
			id: "Plugin-Menu",
			class: "menu-iconic",
		}), dTS);
	}
	Icon.setAttribute("label", "Plugin-Menü");
	Icon.setAttribute("tooltiptext", "Plugins-Menü");
	Icon.setAttribute("image", "chrome://mozapps/skin/plugins/pluginGeneric-16.png");
	Icon.appendChild($C("menupopup")).addEventListener("popupshowing", showPluginList, false);

	function showPluginList(node) {
		node = node.target;
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
		var AddonManager = Components.utils.import('resource://gre/modules/AddonManager.jsm').AddonManager;
		AddonManager.getAddonsByTypes(["plugin"], function(plugin) {
			var item = [];
			for(var i = 0; i < plugin.length; i++) {
				item[i] = node.appendChild(document.createElement("menuitem"));
				item[i].setAttribute("label", plugin[i].name+ ' [' + plugin[i].version + ']');
				item[i].setAttribute("type", "checkbox");
				item[i].setAttribute("checked", !plugin[i].userDisabled);
				item[i].setAttribute("Disabled", plugin[i].appDisabled);
				item[i].setAttribute("pluginID", plugin[i].id);
				item[i].onclick = function(evt) {
					AddonManager.getAddonByID(evt.target.getAttribute("pluginID"), function(p) {
						p.userDisabled = p.userDisabled ? false : true;
					});
				}
			}
		});
	}

	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})();
