(function() {

   if (location != 'chrome://browser/content/browser.xul')
      return;

   try {
      CustomizableUI.createWidget({
         id: 'contextmenu-button',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,
         onBuild: function(aDocument) {
            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'contextmenu-button',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               removable: 'true',
               label: 'Rechtsklick Kontextmenu',             
               tooltiptext: Services.prefs.getBoolPref('dom.event.contextmenu.enabled') ?
                  'Kontextmenu kann manipuliert werden' : 'Kontextmenu kann nicht manipuliert werden',
               oncommand: '(' + onCommand.toString() + ')()'
            };
            for (var a in attributes) {
               button.setAttribute(a, attributes[a]);
            };
            function onCommand() {
               var isEnabled = !Services.prefs.getBoolPref('dom.event.contextmenu.enabled');
               Services.prefs.setBoolPref('dom.event.contextmenu.enabled', isEnabled);
               var windows = Services.wm.getEnumerator('navigator:browser');
               while (windows.hasMoreElements()) {
                  let button = windows.getNext().document.getElementById('contextmenu-button');
                  if (isEnabled)
                     button.setAttribute('tooltiptext', 'Kontextmenu kann manipuliert werden')
                  else
                     button.setAttribute('tooltiptext', 'Kontextmenu kann nicht manipuliert werden');
               };
            };
            return button;
         }
      });
   } catch(e) { };

   var css =
      '#contextmenu-button[tooltiptext="Kontextmenu kann manipuliert werden"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkhJREFUeNqUU0toU0EUPfN5n0RTI1ip6EoJpQtRBCu4qVQouFIJoVap4EKtuOsiuCriRgSxG63iRqRqBY1UXYggiliU6q4rP7hooBJJE4nUxr68N+Od13ylFbxw38zcmXvuuZ/Htl98/qPsBfGK0tBao1kYAwR9LMHzjuQbJeehrVmkcf4ycgD/kqmv8+2D4+/vxVx51PoLRJrIRp58yoFVoxoiivYHOzvgDmfw+0oSt47tHjhx9wNrc+WAFBw1DF6j7UqBqEUqZbhGJA/tJoVyoLAv0Y7xwe4jS7562JyqrG1ccuD02CCba1VldmrvVmxIT8Kn89JoEl6gkhFyU4y3AjiGVhXAiOIa2VIZo8mdodYkINwKt6BsBwETDQBbiDD/GoCJX1j0ME8aWulyV0cMFWHjlxvDxFgPPOm0psBW7AFZqS6MIhpZXLOenHvx043DFxZ4IwVGLFi41pVAXddCpM1B7lIaDzZbuH29FyUR0WWIsYDqUGcQdeRyG5uDc6qJa+Pz+XOwXk0idfY0UXWpEArTb96dyc19Z3WAt7NF87510rgA1q6Dd/MyUsdTQKkAXfTBKKU9OzrxaHZuSLJGsLDnrQB0MJNHiv2HgL7+BsOXGejHLyBZ1SPsPX2ZbkIw46gVOWmo+9egJq7SfCgiJsAtG4xWKfmyw+GuTav+C9n0CKbv3EB31xZYNLG+9jH1MY+iQkZalYXXiQvPesykaegVW+hH+9Cf+IbCzFN43A5TK1aCzMmZ7LAJv400jv+XvCH3R4ABADkKvfJiBGzqAAAAAElFTkSuQmCC)} ' +
      '#contextmenu-button[tooltiptext="Kontextmenu kann nicht manipuliert werden"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYlJREFUeNpi/P//P4Nex67333/9Ffj97z8DiI8MGBkZGJiBBCsz0+ubtZ5iMHG4OhBDpXHbf0Lg8J3X/xXqty5DNgCEWUAckM0gsOnmCwZGqK0gC/4B2f7qEgwcRWsZfvQFM8yPNo1MZNjK+KDROxJmEAuyczhYmIHOBRoAhEDzGf5CxUFe+P73H4ODqijD4liziBSW7axA4RC4ATDAwcLEwMTICHYFSOs/qMvSrJQYRMo2MPwB8n/2BzP8/vsvGMUFMMDOzAR0PsQAEPjH9J/h0cfvDP3BBmAMA3+QAhrFADZmZrD/YQaAlL399ovhzddfcDVGUvwQCWwGgLzAyIAJ/jNAAhUbQPMCRDsuQwgawMXOAolGXK4gZMCxh++AsQBJBxgGgNIFEAdpSWIaAFPPBE22WA1AIhkxDIDqAMc9kGT8z4jFgP9wLzAi2QA2gIUJIhCoKclADICphxvA+vvLQdWm7faglPYfZ3hDkjhIM0g9XAyUD4BOUgayBRiIBx+A+u6CGAABBgBmFq9IdRyTmAAAAABJRU5ErkJggg==)} ';
   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
   document.insertBefore(stylesheet, document.documentElement);

})();

