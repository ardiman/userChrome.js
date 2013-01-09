(function () {
	if (location != "chrome://browser/content/browser.xul") return;
	var URLBarInput = gURLBar.mInputField;
	var locationBar = URLBarInput.parentNode.appendChild(document.createElement("hbox"));
	locationBar.style.display = "none";
	URLBarInput.parentNode.addEventListener("click", function () {
		if (URLBarInput.style.display === "none") {
			URLBarInput.style.display = "";
			locationBar.style.display = "none";
			gURLBar.select();
		}
	}, false);
	URLBarInput.parentNode.addEventListener("mouseout", function () {
		if (document.activeElement !== gURLBar.inputField) {
			locationBar.style.display = "none";
			URLBarInput.style.display = "";
			gURLBar._urlTooltip && gURLBar._hideURLTooltip();
		}
	}, false);
	URLBarInput.addEventListener("mouseover", function (event) {
		if (event.ctrlKey || document.activeElement === gURLBar.inputField) {
			return;
		}
		locationBar.parentNode.removeChild(locationBar);
		locationBar = URLBarInput.parentNode.appendChild(document.createElement("hbox"));
		locationBar.style.overflow = "hidden";
		locationBar.style.width = URLBarInput.clientWidth + "px";
		gURLBar.value.split("?")[0].split("/").map(function (value, index, arr) {
			return index + 1 === arr.length ? (gURLBar.value.split("?")[1] ? (value + "?" + gURLBar.value.split("?")[1]) : value) : value;
		}).map(function (value, index, arr) {
			var sec = locationBar.appendChild(document.createElement("label"));
			sec.style.margin = 0;
			sec.value = value;
			if (index < arr.length - 1) sec.value = value.replace(/[^\/]$/, "$&/");
			index === 0 && (sec.style.marginLeft = "1px");
			if (index === 0 && /:\/$/.test(sec.value)) {
				sec.value += "/";
			} else {
				sec.onmouseover = function () {
					this.style.textDecoration = "underline";
					this.style.cursor = "pointer";
				}
				sec.onmouseout = function () {
					this.style.textDecoration = "";
				}
				sec.onclick = function (event) {
					if (event.button === 0) {
						loadURI(URLBarInput.value.split(this.value)[0] + this.value);
						while (this.nextSibling) {
							this.nextSibling.parentNode.removeChild(this.nextSibling);
						}
						event.stopPropagation();
					}
				}
				URLBarInput.style.display = "none";
				locationBar.style.display = "";
			}
		})
	}, false);
})()