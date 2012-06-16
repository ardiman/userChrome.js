(function () {
	if(location != "chrome://browser/content/browser.xul") return;
	var Eyedropper = document.querySelector("#PersonalToolbar").insertBefore(document.createElement('toolbarbutton'), document.querySelector("#PersonalToolbar").childNodes[5]);
	Eyedropper.resetimage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADR0lEQVQ4jX2TbUxTBxiFX7PIiC4GwnQ/MDHGKMTMDaOWaLQSt4GSbM5AVtZIpSqsJqAUv+oYGQWmgCioIAQ/ih9BUfyoiZsFSovG0sJstVupFCiDItyL9IMm996ixuMP92NkxJOcf+/z5iTveYlmkMp+NrLc3ZBY6r6Qedxdn3l6uCbxmF0VOdPsNBUaNOHljka1hv2drfNpcTJwDVWBK7jsv4K7LzXsDWeRWmPICJ8RPtp2O+rccJuh3qfH4fFLkI2VYdvYz0hllNjPZqNhIg/myXLYxo4ZLBZZ1P8WnHnerj3FdGCv5xp2j9QhY7QCUkaNHawKvzAKaMZS8JBJhsefjSH3Qe00uNT0QHpiyIK8AR2U/2hxYKQJR9jLUE3U41dvFS5M5KN9fDtczCZ4R9ciNLoTLtMe6fvoBl1ssdVkPNjTiVynEaoBA46/MOK814CGyRZcD95B52Q1PL4cBEc3g+9bA8GRgImuncZeQ1Ys7dO1SbIembw7zGZkdXci39GN856/0ep3wSy4YJ+yws83Y2pcjZAzDZxpPXi9CIE/kr2Dd2USSmvSKZPuPQp9/aALW3QWZD5+hqqeAegZFm4hCD7kwVu2Ha/spyC07ALXmAD+kgjB+g2hvtptStp47r58+cWHwZjGLiy7asGG5qdQ6PtRZ2PwbFDAW/dLvOlsxVRzBYQzGeCKxeCL4xEoiA8OqJPktLDkhmh+eYstosaCuZVmRJ9+gqQGJ37TvoBVH8ArPYvXN3UIVRSCz00Bt3sdhD3xYOVxNodstYiIaNa8QzcLwopMCCuyILKgGxtLHCipHEJ3LQOuZhhTZa0QDpSAl6WAk6yHkLoKz7//soCIZr2/o6w66uNsXX+E6k8sybMhOacHpbn9MOUNwr+vD4KiFVz6CXCSnyD8sBXs5tX9bV/FTi9T+C6teJHiiU+c04tMhQvV8l6Y0l0Y/9EJXmIEJ9HgTVohXn+73edKFItnrHPE0uQ48db71sPyQTTJR/BXugdB6RCQ9hRIvQV7gtIqjV4a98GHCqNPPl8W/c1R2Rf5HSfj65xX19Q6K5fv7/hugahsDs1e+UGYiD4iok+JaBERxRDRin8dQ0SLiegzIpr9X+Adr7cJIv/W9uoAAAAASUVORK5CYII=";
	Eyedropper.image = Eyedropper.resetimage;
	Eyedropper.addEventListener("click", function (event) {
		window.setCursor('crosshair');
		content.document.querySelector("body").style.cursor = "crosshair";
		window.addEventListener("mousemove", function (event) {
			var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
			canvas.width = 1;
			canvas.height = 1;
			var ctx = canvas.getContext('2d');
			if (/xul$/.test(event.target.namespaceURI)) {
				ctx.drawWindow(window, event.clientX, event.clientY, 1, 1, 'rgba(255,255,255,0)');
			} else {
				ctx.drawWindow(content, event.clientX + content.scrollX, event.clientY + content.scrollY, 1, 1, 'rgba(255,255,255,0)');
			}
			var imageData = ctx.getImageData(0, 0, 1, 1).data;
			var r = imageData[0].toString(16).toUpperCase().replace(/^(.)$/, "0$1");
			var g = imageData[1].toString(16).toUpperCase().replace(/^(.)$/, "0$1");
			var b = imageData[2].toString(16).toUpperCase().replace(/^(.)$/, "0$1");
			Eyedropper.rgb = "#" + r + g + b;
			canvas.width = 16;
			canvas.height = 16;
			ctx.fillStyle = Eyedropper.rgb;
			ctx.fillRect(0, 0, 16, 16);
			Eyedropper.image = canvas.toDataURL();
			Eyedropper.callee = arguments.callee;
			event.stopPropagation();
			event.preventDefault();
		}, true);
		window.addEventListener("click", function (event) {
			var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
			str.data = Eyedropper.rgb;
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			trans.addDataFlavor("text/unicode");
			trans.setTransferData("text/unicode", str, Eyedropper.rgb.length * 2);
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard);
			clip.setData(trans, null, 1);
			window.setCursor('auto');
			content.document.querySelector("body").style.cursor = "auto";
			window.removeEventListener("mousemove", Eyedropper.callee, true);
			window.removeEventListener("click", arguments.callee, true);
			Eyedropper.image = Eyedropper.resetimage;
			event.stopPropagation();
			event.preventDefault();
		}, true);
	}, false);
})()