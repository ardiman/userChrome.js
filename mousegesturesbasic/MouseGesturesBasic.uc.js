/* :::::::: Mouse Gestures (original by Gomita, cf. http://www.xuldev.org/blog/?p=73 ) ::::::::::::::: */

// http://mozilla.zeniko.ch/userchrome.js.html#snippets

({
	GESTURES: {
		// "<gesture>": ["<gesture name>", "<command id or JavaScript code>"],
		
		// 戻る
		"L":   ["Zurück", "Browser:Back"],
		
		// 進む
		"R":   ["Vor", "Browser:Forward"],
		
		// 更新
		"UD":  ["Neu laden", "Browser:Reload"],
		
		// キャッシュを無視して更新
		"UDU": ["Neu laden ohne Cache", "Browser:ReloadSkipCache"],
		
		// タブを閉じる
		"DR":  ["Schließen", "cmd_close"],
		
		// 閉じたタブを元に戻す
		"DL":  ["Kürzlich geschlossene Tabs", "History:UndoCloseTab"],
		
		// 前のタブへ
		"UL":  ["Vorheriger Tab", 'gBrowser.tabContainer.advanceSelectedTab(-1, true);'],
		
		// 次のタブへ
		"UR":  ["Nächster Tab", 'gBrowser.tabContainer.advanceSelectedTab(+1, true);'],
		
		// ページ先頭へスクロール
		"RU":   ["Zum Seitenanfang", 'goDoCommand("cmd_scrollTop");'],
		
		// ページ末尾へスクロール
		"RD":   ["Zum Seitenende", 'goDoCommand("cmd_scrollBottom");'],
		
		// ページアップ
		"U":   ["Nach oben scrollen", 'goDoCommand("cmd_scrollPageUp");'],
		
		// ページダウン
		"D":   ["Nach unten scrollen", 'goDoCommand("cmd_scrollPageDown");'],
		
		// 縮小
		"LRL":   ["Verkleinern", "cmd_fullZoomReduce"],
		
		// 拡大
		"RLR":   ["Vergrößern", "cmd_fullZoomEnlarge"],
		
		// 原寸
		"DU":   ["Originalgröße", "cmd_fullZoomReset"],
		
		// 画像を拡大
		"RULD":   ["Bild vergrößern", 'var node = aEvent.target; if(node instanceof HTMLImageElement){if(!node.hasAttribute("width")){node.setAttribute("width", node.naturalWidth);} if(!node.hasAttribute("height")){node.setAttribute("height", node.naturalHeight);} if(!node.hasAttribute("originalWidth")){node.setAttribute("originalWidth", node.width);node.setAttribute("originalHeight", node.height);}node.width = node.width * 1.5;node.height = node.height * 1.5;}'],
		
		// 画像を縮小
		"LURD":   ["Bild verkleinern", 'var node = aEvent.target; if(node instanceof HTMLImageElement){ if(!node.hasAttribute("width")){node.setAttribute("width", node.naturalWidth);} if(!node.hasAttribute("height")){node.setAttribute("height", node.naturalHeight);} if(!node.hasAttribute("originalWidth")){node.setAttribute("originalWidth", node.width); node.setAttribute("originalHeight", node.height);} node.width = node.width * 0.5; node.height = node.height * 0.5;}'],
		
		// 画像を原寸
		"RDLU":   ["Bild Originalgröße", 'var node = aEvent.target; if(node instanceof HTMLImageElement){ if(node.hasAttribute("originalWidth")){node.width = node.getAttribute("originalWidth"); node.height = node.getAttribute("originalHeight");}}'],
		
		// ひとつ上の階層へ移動
		"LU":   ["Eine Ebene nach oben", 'var uri = gBrowser.currentURI; if(uri.path != "/"){var pathList = uri.path.split("/"); if (!pathList.pop()){pathList.pop();} loadURI(uri.prePath + pathList.join("/") + "/");}'],
		
		
		// 
		//"*DUD": ["Open Links In Background", 'this._links.forEach(function(aURL) { gBrowser.addTab(aURL, gBrowser.currentURI); });'],
		// regular expression mappings for all gestures containing a wildcard *
		//"*": { "*DUD": /DUD$/ }
	},

	LANGUAGE: {
		"L": "\u2190",
		"R": "\u2192",
		"U": "\u2191",
		"D": "\u2193",

		gesture:  "Geste",
		canceled: "Abbrechen",
		unknown:  "Ungültig",
	},

	init: function()
	{
		var self = this;
		function registerEvents(aAction) {
			["mousedown", "mousemove", "mouseup", "contextmenu"].forEach(function(aType) { getBrowser().mPanelContainer[aAction + "EventListener"](aType, self, aType == "contextmenu"); });
		}
		
		registerEvents("add");
		window.addEventListener("unload", function() { registerEvents("remove"); }, false);
	},

	handleEvent: function(aEvent)
	{
		switch (aEvent.type)
		{
		case "mousedown":
			if (aEvent.button == 2)
			{
				this._isMouseDown = true;
				this.startGesture(aEvent);
			}
			break;
		case "mousemove":
			if (this._isMouseDown)
			{
				this.progressGesture(aEvent);
			}
			break;
		case "mouseup":
			if (this._isMouseDown)
			{
				this._isMouseDown = false;
				this._suppressContext = !!this._gesture;
				this.stopGesture(aEvent);
				
				if (this._shouldFireContext) // for Linux and Mac
				{
					this._shouldFireContext = false;
					var event = aEvent.originalTarget.ownerDocument.createEvent("MouseEvents");
					event.initMouseEvent("contextmenu", true, true, aEvent.originalTarget.defaultView, 0, aEvent.screenX, aEvent.screenY, aEvent.clientX, aEvent.clientY, false, false, false, false, 2, null);
					aEvent.originalTarget.dispatchEvent(event);
				}
			}
			break;
		case "contextmenu":
			if (this._suppressContext || this._isMouseDown)
			{
				this._suppressContext = false;
				this._shouldFireContext = this._isMouseDown;
				aEvent.preventDefault();
				aEvent.stopPropagation();
			}
			break;
		}
	},

	startGesture: function(aEvent)
	{
		this._gesture = "";
		this._language = "";
		this._x = aEvent.screenX;
		this._y = aEvent.screenY;
		this._origDoc = aEvent.originalTarget.ownerDocument;
		this._links = [];
	},

	progressGesture: function(aEvent)
	{
		if (!this._origDoc)
		{
			return;
		}
		for (var node = aEvent.originalTarget; node; node = node.parentNode)
		{
			if (node instanceof Components.interfaces.nsIDOMHTMLAnchorElement)
			{
				if (this._links.indexOf(node.href) == -1)
				{
					this._links.push(node.href);
				}
				break;
			}
		}
		this.timeGesture();
		
		var x = aEvent.screenX, y = aEvent.screenY;
		var distX = Math.abs(x - this._x), distY = Math.abs(y - this._y);
		var threshold = 15 / (gBrowser.selectedBrowser.markupDocumentViewer.fullZoom || 1.0);
		if (distX < threshold && distY < threshold)
		{
			return;
		}
		var dir = distX > distY ? (x < this._x ? "L" : "R") : (y < this._y ? "U" : "D");
		if (dir != this._gesture.slice(-1))
		{
			this._gesture += dir;
//			this._language += dir.replace(/(L|R|U|D)/, this.LANGUAGE["$1"]);
			this._language += dir == "L" ? this.LANGUAGE.L :
			                  dir == "R" ? this.LANGUAGE.R :
			                  dir == "U" ? this.LANGUAGE.U :
			                  dir == "D" ? this.LANGUAGE.D : "?";
//			content.status = "Gesture: " + this._gesture + (this.GESTURES[this._gesture] ? " (" + this.GESTURES[this._gesture][0] + ")" : "");
			content.status = this.LANGUAGE.gesture + ": " + this._language + (this.GESTURES[this._gesture] ? " (" + this.GESTURES[this._gesture][0] + ")" : "");
		}
		this._x = x;
		this._y = y;
	},

	timeGesture: function(aClearing)
	{
		if (this._timer)
		{
			clearTimeout(this._timer);
		}
		this._timer = setTimeout(!aClearing ? function(aSelf) { aSelf.stopGesture({}, true); } : function(aSelf) { aSelf._timer = content.status = ""; }, 1500, this);
	},

	stopGesture: function(aEvent, aCancel)
	{
		if (this._origDoc && this._gesture)
		{
			try
			{
				if (aCancel)
				{
//					throw "Gesture canceled";
					throw this.LANGUAGE.canceled;
				}
				var cmd = this.GESTURES[this._gesture] || null;
				if (!cmd)
				{
					for (var key in this.GESTURES["*"])
					{
						if (this.GESTURES["*"][key].test(this._gesture))
						{
							cmd = this.GESTURES[key];
							break;
						}
					}
				}
				if (!cmd)
				{
//					throw "Unknown Gesture: " + this._gesture;
					throw this.LANGUAGE.unknown + ": " + this._language;
				}
//				content.status = "Gesture: " + cmd[0];
				content.status = this.LANGUAGE.gesture + ": " + cmd[0];
				if (document.getElementById(cmd[1]))
				{
					document.getElementById(cmd[1]).doCommand();
				}
				else
				{
					eval(cmd[1]);
				}
			}
			catch (ex)
			{
				content.status = ex;
			}
			this.timeGesture(true);
		}
		this._origDoc = this._links = null;
	}
}).init();