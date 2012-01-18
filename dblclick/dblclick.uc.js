gBrowser.mTabContainer.addEventListener('dblclick', function (event){
if (event.target.localName == 'tab' && event.button == 0){
document.getElementById('cmd_close').doCommand();
}
}, false);