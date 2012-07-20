// focusLastSelectedTab.uc.js:
// focus the last selected tab when a tab is closed

getBrowser().tabContainer.addEventListener('TabClose',
  function(e) {
    var tab = e.target;
    var tabs = tab.parentNode.childNodes;

    var index = 0;
    var last  = 0;

    for (var i = 0; i < tabs.length; i++) {
      var s = tabs[i].getAttribute('lastselected');

      if (s && s > last && tabs[i] != tab) {
        index = i;
        last = s;
      }
    }

    getBrowser().selectedTab = tabs[index];
  }, false);

getBrowser().tabContainer.addEventListener('TabSelect',
  function(e) {
    var tab = e.target;

    tab.setAttribute('lastselected', new Date().getTime() + tab._tPos);
  }, false);

  