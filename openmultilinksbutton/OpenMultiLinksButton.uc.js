location == "chrome://browser/content/browser.xul" && (function () {
	(function (m) {
		m.id = "openMutiLinks";
		m.addEventListener("command", function () {
			Array.filter(content.document.links, function (link) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(link.toString())) && content.getSelection().containsNode(link, 1)) {
					arguments.callee.uniq.push(link.toString());
					return 1;
				}
			}).forEach(function (link) {
				gBrowser.addTab(link.toString());
			})
		}, false);
		m.setAttribute("label", "Linkauswahl öffnen");
        m.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
        m.setAttribute("tooltiptext", "Linkauswahl öffnen");
        m.setAttribute("image", "data:;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgMF/8QAIxAAAQQBBAEFAAAAAAAAAAAAAQIDBAURABIhQQYiIzEyof/EABUBAQEAAAAAAAAAAAAAAAAAAAUG/8QAHhEBAQABAwUAAAAAAAAAAAAAARECAANhBCEjQfD/2gAMAwEAAhEDEQA/ANRirmKZj2L0VT0V14JHuDc6d2Ckc5ycHrSi4pamPTSno8UR57CEOKSh9Sy0SrjPOOjqVXZUw8di19jMcjyWHFLBQhe5te9RBBAI+D+6O20hJsJTVbLkPxnyjKlE5eOB9hgZ9WetNeTczncjzEuo2bHT7NJk5B7FFHikfrr/2Q==");
	})(document.getElementById("nav-bar").insertBefore(document.createElement("toolbarbutton"), document.getElementById("home-button")));
	document.getElementById("nav-bar").addEventListener("popupshowing", function () {
		gContextMenu.showItem("openMutiLinks", Array.some(content.document.links, function (link) {
			return content.getSelection().containsNode(link, 1);
		}));
	}, false);
})()