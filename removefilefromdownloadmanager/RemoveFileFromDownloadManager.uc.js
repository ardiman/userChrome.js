(function () {
    var removeDownloadfile = {
        removeStatus : function (){
            var RMBtn = document.querySelector("#removeDownload");
            var state = document.querySelector("#downloadsListBox").selectedItems[0].getAttribute('state');
                RMBtn.setAttribute("disabled","true");
            if(state != "0" && state != "4" && state != "5")
                RMBtn.removeAttribute("disabled");
        },
        
        removeMenu : function (){
            try{removeDownloadfile.removeStatus();}catch(e){};
            if(document.querySelector("#removeDownload")) return;
            var menuitem = document.createElement("menuitem"),
                rlm = document.querySelector('.downloadRemoveFromHistoryMenuItem');
            menuitem.setAttribute("label", rlm.getAttribute("label").indexOf("History") != -1 ? "Delete File" : "Löschen von der Festplatte");
            menuitem.setAttribute("id","removeDownload");
            
            menuitem.onclick = function (){
                var path = decodeURI(DownloadsView.richListBox.selectedItem.image)
                            .replace(/moz\-icon\:\/\/file\:\/\/\//,"").replace(/\?size\=32$/,"")
                            .replace(/\?size\=32\&state\=normal$/,"").replace(/\//g,"\\\\");
               
                if(DownloadsView.richListBox.selectedItem.getAttribute('state') == "2"){
                    path = path + ".part";
                }
                var file=Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);file.initWithPath(path);file.exists()&&file.remove(0);
                new DownloadsViewItemController(DownloadsView.richListBox.selectedItem).doCommand("cmd_delete");
            };document.querySelector("#downloadsContextMenu").appendChild(rlm);
            
            document.querySelector("#downloadsContextMenu").insertBefore(menuitem, rlm.nextSibling);
            removeDownloadfile.removeStatus();
        },

        Start : function(){
            document.querySelector("#downloadsContextMenu").addEventListener("popupshowing", this.removeMenu, false);

        }
    }
    try{
        eval("DownloadsPanel.showPanel = " + DownloadsPanel.showPanel.toString()
            .replace(/DownloadsPanel\.\_openPopupIfDataReady\(\)/,"{$&;removeDownloadfile\.Start\(\);}"));

    }catch(e){
        //Components.utils.reportError(e);
    }
})()
