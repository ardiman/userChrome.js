(function() {
	TriggerZone = {
		init: function() {
			this.icon = $("appcontent").appendChild($C("hbox", {
				id: "Trigger-Zone",
				class: "toolbar",
				tooltiptext: "Ausl\u00F6sebereich",
				style: "position: fixed; right: 16px; bottom: 457px; background: -moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%); min-width: auto; max-width: 70px; border: 2px solid rgb(144,144,144); border-radius: 5px;",
			}));

			for (let i = 0, Btn; Btn = mBtns[i]; i++) {
				var BtnItem = this.icon.appendChild($C("toolbarbutton", {
					id: Btn.id,
					tooltiptext: Btn.tooltiptext,
					image: Btn.image,
					class: "toolbarbutton-1",
					oncommand: Btn.oncommand,
//					onclick: Btn.onclick,
					onDOMMouseScroll: Btn.onDOMMouseScroll,
					onmouseover: Btn.onmouseover,
//					style: Btn.style,
				}));
			}

			var css = '\
				#Trigger-Zone {opacity: 0.1!important; -moz-transition: opacity 0.3s ease-out!important;}\
				#Trigger-Zone:hover {opacity: 1!important; -moz-transition: opacity 0.2s ease-in!important;}\
				#Trigger-Zone toolbarbutton {-moz-appearance: none!important; border: none!important;}\
				#Trigger-Zone toolbarbutton:active {margin-top: -1px!important; padding-bottom: 3px!important;}\
				#Trigger-Zone:not(:hover) toolbarbutton {visibility: collapse!important;}\
				#Trigger-Zone:not(:hover) {max-width: 24px!important; max-height: 24px!important; background: #3B3B3B!important; border: 2px solid #3B3B3B!important;}\
				'.replace(/[\r\n\t]/g, '');;
			this.icon.style = addStyle(css);
		}
	};

	var IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC"

	var mBtns = [
		{
			tooltiptext: "",
			image: IMG,
		},
		{
			id: "ScrollTop-button",
			tooltiptext: "Nach oben scrollen",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABc0lEQVQ4jZWQu04CQRSGt9DORAuUiwmTWSBhuIVluGWWsMMgG2AvDAg0Vj6EsaSz5SnsLK3sbSyMb+AkvgDGUpNjs+VCdv/kq845X/IfTdsTKeXZcrV+Xq7WL57nJfbthYZzfiTlYjOfX/8uFss/uVg+UEqPIwtc17/xvNm3P5PgzyT4vvxx3dltpGPbdth06nw6jgeO4wZ4MJ06X5PJxDp4LIRAtj1+te0JhDEajd+EELl9vU/EQDwOxRUcZDB8opSehgkSlmXd8T7f8D7fcovvuMUhYMf7fBvM7judTvJgFcYYMpmpemYPemYPTGYqxhiK9ERN0zTDMFC33VXddhcClGEY8QTNBlUt2oQWbUKzQeMJCCHIqNWVUatDgCKExBNUSElVS2WolspQIaV4AowxIvmiIoUikEIRSL6oMMbxBHmsq4Keg4KegzzWYwrSaYSzSOlZBHoWAc4ihdPp6IJUKnWOMpl3lLmEgI9kMnkRtvsP3puVmLTWpVsAAAAASUVORK5CYII=",
			oncommand: "content.scrollTo(0, 0);",
		},
		{
			tooltiptext: "",
			image: IMG,
		},
		{
			id: "PrevTab-button",
			tooltiptext: "Letzter Tab",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKElEQVQ4jWNgGJTAz8+PNzAwUJgszV5eQfLBwSHLAkPCSkjW7OHhY+nn53/Uzy/gv59fQAPRGh0cHFhcXNyjPN29Hnh6ev/39PT+7+7m2e/k5CTt5OQkjwvb2tqKMjgYOAg4ODjUOzs5f3R2cvkPw05Ozh8cHZ0e4MJOjs4PnRyczzHYWNlusbG2/WVrY/efHMxgbmq+y9zU/Le5qfl/czMkbEocZtDQ0BA2NDBsM9Q3+GxkYPgfCX8wNDB8gAsbGRg9NDIwvMDAwMDAoK2tzaarpZWoo6H1WEdT67+OptZ/bXXtfn01NWlNTU15XFhPWVkMJTZUFRXt1JWUT6sqKf9XUVIiPhqRgaysrLKCtOxaBRm5CrIMYGBgYBAQEBAQERGRJNsAugIArl6U0gA5gzsAAAAASUVORK5CYII=",
			//onmouseover: "gBrowser.mTabContainer.advanceSelectedTab(-1, true);",
			oncommand: "gBrowser.mTabContainer.advanceSelectedTab(-1, true);",
		},
		{
			id: "Reload-button",
			tooltiptext: "Neustart",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADB0lEQVQ4jX2TX0hUeRTHv/fe373eae69c++MeUed5ro2pUO6RY6SFawoK1ZjFPUgpajVZrVIjP3BjMkRy9FozU0ogkoy20JQkowyrenfbn/sIQiWXtqeNojdh6KSMpjTQ2RZ1vf1fD/nHA7fA0yhiu3F9l8iufM2tcwNhg5llu7szghEenzaVN5JysmBuLjUDBaWmedLNjifrqjTXpc3q2M1Ha5n27uThyODKWWRGORv8QnJmWjwzuFfeLJ5+iHAU3Yx4sW/Il55gFHtcYV2n0scax5x7o/EoHxFqyY2GqncmJEqkOERyPDyTxItfse8JcLa6nZxuO6UTuEBNzVdco03XWW7AHATsOxAut3FPVKSeFJNnlSTH1fdQuXH+rYeV+6ePutZ65CfWkcsCl9mT6P3xNyJBqKCTaKCuKTxJOsc2Qzusc2AFwBCxzRnuNcX3Xc+6/mh63nU8VcGNd9kFL0t/tk6KpUBAMeL6BIURt6KGtIWFRCTcRuA+nFA3Qkz2HDG92/Htfn02x03NV4RqOIAe1jeDh8ASJwiDczcvINKLjygWS1nSQz8fAuYdCghb7nZG+pyU3hIomXbRJKTbHcBhwHH4dOGv/PkcNHIQwr0jlLa/kHStxz531bWtvqzQzFOcvan52tUsF4mOVEjMMcwgGnQrv+91H/x/g1/3924dTRG05v6SN3w+xs5WH8SBbWeD7zDEOzuUcHuJqaaJExLIiS42j7UYjEmdQ9lGZ2D/zij/aTX/0Hqus6XCSsjJRP7O6xVgjbjFdM8xNRU4pXk/8CcCyflQGzqqRW3Hn6TUHOEpPKDxIJ77rHZhfWSkdYi6tYTUbdI1C0SdCvO21PaAAiTkxRqt/GV0b1Y2fiaK20krriBhMUbScpaRnJ6Psne+SSkZI3zLt9xQHNOHeaCKhmFm6uxoPoB8qrecoEK4n5cRcgoegdv4BFMfwhwfvepOAB2qFY+3DlhpOR2ISm7C3paBEz5CYD9e/CnJmlVMrLXGJhdmojMIhfScxzweGwA+C/N7wF1/PIEbN4/SAAAAABJRU5ErkJggg==",
			//onmouseover: "",
			oncommand: "Services.appinfo.invalidateCachesOnRestart() || BrowserUtils.restartApplication();",
			//onDOMMouseScroll: "ZoomScroll.onScroll(event);",
		},
		{
			id: "NextTab-button",
			tooltiptext: "N\u00E4chster Tab",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVQ4jWNgGBLA1zdSxM/Pj5dsA4KDQ0uDg0OWeXkFyZNlgJ9fQIOfX8B/Pz//ox4ePpYokra2tqJOTk7yeLC0u5tnv6en939PT+//nu5eD1xc3KMcHBxYGBgYGBicHJzPOTk6P3R0dHqACzs5OX9wdnL5j8DOHx0cHOodDBwEGGxt7P6Tg22sbX/ZWNluYTA3Nf9PFDZDwhCx3+am5rsYjPUNzxsZGD00NDB8gAsbGRh+MDIw/A/DhvoGnw0NDNs0NDSEGfSUlcU0NTXlcWF9NTVpbXXtfh1Nrf86mlr/dTS0HutqaSVqa2uzER2NKkpKDapKyv/VlZRPqyoq2pGcDuRk5MoVpGXXysrKKpOsmYGBgUFMTExcQEBAgCzNNAcAWWmU1BY/4w8AAAAASUVORK5CYII=",
			//onmouseover: "gBrowser.mTabContainer.advanceSelectedTab(+1, true);",
			oncommand: "gBrowser.mTabContainer.advanceSelectedTab(+1, true);",
		},
		{
			tooltiptext: "",
			image: IMG,
		},
		{
			id: "ScrollBottom-button",
			tooltiptext: "Nach unten scrollen",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdklEQVQ4jZXQsUrDQBjA8Qy6CXawoBGTejVt04uSy6VSLkXrpQnk0pYSE6U4+Q4Obt1c+xRujk7uLg6+gge+gOKo8DmYQTCW5oP/9t2Pu1OUgomyrJqm58/Z2RSysymk6flzlGXVot3CESLRk+RUJkkKP51KIRK9BCD00Wgix+MJjMcTGI0mUghRDhAilnE8hDgeghBxOYBzrgdBJMMwgjCMIAgiyTkvB/ATX/p8AD4fAD/xywGMMb1/3Jf94z7kScZYOcBjnux5Peh5PfCYVw4ghOjdw67sHnYhTxJCFgO0QTeoTa8c25m5jjN3KX3rUBc61AWX0jfXceaO7cwoodcY480/AMZ4jezbt+TAhsWRO4rQeuEtTNPULRM/7rcxFGW18ZNlWfWFT2m1WsxsNl9MowW/azear6ZhHC31iXsIXeyh+ruB6pD3YSB0udThfFZqmjZDO9rn7o72VdO0G0VRVssASq1SqWjq9r22pT6oqrrx3943l4GSr2rZzqIAAAAASUVORK5CYII=",
			oncommand: "content.scrollTo(0, 10000000000);",
		},
		{
			tooltiptext: "",
			image: IMG,
		},
	];
	TriggerZone.init();

	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})();
