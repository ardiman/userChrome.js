// ==UserScript==
// @name           AwesomeBookmarkbar
// @description    智能书签工具栏
// @homepage       https://github.com/feiruo/userchromejs/
// @author         feiruo
// @charset        utf-8
// @version        0.1
// @note           点击地址栏显示书签工具栏。
// @note           地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。
// @note           左键点击书签后自动隐藏书签工具栏。
// ==/UserScript== 
(function() {
	var PersonalToolbar = document.getElementById("PersonalToolbar");
	var placesCommands = document.getElementById("placesCommands");

	setToolbarVisibility(PersonalToolbar, PersonalToolbar.collapsed);

	function hideToolbar(e) {
		if (e.button == 2 || (e.button == 0 && !(e.metaKey || e.shiftKey || e.ctrlKey))) return;
		PersonalToolbar.collapsed = true;
	}

	PersonalToolbar.addEventListener("command", hideToolbar, false);
	PersonalToolbar.addEventListener("click", hideToolbar, false);
	placesCommands.addEventListener("command", hideToolbar, false);

	setToolbarVisibility(PersonalToolbar, PersonalToolbar.collapsed);

	gURLBar.addEventListener('click', function(e) {
		if (e.button == 0) {
			var pbar = document.getElementById('PersonalToolbar');
			if (pbar.collapsed) {
				pbar.collapsed = !pbar.collapsed
			}
		}
	}, false);

	gURLBar.addEventListener('blur', function(e) {
		document.getElementById('PersonalToolbar').setAttribute('collapsed', 'true');
	}, false);

	gURLBar.addEventListener('keydown', function(e) {
		if (window.event ? e.keyCode : e.which)
			document.getElementById('PersonalToolbar').setAttribute('collapsed', 'true');
	}, false);

})();