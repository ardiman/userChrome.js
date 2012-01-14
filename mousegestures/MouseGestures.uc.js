//==UserScript==
// @name            Mouse Gestures
// @namespace       http://www.xuldev.org/
// @description     Lightweight customizable mouse gestures.
// @include         main
// @author          Gomita (original author)
// @author          tkhren
// @version         Last Updated: 2011-07-31 17:46:29 JST
// @homepage        http://www.xuldev.org/misc/ucjs.php
// @homepage        https://github.com/tkhren
// @compatibility   Firefox 3.5 ~ 9.0
// @compatibility   Windows, Linux, MacOSX
//==/UserScript==
// @feature         RokerGesture, WheelGesture
// @feature         Display current gesture and its command name
// @feature         Switch functions by element where you start gesture
// @feature         Ctrl+(right_click_up) => Reset Gesture
//
// @note            Gomitaさん版の MouseGestures2.uc.js を参考にして
//                  改造した userChromeJS 用のスクリプト。
// @note            すべてのコマンドをWin/Lin/Macのプラットフォームで
//                  テストしたわけではないのでもしかしたら動作しないものも
//                  含まれるかもしれない。
// @note            Version auf https://github.com/ardiman/userChrome.js
//                  um _showinstatus und _showinstatustime ergaenzt, 
//                  oeffnet Manual (Geste: UDUD) als Tab im Vordergrund
//==ChangeLog==
// 20110718         雑多なコマンドを６つ程追加
// 20110717         RockerGestureでリンククリック動作が暴発するバグを修正
// 20110624         りファクタング、コードの整理を行った。
//                  イベント処理に関するバグを修正

(function() {

    // --- global start ---
    const UCHRM_DIR = Cc['@mozilla.org/file/directory_service;1']
                     .getService(Components.interfaces.nsIProperties)
                     .get('UChrm', Components.interfaces.nsIFile).path;

    const MANUAL_PATH = ((UCHRM_DIR.search(/\\/) != -1)
                            ? UCHRM_DIR + '\\'
                            : UCHRM_DIR + '/') + 'MouseGesturesManual.html';

    var gClipboard = Cc['@mozilla.org/widget/clipboardhelper;1']
                            .getService(Ci.nsIClipboardHelper);

    // --- global end ---


    var MouseGestures = function() {
        this.initialize.apply(this, arguments);
    };

    MouseGestures.prototype = {

        initialize: function() {
            this._POPUP_ID = 'mousegestures_popup';
            this._lastX = 0;
            this._lastY = 0;
            this._clientX = 0;
            this._clientY = 0;

            this._gesture = '';
            this._showinstatus = true;
            this._showinstatustime = 750;
            this._isMDownL = false;
            this._isMDownR = false;
            this._suppressMenu = false;
            this._suppressClick = false;
            this._shouldShowMenu = false;

            this._focusdWindow = null;
            this._anchorNode = null;
            this._linkNode = null;
            this._imageNode = null;

            var events = ['click',
                          'mousedown',
                          'mousemove',
                          'mouseup',
                          'contextmenu',
                          'draggesture',
                          'DOMMouseScroll' ];

            var registerEvents = function(self, action, events) {
                var listener = action + 'EventListener';
                for (var i=0; i<events.length; ++i) {
                    var eventName = events[i];
                    getBrowser().mPanelContainer[listener](
                        eventName, self, eventName == 'contextmenu'
                    );
                }
            };

            // The events are added when this MouseGestures()
            // object is initialized.
            registerEvents(this, 'add', events);

            // The events are removed when the browser is closed.
            window.addEventListener('unload',
                function(){ registerEvents(this, 'remove', events);},
                false
            );
        },


        handleEvent: function(event) {
            switch(event.type) {
                case 'mousedown':
                    if (event.button == 2) {
                        this._isMDownR = true;
                        this._suppressMenu = false;
                        this._startGesture(event);

                        if (this._isMDownL) {
                            // for RockerGesture; LEFT => RIGHT
                            this._isMDownR = false;
                            this._shouldShowMenu = false;
                            this._suppressMenu = true;
                            this._suppressClick = true;
                            this._gesture += '>';
                            this._stopGesture(event);
                        }
                    } else if (event.button == 0) {
                        if (this._isMDownR) {
                            // for RockerGesture; LEFT <= RIGHT
                            this._isMDownL = false;
                            this._shouldShowMenu = false;
                            this._suppressMenu = true;
                            this._suppressClick = true;
                            this._gesture += '<';
                            this._stopGesture(event);
                        } else {
                            this._isMDownL = true;
                        }
                    }
                    break;

                case 'mousemove':
                    if (this._isMDownR) {
                        this._suppressMenu = true;
                        this._progressGesture(event);
                    }
                    break;

                case 'mouseup':
                    if (event.button == 2) {
                        if (event.ctrlKey) {
                            this._resetGesture(event);
                        }

                        else if (this._isMDownR) {
                            if (this._gesture)
                                this._shouldShowMenu = false;
                            this._isMDownR = false;
                            this._stopGesture(event);
                            if (this._shouldShowMenu && ! this._suppressMenu) {
                                this._shouldShowMenu = false;
                                this._displayContextMenu(event);
                            }
                        }
                        break;
                    }

                    else if (event.button == 0) {
                        if (this._isMDownL) {
                            this._isMDownL = false;
                            this._shouldShowMenu = false;
                            break;
                        }
                    }

                    // for Popup Gestures
                    if (event.target.id == this._POPUP_ID) {
                        if (event.button == 0 || event.button == 1) {
                            this._isMDownL = false;
                            this._shouldShowMenu = false;
                            var popup = event.target;
                            popup.hidePopup();
                        }
                    }
                    break;

                case 'popuphidden':
                    if (event.target.id == this._POPUP_ID) {
                        var popup = event.target;
                        popup.removeEventListener('popuphidden', this, true);
                        document.documentElement.removeEventListener(
                                    'mouseup',
                                    this,
                                    true);
                        while (popup.hasChildNodes())
                            popup.removeChild(popup.lastChild);
                    }
                    break;

                case 'contextmenu':
                    if (this._isMDownL
                            || this._isMDownR || this._suppressMenu) {
                        event.preventDefault();  // stop showing the context menu
                        event.stopPropagation();
                        this._shouldShowMenu = true;
                        this._suppressMenu = false;
                    }
                    break;

                case 'DOMMouseScroll':
                    if (this._isMDownR) {
                        this._shouldShowMenu = false;
                        this._suppressMenu = true;
                        this._gesture += (event.detail>0 ? '-' : '+');
                        this._stopGesture(event);
                    }
                    break;

                case 'draggesture':
                    this._isMDownL = false;
                    break;

                case 'click':
                    if (event.button == 0 && this._suppressClick) {
                        event.stopPropagation();
                        event.preventDefault();
                        this._suppressClick = false;
                    }
                    break;
            }  // --- switch end ---
        },  // --- handleEvent() end ---


        _resetGesture: function(event) {
            this._isMDownL = false;
            this._isMDownR = false;
            this._shouldShowMenu = false;
            this._suppressMenu = false;
            this._suppressClick = false;
            this._gesture = '';
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            if (this._showinstatus) {
              this._setStatusLabel('reset');
              setTimeout(function(){XULBrowserWindow.statusTextField.label ='';},this._showinstatustime);
             } else {
              XULBrowserWindow.statusTextField.label =''
            }
        },


        _startGesture: function(event) {
            this._lastX = event.screenX;
            this._lastY = event.screenY;
            this._clientX = event.clientX;
            this._clientY = event.clientY;
            this._gesture = '';

            this._anchorNode = event.target;
            this._linkNode = this._utility.getLinkNode(this._anchorNode);
            this._imageNode = this._utility.getImageNode(this._anchorNode);

            this._focusedWindow = document.commandDispatcher.focusedWindow;
            this._selection = this._focusedWindow.getSelection();
            this._selText = '';
            if (!this._selection.isCollapsed) {
                var ss = [];
                for (var i=0; i<this._selection.rangeCount; ++i) {
                    var range = this._selection.getRangeAt(i);
                    ss.push(range.toString().replace(/^\s+|\s+$/g, ''));
                }
                this._selText = ss.join(' ');
            }
        },


        _progressGesture: function(event) {
            const x = event.screenX,
                  y = event.screenY;
            const subX = x - this._lastX,
                  subY = y - this._lastY;
            const distX = Math.abs(subX),
                  distY = Math.abs(subY);

            if (distX < 20 && distY < 20)
                // Using a large display, you should set bigger values (20~30)
                return;

            var direction;
            if (distX > distY) direction = (subX<0 ? 'L' : 'R');
            else               direction = (subY<0 ? 'U' : 'D');

            if (direction != this._gesture.charAt(this._gesture.length -1)) {
                this._gesture += direction;

//                this._metaKey = (event.ctrlKey ? 'C' : '')
//                              + (event.altKey ? 'A' : '')
//                              + (event.shiftKey ? 'S' : '');

                const command = this._getMappedCommand(this._gesture);

                var label = this._gesture;
                label += command ? (' (' + command + ')') : '';
                if (this._showinstatus) this._setStatusLabel(label);
            }

            this._lastX = x;
            this._lastY = y;
        },


        _stopGesture: function(event) {
            if (this._gesture) {
                try {
                    const command = this._getMappedCommand(this._gesture);
                    this._doCommand(command);
                } catch (thrown_message) {
                    this._setStatusLabel(thrown_message);
                }
            }
            this._gesture = '';
            event.stopPropagation();
            event.preventDefault();
            setTimeout(function(){XULBrowserWindow.statusTextField.label ='';},this._showinstatustime);
        },


        _displayContextMenu: function(event) {
            var mouseEvent = event.originalTarget.ownerDocument
                                  .createEvent('MouseEvents');

            mouseEvent.initMouseEvent('contextmenu',
                    true, true, event.originalTarget.defaultView,
                    0, event.screenX, event.screenY, event.clientX,
                    event.clientY, false, false, false, false, 2, null);

            event.originalTarget.dispatchEvent(mouseEvent);
        },


        _setStatusLabel: function(label) {
            XULBrowserWindow.statusTextField.label = 'Gesture: ' + label;
        },


        _buildPopup: function(){
            var popup = document.getElementById(this._POPUP_ID);
            if (!popup) {
                popup = document.createElement('popup');
                popup.id = this._POPUP_ID;
                document.getElementById('mainPopupSet').appendChild(popup);
            }
            return popup;
        },

        _openPopup: function(popup) {
            document.popupNode = null;
            document.tooltipNode = null;
            popup.addEventListener('popuphidden', this, true);
            popup.openPopup(null, '', this._lastX, this._lastY, false, false);
            document.documentElement.addEventListener('mouseup', this, true);
        },

        _utility: {
            getLinkNode: function(node){
                var i = 0;
                while (node && i++ < 5) {
                    if (node instanceof HTMLAnchorElement && node.href)
                        return node;
                    node = node.parentNode;
                }
                return null;
            },

            getImageNode: function(node){
                var i = 0;
                while (node && i++ < 5) {
                    if (node instanceof HTMLImageElement && node.src)
                        return node;
                    node = node.parentNode;
                }
                return null;
            },

            getKeywordsFromURL: function(url) {
                if (!url) return [];

                var kwds = [];
                if (url.match(/\/.*[#&\?](?:q|query|pq|w|wd|words?|term|kw|keywords?)=([^&]+)/)
                    || url.match(/\.yahoo\.co.+\/.+[&\?]p=([^&]+)/)) {
                    var raw_kwds = decodeURIComponent(RegExp.$1);
                    var kwds_ = raw_kwds.split(/[\+\s\(\)\*\\\|\/\[\]\?\.!^&:;,<>{}"'\uff01\uff20\uff03\uff04\uff05\uff3e\uff06\uff0a\uff08\uff09\uff0b\uff1d\uff5c\u300c\u300d\uff5b\uff5d\uff1a\uff1b\u201d\u2019\uff1c\uff1e\u30fb\uff1f\uff5e]+/);
                    for (var i=0, kw; kw=kwds_[i]; ++i)
                        if (kw && !kw.match(/^(?:and|or|\-.+)$/i))
                            kwds.push(kw);
                } else if (url.match(/\.wikipedia.org\/wiki\/([^#\/]+)/)) {
                    var kw = decodeURIComponent(RegExp.$1);
                    var kw2 = kw.replace(/_/g, ' ');
                    kwds.push(kw);
                    if (kw != kw2)
                        kwds.push(kw2);
                }
                return kwds;
            },

            unique_array: function(array) {
                var uniq_array = [];
                var dict = {};
                for (var i=0; i<array.length; ++i) {
                    var e = array[i];
                    if (!(e in dict)) {
                        dict[e] = true;
                        uniq_array.push(e);
                    }
                }
                return uniq_array;
            },

            hlKeywords: function(kwds, html) {
                var colors = [ ["#000","#FFFF66"],
                               ["#000","#A0FFFF"],
                               ["#000","#99FF99"],
                               ["#000","#FF9999"],
                               ["#000","#FFA500"],
                               ["#000","#D3B8E5"],
                               ["#000","#B8C0FF"],
                               ["#000","#D1F568"],
                               ["#000","#FF9467"]
                            ];

                kwds = this.unique_array(kwds);
                if (!kwds) return html;

                for (var i=0; i<kwds.length; ++i) {
                    var kw = kwds[i];
                    var z = i % colors.length;
                    var substr = '$1<span style="color:'+ colors[z][0]
                                + ';background-color:' + colors[z][1]
                                + ';">$2</span>$3';
                    re_kw = new RegExp('(>[^<]*?)('+ kw +')(.*?<)', 'ig');
                    html = html.replace(re_kw, substr);
                }
                return html;
            },

        },


        _doCommand: function(command) {
            var focusedWindow = this._focusedWindow;
            var imgNode = this._imageNode;
            var linkNode = this._linkNode;
            var selection = this._selection;
            var selText = this._selText;

            switch (command) {
                //===========================
                // Navigation
                //===========================
                case 'History Back': BrowserBack(); break;
                case 'History Forward': BrowserForward(); break;
                case 'Home': BrowserHome(); break;

                case 'Go to Google':
                    var url = 'http://www.google.de/';
                    if (gBrowser.currentURI.path == 'blank')
                        gBrowser.loadURI(url);
                    else
                        gBrowser.addTab(url, {relatedToCurrent: true});
                    break;

                case 'Go to Yahoo':
                    var url = 'http://www.yahoo.de/';
                    if (gBrowser.currentURI.path == 'blank')
                        gBrowser.loadURI(url);
                    else
                        gBrowser.addTab(url, {relatedToCurrent: true});
                    break;

                case 'Go Upper Level':
                    var uri = gBrowser.currentURI;
                    if (uri.path != '/') {
                        var pathList = uri.path.split('/');

                        if (!pathList.pop())
                            pathList.pop();

                        var url = uri.prePath + pathList.join('/') + '/';
                        gBrowser.loadURI(url);
                    }
                    break;

                case 'Popup Session History':
                    var popup = this._buildPopup();
                    var onMouseUp = function(event) {
                        gBrowser.webNavigation
                                .gotoIndex(event.target.index);
                    };

                    var history = gBrowser.webNavigation.sessionHistory;
                    if (history.count < 1)
                        throw 'No back/forward history for this tab.';

                    for (var i=0; i<history.count; ++i) {
                        var entry = history.getEntryAtIndex(i, false);
                        if (!entry) continue;

                        var menuItem = document.createElement('menuitem');
                        menuItem.index = i;
                        menuItem.setAttribute('label', entry.title);

                        try {
                            var iconURL
                                = Cc['@mozilla.org/browser/favicon-service;1']
                                        .getService(Ci.nsIFaviconService)
                                        .getFaviconForPage(entry.URI).spec;
                            menuItem.style.listStyleImage
                                                = 'url(' + iconURL + ')';
                        } catch (e) {}

                        if (i == history.index){
                            menuItem.style.listStyleImage = '';
                            menuItem.setAttribute('type', 'checkbox');
                            menuItem.setAttribute('checked', 'true');
                            menuItem.setAttribute('class',
                                                    'unified-nav-current');
                        } else if (i < history.index) {
                            menuItem.setAttribute('class',
                                    'unified-nav-back menuitem-iconic');
                        } else {
                            menuItem.setAttribute('class',
                                    'unified-nav-forward menuitem-iconic');
                        }
                        menuItem.addEventListener('mouseup', onMouseUp, false);
                        popup.insertBefore(menuItem, popup.firstChild);
                    }

                    this._openPopup(popup);
                    break;


                //===========================
                // Page
                //===========================
                case 'Full Screen': BrowserFullScreen(); break;
                case 'Page Up': goDoCommand('cmd_scrollPageUp'); break;
                case 'Page Down': goDoCommand('cmd_scrollPageDown'); break;
                case 'Scroll Top': goDoCommand('cmd_scrollTop'); break;
                case 'Scroll Bottom': goDoCommand('cmd_scrollBottom'); break;
                case 'Reload': BrowserReload(); break;
                case 'Reload Skip Cache': BrowserReloadSkipCache(); break;
                case 'Stop': BrowserStop(); break;
                case 'Stop Loading All Tabs':
                    var len = gBrowser.mPanelContainer.childNodes.length;
                    for (var i = 0; i < len; ++i)
                          gBrowser.getBrowserAtIndex(i).stop();
                    break;

                case 'Reload All Tabs':
                    gBrowser.reloadAllTabs(gBrowser.mCurrentTab);
                    break;

                case 'Reload Image':
                    if (imgNode) {
                        imgNode.src = imgNode.src;
                    } else {
                        var images = focusedWindow.document.images;
                        for (var i=0; i<images.length; ++i) {
                            images[i].src = images[i].src;
                        }
                    }
                    break;

                case 'Add Bookmark As...':
                    PlacesCommandHook.bookmarkCurrentPage(true,
                                PlacesUtils.bookmarksMenuFolderId
                    );
                    break;

                case 'Zoom In':
                case 'Zoom Out':
                    if (imgNode) {
                        // Starting on an image, zoom the image up(out)
                        if (!imgNode.hasAttribute('width')) {
                            imgNode.setAttribute('width',
                                  imgNode.naturalWidth
                            );
                        }
                        if (!imgNode.hasAttribute('height')) {
                            imgNode.setAttribute('height',
                                  imgNode.naturalHeight
                            );
                        }
                        if (!imgNode.hasAttribute('originalWidth')) {
                            imgNode.setAttribute('originalWidth',
                                  imgNode.width
                            );
                            imgNode.setAttribute('originalHeight',
                                  imgNode.height
                            );
                        }

                        var scale;
                        if (command == 'Zoom In') scale = 1.1;
                        else scale = 0.9;

                        imgNode.width = imgNode.width * scale;
                        imgNode.height = imgNode.height * scale;

                    } else {
                        // Otherwise, zoom the page
                        if (command == 'Zoom In')
                            document.getElementById('cmd_fullZoomEnlarge')
                                    .doCommand();
                        else
                            document.getElementById('cmd_fullZoomReduce')
                                    .doCommand();
                    }
                    break;

                case 'Zoom Reset':
                    if (imgNode) {
                        if (!imgNode.hasAttribute('originalWidth'))
                            break;

                        imgNode.width
                            = imgNode.getAttribute('originalWidth');
                        imgNode.height
                            = imgNode.getAttribute('originalHeight');
                    } else {
                        document.getElementById('cmd_fullZoomReset')
                                .doCommand();
                    }
                    break;


                //===========================
                // Window
                //===========================
                case 'Close Window': BrowserTryToCloseWindow(); break;
                case 'Undo Closed Window': undoCloseWindow(); break;
                case 'Restart Firefox': Application.restart(); break;
                case 'Quit Firefox': Application.quit(); break;
//
//                case 'Save Session and Quit':
//                    var prefObj = Cc['@mozilla.org/preferences-service;1']
//                                            .getService(Ci.nsIPrefService);
//                    var ss = Cc['@mozilla.org/browser/sessionstore;1']
//                                            .getService(Ci.nsISessionStore);
//                    
//                    var privacy = prefObj.getBranch('privacy.sanitize.');
//                    var sanitizeFlag
//                                = privacy.getBoolPref('sanitizeOnShutdown');
//
//                    if (sanitizeFlag) {
//                        privacy.setBoolPref('sanitizeOnShutdown', false);
//                    }
//
//                    var ssPref = prefObj.getBranch('browser.sessionstore.');
//                    ssPref.setBoolPref('resume_session_once', true);
//
//                    goQuitApplication();
//
//                    break;

                case 'Minimize Window':
                    window.minimize();
                    break;

                case 'Maximize or Restore Window':
                    if (window.windowState == 1) window.restore();
                    else window.maximize();
                    break;


                //===========================
                // Tab
                //===========================
                case 'Previous Tab':
                    selection.removeAllRanges();
                    gBrowser.tabContainer.advanceSelectedTab(-1, true);
                    break;

                case 'Next Tab':
                    selection.removeAllRanges();
                    gBrowser.tabContainer.advanceSelectedTab(+1, true);
                    break;

                case 'Open New Tab':
                    var url = imgNode ? imgNode.src : 'about:blank';
                    gBrowser.addTab(url, {relatedToCurrent: true});
                    ++gBrowser.tabContainer.selectedIndex;
                    BrowserSearch.searchBar.value = '';
                    BrowserSearch.searchBar.focus();
                    break;

                case 'Duplicate Tab':
                    var newTab = gBrowser.duplicateTab(gBrowser.mCurrentTab);
                    ++gBrowser.tabContainer.selectedIndex;
                    break;

                case 'Close Tab':
                        if (gBrowser.tabContainer.itemCount > 1) {
                            gBrowser.removeCurrentTab({animate:false});
                        } else {
                            throw 'Warning: Use "Close Window" gesture if you need to close the last tab.'
                        }
                        break;

                case 'Close Other Tabs':
                    gBrowser.removeAllTabsBut(gBrowser.mCurrentTab);
                    break;

                case 'Undo Closed Tab':
                    undoCloseTab();
                    break;

                case 'Pin/Unpin Tab':
                    var curTab = gBrowser.mCurrentTab;
                    if (curTab.pinned) {
                        gBrowser.unpinTab(curTab);
                    } else {
                        gBrowser.pinTab(curTab);
                    }
                    break;

                case 'Detach Tab':
                    gBrowser.replaceTabWithWindow(gBrowser.mCurrentTab);
                    break;

                case 'Popup Closed Tabs':
                    var popup = this._buildPopup();
                    var onMouseUp = function(event) {
                        undoCloseTab(event.target.index);
                    };

                    var ss = Cc["@mozilla.org/browser/sessionstore;1"]
                                            .getService(Ci.nsISessionStore);

                    if (ss.getClosedTabCount(window) == 0) {
                        throw 'No restorable tabs in this window.';
                    }

                    var undoItems
                            = eval('(' + ss.getClosedTabData(window) + ')');

                    for (var i=0; i<undoItems.length; ++i) {
                        var undoItem = undoItems[i];
                        var menuItem = document.createElement('menuitem');
                        menuItem.index = i;
                        menuItem.setAttribute('label', undoItem.title);
                        menuItem.setAttribute('class',
                                            'menuitem-iconic bookmark-item');
                        if (undoItem.image)
                            menuItem.setAttribute('image', undoItem.image);
                        menuItem.addEventListener('mouseup', onMouseUp, false);
                        popup.appendChild(menuItem);
                    }

                    this._openPopup(popup);
                    break;

                case 'Popup All Tabs':
                    var popup = this._buildPopup();
                    var onMouseUp = function(event) {
                        gBrowser.selectedTab
                            = gBrowser.mTabs[event.target.index];
                    };


                    var tabs = gBrowser.mTabs;
                    var curTabId = gBrowser.selectedTab.id;
                    Application.console.log(curTabId);
                    if (tabs.length < 1) break;
                    for (var i=0; i<tabs.length; ++i) {
                        var tab = tabs[i];
                        var menuItem = document.createElement('menuitem');
                        menuItem.index = i;
                        menuItem.setAttribute('label', tab.label);
                        if (tab.selected) {
                            menuItem.setAttribute('type', 'checkbox');
                            menuItem.setAttribute('checked', 'true');
                            menuItem.setAttribute('class',
                                                    'unified-nav-current');
                        } else {
                            menuItem.setAttribute('class',
                                            'menuitem-iconic bookmark-item');
                            menuItem.setAttribute('crop',
                                            tab.getAttribute('crop'));
                            menuItem.setAttribute('image',
                                            tab.getAttribute('image'));
                        }
                        menuItem.addEventListener('mouseup', onMouseUp, false);
                        popup.appendChild(menuItem);
                    }
                    this._openPopup(popup);
                    break;


                //===========================
                // Sidebar
                //===========================
                case 'Show/Hide Bookmarks Sidebar':
                    toggleSidebar('viewBookmarksSidebar');
                    break;

                case 'Show/Hide History Sidebar':
                    toggleSidebar('viewHistorySidebar');
                    break;

                case 'Show/Hide Add-on Bar':
                    toggleAddonBar();
                    break;

                case 'Show/Hide Bookmarks Toolbar':
                    var bar = document.getElementById('PersonalToolbar');
                    bar.collapsed = !bar.collapsed;
                    break;


                //===========================
                // Firefox Tools
                //===========================
                case 'View Page Source':
                    BrowserViewSourceOfDocument(focusedWindow.document);
                    break;

                case 'View Page Info':
                    BrowserPageInfo();
                    break;

                case 'Private Browsing':
                    gPrivateBrowsingUI.toggleMode();
                    break;

                case 'Preferences':
                    openPreferences();
                    break;

                case 'Downloads':
                    BrowserDownloadsUI();
                    break;

                case 'Add-ons Manager':
                    BrowserOpenAddonsMgr();
                    break;

                case 'Error Console':
                    toJavascriptConsole();
                    break;

                case 'Web Console':
                    HUDConsoleUI.toggleHUD();
                    break;

                case 'Clear Privacy Information':
                    Cc['@mozilla.org/browser/browserglue;1']
                                .getService(Ci.nsIBrowserGlue)
                                .sanitize(window);
                    break;

                case 'Cookies':
                    window.open('chrome://browser/content/preferences'
                            + '/cookies.xul',
                            'Browser:Cookies',
                            'chrome,resizable=yes'
                    );
                    break;



                //===========================
                // Search Selection
                //===========================
                case 'Open Findbar':
                    gFindBar.startFind(0);
                    gFindBar.onFindAgainCommand(true);
                    gFindBar.toggleHighlight(true);
                    break;

                case 'Highlight Keywords':
                    var curURL = gBrowser.currentURI.spec;
                    var refURL = focusedWindow.document.referer || null;

                    var kwds = [];
                    kwds = kwds.concat(this._utility.getKeywordsFromURL(curURL));
                    kwds = kwds.concat(this._utility.getKeywordsFromURL(refURL));

                    var hl_html = this._utility.hlKeywords(kwds,
                                    focusedWindow.document.body.innerHTML);
                    focusedWindow.document.body.innerHTML = hl_html;
                    break;

                case 'Close Findbar':
                    gFindBar.toggleHighlight(false);
                    gFindBar.close();
                    break;

                case 'Web Search':
                    if (!selText) throw 'Warning: No Selection.';
                    BrowserSearch.searchBar.value = selText;
                    BrowserSearch.loadSearch(selText, true);
                    break;

                case 'Smart Search':
                    if (!selText) throw 'Warning: No Selection.';
                    var re_URL = RegExp('(?:[^a-z]?)'
                            + '((?:h?t?tps?|h..ps?):(?://)?'
                            + '[-_.!~*\'()a-z0-9;/?:@&=+$,%#]+'
                            + '[a-z0-9/=#])', 'i');

                    if (selText.match(re_URL)) {
                        var url = RegExp.$1;

                        url = url.replace(/^(?:h?t?tp|h..p)(.*)$/i, 'http$1');

                        if (selText.length < (2 * url.length)) {
                            BrowserSearch.searchBar.value = url;
                            gBrowser.addTab(url,{relatedToCurrent: true});
                            throw 'Smart Search [URL]: ' + url;
                        }
                    }

                    BrowserSearch.loadSearch(selText, true);
                    throw 'Smart Search [Web]: ' + selText;
                    break;

                case 'Image Search':
                    var url;
                    if (imgNode) {
                        // Starting on an image, search by the image
                        var image_url = gBrowser.currentURI
                                                .resolve(imgNode.src);
                        url = 'http://www.google.de/searchbyimage?'
                              + 'hl=de&sbisrc=ff_1_0_0&image_url='
                              + encodeURIComponent(image_url);
                    } else {
                        // Otherwise, search for the selection text
                        if (!selText) throw 'Warning: No Selection.';
                        BrowserSearch.searchBar.value = selText;

                        url = 'http://www.google.de/images?hl=de&q='
                                    + encodeURIComponent(selText);
                    }

                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Video Search':
                    if (!selText) throw 'Warning: No Selection.';
                    BrowserSearch.searchBar.value = selText;
                    var url = 'http://www.youtube.com/results?search_query='
                                    + encodeURIComponent(selText);
                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Map Search':
                    if (!selText) throw 'Warning: No Selection.';
                    BrowserSearch.searchBar.value = selText;
                    var url = 'http://maps.google.de/maps?f=q&hl=de&q='
                                    + encodeURIComponent(selText)
                                    + '&ie=utf-8&oe=utf-8';
                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Amazon Search':
                    if (!selText) throw 'Warning: No Selection.';
                    BrowserSearch.searchBar.value = selText;
                    var url = 'http://www.amazon.de/exec/obidos/'
                                    + 'external-search/?tag=&mode=blended'
                                    + '&keyword='
                                    + encodeURIComponent(selText);
                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Eijiro Translation':
                    if (!selText) throw 'Warning: No Selection.';
                    var term = selText.replace('\u0000-\u001F\u0021-\u007E\u007F', ' ')
                                  .replace(/[<>\(\)*!\[\];:,\.\/\?]/g, ' ')
                                  .replace(/\s+/g, ' ')
                                  .replace(/^\s+|\s+$/g, '')
                                  .toLowerCase();
                    var url = 'http://eow.alc.co.jp/'+ term + '/UTF-8/';
                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Search Under the Domain':
                    if (!selText) throw 'Warning: No Selection.';
                    const current_site = gBrowser.currentURI.spec;
                    if (current_site.search('^https?') < 0)
                        throw 'Warning: The URL must start `http[s]\'. ';
                    const domain = current_site.split('/')[2]
                                        + encodeURIComponent(' '+ selText);
                    var url = 'http://www.google.de/search?q=site:' + domain;
                    gBrowser.addTab(url, {relatedToCurrent:true});
                    break;

                case 'Chemistry Reference Resolver':
                    if (!selText) throw 'Warning: No Selection.';
                    BrowserSearch.searchBar.value = selText;
                    if (selText.match(/(?:DOI:\s*)?(10.\d+\/\S+)/i)) {
                        gBrowser.addTab('http://dx.doi.org/' + RegExp.$1,
                                {relatedToCurrent:true});
                    } else {
                        gBrowser.addTab('http://chemsearch.kovsky.net'
                                + '/index.php?q='
                                + encodeURIComponent(selText),
                                {relatedToCurrent:true}
                        );
                    }
                    break;

                case 'Popup Search Engines':
                    var popup = this._buildPopup();

                    var onMouseUp = function(event) {
                        var engine = event.target.engine;
                        var selText_ = event.target.text;

                        if (!engine) return;
                        var submission = engine.getSubmission(selText_, null);
                        if (!submission) return;

                        BrowserSearch.searchBar.value = selText_;
                        gBrowser.addTab(submission.uri.spec, {
                                postData: submission.postData,
                                relatedToCurrent: true}
                        );
                    };


                    var searchSvc = Cc['@mozilla.org/browser/search-service;1']
                                       .getService(Ci.nsIBrowserSearchService);
                    var engines = searchSvc.getVisibleEngines({});
                    if (engines.length < 1)
                        throw 'Error: No search engines installed.';
                    for (var i=engines.length-1; i>=0; --i){
                        var engine = engines[i];
                        var menuItem = document.createElement('menuitem');
                        menuItem.setAttribute('label', engine.name);
                        menuItem.setAttribute('class', 'menuitem-iconic');
                        if (engine.iconURI)
                            menuItem.setAttribute('src', engine.iconURI.spec);
                        popup.insertBefore(menuItem, popup.firstChild);
                        menuItem.engine = engine;
                        menuItem.text = selText;
                        menuItem.addEventListener('mouseup', onMouseUp, false);
                    }

                    this._openPopup(popup);
                    break;

                case 'Popup Google Suggestions':
                    var popup = this._buildPopup();

                    var onMouseUp = function(event) {
                        var text = event.target.text;
                        BrowserSearch.searchBar.value = text;
                        var url = 'http://www.google.de/search?'
                                    + 'hl=de&ie=utf-8&oe=utf-8&q='
                                    + encodeURIComponent(text);
                        gBrowser.addTab(url, {relatedToCurrent:true});
                    };


                    if (!selText) return;
                    var url = 'http://www.google.de/complete/search?'
                                + 'output=toolbar&q='
                                + encodeURIComponent(selText);

                    var request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.onreadystatechange = function() {
                        if (request.readyState == 4
                                && request.status == 200) {
                            var res = request.responseXML;

                            var suggestion_tags
                                    = res.getElementsByTagName('suggestion');
                            var num_queries_tags
                                    = res.getElementsByTagName('num_queries');

                            for (var i=0; i<suggestion_tags.length; ++i) {
                                var key = suggestion_tags[i]
                                            .getAttribute('data');
                                var value = num_queries_tags[i]
                                            .getAttribute('int');

                                var j=0;
                                while (j++ < value.length/3) {
                                    value = value.replace(/^(\d+)(\d\d\d)/,
                                                                    '$1,$2');
                                }

                                var menuItem = document
                                                .createElement('menuitem');
                                menuItem.setAttribute('label', key);
                                menuItem.setAttribute('acceltext', value);
                                menuItem.text = key;
                                menuItem.addEventListener('mouseup',
                                                          onMouseUp,
                                                          false
                                );
                                popup.appendChild(menuItem);
                            }

                        }
                    };
                    request.send(null);

                    this._openPopup(popup);
                    break;

                case 'Popup Interpreters':
                    var popup = this._buildPopup();

                    var onMouseUp = function(event) {
                        gBrowser.addTab(event.target.url,
                                        {relatedToCurrent:true}
                        );
                    };

                    var re_ja = (new RegExp()).compile('[\uFF41-\uFF5A'
                                + '\uFF21-\uFF3A\uFF10-\uFF19\u4E00-\u9FA0'
                                + '\u3041-\u3093\u30A1-\u30F4\u30FC]'
                                );


                    var expand_braces = function(url, word){
                        url = re_ja.test(word)
                                ? url.replace(/%{ja\?(.*?):(.*?)}/, '$1')
                                : url.replace(/%{ja\?(.*?):(.*?)}/, '$2');

                        return url.replace(/%{WORD}/g,
                                        encodeURIComponent(word)
                               );
                    };

                    var topMenu = [
                        {label:'\u82F1\u8F9E\u90CE',
                            url:'http://eow.alc.co.jp/%{WORD}/UTF-8/',
                            webpage:'http://www.alc.co.jp/'
                        },
                        {label:'\u4E2D\u65E5\u8F9E\u66F8 \u5317\u8F9E\u90CE',
                            url:'http://www.ctrans.org/cjdic/search.php?'
                                + 'word=%{WORD}&opts=ch',
                            webpage:'http://www.ctrans.org/cjdic/'
                        },
                        {label:'BitEx \u4E2D\u65E5\u30FB\u65E5\u4E2D',
                            url:'http://bitex-cn.com/search_result.php?'
                                + 'keyword=%{WORD}',
                            webpage:'http://bitex-cn.com/'
                        },
                        {label:'Naver \u97D3\u65E5\u30FB\u65E5\u97D3',
                            url:'http://jpdic.naver.com/search.nhn?'
                                + 'query=%{WORD}',
                            webpage:'http://jpdic.naver.com/'
                        },
                        {label:'japonais \u4ECF\u65E5\u30FB\u65E5\u4ECF',
                            url:'http://www.dictionnaire-japonais.com/'
                                + 'rechercher.php?search=1&mot=%{WORD}&jpIN=1'
                                + '&frIN=1&romajiIN=1',
                            webpage:'http://www.dictionnaire-japonais.com/'
                                + 'rechercher.php'
                        },
                        {label:'dicts \u72EC\u548C\u30FB\u548C\u72EC',
                            url:'http://www.dicts.info/dictionary.php?'
                                + '%{ja?l1=German&l2=Japanese:l1=Japanese'
                                + '&l2=German}&word=%{WORD}&Search=Search',
                            webpage:'http://www.dicts.info/'
                        },
                    ];


                    for (var i=0, x; x=topMenu[i]; ++i) {
                        var menuItem = document.createElement('menuitem');
                        menuItem.setAttribute('label', x.label);
                        menuItem.url = selText ? expand_braces(x.url, selText)
                                               : x.webpage;
                        menuItem.addEventListener('mouseup', onMouseUp, false);
                        popup.appendChild(menuItem);
                    }
                    this._openPopup(popup);
                    break;


                //===========================
                // Utility
                //===========================
                case 'CSS ON/OFF':
                    getMarkupDocumentViewer().authorStyleDisabled
                        = !getMarkupDocumentViewer().authorStyleDisabled;
                    break;

                case 'Save As...':
                    var url;
                    var saveName;
                    if (linkNode) {
                        // Starting on a link, save the link's destination
                        url = linkNode.href;
                        saveName = linkNode.textContent
                                           .replace(/(^\s+|\s$)/, '');
                        saveURL(url, saveName, null, true, false, null);
                        break;
                    } else if (imgNode) {
                       // Starting on an image, save the image
                       url = imgNode.src;
                       saveName = imgNode.hasAttribute('title') ?
                                  imgNode.getAttribute('title') :
                                  ( imgNode.hasAttribute('alt') ?
                                    imgNode.getAttribute('alt') :
                                    url.match(/[^\/]+/)
                                  );
                        saveURL(url, saveName, null, true, false, null);
                        break;
                    }

                    // Otherwise, save the page
                    document.getElementById('Browser:SavePage').doCommand();
                    break;

                case 'Open This Manual':
                    //gBrowser.addTab(MANUAL_PATH, {relatedToCurrent:true});
                    gBrowser.selectedTab = gBrowser.addTab(MANUAL_PATH, {relatedToCurrent:true});
                    break;

                case 'Copy URL to Clipboard':
                    if (linkNode) {
                        var url = gBrowser.currentURI.resolve(linkNode.href);
                        gClipboard.copyString(url);
                        throw 'Copied Link Location: '+ url;
                    } else if (imgNode) {
                        var url = gBrowser.currentURI.resolve(imgNode.src);
                        gClipboard.copyString(url);
                        throw 'Copied Image Location: '+ url;
                    } else {
                        var url = gBrowser.currentURI.spec;
                        gClipboard.copyString(url);
                        throw 'Copied Current Location: '+ url;
                    }
                    break;

                case 'Copy to Clipboard':
                    if (linkNode) {
                        // Starting on a link, copy its inner text
                        var cloneNode = linkNode.cloneNode(true);
                        cloneNode.removeAttribute('href');
                        cloneNode.style.textDecoration = 'underline';
                        cloneNode.removeAttribute('onmousedown');

                        linkNode.innerHTML = '&nbsp;[&gt;&gt;]';
                        linkNode.style.fontSize = 'smaller';
                        linkNode.parentNode.insertBefore(cloneNode, linkNode);
                        var text = cloneNode.textContent;
                        gClipboard.copyString(text);
                        selection.removeAllRanges();
                        selection.selectAllChildren(cloneNode);
                        throw 'Copied Link Text: "'+ text + '"';
                    } else if (imgNode) {
                        // Starting on an image, copy its alt or title text
                        if (imgNode.alt) {
                            gClipboard.copyString(imgNode.alt);
                            throw 'Copied Image Alt: "'+ imgNode.alt + '"';
                        } else if (imgNode.title) {
                            gClipboard.copyString(imgNode.title);
                            throw 'Copied Image Alt: "'+ imgNode.title + '"';
                        } else {
                            throw 'Warning: The image has neither alt nor'
                                + ' title attributes.';
                        }
                    } else if (selText) {
                        // Having a selection, copy the text
                        gClipboard.copyString(selText);
                        throw 'Copied Selectd Text: "'+ selText + '"';
                    }

                    // Otherwise, copy the current title
                    var title = focusedWindow.document.title;
                    gClipboard.copyString(title);
                    throw 'Copied Title: "'+ title + '"';
                    break;

                case 'Increment URL':
                case 'Decrement URL':
                    // In(de)crement last number in the current URL
                    var n;
                    if (command == 'Increment URL') n =  1;
                    else n = -1;
                    gBrowser.currentURI.spec.match(/^(.*?)(\d+)([^\d]*)$/);
                    if (n && RegExp.$2) {
                        var url = RegExp.$1
                                    + (parseInt(RegExp.$2, 10) + n).toString()
                                    + RegExp.$3;
                        gBrowser.loadURI(url);
                    } else {
                        throw 'Warning: No number in the URL';
                    }
                    break;

                case 'Google&hl=(en | ja)':
                    var url = gBrowser.currentURI.spec;
                    if (!url.match(/www\.google\.co(m|\.ja)\/(search\?|#)/))
                        throw 'Warning: Use in a Google search result page.';

                    if (url.match(/[&\?]hl=en/)) {
                        url = url.replace(/([&\?])hl=[^&]+/,"$1hl=ja");
                    } else if (url.match(/[&\?]hl=[^&]+/)) {
                        url = url.replace(/([&\?])hl=[^&]+/,"$1hl=en");
                    } else {
                        url += "&hl=en";
                    }
                    gBrowser.loadURI(url);
                    break;

                case 'Google&lr=(web | ja)':
                    var url = gBrowser.currentURI.spec;
                    if (!url.match(/www\.google\.co(m|\.ja)\/(search\?|#)/))
                        throw 'Warning: Use in a Google search result page.';

                    if (url.match(/[&\?]lr=lang_ja/)) {
                        url = url.replace(/([&\?])lr=[a-z_]*/g,"$1lr=");
                    } else if (url.match(/[&\?]hl=[^&]+/)) {
                        url = url.replace(/([&\?])lr=[a-z]*/g,"$1lr=lang_ja");
                    } else {
                        url += "&lr=lang_ja";
                    }
                    gBrowser.loadURI(url);
                    break;


                //===========================
                // Other Extensions
                //===========================
                case '[QuickNote] Send to QuickNote':
                    QuickNote_qnCopyTo();
                    break;

                case '[QuickNote] Show/Hide QuickNote Sidebar':
                    toggleSidebar('viewQuickNoteSidebar');
                    break;

                case '[NoScript] Allow All This Page Temporarily':
                    noscriptOverlay.allowPage(true);
                    break;

                case '[NoScript] Allow Page Temporarily':
                    noscriptOverlay.allowPage();
                    break;

                default:
                    if (!command) {
                        throw 'Error: No such gesture. (' + this._gesture + ') - try UDUD for manual';
                    }
            }  // --- switch end ---
        },  // --- _doCommand() end ---



        _getMappedCommand: function(gesture) {
            switch (gesture) {
                //===========================
                // Navigation
                //===========================
                case 'L': return 'History Back';
                case 'R': return 'History Forward';
                case 'DURD': return 'Home';  // 'h'
                case 'LDRUL': return 'Go to Google';  // 'G'
                case 'DRUDL': return 'Go to Yahoo';  // 'y'
                case 'ULU': return 'Go Upper Level';
                case 'DRD': return 'Popup Session History';

                //===========================
                // Page
                //===========================
                case 'URD': return 'Full Screen';
                case 'U': return 'Page Up';
                case 'D': return 'Page Down';
                case 'LU': return 'Scroll Top';
                case 'LD': return 'Scroll Bottom';
                case 'UD': return 'Reload';
                case 'UDU': return 'Reload Skip Cache';
                case 'DUD': return 'Reload Image';
                case 'LRL': return 'Stop';
                //case '': return 'Reload All Tabs';
                //case '': return 'Stop Loading All Tabs';
                //case '': return 'Add Bookmark As...';
                case '+': return 'Zoom In';
                case '-': return 'Zoom Out';
                case 'RLR': return 'Zoom Reset';

                //===========================
                // Window
                //===========================
                case 'DRU': return 'Close Window';
                case 'RUD': return 'Minimize Window';
                case 'RDU': return 'Maximize or Restore Window';
                case 'DLU': return 'Restart Firefox';
                //case 'DRUD': return 'Save Session and Quit';
                //case '': return 'Quit Firefox';
                //case '': return 'Undo Closed Window';

                //===========================
                // Tab
                //===========================
                case '<': return 'Previous Tab';
                case '>': return 'Next Tab';
                case 'LR': return 'Open New Tab';
                case 'RL': return 'Duplicate Tab';
                case 'DR': return 'Close Tab';
                case 'DRDU': return 'Close Other Tabs';
                case 'DU': return 'Undo Closed Tab';
                //case '': return 'Pin/Unpin Tab';
                //case '': return 'Detach Tab';
                //case '': return  'Popup All Tabs';
                //case '': return 'Popup Closed Tabs';

                //===========================
                // Sidebar
                //===========================
                case 'DLR': return 'Show/Hide Bookmarks Sidebar';
                //case '': return 'Show/Hide History Sidebar';
                //case '': return 'Show/Hide Add-on Bar';
                //case '': return 'Show/Hide Bookmarks Toolbar';

                //===========================
                // Search For Selection
                //===========================
                case 'UR': return 'Open Findbar';
                case 'URL': return 'Close Findbar';
                case 'RUR': return 'Web Search';
                case 'LRUR': return 'Smart Search';
                case 'UDR': return 'Image Search';   // 'I→'
                case 'DUR': return 'Video Search';   // 'V→'
                case 'UDUDR': return 'Map Search';   // 'M→'
                case 'UDUR': return 'Amazon Search';  // 'A→'
                case 'LRDR': return 'Chemistry Reference Resolver';  // 'C→'
                case 'DRUR': return 'Search Under the Domain';  // 'U→'
                case 'RDR': return 'Eijiro Translation';
                case 'RD': return 'Popup Search Engines';
                case 'UL': return 'Popup Interpreters';
                case 'RU': return 'Popup Google Suggestions';

                //===========================
                // Firefox Tools
                //===========================
                //case '': return 'View Page Source';
                //case '': return 'View Page Info';
                //case '': return 'Preferences';
                //case '': return 'Downloads';
                //case '': return 'Add-ons Manager';
                //case '': return 'Error Console';
                case 'DUDU': return 'Web Console';  // 'W'
                case 'DURDL': return 'Private Browsing';  //  'P'
                case 'RDL': return 'Clear Privacy Information';  // 'コ'
                case 'LDRU': return 'Cookies';  // 'ロ'

                //===========================
                // Utility
                //===========================
                case 'LDRDL': return 'CSS ON/OFF';  // 'S'
                case 'DL': return 'Save As...';  // attention to "Restart Firefox" gesture
                case 'R<': return 'Copy to Clipboard';
                case 'L<': return 'Copy URL to Clipboard';
                case 'RURU': return 'Increment URL';
                case 'RDRD': return 'Decrement URL';
                case 'UDL': return 'Google&hl=(en | de)';
                case 'DUL': return 'Google&lr=(web | de)';
                case 'UDUD': return 'Open This Manual';  // 'M'

                //===========================
                // Other Extensions
                //===========================
                case 'LUL': return '[QuickNote] Send to QuickNote';
                case 'LULR': return '[QuickNote] Show/Hide QuickNote Sidebar';
                //case '': return '[NoScript] Allow All This Page Temporarily';
                //case '': return '[NoScript] Allow Page Temporarily';

                case 'URU': return 'Highlight Keywords';
                
                default: return '';
            }
        },  // --- _getMappedCommand() end ---

    }; // }}}1 --- MouseGestures end ---


    new MouseGestures();
} ) ();



// vim: set ft=javascript fenc=utf-8 ff=unix fdm=indent :