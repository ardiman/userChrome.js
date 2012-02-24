// Cookies aktivieren im Extra Menü

function _toggleCookies()
{
  var pref = Components.classes['@mozilla.org/preferences-service;1']
                       .getService(Components.interfaces.nsIPrefService)
                       .getBranch('network.cookie.');

  var e = pref.getIntPref('cookieBehavior');

  pref.setIntPref('cookieBehavior', (e == 2) ? 0 : 2);
}

(function()
{
  var pref = Components.classes['@mozilla.org/preferences-service;1']
                       .getService(Components.interfaces.nsIPrefService)
                       .getBranch('network.cookie.');

  var menu = document.getElementById('menu_ToolsPopup');

  var item = document.createElement('menuitem');

  item.setAttribute("id", 'tools-cookie-toggle');
  item.setAttribute("label", "Cookies aktivieren");
  item.setAttribute("type", "checkbox");
  item.setAttribute("checked", pref.getIntPref('cookieBehavior') != 2);
  item.setAttribute("oncommand", "_toggleCookies()");

  //menu.appendChild(item);
  menu.insertBefore(item, document.getElementById('sanitizeItem'));
})();
