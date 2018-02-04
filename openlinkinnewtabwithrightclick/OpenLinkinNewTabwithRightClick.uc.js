// OpenLinkinNewTabwithRightClick.uc.js

(function() {

  if (!window.gBrowser)
    return;

  // neuen Tab öffnen im Hintergrund: true, im Vordergrund: false
  const inBackground = true;
  let where = inBackground ? 'tabshifted' : 'tab';
  let contextMenu = document.getElementById('contentAreaContextMenu');
  let rightClick;

  gBrowser.addEventListener('click', function(event) {
    if (event.button == 2) {
      rightClick = !event.ctrlKey && !event.shiftKey
                   && !event.altKey && !event.metaKey;
    };
  }, true);

  contextMenu.addEventListener('popupshowing', function(event) {
    if (event.target != this)
      return;
    if (gContextMenu.link && rightClick) {
      openUILinkIn(gContextMenu.linkURL, where);
      event.preventDefault();
    };
  });

})();
