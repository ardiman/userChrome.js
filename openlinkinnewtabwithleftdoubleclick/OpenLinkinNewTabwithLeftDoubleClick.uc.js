// OpenLinkinNewTabWithLeftDoubleClick.uc.js

(function() {

  if (location != 'chrome://browser/content/browser.xul')
    return;

  // neuen Tab öffnen im Hintergrund: true, im Vordergrund: false
  const inBackground = true;
  let where = inBackground ? 'tabshifted' : 'tab';

  let frameScript = function() {

    /* maximale Zeitdauer des Doppelklicks */
    const delay = 500;
    let delayedClick = false;
    let clickTarget = null;
    let timeout;

    addEventListener('click', onClick, true);

    function onClick(event) {

      if (delayedClick) {
        /* emulated delayed click */
        delayedClick = false;
        return;
      };

      clearTimeout(timeout);

      if (event.button != 0 || event.ctrlKey || event.shiftKey
                            || event.altKey || event.metaKey) {
        clickTarget = null;
        return;
      };

      let link = findLink(event.target);
      if (!link) {
        clickTarget = null;
        return;
      };

      event.preventDefault();
      event.stopPropagation();

      if (event.target == clickTarget) {
        /* 2nd click on link */
        sendAsyncMessage('OpenLinkinNewTabWithLeftDoubleClick.uc.js', link.href);
        clickTarget = null;
        return;
      };

      /* 1st click on link */
      clickTarget = event.target;
      timeout = setTimeout(function() {
        delayedClick = true;
        clickTarget = null;
        link.click();
      }, delay);
    };

    function findLink(element) {
      if (!element || !element.tagName)
        return null;
      switch (element.tagName.toUpperCase()) {
        case 'A':
          return element;
        case 'AREA':
          if (element.href) {
            return element;
          } else {
            return findLink(element.parentNode);
          };
        case 'B': case 'BIG': case 'CODE': case 'DIV': case 'EM':
        case 'H1': case 'I': case 'IMG': case 'NOBR': case 'P':
        case 'S': case 'SMALL': case 'SPAN': case 'STRONG':
        case 'SUB': case 'SUP':
          return findLink(element.parentNode);
        default:
          return null;
      };
    };
  };

  let frameScriptURI = 'data:,(' + frameScript.toString() + ')()';
  window.messageManager.loadFrameScript(frameScriptURI, true);
  window.messageManager.addMessageListener('OpenLinkinNewTabWithLeftDoubleClick.uc.js',
    function(message) {
      openUILinkIn(message.data, where);
    }
  );

})();
