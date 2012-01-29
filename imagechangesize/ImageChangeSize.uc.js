/*「画像の上で右クリック→i→i」で画像を拡大
「画像の上で右クリック→i→a」で画像を縮小
「画像の上で右クリック→i→o」で画像を元のサイズに戻す*/

(function imageChangeSize(){

    const MAGNIFICATION = 2; // 放大率
    const MAX_MAGNIFICATION = MAGNIFICATION * 8; // 最大放大率
    const MIN_MAGNIFICATION = MAGNIFICATION / 8; // 最小缩小率
    const ZOOM_ATTR = "jsa-zoom"; // 保存放大率的属性名称
    const kXULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    var contextMenu = document.getElementById("contentAreaContextMenu");
    var separator = document.getElementById("context-sep-properties");
    var eventTarget = null;

    var menu = document.createElementNS(kXULNS, "menu");
    menu.id = "imagechangesize";
    menu.setAttribute("label", "Zoom Image");
    menu.setAttribute("accesskey", "i");
    menu.hidden = true;
    contextMenu.insertBefore(menu, separator);

    var menuPopup = document.createElementNS(kXULNS, "menupopup");
    menu.appendChild(menuPopup);

    var lst = [
        {
          label:"Gro\u00DF (+)",
          accesskey:"i",
          command:zoomIn
        },
        {
          label:"Klein (-)",
          accesskey:"a",
          command:zoomOut
        },
        {
          label:"Normal (0)",
          accesskey:"o",
          command:original
        }
        ];
    
    for(var i = 0, m; m = lst[i]; i++){
        var menuItem = document.createElementNS(kXULNS, "menuitem");
        menuItem.setAttribute("label", m.label);
        if ("accesskey" in m) menuItem.setAttribute("accesskey", m.accesskey);
        menuItem.addEventListener("command", m.command, false);
        menuItem.id = "image-change-size-" + m.label.toString();
        menuPopup.appendChild(menuItem);
    }

    contextMenu.addEventListener("popupshowing", setMenuDisplay, false);

    function setMenuDisplay(aEvent) {
        if(gContextMenu.onImage){
            document.getElementById("imagechangesize").hidden = false;
        }else{
            document.getElementById("imagechangesize").hidden = true;
        }
    }

    function zoomIn(){
        var imgObj = gContextMenu.target;
        if(imgObj.localName.toLowerCase() != "img") return;
        var zoom = imgObj.getAttribute(ZOOM_ATTR);
        if(zoom == null) zoom = 1;
        if(MAX_MAGNIFICATION > zoom){
            zoom = parseFloat(zoom) * MAGNIFICATION;
            imgObj.width = imgObj.naturalWidth * zoom;
            imgObj.height = imgObj.naturalHeight * zoom;
            imgObj.setAttribute(ZOOM_ATTR, zoom);
        }
    }

    function original(){
        var imgObj = gContextMenu.target;
        if(imgObj.localName.toLowerCase() != "img") return;

        imgObj.width = imgObj.naturalWidth;
        imgObj.height = imgObj.naturalHeight;
        imgObj.removeAttribute(ZOOM_ATTR);
    }

    function zoomOut(){
        var imgObj = gContextMenu.target;
        if(imgObj.localName.toLowerCase() != "img") return;

        var zoom = imgObj.getAttribute(ZOOM_ATTR);
        if(zoom == null) zoom = 1;

        if(MIN_MAGNIFICATION < zoom){
            zoom = parseFloat(zoom) / MAGNIFICATION;
            if(zoom == 0){
                imgObj.width = imgObj.naturalWidth;
                imgObj.height = imgObj.naturalHeight;
            }else{
                imgObj.width = imgObj.naturalWidth * zoom;
                imgObj.height = imgObj.naturalHeight * zoom;
            }
            imgObj.setAttribute(ZOOM_ATTR, zoom);
        }
    }

})();