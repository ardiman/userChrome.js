    //      Webdeveloperbutton.uc.js

    (function() {

       if (location != 'chrome://browser/content/browser.xul') return;
          setTimeout( function() {

       try {
          CustomizableUI.createWidget({
             id: 'Webdeveloper-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_MENUBAR,
             onBuild: function(aDocument) {
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');

                var props = {
                   id: 'Webdeveloper-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   type: 'menu',
                   removable: false,
                   label: 'Web Entwickler',
                   tooltiptext: 'Web Entwickler',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACy0lEQVR4nI2TW0zTZxTAf9%2B%2FfwptXbQtWoTSUimoCNWqmBiWxkWZqAkajfEaNTHbi4%2Fqgw%2FGhy1zEqMxLFPjZYkmi4Qt8TI0miiRGAteEBCEtlBuKtTSpgLFDYRvD6vGGYmel3OSc37nnJyL4Askx5aZYbfbjtrt9hJFmdD29Dz%2FPRQK721o9Q1qPgfPzrIVbNm2OfBT2Q%2F5GRnmFJdrbpJxmmGhz9fu7H0Zqvxs9aLCBVWhvi559c%2FfZNXlC%2FJE2UG5YE7uL%2B%2F86mSgLT0jVb4dXTcrJ2d1%2BFU%2Fba0tuN1ublTdJNjZ89SdN2dXik63QnwKds1zH9q%2BYcUhxwydkEYHjU116LTJuOYX0OHvZFQm43Raqb5d0%2F%2B%2FDuzWWTtKiouO79vpMTm0AeIDz3kY1dDSHCA720qttw6r3UFWmoVARxcNT5ouvu%2BgYN78Kwf2rCvdUpxOuKmaoL%2Bb%2Fp4%2BDDNyuTecicaSz1c6DaqqASG4dfWvwaC%2FzSIA1q9Zdevw90uKs6f28rDWz9DrEUbHFQZCESLDWrK%2B2UQ83UMs1EUsGqau5s5wdzC4uDnQ4RMrl3nKftzo3G8W3Vy43sa16hfsKHWRPB5hZEzB5Colrrdw7mLF%2BTfDg4fVJFUoQtPe6G%2BXAOrSLP139bdrMKZNYXBM3%2FcszrR4cppOGYpisBcybnLyx6XKR%2FXNLbs%2FNXD1TTQ00RoRmJIMFOWOTlfGrCLVIFFsa8GST0XFpYZq7%2F3CydathuJCzjRa8MWmoJoz1aUlZlLzltMZE5wtPxK4V1frngwGYLnn61%2FP%2F3xQnik%2FKR887ZXRf6Q8Vn5a5joclSmqJiURJgA9oHzMC4C5efl3F7oXeUypZh4%2F8HLf6z0BnErEGBNaD0SAfiAODL1PkHBuBb4FBoBmYAR4BWgS9lsgBrwGwokkfHjKAtACSfz3IxIYA%2F4GJiYbwb9UlwQVHCL1dwAAAABJRU5ErkJggg%3D%3D)'
                };
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);

                var dblMenuPopup = document.importNode(document.getElementById('menuWebDeveloperPopup'), true);
                toolbaritem.appendChild(dblMenuPopup);
                var elements = toolbaritem.getElementsByTagName('*');
                for (let i=0; i<elements.length; i++) {
                   var elem = elements[i];
                   if (elem.id)
                      elem.id = 'WebDevButton-' + elem.id;
                };

                return toolbaritem;
             }
          });
       } catch(e) { };

       setTimeout(function() {
          var extApps = document.getElementById('menubar-items').nextSibling;
          var wdbButton = document.getElementById('Webdeveloper-button');
          var dlfButton = document.getElementById('downloadfolder-toolbar-button');
          var rstButton = document.getElementById('restart-button');
          extApps.parentElement.insertBefore(wdbButton, extApps);
          extApps.parentElement.insertBefore(dlfButton, rstButton);
       }, 100);

       }, 0);

    }());

