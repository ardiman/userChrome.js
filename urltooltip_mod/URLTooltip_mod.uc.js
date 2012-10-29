	/**
	 * 010.02/10 01 ver1_kai1
	 * "chaika","127.0.0.1"が含まれるリンクは処理しない
	 */
(function(){
  var popup = document.getElementById('mainPopupSet').appendChild(document.createElement('tooltip'));
  popup.setAttribute('id', 'ChromePopup');
  var label = popup.appendChild(document.createElement('hbox')).appendChild(document.createElement('label'));
  label.setAttribute('id', 'ChromeStatusbar');
  gBrowser.mPanelContainer.addEventListener('mouseover', function(e){
    var elem = e.target;
	var href = String(document.getElementById('statusbar-display').getAttribute('label'));
    do {
      if ( !elem.hasAttribute) continue;
	      if ( elem.hasAttribute('href')){
			if (href.match(/^chaika/)) {
			} else if (href.match("127.0.0.1")) {
			} else
			{
				document.getElementById('ChromeStatusbar').setAttribute('value', document.getElementById('statusbar-display').getAttribute('label'));
				document.getElementById('ChromePopup').openPopup(null, "",e.clientX, e.clientY+30, false, true);
				break;
			}
	      }
    } while ( elem = elem.parentNode );
  },false);
  gBrowser.mPanelContainer.addEventListener('mouseout', function(e){
    document.getElementById('ChromePopup').hidePopup();
  },false);
  document.insertBefore(document.createProcessingInstruction(
  'xml-stylesheet',
  'type="text/css" href="data:text/css,' + encodeURI(
  <![CDATA[
    #ChromePopup{
      -moz-appearance:none!important;
      color: black !important;
      background-color: rgba(255,255,224,1.0) !important;
      font-size: 1em !important;
      max-width: 500px !important;
      white-space: normal;
  ]]>.toString()
  ) + '"'), document.documentElement);
})();