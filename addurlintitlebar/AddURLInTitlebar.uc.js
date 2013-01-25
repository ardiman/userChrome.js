
/*AddURLInTitlebar.uc.js*/

eval('gBrowser.getWindowTitleForBrowser = ' + gBrowser.getWindowTitleForBrowser.toString().replace('aBrowser.contentTitle;', 'this.contentDocument.location + " | " + aBrowser.contentTitle;'));

