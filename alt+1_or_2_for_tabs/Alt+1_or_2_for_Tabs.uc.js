window.addEventListener('keypress',
  function(event) {
    if (!event.altKey)
      return;

    switch (event.which) {
      case event.DOM_VK_1:
        getBrowser().mTabContainer.advanceSelectedTab(-1);
        break;
      case event.DOM_VK_2:
        getBrowser().mTabContainer.advanceSelectedTab(1);
        break;
      default:
        return;
    }
    
    event.stopPropagation();
    event.preventDefault();
  }, true);
