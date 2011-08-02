function Clock() {
    var days = ["So","Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var D = new Date();
    var day = days[D.getDay()];
    var month = months[D.getMonth()];
    var year = D.getFullYear();
    var hours = D.getHours();
    var min = D.getMinutes();
    var sec = D.getSeconds(); 
    var Time = ((hours < 10) ? "0" : "") + hours;
    Time += ((min < 10) ? ":0" : ":") + min;
    Time += " Uhr";
    var date = day + ", " + ((D.getDate()<10) ? "0" : "") + D.getDate() + "."+ month + "." + year;
    var timestr = date + " - " + Time;
    var status = document.getElementById("statusbar-clock-display");
    status.setAttribute("value", timestr);
    var clockstyle = "padding-top: 2px;"
    if (hours < 6 || hours > 22) {
      clockstyle += "color: #ff0000;";
      }
     else {
       clockstyle += "color: #000000;";
     }
     status.setAttribute("style", clockstyle);
     // Timeout variabel - damit Umschalten zur vollen Minute:
     setTimeout("Clock()", (60- sec)*1000);
  }

// letztes Kindelement der Statusbar finden
var ClockStatus = document.getElementById("status-bar").lastChild;
// var ClockStatus = document.getElementById("addon-bar").lastChild;
var ClockLabel = document.createElement("label");
ClockLabel.setAttribute("id", "statusbar-clock-display");
ClockLabel.setAttribute("class", "statusbarpanel-text");
// *vor* dem letzten Kindelement (s.o.) einfuegen - damit ist Uhr immer ganz rechts:
ClockStatus.parentNode.insertBefore(ClockLabel, ClockStatus.previousSibling);
Clock();