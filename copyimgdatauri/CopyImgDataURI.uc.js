location == "chrome://browser/content/browser.xul" && (function () {
	copyImgDataURI = {
		img: null,
		canvas: null,
		init: function () {
			(function (m) {
				m.id = "context-copyImgDataURI";
				m.hidden = true;
				m.setAttribute("oncommand", "copyImgDataURI.copyDataURI()");
				m.setAttribute("label", "Bild in Base64 kopieren");
			})(document.querySelector("#contentAreaContextMenu").insertBefore(document.createElement("menuitem"), document.querySelector("#context-viewimage")));
			document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", copyImgDataURI.showImageContext, false);
		},
		showImageContext: function () {
			document.getElementById("context-copyImgDataURI").hidden = (gContextMenu.onImage || (gContextMenu.hasBGImage && !gContextMenu.isTextSelected) || gContextMenu.onCanvas) ? !((copyImgDataURI.img = new Image()) && (copyImgDataURI.img.src = gContextMenu.mediaURL ? gContextMenu.mediaURL : gContextMenu.bgImageURL) || (copyImgDataURI.img = gContextMenu.target)) : true
		},
		copyDataURI: function () {
			Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString(((((copyImgDataURI.canvas = gContextMenu.browser.contentWindow.document.createElement('canvas')) && (copyImgDataURI.canvas.height = copyImgDataURI.img.naturalHeight || copyImgDataURI.img.height) && (copyImgDataURI.canvas.width = copyImgDataURI.img.naturalWidth || copyImgDataURI.img.width)) ? copyImgDataURI.canvas : 0).getContext("2d").drawImage(copyImgDataURI.img, 0, 0) ? 0 : copyImgDataURI.canvas).toDataURL());
		}
	}
	copyImgDataURI.init()
})()