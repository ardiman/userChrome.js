//	AnimationToggleButtonM.uc.js
//	v. 0.3.1

( function AnimationButton() {

		var iconNormal = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbElEQVR42sWTP6vBURjHfy9DdiarDAZZhBhs/iS/SWGQMlBkIKKUuyMSCwklgxTyFmwWZq/BR8+x3Fu6Nwz31Klvp/N8nuf7PR1Ne2EZjcYvm81GMpmk3W7z62WDwaBLQblcJpfLoes6x+ORzWaDy+Uin88/B1gsFiqVCtPplFAoxGq1Yr1e43Q6CQQC+Hy+n4VWqxW73U6r1eJ6vZJKpZCuUuhwOPjT13w+p1qt4vF4yGazmEwmXslFi8fjZDIZvF6v8ildZdREIoHb7SYYDCotDUTLhJJBLBbD7/ejpdNp+v0+hUKBy+VCs9lUGZxOJxqNBrVaTWmZsl6vcz6fKZVKdDoder0emtlsVonOZjP2+z3L5ZLJZMJut1N6PB6r88ViofThcEBsb7dbFbKyMRqNuN1uL2+xrwBi4R2AZPYRIBwOPwASxkeAbrf7z4DBYPAWIBKJPADFYlG98XA4fLolZHnq72fy2aLRKHfeRoLqwjwI3AAAAABJRU5ErkJggg==)";
		
		var iconOnce = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaElEQVR42p2TvYrCUBSE72OIvVa2ksIipBENWKRTQ0gqQVOIYKEgpIhYCIL7AAmx0EYRLcRCAip5BTsbrX0GR04s3PwsbDwwzQ3fnDsTLmMJJp1O/3Ach1arBWawt/6aVCqlEWCaJnq9HjRNw+Vygeu6HzjOIJfLYTgcYr1eo1arYb/f43A4QBAESJIUhEn5fB6FQgHT6RSPxwO6roO2EsjzfHBDGKbZbrcYjUYol8vodrvIZDLxueJgmkajgU6nA1EU/Zy0la7abDZRKpVQrVYj1y4Wi1BVFZVKBazdbmM2m2EwGOB+v2MymfgdXK9XjMfjCHy73WAYBizLguM4YNlsFv1+H5vNBufzGbvdDqvVCqfTKQIvl0t4ngeKfTwe/ZL9GIvFAs/nM6AwHP5Oovi+AUVICpOos4jBf2FSvV5/G1AZSeGAgW3bieGAwTfwx+BLmCTLctBgPp/HikqmX/37jB6boih4AcQgRNTa5HaFAAAAAElFTkSuQmCC)";
		
		var iconNone = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbUlEQVR42p2TP6uCYBjF/RY32lqaWqOhQVyigoa2/iA6CdUgQUNB0FA0BEH3AxQ56FKIDdEQgopfoa2l5j6Dp/u8F+J69cK1B87i6+887zkixyWYdDr9WSgU0O12EXAc058vp1IpmYDpdIrhcAhZlnG5XGDb9guONcjlcpjNZjBNE81mE6fTCefzGYIgoF6vh2BmkM/nUSwWsVqt8Hg80Ov1QFsJ5Hk+tCEC0xwOB8znc1QqFQwGA2QymY+4SLEwjaIo6Pf7qFarLCdtpat2Oh2Uy2U0Go3ItUulEiRJQq1WA6eqKjRNw3g8xv1+x3K5ZB1cr1csFosIfLvdMJlMsF6vsd1uwWWzWYxGI1iWBc/zcDwesd/v4bpuBN7tdvB9HxTbcRxWMothGAaCIAjrFxw5/xLFZwYUISlMos6iBv+ESa1W69uAykgKhww2m01iOGTwDvwyeBcmtdvtsIGu67GikulT/3xGP5soingC1EBhpA0JGaMAAAAASUVORK5CYII=)";	

		var isonce = false;
	
		function createBtn() {			
	        var navigator = document.getElementById("navigator-toolbox");
			if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
			var BrowserManipulateBtn = document.createElement("toolbarbutton");
			BrowserManipulateBtn.id = "animation-button";
			BrowserManipulateBtn.setAttribute("type", "button");
			BrowserManipulateBtn.setAttribute("onclick", "BrowserAnimation.onClick(event);");
			BrowserManipulateBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
			BrowserManipulateBtn.setAttribute("removable", "true");
			BrowserManipulateBtn.setAttribute("oncontextmenu", "return false");		//	remove original button context menu			
			BrowserManipulateBtn.setAttribute("label", "Animation");			
			var tooltipText = "Linksklick: GIF-Animationen einschalten\nMittelklick: Animation einmal abspielen\nRechtsklick: Ausschalten";			
			BrowserManipulateBtn.setAttribute("tooltiptext", tooltipText);				
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);				
			var animmode = prefs.getCharPref("image.animation_mode");			
			switch (animmode) {					
				case "normal":					
				BrowserManipulateBtn.style.listStyleImage = iconNormal;	
				break;					
				case "once":					
				BrowserManipulateBtn.style.listStyleImage = iconOnce;
				isonce = true;
				break;				
				case "none":					
				BrowserManipulateBtn.style.listStyleImage = iconNone;
				break;
			}
			navigator.palette.appendChild(BrowserManipulateBtn);		
		}		
		
		BrowserAnimation = {			
			onClick: function(event) {				
				var BrowserManipulateBtn = document.getElementById("animation-button");			
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);	
				
				switch (event.button) {	
				
					case 0:	
					var animmode = prefs.getCharPref("image.animation_mode");
					prefs.setCharPref("image.animation_mode", "normal");					
					BrowserManipulateBtn.style.listStyleImage = iconNormal;						
					if (isonce) { 
						BrowserReloadSkipCache();
						isonce = false;
					}
					else if (animmode == "normal") 
							  BrowserReloadSkipCache(); 
						 else BrowserReload();							
					break;	
					
					case 1:					
					prefs.setCharPref("image.animation_mode", "once");					
					BrowserManipulateBtn.style.listStyleImage = iconOnce;		
					BrowserReloadSkipCache();
					isonce = true;
					break;	
					
					case 2:					
					prefs.setCharPref("image.animation_mode", "none");					
					BrowserManipulateBtn.style.listStyleImage = iconNone;
					BrowserReload();
					break;
				}									
			}			
		}

		function updateToolbar() {
		var toolbars = Array.slice(document.querySelectorAll('toolbar'));
   for (var i=0; i<toolbars.length; i++) {          
      var currentset = toolbars[i].getAttribute('currentset');      
      if (currentset.split(',').indexOf('animation-button') >= 0) {      
         var j;
         if (i == 0) j = 1
         else j = 0;         
         toolbars[j].currentSet += ','+'animation-button';         
         toolbars[i].currentSet = currentset;      
      };      
   };	
		}
		
	createBtn();	

	updateToolbar();

})();