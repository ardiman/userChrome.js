// ==UserScript==
// @name           InFormEnterPlus
// @description    InfFormEnterPlus for userChrome.js
// @namespace      lidanny_2012@gmail.com
// @author         danny
// @include        main
// @license        MIT License
// @compatibility  Firefox 18-21
// @charset        UTF-8
// @version        2.1.3.2
// @note           2.1.3 2013/05/07 Rechtsklick Automatisches ausfüllen in Popups, funktionierte nicht mehr. 
// @note           2.1.2 2013/05/03 add Autofill on popupmenu
// @note           2.1.1 2013/05/02 FIX tolowcase BUG and add view password
// @note           2.1.0 2013/04/13 02:00 FIX BUG
// @note           2.0.0
// @note           Referenz InfFormEnter Skript，Überschreiben erweiterte Edition，benutzerdefinierte UI
// @note           report bug: https://g.mozest.com/thread-43513-4-1
// @updateURL      https://j.mozest.com/ucscript/script/103.meta.js
// @screenshot     http://j.mozest.com/images/uploads/previews/000/00/01/86bb70c8-0ab9-c027-daf4-12a2f293d21c.jpg http://j.mozest.com/images/uploads/previews/000/00/01/thumb-86bb70c8-0ab9-c027-daf4-12a2f293d21c.jpg
// ==/UserScript==
//
//
(function(){
if (window.InformEnterPlus) {
	window.InformEnterPlus.uninit();
	delete window.InformEnterPlus;
}	
const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
const FileInputStream = Components.Constructor("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream", "init");
const ConverterInputStream = Components.Constructor("@mozilla.org/intl/converter-input-stream;1", "nsIConverterInputStream", "init");
const FileOutputStream = Components.Constructor("@mozilla.org/network/file-output-stream;1", "nsIFileOutputStream", "init");
const ConverterOutputStream = Components.Constructor("@mozilla.org/intl/converter-output-stream;1", "nsIConverterOutputStream", "init");

window.InformEnterPlus = {
	InformArr: [],
	optionwin: false,
	_crrinput: "",
	init: function(){
		var contextMenu = document.getElementById("contentAreaContextMenu");
		var separator = document.getElementById("context-sep-undo");
		this.menubtn = document.createElement("menu");
		this.menubtn.setAttribute("id","ife-context-menu");
		this.menubtn.setAttribute("label", "InFormEnterPlus");
		contextMenu.insertBefore(this.menubtn, separator);
		this.menusetPop = document.createElement("menupopup");
		this.menusetPop.setAttribute("id","informpopup");
		this.menubtn.appendChild(this.menusetPop);
		this.menuset = document.createElement("menuitem");
		this.menuset.setAttribute("id","ife-context-set");
		this.menuset.setAttribute("label","InFormEnter-Seiteneinstellungen");
		this.menuset.setAttribute("oncommand","InformEnterPlus.openManager();");
		this.menusetPop.appendChild(this.menuset);
		
		var file = this._getInformEnterFile();
		if (file.exists()) {
			    this.importInformEnter(file);
		}
		if (this.InformArr.length > 0) {
		  this.createSubMenu();
		}
		
		//for rulelistmanager
	        var xmlTT = '\
	        <splitter id="InformEnterPlus-splitter" hidden="true"/>\
          <vbox id="InformEnterPlus-rule" height="250" hidden="true">\
          <hbox>\
              <vbox id="InformEnterPlus-details" width="600" height="250"  flex="1">\
              <groupbox  flex="1">\
			           <caption label="InFormEnterPlus Liste" />\
                <tree id="InformEnterPlus-tree" flex="1" seltype="single" onclick="InformEnterPlus.Ruletree.selectRule();">\
            			<treecols>\
            				<treecol id="InformEnterPlus-domain" label="Webadresse" flex="1" crop="center" persist="width ordinal hidden"/>\
                    <splitter class="tree-splitter"/>\
                    <treecol id="InformEnterPlus-menu" label="Menüname" flex="1" crop="center" persist="width ordinal hidden"/>\
                    <splitter class="tree-splitter"/>\
                    <treecol id="InformEnterPlus-InputID" label="Input ID" flex="1" crop="center"  persist="width ordinal hidden"/>\
                    <splitter class="tree-splitter"/>\
                    <treecol id="InformEnterPlus-Value" label="Einfügen des Inhalts" hidden="true" persist="width ordinal hidden"/>\
            			 </treecols>\
            			<treechildren/>\
               </tree>\
            	</groupbox>\
              </vbox>\
              <vbox id="InformEnterPlus-todo"  height="250" flex="1">\
                  <hbox><label value="      "/></hbox>\
                  <hbox><label value="Die Daten werden in einer Konfigurationsdatei im Profil gespeichert! Ändern Schaltfläche gilt nur für Inhalt einfügen!"/><spacer flex="1" /><button label="Speichern" id="InformEntersave" oncommand="InformEnterPlus.saveRule();" />\
                              <button label="Schließen" id="InformEnterPlus-close" oncommand="InformEnterPlus.Ruletree.closesplicer();" /></hbox>\
                  <hbox><label value="Input ID (Web-Seitenadresse) zum Identifizieren des Eingabefeldes. Feld darf nicht leer sein! * = Global auf allen Seiten verwenden! "/></hbox>\
                  <hbox><label value="Webadresse, Domain -oder Hostname, zB: google.com angeben. * = Global auf allen Seiten verwenden!:"/><textbox id="domainvalue" flex="1" /></hbox>\
                  <hbox><label value="Menüname (Bezeichnung im Kontextmenü, zB: Google Benutzer). Feld darf nicht leer sein!:"/><textbox id="menuvalue" flex="1" /></hbox>\
                  <hbox><label value="Input ID (ID, Name, Klasse, die unterstützt werden). * = Global auf allen Seiten verwenden!:"/><textbox id="inputvalue" flex="1" /></hbox>\
                  <hbox><label value="Inhalt einfügen (Inhalt des Popup wird automatisch in das Eingabefeld kopiert). Feld darf nicht leer sein!:"/><textbox id="pastevalue" type="password" flex="1" oncopy="return false;" oncut="return false;"/>\
                  <checkbox id="IMETYPE" checked="false" label="IME-Eingaben" oncommand="InformEnterPlus.setIMEmode(event);"/></hbox>\
                  <hbox>\
				            <button label="Hinzufügen" id="InformEnteradd" oncommand="InformEnterPlus.Ruletree.addlistRule();" />\
				            <button label="Löschen" id="InformEnterdel" disabled="false" oncommand="InformEnterPlus.Ruletree.dellistRule();" />\
				            <button label="Ändern" id="InformEnteredit" disabled="false" oncommand="InformEnterPlus.Ruletree.editlistRule();" />\
				            <spacer flex="1" />\
                  </hbox>\
                  <spacer flex="1" />\
                </vbox>\
            </hbox>\
          </vbox>\
	    ';
	    var rangeTT = document.createRange();
	    rangeTT.selectNodeContents(document.getElementById('appcontent'));
	    rangeTT.collapse(false);
	    rangeTT.insertNode(rangeTT.createContextualFragment(xmlTT.replace(/\n|\r/g, '')));//.replace(/\n|\t|\r/g, '')
	    rangeTT.detach();
		this.Ruletree.init();
		contextMenu.addEventListener("popupshowing", this, false);
		window.addEventListener("unload", this, false);
	},
	
	openManager: function() {
  		var InformEnterPlusrule = document.getElementById("InformEnterPlus-rule");
      var InformEnterPlusSplitter = document.getElementById("InformEnterPlus-splitter");
      if (InformEnterPlusrule.hidden) {
      	var taburl = this.getFocusedWindow().location.href;
      	var crurl = taburl.substring(0,4);
      	if (crurl === "http") {
      	  var host = this.convertUrl2host(taburl);
      	  var etld = host;
          var aIP = '';
            [ etld , aIP ] = this.isValidTld(etld);
              if (aIP != '') {
            etld = aIP;
          }
      	  document.getElementById("domainvalue").value = etld;
      	  document.getElementById("inputvalue").value = this._crrinput;
        } else {
          document.getElementById("domainvalue").value = "";
          document.getElementById("inputvalue").value = "";
        }
      	InformEnterPlus.Ruletree.AddRuleTable();
      	InformEnterPlus.Ruletree.selectRule();
        InformEnterPlusrule.hidden = InformEnterPlusSplitter.hidden = false;
      }else {
        var taburl = this.getFocusedWindow().location.href;
      	var crurl = taburl.substring(0,4);
      	if (crurl === "http") {
      	  var host = this.convertUrl2host(taburl);
      	  var etld = host;
          var aIP = '';
            [ etld , aIP ] = this.isValidTld(etld);
              if (aIP != '') {
            etld = aIP;
          }
      	  document.getElementById("domainvalue").value = etld;
      	  document.getElementById("inputvalue").value = this._crrinput;
        } else {
          document.getElementById("domainvalue").value = "";
          document.getElementById("inputvalue").value = "";
        }
      }
  },
	
	uninit: function() {
		var i = document.getElementById("ife-context-set");
		if (i) i.parentNode.removeChild(i);
		var i = document.getElementById("informpopup");
		if (i) i.parentNode.removeChild(i);
		document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing", this, false);
		var i = document.getElementById("ife-context-menu");
		if (i) i.parentNode.removeChild(i);
		window.removeEventListener("unload", this, false);
	},
	
	handleEvent: function( evt ){
	  switch(evt.type){
			case "unload": this.uninit(); break;
			case 'popupshowing':
			  return this._setMenuDisplay(evt);
			break
		}
	},
	
	_setMenuDisplay: function(e) {
		var showcut = -1;
		var crrupop = null;
		var taburl = this.getFocusedWindow().location.href; 
		taburl = taburl.toLowerCase();
		for(var i=0, menu; menu=this.InformArr[i]; ++i) {
			if (menu.domainname != "*") {
				var nm = menu.domainname.replace('.', '_');
				if (taburl.indexOf(menu.domainname.toLowerCase()) == -1) { 
					document.getElementById(nm + "pop").hidden = true;
					document.getElementById(nm + "id").hidden = true;
				} else {
					document.getElementById(nm + "pop").hidden = false;
					document.getElementById(nm + "id").hidden = false;
					crrupop = document.getElementById(nm + "pop");
					showcut = document.getElementById(nm + "pop").childNodes.length;
			  }
			}
		}
		if (gContextMenu != null && gContextMenu.onTextInput) {
			if (content.document.activeElement) {
			  if (content.document.activeElement.id) 
			    this._crrinput = content.document.activeElement.id;
			  else if (content.document.activeElement.name) 
			    this._crrinput = content.document.activeElement.name;
			  else if (content.document.activeElement.className) 
			    this._crrinput = content.document.activeElement.className;
			  else
			  	this._crrinput = "";
			} else
				this._crrinput = "";
			document.getElementById("ife-context-menu").hidden = false;
			var amenu = null;
			if (this._crrinput != "" && showcut > 0 && crrupop)
			for (var j = 0; j < showcut; j++) {
				amenu = crrupop.childNodes[j];
			  if (amenu && amenu.culMenu.inputid === this._crrinput) {
			  	content.document.activeElement.value = amenu.culMenu.text;
			  	e.preventDefault();
			  	break;
			  }
			}
		} else {
			document.getElementById("ife-context-menu").hidden = true;
		}
	},
	
	createSubMenu: function() {
		var menuItemtemp;
		var menulist = [];
		var menures = {};
		for(var i=0, menu; menu=this.InformArr[i]; ++i)
		{
			menulist = menu.MenusArr;
			if (menu.domainname != "*") {
				  var nm = menu.domainname.replace('.', '_');
				  var menuItem = document.createElement("menu");
				  menuItem.setAttribute("id", nm + "id");
				  menuItem.setAttribute("label", "InformEnter für " + menu.domainname);
				  var menuPopup = document.createElement("menupopup");
				  menuPopup.setAttribute("id", nm + "pop");
				  menuItem.appendChild(menuPopup);
				  for(var j=0, menures; menures = menulist[j]; ++j){
				  	menuItemtemp = document.createElement("menuitem");
				  	menuItemtemp.setAttribute("id", menures.inputid + "-ID" + j.toString());
				    menuItemtemp.setAttribute("label", menures.label);
				    menuItemtemp.culMenu = menures;
				    menuItemtemp.setAttribute("oncommand","InformEnterPlus.pasteText(event);");
				    menuPopup.appendChild(menuItemtemp);
				  }
				  this.menusetPop.appendChild(menuItem);
			} else {
				var menuItem = document.createElement("menu");
			  menuItem.setAttribute("id", "allsiteid");
			  menuItem.setAttribute("label", "InformEnter für alle Felder");
			  var menuPopup = document.createElement("menupopup");
			  menuPopup.setAttribute("id", "allsitepop");
			  menuItem.appendChild(menuPopup);
				for(var q=0, menures; menures = menulist[q]; ++q){
				  menuItemtemp = document.createElement("menuitem");
				  menuItemtemp.setAttribute("id", menures.inputid + "-ID" + q.toString());
				  menuItemtemp.setAttribute("label", menures.label);
				  menuItemtemp.culMenu = menures;
				  menuItemtemp.setAttribute("oncommand","InformEnterPlus.pasteText(event);");
				  menuPopup.appendChild(menuItemtemp);
			  }
			  this.menusetPop.appendChild(menuItem);
			}
		}
	},
	
	addnewmenu: function(isidx, dmn, arec){
		var dmname = (dmn != "*") ? dmn.replace('.', '_') : "allsite";
		try {
  	  if (isidx > -1) {
  	  	InformEnterPlus.InformArr[isidx].MenusArr.push(arec);
  	  	var pmenu = document.getElementById(dmname + "pop");
  	  	var j = pmenu.childNodes.length;
        var menuItemtemp = document.createElement("menuitem");
        menuItemtemp.setAttribute("id", arec.inputid + "-ID" + j.toString());
  	    menuItemtemp.setAttribute("label", arec.label);
  	    menuItemtemp.culMenu = arec;
  	    menuItemtemp.setAttribute("oncommand","InformEnterPlus.pasteText(event);");
  	    pmenu.appendChild(menuItemtemp);
  	  } else {
  	  	var re = {
  			    domainname : dmn,
  			    MenusArr : []
		    };
		    re.MenusArr.push(arec);
		    InformEnterPlus.InformArr.push(re);
  	  	var menuItem = document.createElement("menu");
  		  menuItem.setAttribute("id", dmname + "id");
  		  menuItem.setAttribute("label", "InformEnter für " + dmn);
  		  var pmenu = document.createElement("menupopup");
  		  pmenu.setAttribute("id", dmname + "pop");
  		  menuItem.appendChild(pmenu);
  		  var menuItemtemp = document.createElement("menuitem");
  		  menuItemtemp.setAttribute("id", arec.inputid + "-ID0");
  	    menuItemtemp.setAttribute("label", arec.label);
  	    menuItemtemp.culMenu = arec;
  	    menuItemtemp.setAttribute("oncommand","InformEnterPlus.pasteText(event);");
  	    pmenu.appendChild(menuItemtemp);
  	    this.menusetPop.appendChild(menuItem);
  	  } 
  	  return true;
	  } catch (ex) {
			return false;
	  }
	},
	
	editnewmenu: function(isexited, olddm, oldip, rec) {
	  try {
	  	if (isexited > -1 && olddm > -1) {
  	  	//var itid = rec.inputid + "-ID" + olddm.toString();
  	  	var itid = oldip + "-ID" + olddm.toString();
  	  	var menuItemtemp = document.getElementById(itid);
  	  	if (itid) {
  	  		menuItemtemp.setAttribute("id", rec.inputid + "-ID" + olddm.toString());
  	      menuItemtemp.culMenu = rec;
  	      this.InformArr[isexited].MenusArr[olddm] = rec;
  	      return true;
  	    } else
  	    	return false;
  	  } else 
  	  return false;	
	  } catch (ex) {
			return false;
	  }
	},
	
	delmenurec: function(delrecnm){
		 var menulist = [];
		  var isexited = -1; var issame = -1; 
			for(var i=0, menu; menu=this.InformArr[i]; ++i)
  		{
  			menulist = menu.MenusArr;
  			var nm = menu.domainname;
  			if (delrecnm.domainname == nm){
  				isexited = i;
  				for(var j=0, menures; menures = menulist[j]; ++j){
  					if (delrecnm.MenusArr[0].label == menures.label && delrecnm.MenusArr[0].inputid == menures.inputid  && delrecnm.MenusArr[0].text == menures.text ) {
  						 issame = j;
  						 break; 
  					}
  				}
  				if (issame) break;
  			}
  		}
		  if (issame == -1 || isexited == -1) {
  			window.alert("Datensätze stimmen nicht überein!");
				return false;
  		} else {
  			var delres = {};
  			delres = delrecnm.MenusArr[0];
  			var dmname = (delrecnm.domainname != "*") ? delrecnm.domainname.replace('.', '_') : "allsite";
  			var mnrec = document.getElementById(delres.inputid + "-ID" + issame.toString());
  			if (mnrec) {
  				mnrec.parentNode.removeChild(mnrec);
  			  this.InformArr[isexited].MenusArr.splice(issame, 1);
  			  if (this.InformArr[isexited].MenusArr.length == 0 ) {
  			      this.InformArr.splice(isexited, 1);
  			      mnrec = document.getElementById(dmname + "pop");
  			      if (mnrec) mnrec.parentNode.removeChild(mnrec);
  			      mnrec = document.getElementById(dmname + "id");
  			      if (mnrec) mnrec.parentNode.removeChild(mnrec);
  			  }
  			  return true;
  		  } else {
  		  	window.alert("Löschen fehlgeschlagen!");
  		    return false;
  		  }
  		}
	},
	
	pasteText: function(aEvent) {
		var inputtextid = aEvent.target.culMenu.inputid;
		var text = aEvent.target.culMenu.text;
		if (!inputtextid) {
		  if (text!="undefined")
		  {
			  content.document.activeElement.value = text;
		  }
		}	else if (inputtextid !="undefined" && (inputtextid == "*" || content.document.activeElement.id.indexOf(inputtextid) != -1 || content.document.activeElement.name.indexOf(inputtextid) != -1 || content.document.activeElement.className.indexOf(inputtextid) != -1)) {
		  if (text!="undefined")
		  {
			  content.document.activeElement.value = text;
		  }
	  } else if (content.document.activeElement.tagName.toLowerCase() == "iframe"){
	  	let actfritem = content.document.activeElement.contentDocument ? content.document.activeElement.contentDocument : content.document.activeElement.document; 
	  	if (inputtextid !="undefined" && (inputtextid == "*" || actfritem.activeElement.id.indexOf(inputtextid) != -1 || actfritem.activeElement.name.indexOf(inputtextid) != -1 || actfritem.activeElement.className.indexOf(inputtextid) != -1)) {
			    actfritem.activeElement.value = text;
	  	}
		}
	},
	
	_getInformEnterFile : function() {
		var file = Components.classes["@mozilla.org/file/directory_service;1"].
		           getService(Components.interfaces.nsIProperties).
		           get("UChrm", Components.interfaces.nsIFile);
		file.append('InformEnter.json');
		return file;
	},
	
	saveRule: function(event) {
    	var file = this._getInformEnterFile();
		  this.exportInformEnter(file);
  },
	
	exportInformEnter : function(file) {
		const PR_WRONLY 	 = 0x02;
		const PR_CREATE_FILE = 0x08;
		const PR_TRUNCATE	 = 0x20;

		var fileStream = new FileOutputStream(file, PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, 0644, 0);
		var stream = new ConverterOutputStream(fileStream, "UTF-8", 16384, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
		var rjson = { createdBy : 'InformEnterPlus', createdAt : new Date(), Menus :[]};
		var re = { };
		for (var i = 0; i < this.InformArr.length; i++) {
		  re = this.InformArr[i];
			rjson.Menus.push(re);
		}
		stream.writeString(JSON.stringify(rjson, null, 4));
		stream.close();
	},
	
	importInformEnter : function(file) {
		var fileStream = new FileInputStream(file, 0x01, 0444, 0);
		var stream = new ConverterInputStream(fileStream, "UTF-8", 16384, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
		var str = {};
		var rjson = '';
		while (stream.readString(4096, str) != 0) {
			rjson += str.value;
		}
		stream.close();
		rjson = JSON.parse(rjson);
		for each (var rd in rjson.Menus) {
			var re = {
  			  domainname : rd.domainname,
  			  MenusArr : rd.MenusArr
		  };
		  this.InformArr.push(re);
		}
		return true;
	},
	
	getFocusedWindow: function() {
	  var win = document.commandDispatcher.focusedWindow;
	  return (!win || win == window) ? content : win;
  },
  
  convertUrl2host: function(url){
    var baseURI = ioService.newURI(this.getFocusedWindow().content.document.location.href, null, null);
    try{
      var uri = ioService.newURI(url, null, baseURI);
      uri = uri.host.replace(/^\s*/,"").replace(/\s*$/,"");
      return uri;
    }catch(e){}
    return '';
  },
  
  isValidTld: function(aHost){
    var regexpIP = new RegExp("^[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]$","");
    var _host = aHost;
    var _IPadd = '';
    if (_host) {
      if (regexpIP.test(_host)) {
        _IPadd = _host;
      } else {
        try {
        var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"]
                    .getService(Components.interfaces.nsIEffectiveTLDService);
        _host = eTLDService.getBaseDomainFromHost(_host,0);
        } catch(e) { return [ _host , _IPadd ]; }
      }
    }
    return [ _host , _IPadd ];
  },
  
  setIMEmode: function(evt) {
  	if (evt.target != document.getElementById("IMETYPE")) return;
    if (evt.target.checked)
      document.getElementById("pastevalue").setAttribute("type", "autocomplete");
    else
    	document.getElementById("pastevalue").setAttribute("type", "password");
  },

};
InformEnterPlus.Ruletree = {
  	_inited : false,
  	_visibleData : [],
  	
    get visibleData() { return this._visibleData; },
	  set visibleData(val) { this._visibleData = val; },
    get tree() { return document.getElementById("InformEnterPlus-tree"); },
    
    view: {
  		mgr: null,		// points back to RPBT
  		_columnNameToIndexMap : {
      "InformEnterPlus-domain" : 0,
      "InformEnterPlus-menu" : 1,
      "InformEnterPlus-InputID" : 2,
      "InformEnterPlus-Value" : 3,
      },
  		
  		inittree: function(mgr) {
  			this.mgr = mgr;
  		},
  		
  		get rowCount() { return this.mgr.visibleData.length;  },
  		getCellText : function(index, column) {
        try {
          var columnIndex = this._columnNameToIndexMap[column.id];
          return this._getVisibleItemAtIndex(index)[this._columnNameToIndexMap[column.id]];
        } catch (ex) {
        }
        return "";
      },
  		_getVisibleItemAtIndex : function(index) {
        return this.mgr.visibleData[this.mgr.visibleData.length - index - 1];
      },
      isContainerOpen : function(index) { return false;},
      isContainerEmpty : function(index) { return false; },
      isEditable : function(index, column) { return false; },
      hasNextSibling : function(index, after) { return false; },
  		isSeparator: function(aIndex) { return false; },
  		isSorted: function() { return false; },
  		isContainer: function(aIndex) { return false; },
  		setTree: function(aTree){},
  		getImageSrc: function(aRow, aColumn) {},
  		getProgressMode: function(aRow, aColumn) {},
  		getCellValue: function(aRow, aColumn) {},
  		cycleHeader: function(aColId, aElt) {},
  		getRowProperties: function(aRow, aProperty) {},
  		getColumnProperties: function(aColumn, aColumnElement, aProperty) {},
  		getCellProperties: function getCellProperties(aRow, aColumn, aProperty) { },
  
  		get selection() { return this._selection != undefined ? this._selection : this.mgr.tree.selection; },
  		set selection(val) { return this._selection = val; }
  		// end Implement TreeView interface
  	},
    init : function() {
    	this.view.inittree(this);
			this.tree.treeBoxObject.view = this.view;
			this._inited = true;
      //this.AddRuleTable();
    },
    closesplicer: function(){
    	document.getElementById("InformEnterPlus-rule").hidden = true;
      document.getElementById("InformEnterPlus-splitter").hidden = true;
    },
    
    addlistRule:  function(){
    	var menulist = [];
    	var zdxx = document.getElementById('domainvalue').value.replace(/\n|\t|\r|\s/g, '');
    	var yxbtn = document.getElementById('menuvalue').value.replace(/\n|\t|\r|\s/g, '');
    	var zzbtn = document.getElementById('inputvalue').value.replace(/\n|\t|\r|\s/g, '');
    	var grupbtn = document.getElementById('pastevalue').value.replace(/\n|\t|\r|\s/g, '');
			if (zdxx == "" || yxbtn == "" || grupbtn == "") {
				window.alert("Feldinhalt angeben!");
				return;
			}//zzbtn == "" || 
			if (zdxx != "*" && zzbtn == ""){
				window.alert("Globale Einstellungen angeben!");
				return;
			}
			var isexited = -1; var issame = false; 
			for(var i=0, menu; menu=InformEnterPlus.InformArr[i]; ++i)
  		{
  			menulist = menu.MenusArr;
  			var nm = menu.domainname;
  			if (zdxx == nm){
  				isexited = i;
  				for(var j=0, menures; menures = menulist[j]; ++j){
  					if (yxbtn == menures.label && zzbtn == menures.inputid  && grupbtn == menures.text ) {
  						 issame = true;
  						 break; 
  					}
  				}
  				if (issame) break;
  			}
  		}
  		if (issame && isexited != -1) {
  			window.alert("Protokoll-Duplikat!");
				return;
  		} else {	
  			var rec = {
			     label : yxbtn,
			     inputid : zzbtn,
			     text : grupbtn 
			  };
			  if (InformEnterPlus.addnewmenu(isexited, zdxx, rec))
			    this.filldatatotree(zdxx, yxbtn, zzbtn, grupbtn);
			  else
			  	window.alert("Hinzufügen fehlgeschlagen!");
		  }
    },
    AddRuleTable: function(){
		  var menulist = [];
		  var menures = {};
    	if (!this._inited) {
    		 this._inited = true;
    	} else
    	  this.clear();
      	for(var i=0, menu; menu=InformEnterPlus.InformArr[i]; ++i) {
      		menulist = menu.MenusArr;
          for (var j = 0; j < menulist.length; j++){
          	menures = menulist[j];
            var dm = menu.domainname;
            var lm = menures.label;
            var ipid = menures.inputid;
            var iptxt = menures.text;
          	this.filldatatotree(dm, lm, ipid, iptxt);
          }
        }
    },
    filldatatotree: function(domainname, label, inputid, text){
    	this.visibleData.push([domainname, label, inputid, text]);
      this.visibleData = this.visibleData;		// yea for hidden side-effects
			if (this.view.selection)
			{
				this.view.selection.clearSelection();
				//this.view.selection.currentIndex = -1;
			}
			this.tree.treeBoxObject.view = this.view;
    },
    clear : function(e) {
			var oldRowCount = this.view.rowCount;
			this.tree.treeBoxObject.rowCountChanged(0, -oldRowCount);
			var selection = this.view.selection;
			if (selection)
				selection.clearSelection();
      this.visibleData = [];
    },
    dellistRule: function(event) {
    	var selection = this.view.selection;
			var idxitem = selection.currentIndex;
    	if (idxitem >= 0) {
    		  var ett = this.visibleData.length - idxitem - 1;
    		  var delrecnm = {
    		  	domainname : this.visibleData[ett][0],
    		  	MenusArr : []
    		  };
    		  var delrec = {
    		  	label : this.visibleData[ett][1],
    		  	inputid : this.visibleData[ett][2],
    		  	text : this.visibleData[ett][3]
    		  };
    		  delrecnm.MenusArr.push(delrec);
    		  if (InformEnterPlus.delmenurec(delrecnm)) {
    		  	selection.selectEventsSuppressed = true;
    		    this.visibleData.splice(ett, 1);
            this.tree.treeBoxObject.rowCountChanged(ett, -1);
            selection.selectEventsSuppressed = false;
      			if (idxitem > this.view.rowCount - 1)
      				idxitem = this.view.rowCount - 1;
      			this.view.selection.select(idxitem);
      			this.tree.treeBoxObject.ensureRowIsVisible(idxitem);
      			this.selectRule();
    		  } else {
    		    window.alert("Löschen fehlgeschlagen!");
    		  }
    	}
    },
    editlistRule: function(event) {
    	var selection = this.view.selection;
    	var menulist = [];
			var idxitem = selection.currentIndex;
    	if (idxitem >= 0) {
        	var zzbtn = document.getElementById('inputvalue').value.replace(/\n|\t|\r|\s/g, '');
        	var grupbtn = document.getElementById('pastevalue').value.replace(/\n|\t|\r|\s/g, '');
    			if (zzbtn == "" || grupbtn == "") {
    				window.alert("Feldinhalt angeben!");
    				return;
    			}
    			if (zzbtn == ""){
    				window.alert("Globale Einstellungen angeben!");
    				return;
    			}
    			var ett = this.visibleData.length - idxitem - 1;
    			var olddm = this.visibleData[ett][0];
    			var oldlb = this.visibleData[ett][1];
    			var oldip = this.visibleData[ett][2];
    			var oldtt = this.visibleData[ett][3];
    			var isexited = -1; var issame = false; var islbl = -1;
    			for(var i=0, menu; menu=InformEnterPlus.InformArr[i]; ++i)
      		{
      			menulist = menu.MenusArr;
      			var nm = menu.domainname;
      			if (olddm == nm){
      				isexited = i;
      				for(var j=0, menures; menures = menulist[j]; ++j){
      					if (oldlb == menures.label) {
      					   islbl = j;
      					}
      					if (zzbtn == menures.inputid  && grupbtn == menures.text ) {
      						 issame = true;
      						 break; 
      					}
      				}
      				if (issame) break;
      			}
      		}
      		if (issame && isexited != -1 && islbl != -1) {
    				return;
      		} else if (isexited != -1 && islbl != -1 && !issame) {	
      			var rec = {
    			     label : oldlb,
    			     inputid : zzbtn,
    			     text : grupbtn 
    			  };
    			  if (InformEnterPlus.editnewmenu(isexited, islbl, oldip, rec)) {
    			  	selection.selectEventsSuppressed = true;
    	   	    this.visibleData[ett] = [olddm, oldlb, zzbtn, grupbtn];
              selection.selectEventsSuppressed = false;
        			this.view.selection.select(idxitem);
        			this.tree.treeBoxObject.ensureRowIsVisible(idxitem);
    			  } else
    			  	window.alert("Änderung fehlgeschlagen!");
    		  } else
    		  	return;
    	}
    },
    selectRule: function(event) {
      var selection = this.view.selection;
      if (selection == null) {
      	document.getElementById('InformEnterdel').setAttribute('disabled', true);
    	  document.getElementById('InformEnteredit').setAttribute('disabled', true);
    	  return;
      }
			var idxitem = selection.currentIndex;
    	document.getElementById('InformEnterdel').setAttribute('disabled', (idxitem >= 0) ? false : true);
    	document.getElementById('InformEnteredit').setAttribute('disabled', (idxitem >= 0) ? false : true);
			if (idxitem >= 0) {
    		  var ett = this.visibleData.length - idxitem - 1
          this.visibleData[ett];
          document.getElementById('domainvalue').value = this.visibleData[ett][0];
    	    document.getElementById('menuvalue').value = this.visibleData[ett][1];
    	    document.getElementById('inputvalue').value = this.visibleData[ett][2];
    	    if (!document.getElementById('IMETYPE').checked)
    	        document.getElementById('pastevalue').value = this.visibleData[ett][3];
    	    else
    	    	  document.getElementById('pastevalue').value = "";
    	}
    },
};
InformEnterPlus.init();
window.InformEnterPlus = InformEnterPlus;

})();
