// ==UserScript==
// @name           AutoPopup.uc.js
// @description    Auto popup menulist/menupopup
// @compatibility  Firefox 24.0+
// @author         GOLF-AT
// @version        3.0.6.20141202

(function() {
	var overElt = null;   var nDelay = 200;
	var DropElt = null;   var PopElt = null;
	var PopTimer = null;  var HideTimer = null;
	var AlwaysPop = false;

	var BlackIDs = []; //['abp-toolbarbutton'];

	var popupPos = ['after_start', 'end_before',
		'before_start', 'start_before'];

	function IsNewMenuBtn(elt) {
		try {
			return elt.id=='PanelUI-menu-button';
		}catch(e) {
			return false;
		}
	}
	
	function IsSearchDrop(elt) {
		try {
			return elt.localName=='dropmarker'
				&& elt.parentNode!=null && elt.
				parentNode.getAttribute('class'
				)=='searchbar-textbox';
		}catch(e) { return false; }
	}

	function IsDownloadBtn(elt) {
		try {
			return elt.localName=='toolbarbutton'
				&& elt.id=='downloads-button';
		}catch(e) { return false; }
	}

	function IsMenuPanelChild(node) {
		for(node=(node?node.parentNode:null);
			node; node=node.parentNode) {
			try {
				if (node.id=='PanelUI-multiView')
					return true;
			}catch(e) {}
		}
		return false;
	}

	function IsAutoComplete(elt) {
		try {
			return 'PopupAutoComplete'==elt.id.
				substr(0,17);
		}catch(e) { return false; }
	}

	function getPopupMenu(elt)
	{
		var nodes = elt!=null ? elt.ownerDocument.
			getAnonymousNodes(elt) : null;
		for(var n=(nodes ? nodes.length : 0); n>0;
			n--) {
			if (nodes[n-1].localName=='menupopup')
				return nodes[n-1];
		}
		return null;
	}

	function getPopupPos(elt)
	{
		var x, y, pos, box;

		for(pos=0,x=elt.boxObject.screenX,y=elt
			.boxObject.screenY; elt!=null; elt=
			elt.parentNode) {
			if (elt.localName=='window' || elt.
				parentNode==null)
				break;
			else if(pos & 8)
				;
			else if('toolbar'==elt.localName ||
				'hbox'==elt.localName || 'vbox'
				==elt.localName) {
				if (elt.boxObject.height >= 3*
					elt.boxObject.width)
					pos = 9;
				else if(elt.boxObject.width >=
					3*elt.boxObject.height)
					pos = 8;
			}
		}
		box = elt.boxObject; //box of window
		if (pos & 1)
			return popupPos[x<box.width/2+box.
				screenX?1:3];
		else
			return popupPos[y<box.height/2+box
				.screenY?0:2];
	}

	function getPopupNode(node)
	{
		var isPop, nodeID;

		for(; node!=null; node=node.parentNode) {
			isPop = false; //Node isn't Popup node
			try {
				nodeID = node.id;
			}catch(ex) { nodeID = ''; }
			if (node.localName=='toolbarbutton' &&
				node.parentNode.localName==node.
				localName && !getPopupMenu(node))
				return IsNewMenuBtn(overElt)==true
					&& IsMenuPanelChild(node)==true
					? overElt : null;
			else if(IsNewMenuBtn(overElt) && nodeID
				=='PanelUI-popup')
				return overElt;
			else if(IsSearchDrop(overElt) && nodeID
				=='PopupSearchAutoComplete')
				return overElt;
			else if(IsDownloadBtn(overElt) && nodeID
				=='downloadsPanel')
				return overElt;
			if (node.localName=='menupopup' || node.
				localName=='popup' || node.localName
				=='menulist' || IsAutoComplete(node)
				|| IsMenuButton(node))
				isPop = true;
			else if(node.localName == 'dropmarker') {
				if (node.getAttribute('type')=='menu'
					) {
					node = node.parentNode;
					if (node.firstChild && 'menupopup'
						==node.firstChild.localName)
						isPop = true;
				}
				else if(IsSearchDrop(node) == true)
					isPop = true;
				else {
					try {
						isPop = node.parentNode.id ==
							'urlbar';
					}catch(ex) {}
				}
			}
			else if(node.localName == 'menu')
				isPop = node.parentNode && 'menubar'==
					node.parentNode.localName;
			if (isPop) return node;
		}
		return null;
	}

	function AutoPopup()
	{
		PopTimer = null;
		if (DropElt) {
			var LocalName = DropElt.localName;
			if (LocalName=='menulist' || LocalName
				=='dropmarker' || IsDownloadBtn(
				DropElt) || IsNewMenuBtn(DropElt))
				PopElt = DropElt;
			else
				PopElt = getPopupMenu(DropElt);
			try {
				if (PopElt.localName=='dropmarker')
					PopElt.showPopup();
				else if(PopElt.localName=='menulist')
					PopElt.open = true;
				else if(IsNewMenuBtn(PopElt))
					PanelUI.show();
				else if(IsDownloadBtn(PopElt))
					DownloadsPanel.showPanel();
				else {
					var popPos = getPopupPos(overElt
						);
					PopElt.openPopup(overElt, popPos
						, 0, 0, false, false, null);
				}
			}catch(e) { PopElt = null; }
		}
	}

	function HidePopup()
	{
		try {
			if (PopElt.localName=='dropmarker')
				PopElt.parentNode.closePopup();
			else if(PopElt.localName=='menulist')
				PopElt.open = false;
			else if(IsNewMenuBtn(PopElt))
				PanelUI.hide();
			else if(IsDownloadBtn(PopElt))
				DownloadsPanel.hidePanel();
			else
				PopElt.popupBoxObject.hidePopup();
		}catch(e) {}

		overElt = null; PopElt    = null;
		DropElt = null; HideTimer = null;
	}

	function MouseOver(e)
	{
		var n, popNode, sNodeID;

		if (!AlwaysPop && !document.hasFocus())
			return;
		popNode = getPopupNode(e.originalTarget);
		try {
			sNodeID = popNode ? popNode.id : '';
		}catch(ex) { sNodeID = ''; }
		if (sNodeID!='' && BlackIDs.length!=0) {
			for(n=0; n<BlackIDs.length; n++) {
				if (BlackIDs[n] == sNodeID) {
					popNode = null; break;
				}
			}
		}
		if (popNode==null) { MouseOut();return; }

		if (HideTimer) {
			window.clearTimeout(HideTimer);
			HideTimer = null;
		}
		try {
			if (IsAutoComplete(popNode)) return;

			for(var elt=popNode; elt!=null; elt=
				elt.parentNode) {
				if (elt.localName=='popup' || elt.
					localName=='menupopup')
					return;
			}
		}catch(ex) {}

		if (IsNewMenuBtn(PopElt)) {
			if ((popNode==PopElt&&"open"==PanelUI.
				panel.state) || IsMenuPanelChild(
				popNode))
				return;
		}
		else if(PopElt != null) {
			if (DropElt!=null && popNode==DropElt)
				return;
			try { 
				if (PopElt.localName != 'dropmarker'
					) {
					for(var elt=popNode; elt!=null;
						elt=elt.parentNode) {
						if (elt == PopElt) return;
					}
				}
			}catch(ex) {}
		}
		if (DropElt && popNode!=DropElt) HidePopup();
		DropElt = popNode; overElt = e.originalTarget;
		PopTimer = setTimeout(AutoPopup, nDelay);
	}

	function MouseOut(e)
	{
		if (e!=null && (overElt==null || overElt!=e.
			originalTarget))
			return;
		if (PopTimer) {
			window.clearTimeout(PopTimer);
			PopTimer = null;
		}
		if (!HideTimer && PopElt)
			HideTimer = window.setTimeout(HidePopup,
				500);
	}

	function IsButton(elt) {
		try {
			return elt.localName=='toolbarbutton' ||
				elt.localName=='button';
		}catch(e) { return false; }
	}

	function IsMenuButton(elt) {
		if (IsNewMenuBtn(elt) || IsDownloadBtn(elt))
			return true;
		return IsButton(elt) && getPopupMenu(elt);
	}

	//window.addEventListener('mouseout', MouseOut, false);
	window.addEventListener('mouseover',MouseOver, false);
})();
