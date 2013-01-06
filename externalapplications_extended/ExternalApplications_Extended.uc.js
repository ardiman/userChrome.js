// ==UserScript==
// @name           externalApplications.uc.js
// @namespace      ithinc#mozine.cn
// @description    External Applications
// @include        main
// @compatibility  Firefox 3.5.x 3.6.x
// @author         ithinc
// @version        20091216.1.0.0 Final release
// @version        20091215.0.0.2 Handle toolbar apps and menu apps separately
// @version        20091212.0.0.1 Initial release
// ==/UserScript==

/* :::: External Applications :::: */

var gExternalApplications = {
  toolbar: {
    apps: [
      //{name: 'Notepad', path: '/WINDOWS/system32/notepad.exe'},
      {name: 'Calculator', path: 'C:\\WINDOWS\\system32\\calc.exe'},
     {name: 'freegate', path: 'F:\\360download\\fg709a.exe'},
     //{name: 'separator'},
     {name: 'Internet Explorer', path: 'C:\\Program Files\\Internet Explorer\\IEXPLORE.EXE', args: ['%u']},
      //{name: 'Command Prompt', path: 'C:\\WINDOWS\\system32\\cmd.exe'},
    ],
    insertafter: 'menubar-items'  //'menubar-items' or 'home-button'
  },

  menu: {
    apps: [
      //{name: 'Notepad', path: '/WINDOWS/system32/notepad.exe'},
      {name: 'Calculator', path: 'C:\\WINDOWS\\system32\\calc.exe'},
      //{name: 'Command Prompt', path: 'C:\\WINDOWS\\system32\\cmd.exe'},
      //{name: 'separator'},
      //{name: 'UltraEdit', path: 'C:\\Program Files\\IDM Computer Solutions\\UltraEdit-32\\uedit32.exe'},
      //{name: 'Total Commander', path: 'U:\\Programs\\Total Commander\\TOTALCMD.EXE'},
      //{name: 'separator'},
     //{name: 'My Computer', path: 'c:\\windows\\explorer.exe'},/*x?????*/
      {name: 'Internet Explorer', path: 'C:\\Program Files\\Internet Explorer\\IEXPLORE.EXE', args: ['%u']},//??????????,????%u
     // {name: 'Maxthon', path: 'C:\\Program Files\\Maxthon\\Maxthon.exe', args: ['%u']},
     // {name: 'Namoroka', path: 'D:\\Program Files\\Namoroka3.6b5pre\\firefox.exe', args: ['-no-remote', '-P blank']},
     // {name: 'separator'},
      //{name: 'Profile', path: 'C:\\Documents and Settings\\linus\\Application Data\\Mozilla\\Firefox\\Profiles\\c4r67s72.default'},
    ],
    insertafter: 'browserToolsSeparator', //'helpMenu', 'tools-menu' or 'browserToolsSeparator'
    label: 'Start',
    accesskey: 'A'
  },

  init: function() {
    this.handleRelativePath(this.toolbar.apps);
    this.handleRelativePath(this.menu.apps);

    if (this.toolbar.apps.length > 0) {
      var refNode = document.getElementById(this.toolbar.insertafter);
      if (refNode) {
        refNode.parentNode.insertBefore(this.createToolbaritem(this.toolbar.apps), refNode.nextSibling);
      }
    }

    if (this.menu.apps.length > 0) {
      var refNode = document.getElementById(this.menu.insertafter);
      if (refNode) {
        var menu = refNode.parentNode.insertBefore(document.createElement('menu'), refNode.nextSibling);
        menu.setAttribute('label', this.menu.label);
        menu.setAttribute('accesskey', this.menu.accesskey);
        menu.appendChild(this.createMenupopup(this.menu.apps));
      }
    }
  },

  handleRelativePath: function(apps) {
    for (var i=0; i<apps.length; i++) {
      if (apps[i].path) {
        apps[i].path = apps[i].path.replace(/\//g, '\\');

        var ffdir = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('CurProcD', Ci.nsIFile).path;
        if (/^(\.)/.test(apps[i].path)) {
          apps[i].path = ffdir + '\\' + apps[i].path;
        }
        else if (/^(\\)/.test(apps[i].path)) {
          apps[i].path = ffdir.substr(0,2) + apps[i].path;
        }
      }
    }
  },

  exec: function(path, args) {
    args = args || [];
    for (var i=0; i<args.length; i++) {
      args[i] = args[i].replace(/%u/g, gBrowser.currentURI.spec);
    }

    var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
    file.initWithPath(path);
    if (!file.exists()) {
      Cu.reportError('File Not Found: ' + path);
      return;
    }

    if (!file.isExecutable()) {
      file.launch();
    }
    else {
      var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
      process.init(file);
      process.run(false, args, args.length);
    }
  },

  createToolbaritem: function(apps) {
    var toolbaritem = document.createElement('toolbaritem');
    toolbaritem.setAttribute('class', 'chromeclass-toolbar-additional');
    toolbaritem.setAttribute('orient', 'horizontal');

    for (var i=0; i<apps.length; i++) {
      if (apps[i].name == 'separator') {
        toolbaritem.appendChild(document.createElement('toolbarseparator'));
      }
      else {
        var item = toolbaritem.appendChild(document.createElement('toolbarbutton'));
        item.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
        item.setAttribute('label', apps[i].name);
        item.setAttribute('image', 'moz-icon:file://' + apps[i].path + '?size=16;');
        item.setAttribute('oncommand', 'gExternalApplications.exec(this.path, this.args);');
        item.setAttribute('tooltiptext', apps[i].name);
      item.setAttribute('style','margin: 0px 0px;background: none;box-shadow: none;border-color: transparent;'); //dawlen add
        item.path = apps[i].path;
        item.args = apps[i].args;
      }
    }
    return toolbaritem;
  },

  createMenupopup: function(apps) {
    var menupopup = document.createElement('menupopup');
    for (var i=0; i<apps.length; i++) {
      if (apps[i].name == 'separator') {
        menupopup.appendChild(document.createElement('menuseparator'));
      }
      else {
        var item = menupopup.appendChild(document.createElement('menuitem'));
        item.setAttribute('class', 'menuitem-iconic');
        item.setAttribute('label', apps[i].name);
        item.setAttribute('image', 'moz-icon:file://' + apps[i].path + '?size=16');
        item.setAttribute('oncommand', 'gExternalApplications.exec(this.path, this.args);');
        item.path = apps[i].path;
        item.args = apps[i].args;
      }
    }
    return menupopup;
  }
};
gExternalApplications.init();