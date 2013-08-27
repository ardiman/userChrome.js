// ==UserScript==
// @name         Stylish Custom
// @description  在Stylish编辑中增加一些小功能
// @namespace    StylishCustom@uc.js
// @author       Crab
// @include      chrome://stylish/content/edit.xul
// @version      0.0.2.1
// @updateURL     https://j.mozest.com/ucscript/script/110.meta.js
// ==/UserScript==
if(location == "chrome://stylish/content/edit.xul") {
/* 
// 1.取消预览:  恢复 预览 至未保存时的状态(实质上是将保存前的样式再一次"预览")
// 2.保存按钮:  将原先"保存"按钮改名为"保存并关闭".
// 3.键盘输入"!"时自动补全为"!important;"
// 4.注释按钮(ctrl+/)
// 5.复制当前行或选中内容(ctrl+d)
// 6.插入链接:检测当前打开的窗口和标签列出其地址链接;
//		左键菜单项直接插入对应的链接;
//		中键或右键则插入包含@-moz-document url("")的链接
// 7.插入文本:第一个子菜单为文档规则,其余为一些常用的文本 
*/
	var StylishCustom = {
		iText: {
			//可以在Text中按格式加入一些常用的属性或文本
			Text: [
				"-moz-box-ordinal-group:",
				"-moz-appearance: none!important;",
				"@-moz-document url-prefix(chrome://browser/content/browser.xul)",
				"border:none!important;",
				"-moz-linear-gradient",
				"vertical-align:middle",
				"text-decoration:underline"],
			DomRule: {
			    "list-style-image(\"\")": 'list-style-image: url(""){\n\n}',
				"url(\"\")": '@-moz-document url(""){\n\n}',
				"url-prefix(\"\")": '@-moz-document url-prefix(""){\n\n}',
				"domain(\"\")": '@-moz-document domain(""){\n\n}',
				"regexp(\"\")": '@-moz-document regexp(""){\n\n}'
			}
		},
		locale : null,
		oldPreview: null,
		isInit: false,
		init: function () {
			if(this.isInit) return;
			this.isInit = true;
			eval("save=" + save.toString().replace("return true;", "if(typeof(StylishCustom)!='undefined'){StylishCustom.oldPreview = codeElementWrapper.value;document.getElementById('unperview').setAttribute('disabled',true);}$&"));
			eval("preview=" + preview.toString().replace("setTimeout", "if(typeof(StylishCustom)!='undefined'){document.getElementById('unperview').setAttribute('disabled',false);}$&"));
			this.locale = (Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale").indexOf("zh") != -1);
			this.setBtn();
			this.setShortcuts();
			this.oldPreview = codeElementWrapper.value;
		},
		setBtn: function () {
			document.documentElement.getButton("accept").label = (this.locale ? "\u4FDD\u5B58\u5E76\u5173\u95ED" : "Speichern und Schließen");
			var editortools = document.getElementById("editor-tools").parentNode.appendChild(document.createElement("hbox"));
			editortools.id = "editortools";
			editortools.setAttribute("style", "-moz-box-ordinal-group:100;");
			editortools.setAttribute("pack","end");
			document.getElementById("findbar").setAttribute("style", "position:relative;-moz-box-ordinal-group:10;");
			var Ubtn = editortools.appendChild(document.createElement("button"));//撤销预览
			var Cbtn = editortools.appendChild(document.createElement("button"));//注释
			
			editortools.appendChild(document.createElement("spacer")).setAttribute("flex",1);
			
			var Sbtn = editortools.appendChild(document.createElement("button"));//保存
			var IxUrlMenu = document.getElementById("insert-data-uri").parentNode.appendChild(document.createElement("menu"));//插入链接
			with(Ubtn) {
				id = "unperview";
				label = this.locale ? "\u53D6\u6D88\u9884\u89C8" : "Vorschau zurücksetzen";
				onclick = this.unperview;
			}
			with(Cbtn) {
				id = "Comment";
				label = this.locale ? "\u6CE8\u91CA" : "Kommentar";
				onclick = this.setComment;
			}
			with(Sbtn) {
				id = "save";
				label = this.locale ? "\u4FDD\u5B58" : "Speichern";
				onclick = save;
			}
			with(IxUrlMenu) {
				id = "IxUrlMenu";
				setAttribute("label", this.locale ? "\u63D2\u5165\u94FE\u63A5" : "URL einfügen")
			}
			
			var contentPop = IxUrlMenu.appendChild(document.createElement("menupopup"));
			contentPop.id = "contentPop";
			contentPop.setAttribute("onpopupshowing", "StylishCustom.showDocumentList(event,false);");
			
			var Ibtn = document.getElementById("insert-data-uri").parentNode.appendChild(document.createElement("menu"));//插入文本
			with(Ibtn) {
				id = "IxTextMenu";
				setAttribute("label", this.locale ? "\u63D2\u5165\u6587\u672C" : "Text einfügen");
			}
			var Ipop = Ibtn.appendChild(document.createElement("menupopup"));//一级
			var IpopU = Ipop.appendChild(document.createElement("menu"));//一级
			Ipop.appendChild(document.createElement("menuseparator"));
			IpopU.id = "DomRule";
			IpopU.setAttribute("label", this.locale ? "\u6587\u6863\u89C4\u5219" : "Dokument-Regel");
			IpopU = IpopU.appendChild(document.createElement("menupopup"));//二级
			var IpopU_M;
			for (i in this.iText.DomRule) {
				IpopU_M = IpopU.appendChild(document.createElement("menuitem"));
				IpopU_M.setAttribute("label", i);
				IpopU_M.setAttribute("value", this.iText.DomRule[i]);
				IpopU_M.onclick = function () {
					StylishCustom.insertString(this.value, 6);
				}
			}
			for (i in this.iText.Text) {
				IpopU_M = Ipop.appendChild(document.createElement("menuitem"));
				IpopU_M.setAttribute("label", this.iText.Text[i]);
				IpopU_M.setAttribute("value", this.iText.Text[i]);
				IpopU_M.onclick = function () {
					StylishCustom.insertString(this.value);
				}
			}
		},
		unperview: function(){
			style.name = nameE.value;
			style.code = StylishCustom.oldPreview;
			this.setAttribute("disabled", true);
			document.getElementById("errors").style.display = "none";
			setTimeout(function () {
				style.setPreview(true);
			}, 50);
		},
		setComment: function(){
			var start = codeElementWrapper.selectionStart,
				end = codeElementWrapper.selectionEnd;
				selText = codeElementWrapper.value.substring(start, end);
			if(!selText) return;
			var re = /(^[\W\s]*?\/\*)(((?!\/\*|\*\/)[\s\S])*?)(\*\/[\W\s]*?$)/;
			if(!re.test(selText)){
				if(!/\/\*|\*\//.test(selText)){
					codeElementWrapper.value = 
						codeElementWrapper.value.substr(0, start) + 
						"/*" + selText + "*/" +
						codeElementWrapper.value.substring(end);
					codeElementWrapper.focus();
					codeElementWrapper.setSelectionRange(start, end + 4);
				}else{
					codeElementWrapper.focus();
					codeElementWrapper.setSelectionRange(start, end);
				}
			}else{
				var reg = selText.match(re);
				codeElementWrapper.value = 
					codeElementWrapper.value.substr(0, start) + 
					reg[1].replace(/\/\*$/g,"") + reg[2] + reg[4].replace(/^\*\//g,"") +
					codeElementWrapper.value.substring(end);
				codeElementWrapper.focus();
				codeElementWrapper.setSelectionRange(start, end - 4);
			}
		},
		setShortcuts: function(){
			document.getElementById("editor").addEventListener("keydown", function (e) {
				if (e.shiftKey && e.keyCode == 49) {//"!"
					e.preventDefault();
					StylishCustom.insertString("!important;");
				}
				if (e.ctrlKey && e.keyCode == 191) {//"/"
					e.preventDefault();
					StylishCustom.setComment();
				}
				if (e.ctrlKey && e.keyCode == 68) {//"d"
					e.preventDefault();
					var v = codeElementWrapper.value,
						s = codeElementWrapper.selectionStart,
						e = codeElementWrapper.selectionEnd;
					if(s==e) {
						var sl = v.substr(0, s).split("\n").length - 1,
							vs = v.split("\n");
						vs.splice(sl,0,vs[sl]);
						codeElementWrapper.value = vs.join("\n");
					}else{
						var se = v.substring(s, e);
						codeElementWrapper.value = v.substr(0, s) + se + se + v.substring(e);
					}
					codeElementWrapper.focus();
					codeElementWrapper.setSelectionRange(s, e);
				}
			}, false)
		},
		insertString: function (str, range) {
			var start = codeElementWrapper.selectionStart + str.length;
			codeElementWrapper.value = codeElementWrapper.value.substr(0, codeElementWrapper.selectionStart) + str + codeElementWrapper.value.substring(codeElementWrapper.selectionEnd);
			if (range) start = start - range;
			codeElementWrapper.focus();
			codeElementWrapper.setSelectionRange(start, start);
		},
		showDocumentList: function (event, isChrome) {
			var menu = event.target;
			var ww = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator)
			var windows = ww.getXULWindowEnumerator(null);
			var docs = [];
			while (windows.hasMoreElements()) {
				try {
					var windowDocShell = windows.getNext().QueryInterface(Components.interfaces.nsIXULWindow).docShell;
					this.appendContainedDocuments(docs, windowDocShell,
					isChrome ? Components.interfaces.nsIDocShellTreeItem.typeChrome : Components.interfaces.nsIDocShellTreeItem.typeContent);
				} catch (ex) {
					Components.utils.reportError(ex);
				}
			}
			this.emptyChildren(menu);
			
			if(!isChrome && menu.id != "chromeMenu"){
				var chromeMenu = menu.appendChild(document.createElement("menu"));
				chromeMenu.appendChild(document.createElement("menupopup"));
				chromeMenu.id = "chromeMenu";
				chromeMenu.setAttribute("label", this.locale ? "Chrome \u8DEF\u5F84":"Chrome Url");
				chromeMenu.setAttribute("onpopupshowing", "event.stopPropagation();StylishCustom.showDocumentList(event,true);");
				menu.appendChild(document.createElement("menuseparator"));
			}
			if (!docs.length) {
				var noneMenuItem = document.createElement("menuitem");
				noneMenuItem.setAttribute("label", "(None)");
				noneMenuItem.setAttribute("disabled", true);
				menu.appendChild(noneMenuItem);
			} else {
				for (var i = 0; i < docs.length; i++) {
					this.addMenuItem(menu, docs[i]);
				}
			}
		},
		appendContainedDocuments: function (array, docShell, type) {
			var containedDocShells = docShell.getDocShellEnumerator(type,
			Components.interfaces.nsIDocShell.ENUMERATE_FORWARDS);
			while (containedDocShells.hasMoreElements()) {
				try {
					var childDoc = containedDocShells.getNext().QueryInterface(Components.interfaces.nsIDocShell)
						.contentViewer.DOMDocument;
					if (type == 0 && docShell.contentViewer.DOMDocument.location.href == childDoc.location.href && childDoc.location.href != "about:blank") {
						array.push(childDoc);
					}
					if (type == 1 && docShell.contentViewer.DOMDocument.location.href != childDoc.location.href && (childDoc.location.href != "about:blank" ||childDoc.URL == childDoc.baseURI)) {
						if(childDoc.location.href == "about:blank" && childDoc.URL != childDoc.baseURI || (childDoc.defaultView && childDoc.defaultView.frameElement != null)) 
							continue;
						array.push(childDoc);
					}
				} catch (ex) {
					console.log(ex + "\n");
				}
			}
		},
		emptyChildren: function (node) {
			while (node.hasChildNodes()) {
				node.removeChild(node.lastChild);
			}
		},
		addMenuItem: function (parent, doc) {
			var menuItem = document.createElement("menuitem");
			menuItem.doc = doc;
			var title = doc.title || doc.location.href;
			menuItem.setAttribute("label", title);
			menuItem.setAttribute("tooltiptext", doc.location.href);
			menuItem.value = doc.location.href;
			menuItem.onclick = function (e) {
				if (e.button != 0) StylishCustom.insertString('@-moz-document url("' + e.target.value + '"){\n\n}', 2);
				else StylishCustom.insertString(e.target.value);
				StylishCustom.closeMenus(this);
			}
			parent.appendChild(menuItem);
		},
		closeMenus: function (node) {
			if ("tagName" in node) {
				if (node.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" && (node.tagName == "menupopup" || node.tagName == "popup")) node.hidePopup();
				this.closeMenus(node.parentNode);
			}
		}
	}
	StylishCustom.init();
}