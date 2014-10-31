    //      Webdevelopercontextmenu.uc.js

    (function() {

       if (location != 'chrome://browser/content/browser.xul') return;
          setTimeout( function() {

       var contextMenu = document.getElementById('contentAreaContextMenu');
       var dblMenu = document.importNode(document.getElementById('webDeveloperMenu'), true);
    //   contextMenu.appendChild(document.createElement('menuseparator'));
    //   contextMenu.appendChild(dblMenu);
       contextMenu.insertBefore(dblMenu, document.getElementById('context-viewsource'));
       dblMenu.id = 'context-' + dblMenu.id;
       var elements = dblMenu.getElementsByTagName('*');
       for (let i=0; i<elements.length; i++) {
          var elem = elements[i];
          if (elem.id)
             elem.id = 'context-' + elem.id;
       };
    }, 0);
    }());
