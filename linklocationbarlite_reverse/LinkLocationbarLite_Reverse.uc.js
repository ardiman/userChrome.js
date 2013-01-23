// ==UserScript==
// @name			LinkLocationbarLite.uc.js
// @namespace		myfriday9_r1232313@live.com
// @description		マウスがリンク上にあるとき、リンクのURLをロケーションバーに表示
// @version			2013/01/16
// @include			main
// @compatibility	Firefox 18
// @auther			http://j.mozest.com/zh-CN/ucscript/script/48/
// ==/UserScript==
(function() {
	if (!isElementVisible(gURLBar)) return;	// アドレスバーが無かったらストップ

	var loadingStat = false;	// Der Ladevorgang wird auch in der Adressleiste angezeigt,  false = Aus

	var urlbarIcons = document.getElementById('urlbar-icons');
	var additionBar = document.createElement('label');
	additionBar.setAttribute('id', 'addtion-link');
	additionBar.setAttribute('value', '');
	additionBar.setAttribute('crop', 'center');	// Die Mitte einer langen URL wird weggelassen
//	additionBar.setAttribute('flex', '1');
	additionBar.style.color = 'brown';
	additionBar.style.margin = "0 0 -1px 1"
	urlbarIcons.insertBefore(additionBar, urlbarIcons.firstChild);
	gURLBar.insertBefore(additionBar, gURLBar.firstChild);	// Anzeige auf der linken Seite

	function resetmaxWidth() {
		var p = gURLBar.boxObject.width;
		//Der Abstand (120) in Px zwischen angezeigtem Link und der Adresse in der Urlbar
		urlbarIcons.style.maxWidth = Math.ceil(p - 120) + 'px';
	}
	resetmaxWidth();
	window.addEventListener('resize', resetmaxWidth, false);

	XULBrowserWindow.statusTextField.__defineGetter__('label', function() {
		return this.getAttribute("label");
  	});
	XULBrowserWindow.statusTextField.__defineSetter__('label', function(str) {
		if (str) {
			this.setAttribute('label', str);
			if(this.getAttribute('type') == 'overLink') {	// overLink
				additionBar.value = str + ' <';	// 矢印の向きを逆にする
			} else {	// その他
				if (loadingStat == true) {
					additionBar.value = str;
				} else {
					this.style.opacity = 1;
					additionBar.value = '';
				}
			}
		} else {
			this.style.opacity = 0;
			additionBar.value = '';
	    }
	    if (this.style.opacity == 0) {
	    	XULBrowserWindow.statusTextField.removeAttribute('mirror');
	    }
	    return str;
	});
})();