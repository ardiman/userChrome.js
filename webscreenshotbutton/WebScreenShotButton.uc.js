// ==UserScript==
// @name           WebScreenShotButton.uc.js
// @include        main
// ==/UserScript==
(function(){

var shotMenu =document.createElement("menupopup");
shotMenu.setAttribute("id","leftclickpopup");

var label3=document.createElement("menuitem");
label3.setAttribute("label","Wählen Sie einen Seitenbereich");
label3.setAttribute("oncommand","WebScreenShotByClipping.init()");

shotMenu.appendChild(label3);

var statusbarW = document.getElementById("status-bar");
var WebScreenShot = document.createElement("statusbarpanel");
WebScreenShot.setAttribute("id","WebScreenShotId");
WebScreenShot.setAttribute("class","statusbarpanel-menu-iconic");
WebScreenShot.setAttribute("src","data:image/png;base64,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");
WebScreenShot.setAttribute("tooltiptext","Screenshot");
//WebScreenShot.setAttribute("popup","leftclickpopup");
WebScreenShot.appendChild(shotMenu);
statusbarW.appendChild(WebScreenShot);

var RightMenu = document.getElementById("contentAreaContextMenu");

var labelImg = document.createElement("menuitem");
labelImg.setAttribute("id","WebScreenShotOnImage");
labelImg.setAttribute("label","Grafik in Base64 kopieren");
labelImg.setAttribute("insertbefore","context-setDesktopBackground");
labelImg.setAttribute("oncommand","WebScreenShot.onImage(gContextMenu.target)");
RightMenu.appendChild(labelImg);
})();
  
var WebScreenShot= {
        capture : function(win, x, y, width, height, isCopy){
                var mainWindow = document.getElementById('main-window');
                var scrollbox = document.createElement('scrollbox');
                scrollbox.width = '1';
                scrollbox.height = '1';
                mainWindow.appendChild(scrollbox);
                var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                canvas.style.display = 'inline';
                canvas.width = width;
                canvas.height = height;
                scrollbox.appendChild(canvas);

                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, width, height);
                ctx.save();
                ctx.scale(1.0, 1.0);
                ctx.drawWindow(win, x, y, width, height, "rgb(255,255,255)");
                ctx.restore();

                var base64 = canvas.toDataURL("image/png");
                if (isCopy){
                        Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper).copyString(base64);
                        alert('Kopie des Bildes als Base64-Code in Zwischenablage.');
                }else{
                        gBrowser.addTab(base64);
                }
                mainWindow.removeChild(scrollbox);
        },
        
        onImage : function(image){
                var doc = image.ownerDocument;

                var canvas = doc.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                doc.body.appendChild(canvas);

                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                var base64 = canvas.toDataURL('image/png');
                doc.body.removeChild(canvas);
                Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper).copyString(base64);
                alert('Kopie des Bildes als Base64-Code in Zwischenablage.');
        },
        handleEvent : function(event){
                if (event.target != event.currentTarget) return;
                document.getElementById('WebScreenShotOnImage').hidden = !gContextMenu.onImage;
        },
        init : function(){
                document.getElementById('contentAreaContextMenu').addEventListener('popupshowing', this, false);
        },
};

var WebScreenShotByClipping = {
        capture : WebScreenShot.capture,
        handleEvent : function(event){
                if (event.button != 0) return false;
                event.preventDefault();
                event.stopPropagation();
                switch(event.type){
                        case 'mousedown':
                                this.downX = event.pageX;
                                this.downY = event.pageY;
                                this.bs.left = this.downX + 'px';
                                this.bs.top  = this.downY + 'px';
                                this.body.appendChild(this.box);
                                this.flag = true;
                                break;
                        case 'mousemove':
                                if (!this.flag) return;
                                this.moveX = event.pageX;
                                this.moveY = event.pageY;
                                if (this.downX > this.moveX) this.bs.left = this.moveX + 'px';
                                if (this.downY > this.moveY) this.bs.top  = this.moveY + 'px';
                                this.bs.width  = Math.abs(this.moveX - this.downX) + 'px';
                                this.bs.height = Math.abs(this.moveY - this.downY) + 'px';
                                break;
                        case 'mouseup':
                                this.uninit();
                                break;
                }
        },
        init : function(){
                this.win = document.commandDispatcher.focusedWindow;
                if (this.win == window) this.win = content;
                this.doc = this.win.document;
                this.body = this.doc.body;
                if (!this.body instanceof HTMLBodyElement){
                        alert("Screenshot/Capture nicht möglich.");
                        return false;
                }
                this.flag = null;
                this.box = this.doc.createElement('div');
                this.bs = this.box.style;
                this.bs.border = '#0f0 dashed 2px';
                this.bs.position = 'absolute';
                this.bs.zIndex = '2147483647';
                this.defaultCursor = getComputedStyle(this.body, '').cursor;
                this.body.style.cursor = 'crosshair';
                this.doc.addEventListener('mousedown', this, true);
                this.doc.addEventListener('mousemove', this ,true);
                this.doc.addEventListener('mouseup', this ,true);
                this.doc.addEventListener('click', this, true);
        },
        uninit : function(){
                var pos = [this.win, parseInt(this.bs.left), parseInt(this.bs.top), parseInt(this.bs.width), parseInt(this.bs.height)];
                this.doc.removeEventListener('mousedown', this, true);
                this.doc.removeEventListener('mousemove', this, true);
                this.doc.removeEventListener('mouseup', this, true);
                this.doc.removeEventListener('click', this, true);
                this.body.style.cursor = this.defaultCursor;
                this.body.removeChild(this.box);
                this.capture.apply(this, pos);
        },
}


WebScreenShot.init();