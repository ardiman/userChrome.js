(function () {
	if (location != "chrome://browser/content/browser.xul") return
	var urlinput = (document.getAnonymousElementByAttribute(document.querySelector("#urlbar"), "class", "autocomplete-textbox-container") || document.getAnonymousElementByAttribute(document.querySelector("#urlbar"), "anonid", "textbox-container")).childNodes.item(0).childNodes.item(0)
	var locationbar = urlinput.parentNode.appendChild(document.createElement("hbox"));
	locationbar.style.display = "none";
	urlinput.parentNode.addEventListener("click", function (e) {
		if (e.button == 0 && e.originalTarget.localName == "label") {
			return
		}
		if (urlinput.style.display == "none") {
			urlinput.reset = 1;
			urlinput.style.display = "";
			locationbar.style.display = "none";
			document.querySelector("#urlbar").select();
		}
	}, false)
	urlinput.parentNode.onmouseout = function (e) {
		locationbar.style.display = "none";
		urlinput.style.display = "";
		document.querySelector("#urlTooltip").hidden = 1;
	}
	urlinput.onmouseover = function () {
		if (urlinput.reset == 1) {
			urlinput.reset = 0;
			return;
		}
		document.querySelector("#urlTooltip").hidden = 0;
		locationbar.parentNode.removeChild(locationbar);
		locationbar = urlinput.parentNode.appendChild(document.createElement("hbox"));
		locationbar.style.overflow = "hidden";
		locationbar.style.width = urlinput.clientWidth + "px"
		document.querySelector("#urlbar").value.split("?")[0].split("/").map(function (u, n, c) {
			return n + 1 == c.length ? (document.querySelector("#urlbar").value.split("?")[1] ? (u + "?" + document.querySelector("#urlbar").value.split("?")[1]) : u) : u
		}).map(function (u, n, i) {
			var sec = locationbar.appendChild(document.createElement("label"));
			sec.style.margin = 0;
			sec.value = u;
			if (n < i.length - 1) sec.value = u.replace(/[^\/]$/, "$&/");
			n == 0 && (sec.style.marginLeft = "1px");
			if (n == 0 && /:\/$/.test(sec.value)) {
				sec.value += "/";
			} else {
				sec.onmouseover = function (e) {
					document.querySelector("#urlTooltip").hidden = 0;
					e.target.style.textDecoration = "underline";
					e.target.style.cursor = "pointer";
				}
				sec.onmouseout = function (e) {
					e.target.style.textDecoration = "";
				}
				sec.onclick = function (e) {
					if (e.button == 0) {
						loadURI(urlinput.value.split(e.target.value)[0] + e.target.value);
						while (e.target.nextSibling) {
							e.target.nextSibling.parentNode.removeChild(e.target.nextSibling)
						}
					}
				}
				urlinput.style.display = "none";
				locationbar.style.display = "";
			}
		})
	}
})()