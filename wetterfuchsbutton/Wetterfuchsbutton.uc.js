// ==UserScript==
// @name           wetterfuchsbutton.uc.js
// @compatibility  Firefox 8.*,12.*,13.*,14.*,15.*,16.*,17.*,18.*
// @include        main
// @version        1.0.20130112
// ==/UserScript==

var wetterfuchs = {
  urlobj: {
    MO_Doppelklick: {url:"http://wetter.msn.com/local.aspx?wealocations=wc:GMXX0007&q=Berlin%2c+BE",width:615,height:390},
    MO_Rechtsklick: {url:"http://www.wetterkontor.net/de/wetter/deutschland/vorhersage.asp?w=view&sc=Berlin&lookfor=13407",width:478,height:338},
    MO_Mittelklick: {url:"http://www.daswetter.com/wetter_Berlin-Europa-Deutschland-Berlin--1-26301.html",width:678,height:477},
    DED_WetterAktuell: {url:"http://www.wetterkontor.net/de/deutschland_aktuell.asp?id=0&page=0&sort=0",width:478,height:635},
    DED_Vorhersage: {url:"http://www.wetterkontor.net/de/wetter/deutschland.asp?dayno=0",width:478,height:635},
    DED_PollenbelastungAktuell: {url:"http://www.wetterkontor.net/de/bio/pollenflug_aktuell.asp?p=1",width:478,height:590},
    DED_PollenbelastungVorhersage: {url:"http://www.wetterkontor.net/de/bio/pollenflug_vorhersage.asp?p=1",width:478,height:590},
    DED_UVIndexVorhersage: {url:"http://www.wetterkontor.net/de/bio/uv_aktuell.asp?p=1",width:478,height:590},
    DE_WetterAktuell: {url:"http://www.dwd.de/wundk/wetter/de/Deutschland.jpg",width:558,height:518},
    DE_Vorhersage: {url:"http://www.dwd.de/wundk/wetter/de/Deutschland_morgen_spaet.jpg",width:558,height:518},
    DE_Unwetterwarnung: {url:"http://www.unwetterzentrale.de/images/map/deutschland_index.png",width:572,height:572},
    DE_RegenradarAktuell: {url:"http://www.niederschlagsradar.de/image.ashx",width:568,height:530},
    DE_RegenradarPrognose: {url:"http://www.niederschlagsradar.de/images.aspx?srt=loopvorhersage&jaar=-3&regio=homepage&tijdid=&m=&d=&uhr=&mi=",width:568,height:530},
    EU_AktuellVorhersage: {url:"http://www.wetterkontor.net/de/wetter/welt/europa-0.html",width:478,height:460},
    EU_Unwetterwarnung: {url:"http://www.unwetterzentrale.de/images/map/europe_index.png",width:572,height:572},
    EU_RegenradarAktuell: {url:"http://www.meteox.de/images.aspx?jaar=-3&voor=&soort=loop-bliksem&c=&n=&tijdid=20128241541",width:570,height:570},
    EU_RegenradarPrognose: {url:"http://db.eurad.uni-koeln.de/prognose/data/aktuell/trh_eur_1h_movd1.gif",width:518,height:518},
    WE_WetterAktuell: {url:"http://wetter.faz.net/wetter/wettervorhersage/wetter_welt/?offset=0",width:575,height:380},
    WE_Vorhersage: {url:"http://wetter.faz.net/wetter/wettervorhersage/wetter_welt/?offset=1",width:575,height:380},
    RE_AktuellVorhersage: {url:"http://www.wetterkontor.net/de/wetter/deutschland/brandenburg0.html",width:478,height:635},
    RE_Unwetterwarnung: {url:"http://www.wetterkontor.net/warnungen/land.asp?c=BB",width:700,height:630},
    RE_RegenradarAktuell: {url:"http://www.niederschlagsradar.de/image.ashx?type=regioloop&regio=bln&j=&m=&d=&mi=&uhr=&bliksem=0&voor=&srt=loop1stunde&tijdid=201194154",width:568,height:530},
    RE_RegenradarPrognose: {url:"http://www.wetterkontor.net/de/radar/?r=o",width:478,height:478}
  },
  TOOLBAR: "nav-bar",       // nav-bar - Toolbar, auf der der Button landen soll
  TARGET_BUTTON: "search-container",  // search-container - sollte ein Element auf TOOLBAR sein
  wfthrobber: "http://img.cdn.tl/loading51.gif",  // alternativ z.B. wfthrobber: "chrome://global/skin/media/throbber.png",
  createBtn: function() {
    this.$F(this.TOOLBAR,'\
	<toolbarbutton id="wetterfuchs-toolbarbutton" class="toolbarbutton-1 chromeclass-toolbar-additional" type="menu" label="Wetterfuchs" tooltiptext="Lokale und globale Wetter Infos" \
	ondblclick="if (event.button === 0) { wetterfuchs.openPanel(\'MO_Doppelklick\',event,\'b\')}" \
	onclick="if (event.button === 1) {wetterfuchs.openPanel(\'MO_Mittelklick\',event,\'b\')};if (event.button === 2) {wetterfuchs.openPanel(\'MO_Rechtsklick\',event,\'b\')}" \
	style="list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAD+0lEQVQ4jb3Tf0zUZRwH8LdgEngngitiMVBXcxH4h+lmETndkqVIOYemrewH4ipJmCjmmDLJRmrKBkPgMNYSMYNN3cQ1YoG4ovjpwQEnX+644ziP7/fbHd9z4SnH8+4PxXIWtLX13j7bsz17Xtvz+TwP8H9lfXx02NT62HJd3JHlurgHe9GhYX9/appkx+k31m0JKtEBzzdlLLz08+6FlxcAz9VtCi7JjtNv/NfQ60sXJQJA/VocutVx6I77+9fGbl/fNeG7nu53X355zNu89W5DSkA+AGyIj1o1I1i1KtQglyzn2MUk/+TNYgq1nEIuohg9TuHK56Qtg2PfxftdJ2L4zStzK6azHgOwoDNRf9Q/kEPeqiJ/MwiqZaRSQsqFpOswhSNL0PEeJ9pXsDVBd1IH3ZMA5jyiFSwOWt//2eIfTF+lyt3XjrCvrZjjN0vJsQpSOUbezCQdH5D2N0nrBk6aYun5+nHF+KmusXDJ/JRHwI7UrS9WH05TW1quUZLMorOjlacNp9j/ay7p2kmquyhGd5HOHeTwNgrLq0J0hfPGhyE9BUA0gICHwIq8vNy2tva7DoeDZrOZNTU1rK6uZl1dPc+fr+HF2uOUBw9SKPtJ18fk8FZOGqPYsy34l1Ig9iEwBogs+uLzVpPJRIvFIoxGIxsaGihJEm02G212O43dfaysrKC9L4/05JDOHRTmeKHVzOaVJH1tInRPTHmBGe9v3/NTc/P40NAQrVYrJUni4ODgPcxm4/DwMB0OBzs6Onm2qpAj/bmcdKZTmBbRtD2o80pw4MZ9gB4AkJaWFnHhwoU7qqrS6XSKkZGRB5DL5aIsy1QUhaqq0uVycWBggF1d7aLlx+OcuB4hpMwQaz6w5P4rAVJSUhJ6e3vpdrupKAplWaYkSTSZTJRlmZqm0ev10uv1UtM0jo+P0+fzcXBIFj1nEiekzBDnt0vnffKgfytXrlxWX1/v93g8dLvdtFqt7O7uFhaLhXa7nYqiUNM0appGVVXp8/mE3+/nrdvjrMrY214FJJUBkX8dSkRycvKpsrIy58VLl+5cbW6m0WgUHo+HsizT1NtLVVWpaRodIyNUVDdv+3x0jI6y8I017SeAp7OBuQBmTYEBAGL1ev27EWFhB/ZnZTkbm5rYb77BltZWGsrLRWPTVfaZB1h7tpKGL/ewsqTo992bNnXs0wfvBRD0T19vdjgQFQmkLwkPN2x+aVnbO3ExA6uB2p0vPGX7KOEZxzrgXE402rbMw7nVwOZS4NnpwKkEA4hZByRnAm/lA2tP6HHgaAgOngTW1ABJZ4AV9282awbrz2QBwQVAaCowpxiIMQCLUoE5ecD8t+/17D8l8H7NmD8Aw0h46qvM+RMAAAAASUVORK5CYII=)"\
	>\
		<menupopup id="wetterfuchsmenu">\
			<menu label="DE Wetterdaten">\
				<menupopup id="wetterfuchsdatamenu">\
					<menuitem label="Wetter aktuell" oncommand="wetterfuchs.openPanel(\'DED_WetterAktuell\',event,\'p\')"/>\
					<menuitem label="Vorhersage" oncommand="wetterfuchs.openPanel(\'DED_Vorhersage\',event,\'p\')"/>\
					<menuitem label="Pollenbelastung aktuell" oncommand="wetterfuchs.openPanel(\'DED_PollenbelastungAktuell\',event,\'p\')"/>\
					<menuitem label="Pollenbelastung Vorhersage" oncommand="wetterfuchs.openPanel(\'DED_PollenbelastungVorhersage\',event,\'p\')"/>\
					<menuitem label="UV-Index Vorhersage" oncommand="wetterfuchs.openPanel(\'DED_UVIndexVorhersage\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="DE Wetterkarten">\
				<menupopup id="wetterfuchsDEmapsmenu">\
					<menuitem label="Wetter aktuell" oncommand="wetterfuchs.openPanel(\'DE_WetterAktuell\',event,\'p\')"/>\
					<menuitem label="Vorhersage" oncommand="wetterfuchs.openPanel(\'DE_Vorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'DE_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'DE_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'DE_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="EU Wetter">\
				<menupopup id="wetterfuchsEUmapsmenu">\
					<menuitem label="Aktuell und Vorhersage" oncommand="wetterfuchs.openPanel(\'EU_AktuellVorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'EU_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'EU_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'EU_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="Welt Wetter">\
				<menupopup id="wetterfuchsWEmapsmenu">\
					<menuitem label="Wetter aktuell" oncommand="wetterfuchs.openPanel(\'WE_WetterAktuell\',event,\'p\')"/>\
					<menuitem label="Vorhersage" oncommand="wetterfuchs.openPanel(\'WE_Vorhersage\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="Regionales Wetter">\
				<menupopup id="wetterfuchsRegiomapsmenu">\
					<menuitem label="Aktuell und Vorhersage" oncommand="wetterfuchs.openPanel(\'RE_AktuellVorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'RE_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'RE_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'RE_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
		</menupopup>\
	</toolbarbutton>'
    );
    var mywfButton = document.getElementById('wetterfuchs-toolbarbutton');
    document.getElementById(this.TOOLBAR).insertBefore(mywfButton, document.getElementById(this.TARGET_BUTTON));
  },
  init: function() {
    this.createBtn();
    this.$F('mainPopupSet','\
		<panel id="wetterfuchs-panel" noautohide="false" type="arrow" onpopuphiding="wetterfuchs.clearPanel()" onmousedown="if (event.button === 1) {wetterfuchs.openUrlFromPanel()}">\
			<vbox>\
				<iframe flex="1" id="wetterfuchs-iframe" src="' + this.wfthrobber + '" />\
			</vbox>\
		</panel>'
    );
  },
  myEventhandler: function (e,toDo) {
    switch (toDo) {
     case "p":
      e.preventDefault();
      break;
     case "s":
      e.stopPropagation();
      break;
     case "b":
      e.preventDefault();
      e.stopPropagation();
      break;
    }
  },
  clearPanel: function() {
    myiframe = document.getElementById("wetterfuchs-iframe");
    myiframe.parentNode.width = 146;
    myiframe.parentNode.height = 146;
    myiframe.setAttribute("src",this.wfthrobber);
  },
  openUrlFromPanel: function() {
    getBrowser().selectedTab = getBrowser().addTab(document.getElementById("wetterfuchs-iframe").getAttribute("src"));
    document.getElementById("wetterfuchs-panel").hidePopup();
  },
  openPanel: function(bezeichner,e,toDo) {
    this.myEventhandler(e,toDo);
    mymenu = document.getElementById("wetterfuchsmenu");
    if (mymenu.state === "open" && e.button !== 0) return;
    mymenu.hidePopup();
    myiframe = document.getElementById("wetterfuchs-iframe");
    myiframe.parentNode.width = this.urlobj[bezeichner]["width"];
    myiframe.parentNode.height = this.urlobj[bezeichner]["height"];
    myiframe.setAttribute("src",this.urlobj[bezeichner]["url"]);
    mypanel = document.getElementById("wetterfuchs-panel");
    mypanel.openPopup(document.getElementById("wetterfuchs-toolbarbutton"));
  },
  $F: function (zId,sXml) {
    var range = document.createRange();
    range.selectNodeContents(document.getElementById(zId));
    range.collapse(false);
    range.insertNode(range.createContextualFragment(sXml.replace(/\n|\t/g, '')));
    range.detach();
  }
};

wetterfuchs.init();
