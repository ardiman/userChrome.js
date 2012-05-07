/* TabsOpenRelative.uc.js */

(function() {
	getBrowser().__uc_addedTabs = 0;
	eval("gBrowser.addTab = " + gBrowser.addTab.toString().replace(/\{/, "$& var __oldTabPos = this.mCurrentTab._tPos;").replace(/return /, "if (!blank) this.moveTabTo(t, __oldTabPos + 1 + this.__uc_addedTabs++); $&"));
	eval("gBrowser.moveTabTo = " + gBrowser.moveTabTo.toString().replace(/{/, "$& if (aTab == this.mCurrentTab) this.__uc_addedTabs = 0;"));
	gBrowser.mTabContainer.addEventListener("select", function() { gBrowser.__uc_addedTabs = 0; }, false);
})();
