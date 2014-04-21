// ==UserScript==
// @name                  urlbarautocopy.uc.js
// @namespace             urlbarautocopy@gmail.com
// @description           Linksklick auf Adressleiste kopiert automatisch die Adresse der aktuellen Seite
// ==/UserScript==

document.getElementById('urlbar').addEventListener('click',
   function(e){
      if(e.button===0 )
         goDoCommand('cmd_copy');
   },
   false
);