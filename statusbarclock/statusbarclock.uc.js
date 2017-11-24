function doDatClockCallback() { try{ doDatClock(); } catch(ex){} }

function doDatClock() {
	var options = { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric', 
		hour: '2-digit', 
		minute: '2-digit', 
		second: '2-digit' 
	};
	
	var timestr = new Date().toLocaleDateString('de-DE',options);

	var ua = window.navigator.userAgent;
	var FFstr = ua.split(' ');
	var FF = FFstr[FFstr.length-1].replace( '/' , ' ' );
	
	var text = FF + ' ';

	var agent = document.getElementById('statusbar-agent-display');
	agent.setAttribute( 'value', text );
	
	var status = document.getElementById('statusbar-clock-display');
	status.setAttribute( 'value', timestr );
	
	window.setTimeout(doDatClockCallback, 1000);	
}

var css = 'padding-top: 4px !important; padding-left: 5px; color: yellow; font-weight: 700; text-shadow: none;';


var ClockStatus = document.getElementById('helpMenu');

var AgentLabel = document.createElement('label');
AgentLabel.setAttribute('id', 'statusbar-agent-display');
AgentLabel.setAttribute('class', 'statusbarpanel-text');
AgentLabel.setAttribute('style', css);

var ClockLabel = document.createElement('label');
ClockLabel.setAttribute('id', 'statusbar-clock-display');
ClockLabel.setAttribute('class', 'statusbarpanel-text');
ClockLabel.setAttribute('style', css);	

ClockStatus.parentNode.insertBefore(ClockLabel, ClockStatus.nextSibling);
ClockStatus.parentNode.insertBefore(AgentLabel, ClockStatus.nextSibling);

doDatClock();
