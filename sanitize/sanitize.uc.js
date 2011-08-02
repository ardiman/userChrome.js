WindowHook.register("chrome://browser/content/sanitize.xul", function(aWindow) {
  with(aWindow) {
    document.getElementsByAttribute("preference", "privacy.cpd.history")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.cpd.formdata")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.cpd.cookies")[0].disabled = true;    
    document.getElementsByAttribute("preference", "privacy.cpd.siteSettings")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.cpd.sessions")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.cpd.extensions-tabmix")[0].disabled = true;
  }
});

WindowHook.register("chrome://browser/content/preferences/sanitize.xul", function(aWindow) {
  with(aWindow) {
    document.getElementsByAttribute("preference", "privacy.item.extensions-tabmix")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.history")[0].disabled = true;
  document.getElementById("privacy.clearOnShutdown.history")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.formdata")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.cookies")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.downloads")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.passwords")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.sessions")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.siteSettings")[0].disabled = true;
    document.getElementsByAttribute("preference", "privacy.clearOnShutdown.offlineApps")[0].disabled = true;
  }
});

