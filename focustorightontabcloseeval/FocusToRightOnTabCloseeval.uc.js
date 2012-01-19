(function(){
        try {
            eval("gBrowser._blurTab = " + gBrowser._blurTab.toString().replace('this.selectedTab = tab;', "this.selectedTab = aTab.nextSibling? aTab.nextSibling : tab;"));
        }catch(e){};

})();
