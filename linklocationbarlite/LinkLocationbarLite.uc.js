// ==UserScript==
// @name           LinkLocationbarLite.uc.js
// @namespace      myfriday9_r1232313@live.com
// @description    Link Locationbar扩展的轻量级实现——当鼠标位于链接上时，在地址栏显示目标链接地址
// @version        1.0.110919.2
// @include        main
// @compatibility  Firefox 7.0
// @note           by Friday, 仿造 link locationbar 扩展，配合Omnibar效果尤佳。
// @updateURL     https://j.mozest.com/ucscript/script/48.meta.js
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/00/46b11cb1-6537-274e-6d53-c9646df0c676.jpg http://j.mozest.com/images/uploads/previews/000/00/00/thumb-46b11cb1-6537-274e-6d53-c9646df0c676.jpg
// ==/UserScript==

(function(){
	if (!isElementVisible(gURLBar)) return;//地址栏不可见，则返回
	var urlbarIcons = document.getElementById('urlbar-icons');
	if(!urlbarIcons)	return;
		
	var loadingStat = 0;	//载入状态显示的位置：0-左下角（默认位置），1-地址栏
	
	// 新建一个用来显示目标链接的容器
	var additionBar = document.createElement('label');
	additionBar.setAttribute('id','addtion-link');
	additionBar.setAttribute('value','');
	additionBar.setAttribute('crop','center');// 文本长度超出时，省略中间内容
	additionBar.setAttribute('text-align','right');
	additionBar.style.maxWidth = '500px';
	additionBar.style.color = 'brown';
	
	// 添加到地址栏
	gURLBar.appendChild(additionBar);
	
	XULBrowserWindow.statusTextField.__defineGetter__('label', function() {
		return this.getAttribute("label");
  	});
	XULBrowserWindow.statusTextField.__defineSetter__('label', function(str) {
		if (str) {
			this.setAttribute('label', str);
			this.style.opacity = 1;
			if(str.charCodeAt(0) < 128) {		// 显示目标链接
				this.style.opacity = 0;
				additionBar.setAttribute('value','' + str);
				urlbarIcons.style.display = 'none';
			} else {		// 显示载入动态
				if(loadingStat == 1){	// 在地址栏显示
					this.style.opacity = 0;
					additionBar.setAttribute('value',str);
				} else {		// 在左下角显示
					additionBar.setAttribute('value','');
				}
				urlbarIcons.style.display = 'inherit';
			}
			
		} else {
			this.style.opacity = 0;
			
			additionBar.setAttribute('value','');
			urlbarIcons.style.display = 'inherit';
	    }
	    if(this.style.opacity == 0) {
	    	XULBrowserWindow.statusTextField.removeAttribute('mirror');
	    }
	    return str;
	});
	
	
})();