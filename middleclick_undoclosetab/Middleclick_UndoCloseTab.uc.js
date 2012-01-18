// Mittelklick auf die Tableiste stellt den letzten Tab wieder her

gBrowser.mTabContainer.addEventListener('mousedown', function (event) {
                if (event.target.localName != 'tab' && event.button == 1){
                    document.getElementById('History:UndoCloseTab').doCommand();
                }},
                false
);