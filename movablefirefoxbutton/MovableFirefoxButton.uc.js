(function(css) {
  var appmenubutton = document.getElementById("appmenu-button");
  var navbar = document.getElementById("nav-bar");

  navbar.appendChild(appmenubutton);

  addStyle(css);

  function addStyle(css) {
    var pi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
  }
  
})(<![CDATA[
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);

[type="appmenu-button"]{display:none !important;}
#appmenu-button {-moz-box-ordinal-group: 0 !important;}

#appmenu-button .button-text {
display: none !important;
}
#appmenu-button dropmarker {
display: none !important;
}
#appmenu-button {
background:transparent !important; list-style-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2lJREFUeNpEU11sFFUYPffemdmZ7i5ddmkXSLO7FGsbFCQCJkj8Qf6aEk2MSVMD8uIP4otGo4EaMfEBfOBVH3gymhgkaIxREwQNoVhtoIgUti0t4q6k7tbd7nZ2d3b%2B7ox3tv6c5My9d%2B53zky%2Bcy%2FxfR%2Fvq%2BwMgOOHTT4e6927uc8ovBjm1qPj0XQnljAheEHwa8ErwYvq9DetDfKPgR8svk3cf2xBDg%2FtL4x1B%2Bt9JgcR4%2BC%2BEzj8XB2zn%2F3kXfzFOL%2BrdPW9Wsn8MaihQrw%2FmLwwHMNA%2BcZwIA7mAXIWkK9zHP3gVbxxUsOelzL0taf93TwcOZ95KD7YMiAEj8cTrCV4ZiiOdFrGv7jUzvB6TMFN3cLgwQE88W4G3U%2F2Yedb96m1Gj25bm%2FHSsoo2bSmR7aNvAuv2sTmrdH%2FzFqGFNAhoZK6B35IwaejMWQeTiKR0trrRecIlUNk9eoupjhND%2BHM0tebi0ms6H8en59agH%2Buil%2BvlnHj4u%2FwwJCdtbG46KJ3VwKNkrldEj1cFo5RSJTAqFFEHlnbMpHkbGucmymgkp1Eba4A15MwPkmhUY5kWkWjwvsky%2FRCcAF1FcXIdzU431%2FBXKEVCo7t%2BRDOx6dFVFyIPDRNgmTGQGzZAiqGAVN3JRqSSb22KAQir3iSoSPqYZUwCzB89hV8sfUHHN2Sgz5fgq1X8FhXHqgsoD5VhBYhhiT6f%2F3PvLMtupzh3nUq%2FphwsT4tYcMWFWHVxVjuL%2BDLC3C7XkZKy%2BPgxklYBRt3L1XAiDchudw%2FNTNhP9iekLTOlIqu9XG4Nsf4zw3kbtviP27iSPhZbGubxqH%2BMhLMQnWmiuxlBiUWP0eOh2hEYxiRCNm4fSgKNSSBcwlUZbhTUVDSTbSRBlKdDjKZEJoi0snROn7LafrKVEcv2ykRu%2BnjmuBTxawdVtsI2jQO6rhIyE2sjZhIqoDi0eDgI3fLxXTWMWfr1iH9enlUCpr1jsnH%2BmX65gPACWvU6EhEKLp7FbTHCZqaKBDHY%2F6ug9wIge7A%2FKrA397h4ZNW3MFD3Aecdf3irI%2BPBmRyoGH4y8vXLIW7S%2BkoKgGNUrdQQ%2BOMzk%2Ffcr2pHaGlpAj%2BR3B1k4I9PYxsSjOyIcbIClFAStyfz3N%2F6jb3L4v9KcGi4Hwg%2BluAAQD0OGaLejQqagAAAABJRU5ErkJggg%3D%3D"); 
min-width:30px !important;
margin-top:2px !important; 
margin-bottom:1px !important; 
padding-left:0px !important; 
padding-right:0px !important; 
//margin-right: 0px !important; 
box-shadow:none !important; 
border:none !important;
}

]]>.toString());