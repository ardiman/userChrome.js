var tab_hover={
   event:null,
   tid:null,

   onLoad: function() {
      gBrowser.tabContainer.addEventListener("mouseout", tab_hover.onMouseOut, false);
      gBrowser.tabContainer.addEventListener("mouseover", tab_hover.onMouseOver, false);
   },
   onUnload: function() {
      gBrowser.tabContainer.removeEventListener("mouseover", tab_hover.onMouseOver, false);
      gBrowser.tabContainer.removeEventListener("mouseout", tab_hover.onMouseOut, false);
   },

   onMouseOver: function(event) {
      tab_hover.event=event.target;
      tab_hover.tid=setTimeout( function(){ gBrowser.selectedTab=tab_hover.event;   } , 250);
   },
   onMouseOut: function() {
      clearTimeout(tab_hover.tid);
   }
};
tab_hover.onLoad();
