// ==UserScript==
// @name                 UndoCloseTabBtn.uc.js
// @namespace            UndoCloseTab@gmail.com
// @description          恢复已关闭标签de可移动按钮
// @author               defpt
// @charset              UTF-8
// @Compatibility        FF29+
// @version              v2014.9.15
// ==/UserScript==
(function() {
	var buttonAttrs = {
		id: "undoclosetab-button",
		label: "Tabs wiederherstellen",
		tooltiptext: "Kürzlich geschlossene Tabs wiederherstellen",
		class: "toolbarbutton-1 chromeclass-toolbar-additional",
		removable: "true",
		type: "menu-button", //点击按钮恢复最后一次关闭的标签，如果想左键恢复最后一次关闭的标签，右键打开已关闭标签列表，
								// 那么改为(context: "_child",) 
		image: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAgAAAASAAAADAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcuFA06Yy0bw0YcFHIAAAAYAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXS8cpNejNf+zfCj9TCIWkgAAABkAAAADAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAACAAAAAgAAAAIAAAACAAAAFWk1Hr7nvkj//+BH/7eALP9DGxeDAAAAFAAAAAIAAAAAAAAACB0NCCYfDAc3HAsGOBwMBjgcDAc4HQwHNw0FAzkqDwt0hlIr7vnUVv//2Uv/jVYn8DcXD14AAAAMAAAAAAAAABlqNCLYlGZS+5VoUfeUZkz3lGVJ95VlRveWZUL4iVY19U8hFsOOWzHw/dhf/+3CTP90QSHXAAAAIgAAAAMAAAAjdkMx7/jx5P///Ob///TT///0yf//9sH///66/9vEh/9LIhijLhEOfLiKSvz/7W//y5xH/0UdE3sAAAAMAAAAJHVDMuz49fT////9////8P/o2L3/p31g/bONavuoe1j/VikZlQAAADFnNyHR99R2//DLaP9hMB7CAAAAGAAAACR1QzLs+PX0////////////+fTp/4xeTPw6EASvMBMLbjIXDzYAAAAhVCgYtePAeP//5of/hFQy3wAAACAAAAAkdUMy7Pz7+//g087/q4l9///////49O//mXNj8U0hE6UPBgM8BQIBPWk5Jdby2Jv///Sk/6h8Tu0AAAAjAAAAJHVDMuz+/f3/28zH/1klFNuSal309fHw///////dzcT/pYJy8ZJrWOrbw6H+//XC///ytf+SZ0XlAAAAIQAAACN2QzLu/v39/97Py/9LJBamNRIHfpt1avT28vH//////////v////T///7n////3P/q2bH/ZjIiwwAAABcAAAAabzop3bugl/uwjoP/VSkZkAAAACE2FQ1ddko62cSspP7s5OH//Pr4//v27f/jz73/i2JJ6C4aB00AAAAJAAAACSEPCSkjDgY/NhYMSyURDCMAAAAHAAAADAAAACE9GQ1wZzQk04FPP/h9STn1Vy8WuCQUBUEAAAAOAAAAAQAAAAAAAAABAAAAAwAAAAQAAAACAAAAAAAAAAAAAAADAAAADAAAABsAAAAkAAAAIwAAABYAAAAIAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/g8AAP4HAAD+AwAAgAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGAQAA//8AAA==",
		command: "History:UndoCloseTab"
	};
	
	var uCTBtn = $C('toolbarbutton', buttonAttrs);

	var popup = uCTBtn.appendChild($C("menupopup", {
		oncommand: "event.stopPropagation();",
		onpopupshowing: "this.parentNode.populateUndoSubmenu();",
		context: "",
		tooltip: "bhTooltip",
		popupsinherittooltip: "true"
	}));
	uCTBtn._getClosedTabCount = HistoryMenu.prototype._getClosedTabCount;
	uCTBtn.populateUndoSubmenu = eval("(" + HistoryMenu.prototype.populateUndoSubmenu.toString().replace(/._rootElt.*/, "") + ")");
	
	// 来自 User Agent Overrider 扩展
    const log = function() { dump(Array.slice(arguments).join(' ') + '\n'); };
    const trace = function(error) { log(error); log(error.stack); };
    const ToolbarManager = (function() {

        /**
         * Remember the button position.
         * This function Modity from addon-sdk file lib/sdk/widget.js, and
         * function BrowserWindow.prototype._insertNodeInToolbar
         */
        let layoutWidget = function(document, button, isFirstRun) {

            // Add to the customization palette
            let toolbox = document.getElementById('navigator-toolbox');
            toolbox.palette.appendChild(button);

            // Search for widget toolbar by reading toolbar's currentset attribute
            let container = null;
            let toolbars = document.getElementsByTagName('toolbar');
            let id = button.getAttribute('id');
            for (let i = 0; i < toolbars.length; i += 1) {
                let toolbar = toolbars[i];
                if (toolbar.getAttribute('currentset').indexOf(id) !== -1) {
                    container = toolbar;
                }
            }

            // if widget isn't in any toolbar, default add it next to searchbar
            if (!container) {
                if (isFirstRun) {
                    container = document.getElementById('nav-bar');
                } else {
                    return;
                }
            }

            // Now retrieve a reference to the next toolbar item
            // by reading currentset attribute on the toolbar
            let nextNode = null;
            let currentSet = container.getAttribute('currentset');
            let ids = (currentSet === '__empty') ? [] : currentSet.split(',');
            let idx = ids.indexOf(id);
            if (idx !== -1) {
                for (let i = idx; i < ids.length; i += 1) {
                    nextNode = document.getElementById(ids[i]);
                    if (nextNode) {
                        break;
                    }
                }
            }

            // Finally insert our widget in the right toolbar and in the right position
            container.insertItem(id, nextNode, null, false);

            // Update DOM in order to save position
            // in this toolbar. But only do this the first time we add it to the toolbar
            if (ids.indexOf(id) === -1) {
                container.setAttribute('currentset', container.currentSet);
                document.persist(container.id, 'currentset');
            }
        };

        let addWidget = function(window, widget, isFirstRun) {
            try {
                layoutWidget(window.document, widget, isFirstRun);
            } catch(error) {
                trace(error);
            }
        };

        let removeWidget = function(window, widgetId) {
            try {
                let widget = window.document.getElementById(widgetId);
                widget.parentNode.removeChild(widget);
            } catch (error) {
                trace(error);
            }
        };

        let exports = {
            addWidget: addWidget,
            removeWidget: removeWidget,
        };
        return exports;
    })();
	
    ToolbarManager.addWidget(window, uCTBtn, false);
	document.insertBefore(document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent('\
		#undoclosetab-button menuitem {max-width: 240px;}\
		') + '"'), document.documentElement);
		
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})();
