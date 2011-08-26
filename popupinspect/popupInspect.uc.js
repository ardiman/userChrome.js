// popup.js -- js
// @Author:      eric.zou (frederick.zou@gmail.com)
// @License:     GPL (see http://www.gnu.org/licenses/gpl.txt)
// @Created:     Sun 29 May 2011 07:28:41 PM CST
// @Last Change: Sun 29 May 2011 07:31:43 PM CST
// @Revision:    4
// @Description:
// @Usage:
// @TODO:
// @CHANGES:
// @LINK:       https://g.mozest.com/viewthread.php?tid=37357
var EventListener = {};
EventListener.targets = [];
EventListener.handleEvent = function(e) {
	// Shift + 右键 响应
	if (e.button == 2 && e.shiftKey) {
		try {
			e.preventDefault();
			window.openDialog('chrome://inspector/content/',
				'_blank', 'chrome, all, dialog=no',
				e.originalTarget
			);
			for (var i = 0, lg = EventListener.targets.length; 
				i < lg; ++i) {
				this.targets[i].hidePopup();
			}
			e.stopPropagation();
			this.targets = [];
		} catch (err) {
			alert(err.message);
		}
	}
};
document.addEventListener("popupshown", function(e) {
		EventListener.targets.push(e.originalTarget);
		e.target.addEventListener("click", EventListener, false);
	}, false);
document.addEventListener("popuphidden", function(e) {
		e.target.removeEventListener("click", EventListener, false);
	}, false);

