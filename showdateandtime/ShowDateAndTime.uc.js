(function() {
	DaT = $("TabsToolbar").appendChild($C("label", {
				id: "Clock",
				tooltiptext: "Aktuelles Datum und Uhrzeit",
				style: "margin: 5px -4px 5px 4px; font-weight: bold; font: 18px Arial, Microsoft Yahei; color: grey; min-width: 210px;",
				ordinal: "0",
			}));
	function startTime() {
		var dayName = new Array ("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");
		var today = new Date();
		var D = today.getDate(),
			M = today.getMonth() + 1,
			Y = today.getFullYear(),
			h = today.getHours(),
			m = today.getMinutes(),
			s = today.getSeconds();
		D = checkTime(D);
		M = checkTime(M);
		h = checkTime(h);
		m = checkTime(m);
		s = checkTime(s);
		DaT.value = D + "." + M + "." + Y + ", " + dayName[today.getDay()] + " " + h + ":" + m + ":" + s;
		setTimeout(function() {startTime();}, 250);
	}
	function checkTime(i) {
		if (i < 10) {i = "0" + i}
		return i
	}
	startTime();

	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})();
