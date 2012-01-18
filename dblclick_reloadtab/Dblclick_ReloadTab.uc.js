// Mit Doppelklick auf ein Tab wird dieser neu geladen 

gBrowser.mTabContainer.addEventListener('dblclick', function (event){
                if (event.target.localName == 'tab' && event.button == 0){
                    getBrowser().getBrowserForTab(event.target).reload();
                }},
                false
);