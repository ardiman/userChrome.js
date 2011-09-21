/* :::::::: Anzeige Dokument / WoTag/ Dat / Uhrzeit ::::::::::::::: */

/*--------------------------------------------------------
    Anzeige erfolgt deutsch und mit f√ºhrenden
    Nullen bei Datum, Stunden und Minuten
  --------------------------------------------------------*/

function doDatUhr() {
  var days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var months = ["Januar", "Februar", "M‰rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  window.setTimeout("try{doDatUhr()}catch(ex){}", 400 );
  var D = new Date();
  var day = days[D.getDay()];
  var month = months[D.getMonth()];
  var year = D.getFullYear();
  var hour = D.getHours();
  var minute = D.getMinutes();
  var second = D.getSeconds();
  var date = day + ", " + (D.getDate() < 10 ? "0" +D.getDate() : D.getDate()) + ". " + month + " " +  year;           
  var time = (hour < 10 ? "0" +hour : hour) + ":" + (minute < 10 ? "0" +minute : minute) + ":" + (second < 10 ? "0" +second : second);
  var timestr = ".........................................................>>>> " + date + ", " + time+ " Uhr  <<<<..............................................."; 
  document.title = timestr;
  
}

doDatUhr();

/* :::::::: END Anzeige Dokument / WoTag/ Dat / Uhrzeit ::::::::::::::: */