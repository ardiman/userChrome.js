function Clock() {
    var D = new Date();
    var days = ["So","Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    var day = days[D.getDay()];
    var hours = D.getHours();
    var dateString = day + ", " + ("0"+D.getDate()).substr(-2) + "." + ("0"+(D.getMonth()+1)).substr(-2) + "." + D.getFullYear();
    var timeString = ("0"+hours).substr(-2) + ":" + ("0"+D.getMinutes()).substr(-2) + " Uhr";
    var statusC = document.getElementById("statusbar-clock-display");
    statusC.setAttribute("label", dateString + " - " + timeString);
    if (hours < 6 || hours > 22) {
      statusC.setAttribute("style", "color: #ff0000;");
      }
     else {
      statusC.setAttribute("style", "color: #000000;");
     }
     // Timeout variabel - damit Umschalten zur vollen Minute:
     setTimeout("Clock()", (60- D.getSeconds())*1000);
  }
if (location == "chrome://browser/content/browser.xul") {
  // moegliche IDs von Statusbars (je nach Firefox-Version und verwendeter Erweiterung)
  var arrStatusbars = ["ctraddon_addon-bar","status4evar-status-bar","status-bar","addon-bar"];
  for (i = 0; i < arrStatusbars.length; i++) {
    if (document.getElementById(arrStatusbars[i]) !== null) {
      // letztes Kindelement der Statusbar finden
      var ClockStatus = document.getElementById(arrStatusbars[i]).lastChild;
      break;
    }
  }
  var ClockPanel = document.createElement("statusbarpanel");
  ClockPanel.setAttribute("id", "statusbar-clock-display");
  // *vor* dem letzten Kindelement (s.o.) einfuegen:
  ClockStatus.parentNode.insertBefore(ClockPanel,ClockStatus.previousSibling);
  Clock();
}