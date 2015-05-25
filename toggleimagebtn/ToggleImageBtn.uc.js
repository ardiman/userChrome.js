(function() {
	if (location != "chrome://browser/content/browser.xul") return;
	var imgOn = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABbklEQVQ4jdXUsUuVURjH8Y9OgdAkUUmDFhWBS4ENLTno0tIqOEoaXlJoElwSpFlpcmvoH2gKd1HwkqBDWwaVpGQKcfGKWQ7nefHt4n17L7j0g2d5z+98Oef3POflf9YdrOCgoVZirSXdxCr+NKnV8DTVIMbwNGq5AJbVcs4/FgwwgVoJwL+qhmfw5RxgWX2GwwLDLmZwD3fxAt8L/HVS585a3MnnEurAywLgQTPgb7xqgHXjbfirWMJGWWAdQznYJbzHJwzjYny/jAq2ywCHc8CFyPN2w6nb0IXH+IFfRRkuxKZObGG6AdYeng/oxevY1xS4LzXlvtTZW3gY2fVjLnxVqVnj2ZWLxuYb3gXwGkakhtVjfQ034sSj0nCXGuxjPIqNzwO6juu5COakpqngZwnoYm7zZOSW6WrcZjb7MOD0oZ9VUziKU1zwt7I/0yauaEFPpOyq0muZkIb/I77iQSuwTH14I2W1F7B59GSGE0Hn2GFuKJeRAAAAAElFTkSuQmCC"
	var imgOff = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABcElEQVQ4jdXUvUtWYRjH8Q84BLlFFOEgiUQILQY5OCf+AyqCS4sohIkE4Zgguonl5N4gODnp6CCPoNTQnAqpWPhShKnl23Bfhx7U53SEln5wccN9/e4vXC/n8D+rAYs4uBCLkbuWHmAJZxViKTwV1YIe9EaUcmBZlMr8PcEAL7BfAPC32EcfrP8DWBaf4SjHsIMhPEYjXmM7x39ImtxVya/lfQlVYyQHeFAJeIqJC7D7mAn/MhbwsSjwEJ1lsDt4jzW040bc38JLfCkC7CoDTmJX2r1q3I37h3F2RP44r4eTYb6NTbxCFabwAf1YiXuYjncVgd+koTRJk30UwNHI/8LvaAEMZCXnrc0WZqOc2gC24XvkP6E+gN3Schda7BO0Rv/m8TPOM4wFcEwamuf4UQA6Fw9b8Qw3MYga3ItqhsPjqT8f+lUxGP0ad1m10t9nNcCF1S2t07I0mH68lSa9gebrwDI9wTupV3sBe4O6zHAODFnbpYY8UzIAAAAASUVORK5CYII="
	var switchImg = document.querySelector("#nav-bar-customization-target").appendChild(document.createElement("toolbarbutton"));
	
	switchImg.image = (gBrowser.mPrefs.getIntPref("permissions.default.image") == 1 ? imgOn : imgOff);
	switchImg.onclick = function() {
		switch(gBrowser.mPrefs.getIntPref("permissions.default.image")) {
			case 1:
				gBrowser.mPrefs.setIntPref("permissions.default.image", 2);
				switchImg.image = imgOff;
			break;
			case 2:
				gBrowser.mPrefs.setIntPref("permissions.default.image", 1);
				switchImg.image = imgOn;
			break;
			default:
			break;
		}
		goDoCommand('cmd_scrollTop');
		gBrowser.reload();
	}
})();
