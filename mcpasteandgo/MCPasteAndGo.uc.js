// ==UserScript==
// @name			MCPasteAndGo.uc.js
// @description		中クリックであらゆるウェブページやブラウザの入力欄で貼り付けて検索を実行します。
// @version			1.0
// @author			y2k
// @include			main
// @namespace		http://tabunfirefox.web.fc2.com/
// @note			正確にはmousedownで貼り付け、mouseupで検索
// @note			中クリックの代わりにshift+クリックでも可
// ==/UserScript==
(function() {
function LOG(text) { Application.console.log("[MCPasteAndGo] " + text); }


var PasteOnlyHtmlID = {
//	"id": "url",
//	"id": [ "url1", "url2", "url3" ],
//	"lst-ib": "http://www.google.de/",
};

var PasteOnlyXulID = {
	browserHomePage: true,
};

var TagAction = {
	//HTMLのinput
	INPUT: {
		paste: function(target, text) {
			target.value = text;
		},
		go: function(target) {
			var url = target.ownerDocument.defaultView.location.href;
			var list = PasteOnlyHtmlID[target.id];
			if (list) {
				list = (list instanceof Array) ? list : [ list ];
				for (var i = 0, l = list.length; i < l; i++) {
					if (url.indexOf(list[i]) >= 0) {
						return;
					}
				}
			}
			if (target.form) {
				target.form.submit();
			}
			else {
				var event = document.createEvent("KeyboardEvent");
				event.initKeyEvent("keydown", true, true, null, false, false, false, false, 13, 0);
				target.dispatchEvent(event);
			}
		},
	},
	
	//HTMLのtextarea
	TEXTAREA: {
		paste: function(target, text) {
			target.focus();
			var value = target.value;
			var pos = target.selectionStart;
			var newpos = pos + text.length;
			target.value = [ value.substr(0, pos), text, value.substr(pos) ].join("");
			target.setSelectionRange(newpos, newpos);
		},
		go: function() {
			//paste only
		},
	},
	
	//ブラウザのtextbox
	textbox: {
		paste: function(target, text) {
			target.value = text;
		},
		go: function(target) {
			if (PasteOnlyXulID[target.id]) {
				return;
			}
			var event = document.createEvent("KeyboardEvent");
			event.initKeyEvent("keypress", true, true, null, false, false, false, false, 13, 0);
			target.dispatchEvent(event);
		},
	},
	
	//検索バー
	searchbar: {
		paste: function(target, text) {
			if (target._textbox) {
				target._textbox.value = text;
			}
		},
		go: function(target) {
			if (target.handleSearchCommand) {
				target.handleSearchCommand();
			}
		},
	},
	
	//ページ内検索バー
	findbar: {
		paste: function(target, text) {
			if (target._findField) {
				target._findField.value = text;
			}
		},
		go: function(target) {
			if (target.onFindAgainCommand) {
				target.onFindAgainCommand(false);
			}
		},
	},
};

function checkEvent(e) {
	//中クリック or shift+クリック
	return (e.button == 1) || ((e.button == 0) && e.shiftKey);
};



function getClipboardText() {
	var text = "";
	var clip = Cc["@mozilla.org/widget/clipboard;1"].getService(Ci.nsIClipboard);
	var trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);
	if (clip && trans) {
		var str = new Object();
		var strLength = new Object();
		
		trans.addDataFlavor("text/unicode");
		clip.getData(trans, clip.kGlobalClipboard);
		trans.getTransferData("text/unicode", str, strLength);
		if (str) {
			str = str.value.QueryInterface(Ci.nsISupportsString);
			text = str.data.substring(0, strLength.value / 2);
		}
	}
	return text;
};

var clickTarget = false;

function mousedown(e) {
	var target = e.target;
	clickTarget = null;
	if (checkEvent(e)) {
LOG([ "tag: ", target.tagName, " id:", target.id, " class:", target.className ].join(""));
		var text = getClipboardText();
		var action = TagAction[target.tagName];
		if (text && action) {
			action.paste(target, text);
			clickTarget = target;
		}
	}
};

function mouseup(e) {
	var target = e.target;
	if ((clickTarget === target) && checkEvent(e)) {
		var action = TagAction[target.tagName];
		if (action) {
			action.go(target);
		}
	}
	clickTarget = null;
};



window.addEventListener("mousedown", mousedown, false);
window.addEventListener("mouseup", mouseup, false);

var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].getService(Ci.nsIWindowWatcher);
ww.registerNotification({
	observe: function(window, event, data) {
		if (event == "domwindowopened") {
			window.addEventListener("mousedown", mousedown, false);
			window.addEventListener("mouseup", mouseup, false);
		}
	}
});

})();