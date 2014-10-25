//    ClearCacheButtonM.uc.js
//    v. 0.1 

(function () {

    if (location != 'chrome://browser/content/browser.xul') return;
   
    const buttonId = 'clearcache-button';
    const buttonLabel = 'Cache leeren';
    const buttonTooltiptext = 'Cache leeren';
    const buttonIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw%2FeHBhY2tldCBiZWdpbj0i77u%2FIiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8%2BIDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDM0MiwgMjAxMC8wMS8xMC0xODowNjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQzdFNERGRDNCNkYxMUUwQjRDRUVDOEM3Q0YyMDZEMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQzdFNERGRTNCNkYxMUUwQjRDRUVDOEM3Q0YyMDZEMSI%2BIDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFDN0U0REZCM0I2RjExRTBCNENFRUM4QzdDRjIwNkQxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFDN0U0REZDM0I2RjExRTBCNENFRUM4QzdDRjIwNkQxIi8%2BIDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY%2BIDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8%2BKcFfnQAAAuZJREFUeNqkkslv1EgUxr%2FyUm272267O510RCcThS1IhE1Bg9CAWgyZuc8px5FGHIAj4sAdLvwBuXDgDwAklguI5QBCiGWQWEYsEyAKUTrB9JLEbaddLhfVSbghhERJr0ol1fu9V9%2F7iBACP7O07jZ5dXL1IlIJ4wAtuiAXLsF%2BdAObjozB6S%2BDcANyQxDHuHX59l9DmwdO9i1%2BOK79cCmRggDbgjaf4K5WTT8vnFB8%2BvTHAEIMa1bxH56IAzR9Zo3%2FNgwEJos7HN8HEPmlNP1VNwqndcvzqJZFv2XLTkLEzXdj2Vz%2BsfKNtJLMtLpyIFZ2UJ47qxuqJ%2FiyhAUwCxVoVgFhnPBPi2K9A%2FmYENKNQ1Ax3Ak6V4ousyx39ExA9mfLogEmQqjyDV96iRV%2FKmVh5gEIWwdIdaT6RI60Fzp9Xw59f8vGubO%2BMdB%2F7VkTI41ebDY7SGf%2Fx8zb16jPzk7ZPHwlZKK2ppGQxcnf8uS6aj4pBi%2F%2BKPXqh5xyCNLzEvM1C63QwLv5aWwdMGBo1vWokSREVdYAaqrqgoiMoqqPSNweK%2FW0TylGHlpCsGtHBnwkBuNL2DNeAmMxf%2FOieD8TebLldA1AFHJUVv%2FMhdafj6erfT3MTjiBxIJJCBcUumkiYVInwfjyXLTCOzEIXXdiumpBbEhSMeSQBleVDvScC2QqIKp0JRIZEeJ2EzSv0sEtrWMfn89PJlzUv05hlgtedazCRYf17LS8NtTew1BUipS1pMDLYFEMKxtDcIHRg4N%2FFgcKe33fPr8mYk48qdBKYHI7O%2FWhaA46fkxaD2mSUjh210xLKPVpqNUasB0Nb98kHb%2FutdztR1%2BtAnRTn6mOVmsLtYWR9mJk3%2Flv5SZd%2Fnf7TDOHil13389r8e%2F7QKenaaS6v8xltFytNDJ%2Bt1iu1Lqzx7l75zCxewK6pkuVWcavN50o6rhhO3CiMDTSVZspiecYKzTrffLyuUU3b7dZkuCLAAMAxwpPxFIuoXQAAAAASUVORK5CYII%3D)';
    function clearCache() {   
        // ungueltig ab Fx 32 - s. auch Zeile 16+17 + http://www.camp-firefox.de/forum/viewtopic.php?p=931841#p931841
        // var cacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService);
        try {
            // cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK);
            // cacheService.evictEntries(Ci.nsICache.STORE_IN_MEMORY);
            Services.cache2.clear();
        } catch (exception) {
            alert(exception.description);
        }       
    };   
   
    var button = document.createElement('toolbarbutton');
    button.id = buttonId;
    button.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
    button.setAttribute('label', buttonLabel);
    button.setAttribute('tooltiptext', buttonTooltiptext);
    button.style.listStyleImage = buttonIcon;
   
    button.addEventListener('click', function (event) {
       if (event.button == 0)
           clearCache();
    });
   
    document.getElementById('navigator-toolbox').palette.appendChild(button);   

    var toolbars = document.getElementsByTagName('toolbar');
    for (var i=0; i<toolbars.length; i++) { 			
        var currentset = toolbars[i].getAttribute('currentset');		
        if (currentset.split(',').indexOf(button.id) >= 0) {
            var j;
            if (i == 0) j = 1	
            else j = 0;			
            toolbars[j].currentSet += ',' + button.id;				
            toolbars[i].currentSet = currentset;	
        };
    };
   
    var menuitem = document.createElement('menuitem');
    menuitem.id = 'clearcache-item';
    menuitem.setAttribute('label', buttonLabel);
   
    menuitem.addEventListener('click', function (event) {
       if (event.button == 0)
           clearCache();
    });

    var separator = document.getElementById('devToolsSeparator');
    separator.parentElement.insertBefore(menuitem, separator.nextSibling);
   
    var key = document.createElement('key');
    key.id = 'ae_key_clearbutton';
    key.setAttribute('keycode', 'VK_F9');
    key.setAttribute('oncommand', 'document.getElementById("clearcache-item").click()');
   
    document.getElementById('mainKeyset').appendChild(key);
   
}) ();