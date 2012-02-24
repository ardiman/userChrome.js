// Der Plugin Manager im Extra Menü

var pluginManager = {
  timerInterval: 3600,
  timerIntervalPref: 'pluginmanager.timer.interval',
  timerEnabled: false,
  timerEnabledPref: 'pluginmanager.timer.enabled',
  timerPrompt: true,
  timerPromptPref: 'pluginmanager.timer.prompt',
  timers: [],

  observe: function(subject, topic, data)
  {
    switch (topic) {
      case 'plugins-list-updated':
        this.reloadPlugins();
        break;
      case 'nsPref:changed':
        switch (data) {
          case this.timerIntervalPref:
            this.timerInterval = this.getPref('Int', this.timerIntervalPref,
                                                     3600);

            if (this.timerEnabled)
              this.forEachTimer(function(pluginManager, id) {
                                  var plugin = pluginManager.getPluginByPath(id);

                                  if (plugin) {
                                    pluginManager.delTimer(plugin);
                                    pluginManager.addTimer(plugin);
                                  }
                                });
            break;
          case this.timerEnabledPref:
            this.timerEnabled = this.getPref('Bool', this.timerEnabledPref,
                                                     false);

            if (!this.timerEnabled)
              this.forEachTimer(function(pluginManager, id) {
                                  pluginManager.delTimer(null, id);
                                });
            break;
          case this.timerPromptPref:
            this.timerPrompt = this.getPref('Bool', this.timerPromptPref, true);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  },

  getPref: function(type, pref, def)
  {
    try { return this.prefs['get' + type + 'Pref'](pref); } catch (e) { }

    return def;
  },
  setPref: function(type, pref, val)
  {
    try {
      this.prefs['set' + type + 'Pref'](pref, val);
    } catch (e) { alert(e); }

    this.prefs.savePrefFile(null);
  },

  isChecked: function(item)
  {
    return item.getAttribute('checked') == 'true';
  },

  toggle: function(item)
  {
    var filename = item.getAttribute('filename');

    var plugin = this.getPluginByPath(filename);

    if (plugin) {
      this.setPlugin(plugin, !this.isChecked(item));

      if (this.timerEnabled && this.timerInterval > 0) {
        if (this.hasTimer(plugin))
          this.delTimer(plugin);
        else
          this.addTimer(plugin);
      }
    }
  },

  toggleTimer: function(item)
  {
    this.setPref('Bool', this.timerEnabledPref, this.isChecked(item));
  },
  togglePrompt: function(item)
  {
    this.setPref('Bool', this.timerPromptPref, this.isChecked(item));
  },

  setPlugin: function(plugin, disabled)
  {
    plugin.disabled = disabled;

    Cc["@mozilla.org/observer-service;1"]
      .getService(Ci.nsIObserverService)
      .notifyObservers(null, "plugins-list-updated", null);
  },

  getPluginByPath: function(filename)
  {
    for (var i = 0; i < this.plugins.length; i++)
      if (this.plugins[i].filename == filename)
        return this.plugins[i];

    return null;
  },

  hasTimer: function(plugin)
  {
    return !!this.timers[plugin.filename];
  },
  addTimer: function(plugin)
  {
    this.timers[plugin.filename] =
      setTimeout(function(pluginManager, plugin, disabled) {
          pluginManager.delTimer(plugin);

          // just in case the plugins have changed
          var plugin = pluginManager.getPluginByPath(plugin.filename);

          var text = 'Zurückkehren von ' + plugin.name + ' zum ' +
                       (plugin.disabled ? 'aktivierten' : 'deaktivierten') + ' Zustand?';

          // if plugin found and state is unchanged
          if (plugin && plugin.disabled == disabled &&
               (!pluginManager.timerPrompt ||
                (pluginManager.timerPrompt && confirm(text))))
            pluginManager.setPlugin(plugin, !disabled);
        }, this.timerInterval * 1000, this, plugin, plugin.disabled);
  },
  delTimer: function(plugin, id)
  {
    if (!id && plugin)
      id = plugin.filename;

    if (this.timers[id])
      clearTimeout(this.timers[id]);

    delete this.timers[id];
  },

  forEachTimer: function(func)
  {
    for (var id in this.timers)
      func(this, id);
  },

  reloadPlugins: function()
  {
    this.plugins = Cc['@mozilla.org/plugin/host;1']
                     .getService(Components.interfaces.nsIPluginHost)
                     .getPluginTags({});

    this.plugins.sort(function(a, b) {
                        return String.localeCompare(a.name, b.name);
                      });
  },

  menu: function(event)
  {
    var popup = event.target;

    while (popup.hasChildNodes())
      popup.removeChild(popup.firstChild);

    for (var i = 0; i < this.plugins.length; i++) {
      var plugin = this.plugins[i];

      var label = plugin.name;

      if (label.length > 32)
        label = label.substr(0, 32) + '...';

      var item = document.createElement('menuitem');
      item.setAttribute('label', label);
      item.setAttribute('name', plugin.name);
      item.setAttribute('description', plugin.description);
      item.setAttribute('filename', plugin.filename);
      item.setAttribute('tooltiptext',
                        plugin.description.replace(/<.+?>/g, ' '));
      item.setAttribute('type', 'checkbox');
      item.setAttribute('checked', !plugin.disabled);
      item.setAttribute('disabled', plugin.blocklisted);
      item.setAttribute('oncommand', 'pluginManager.toggle(this, true);');

      if (this.hasTimer(plugin))
        item.setAttribute('style', 'font-style: italic;');

      popup.appendChild(item);
    }

    var item = document.createElement('menuseparator');
    item.setAttribute('id', 'pluginManagerTimerSeparator');
    popup.appendChild(item);

    var item = document.createElement('menuitem');
    item.setAttribute('id', 'pluginManagerTimerCheckbox');
    item.setAttribute('label', 'Aktivierung (nach ' + this.timerInterval +
                                                       ' Sekunden)');
    item.setAttribute('type', 'checkbox');
    item.setAttribute('checked', this.timerEnabled);
    item.setAttribute('oncommand', 'pluginManager.toggleTimer(this);');
    popup.appendChild(item);

    var item = document.createElement('menuitem');
    item.setAttribute('id', 'pluginManagerTimerPrompt');
    item.setAttribute('label', 'Bestätigung der Aktivierung');
    item.setAttribute('type', 'checkbox');
    item.setAttribute('checked', this.timerPrompt);
    item.setAttribute('disabled', !this.timerEnabled);
    item.setAttribute('oncommand', 'pluginManager.togglePrompt(this);');
    popup.appendChild(item);
  },

  startup: function()
  {
    this.prefs = Cc["@mozilla.org/preferences-service;1"]
                   .getService(Ci.nsIPrefService);

    this.pbi = Cc["@mozilla.org/preferences-service;1"]
                 .getService(Ci.nsIPrefBranch2);

    this.pbi.addObserver(this.timerIntervalPref, this, false);
    this.pbi.addObserver(this.timerEnabledPref, this, false);
    this.pbi.addObserver(this.timerPromptPref, this, false);

    this.os = Cc["@mozilla.org/observer-service;1"]
                .getService(Ci.nsIObserverService);

    this.os.addObserver(this, "plugins-list-updated", false);

    this.timerInterval = this.getPref('Int', this.timerIntervalPref, 3600);
    this.timerEnabled = this.getPref('Bool', this.timerEnabledPref, false);
    this.timerPrompt = this.getPref('Bool', this.timerPromptPref, true);

    this.reloadPlugins();

    var sep = document.getElementById('devToolsSeparator');

    var menu = document.createElement('menu');
    menu.setAttribute('id', 'pluginManager');
    menu.setAttribute('label', 'Plugin Manager');

    sep.parentNode.insertBefore(menu, sep);

    var popup = document.createElement('menupopup');
    popup.setAttribute('onpopupshowing', 'pluginManager.menu(event);');
    menu.appendChild(popup);

    window.addEventListener("unload", function() {
                                        pluginManager.shutdown();
                                      }, false);
  },
  shutdown: function()
  {
    // it's difficult to know what the user would want to happen here,
    // so just clear the timers and let them deal with plugin states
    this.forEachTimer(function(pluginManager, id) {
                        this.delTimer(null, id);
                      });

    this.pbi.removeObserver(this.timerIntervalPref, this);
    this.pbi.removeObserver(this.timerEnabledPref, this);
    this.pbi.removeObserver(this.timerPromptPref, this);

    this.os.removeObserver(this, "plugins-list-updated");
  }
};

pluginManager.startup();
