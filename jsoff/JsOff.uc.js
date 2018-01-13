// JsOff.uc.js
(function() {

   if (location != 'chrome://browser/content/browser.xul')
      return;

   try {
      CustomizableUI.createWidget({
         id: 'toolbar-button-js',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,
         onBuild: function(aDocument) {
            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'toolbar-button-js',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               removable: 'true',
               label: 'Javascript ein-/ausschalten',             
               tooltiptext: Services.prefs.getBoolPref('javascript.enabled') ?
                  'Javascript ist eingeschaltet' : 'Javascript ist ausgeschaltet',
               oncommand: '(' + onCommand.toString() + ')()'
            };
            for (var a in attributes) {
               button.setAttribute(a, attributes[a]);
            };
            function onCommand() {
               var isEnabled = !Services.prefs.getBoolPref('javascript.enabled');
               Services.prefs.setBoolPref('javascript.enabled', isEnabled);
               var windows = Services.wm.getEnumerator('navigator:browser');
               while (windows.hasMoreElements()) {
                  let button = windows.getNext().document.getElementById('toolbar-button-js');
                  if (isEnabled)
                     button.setAttribute('tooltiptext', 'Javascript ist eingeschaltet')
                  else
                     button.setAttribute('tooltiptext', 'Javascript ist ausgeschaltet');
               };
            };
            return button;
         }
      });
   } catch(e) { };

   var css =
      '#toolbar-button-js[tooltiptext="Javascript ist eingeschaltet"] {list-style-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIiAgaGVpZ2h0PSIxNnB4IiB3aWR0aD0iMTZweCI+DQo8Zz48cGF0aCBmaWxsPSIjNUE1QjVDIiBkPSJNMzk1LDEzMi41SDIyMHY0NjQuOGMwLDExNS0zOS40LDE0Ny4xLTEwOC4xLDE0Ny4xYy0zMi4yLDAtNjEuMS01LjUtODMuNy0xMy4zTDEwLDg2Ny4zQzQyLjIsODc4LjQsOTEuNSw4ODUsMTMwLjEsODg1QzI4Ny43LDg4NSwzOTUsODEwLjksMzk1LDU5OC41VjEzMi41TDM5NSwxMzIuNXoiLz48cGF0aCBmaWxsPSIjNUE1QjVDIiBkPSJNNzc2LjYsMTE1QzYwNy4yLDExNSw1MDAsMjExLjIsNTAwLDMzOC41YzAsMTA5LjYsODIuNiwxNzguMSwyMDIuNywyMjIuNGM4Ni44LDMxLDEyMS4yLDU4LjYsMTIxLjIsMTA0YzAsNDkuOC0zOS43LDgxLjktMTE0LjcsODEuOWMtNjkuNywwLTEzMy0yMy4zLTE3NS45LTQ2LjV2MEw1MDAsODM4LjVjNDAuOCwyMy4zLDExNi45LDQ2LjUsMTk5LjQsNDYuNUM4OTcuOCw4ODUsOTkwLDc3OC44LDk5MCw2NTMuN2MwLTEwNi4yLTU5LTE3NC44LTE4Ni41LTIyMy41Yy05NC40LTM3LjYtMTM0LTU4LjYtMTM0LTEwNi4yYzAtMzcuNiwzNC4zLTcxLjksMTA1LjEtNzEuOWM2OS43LDAsMTE3LjYsMjMuNCwxNDUuNSwzNy44bDQxLjgtMTQwQzkxOC4xLDEzMC44LDg1OS4yLDExNSw3NzYuNiwxMTVMNzc2LjYsMTE1eiIvPjwvZz4NCjwvc3ZnPg==");}' +
      '#toolbar-button-js[tooltiptext="Javascript ist ausgeschaltet"] {list-style-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIiAgaGVpZ2h0PSIxNnB4IiB3aWR0aD0iMTZweCI+DQo8Zz48cGF0aCBmaWxsPSIjZmYwMDAwIiBkPSJNMzk1LDEzMi41SDIyMHY0NjQuOGMwLDExNS0zOS40LDE0Ny4xLTEwOC4xLDE0Ny4xYy0zMi4yLDAtNjEuMS01LjUtODMuNy0xMy4zTDEwLDg2Ny4zQzQyLjIsODc4LjQsOTEuNSw4ODUsMTMwLjEsODg1QzI4Ny43LDg4NSwzOTUsODEwLjksMzk1LDU5OC41VjEzMi41TDM5NSwxMzIuNXoiLz48cGF0aCBmaWxsPSIjZmYwMDAwIiBkPSJNNzc2LjYsMTE1QzYwNy4yLDExNSw1MDAsMjExLjIsNTAwLDMzOC41YzAsMTA5LjYsODIuNiwxNzguMSwyMDIuNywyMjIuNGM4Ni44LDMxLDEyMS4yLDU4LjYsMTIxLjIsMTA0YzAsNDkuOC0zOS43LDgxLjktMTE0LjcsODEuOWMtNjkuNywwLTEzMy0yMy4zLTE3NS45LTQ2LjV2MEw1MDAsODM4LjVjNDAuOCwyMy4zLDExNi45LDQ2LjUsMTk5LjQsNDYuNUM4OTcuOCw4ODUsOTkwLDc3OC44LDk5MCw2NTMuN2MwLTEwNi4yLTU5LTE3NC44LTE4Ni41LTIyMy41Yy05NC40LTM3LjYtMTM0LTU4LjYtMTM0LTEwNi4yYzAtMzcuNiwzNC4zLTcxLjksMTA1LjEtNzEuOWM2OS43LDAsMTE3LjYsMjMuNCwxNDUuNSwzNy44bDQxLjgtMTQwQzkxOC4xLDEzMC44LDg1OS4yLDExNSw3NzYuNiwxMTVMNzc2LjYsMTE1eiIvPjwvZz4NCjwvc3ZnPg==");}';	  
   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
   document.insertBefore(stylesheet, document.documentElement);

})();