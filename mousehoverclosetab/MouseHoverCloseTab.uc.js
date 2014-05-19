// close tab by hovering over close button
(function(){

let delay = 500 ;//Zeitintervall

let ttb = document.getElementById('TabsToolbar');
if(!ttb)return;
let searchTabParent = function(node){
	let node = node.parentElement;
	if(null===node){
		return null;
	}else if('tab'===node.nodeName){
		return node;
	}else{
		return searchTabParent(node);
	}
};
let listener = function(event){
	let target = event.originalTarget,
		className = target.getAttribute('class');
	if(className.indexOf('tab-close-button')!== -1 || className.indexOf('tabs-closebutton')!== -1){
		//ttb.removeEventListener('mouseover', listener, false);
		let timeoutID = setTimeout(function(){
			let tab = searchTabParent(target);
			tab?gBrowser.removeTab(tab):BrowserCloseTabOrWindow();
			//fn();
		}, delay);
		target.addEventListener('mouseout', function(){
			(typeof(timeoutID)!=='undefined')&&clearTimeout(timeoutID);
			//fn();
		}, false);
	}
};
let fn = function(){
	ttb.addEventListener('mouseover', listener, false);
};
fn();

})();