//   WebDeveloper-Menu.uc.js

(function() {
   if (location != 'chrome://browser/content/browser.xul')
      return;
   setTimeout(function() {
      var dblMenu = document.getElementById('webDeveloperMenu').cloneNode(true);
      document.getElementById('contentAreaContextMenu').insertBefore(dblMenu, document.getElementById('context-viewsource'));
      dblMenu.id = 'context-' + dblMenu.id;
      var elements = dblMenu.getElementsByTagName('*');
      for (let elem of elements) {
         let origId = elem.id;
         if (origId) {
            elem.id = 'context-' + origId;
            if (elem.tagName == 'menuitem') {
               elem.setAttribute('oncommand', 'document.getElementById("' + origId + '").click();');
               let obs = document.createElement('observes');
               obs.setAttribute('element', origId);
               obs.setAttribute('attribute', 'checked');
               elem.appendChild(obs);
            };
         };
      };
   }, 100);
}());

