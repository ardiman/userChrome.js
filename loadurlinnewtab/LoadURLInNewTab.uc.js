    if (location == 'chrome://browser/content/browser.xul') {
        if (typeof gURLBar.handleCommand !== 'undefined') {
            let str = gURLBar.handleCommand.toString();
            str = str.replace('&& !isTabEmpty', '|| isTabEmpty');
            str = str.replace('where = altEnter', 'where = !altEnter');
            (new Function('gURLBar.handleCommand = ' + str)());
        }
    }