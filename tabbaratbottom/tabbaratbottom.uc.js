/*==uc/==
@name Tabbar at the bottom
@author esquifit
@description In FF4+ places tabbar at the bottom of the main content
@include main
@compatibility Firefox 4.0+
@version 2011-08-28
==/uc==*/

// This code is shamelessly stolen from Tab Mix Plus:
        var bottomToolbox = document.getElementById("foo-bottom-toolbox");
        if (!bottomToolbox) {
          bottomToolbox = document.createElement("toolbox");
          bottomToolbox.setAttribute("id", "foo-bottom-toolbox");
          let browser = document.getElementById("browser");
          browser.parentNode.insertBefore(bottomToolbox, browser.nextSibling);
        }
        bottomToolbox.appendChild(document.getElementById("TabsToolbar"));
/*
*/
