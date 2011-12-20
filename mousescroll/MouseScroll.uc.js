(function(){
    // Beginn der Einstellungen
    var speed = 1;//Standard Geschwindigkeit
    var isShowIndicator =true;//Aktivierung der Funktion mit der rechten Maustaste
    var imageHeight = 35;//px Abstand zwischen "Hoch" und "Runter"
    //Ende der Einstellungen

    var toTopImage = "Hoch";
    var toBottomImage = "Runter";  

    var scrollMode = 0;
    var scrollStartSWTM = -1;    
    var mouseLeftDown = false;    
   var nav=false;
    function hideIndicator() {
        var document = window.content.document;
        if(document.body instanceof HTMLFrameSetElement) {
            document = window.content.frames[0].document;
        }
        var topIndicator = document.getElementById("topIndicator");
        if(topIndicator) {
            topIndicator.style.display = "none";
        }
        var bottomIndicator = document.getElementById("bottomIndicator");
        if(bottomIndicator) {
            bottomIndicator.style.display = "none";
        }
    }

    function showIndicator() {
        var document = window.content.document;
        if(document.body instanceof HTMLFrameSetElement) {
            document = window.content.frames[0].document;
        }
        var topIndicator = document.getElementById("topIndicator");
        if(!topIndicator) {
            topIndicator = document.createElement("div");
            topIndicator.setAttribute("id", "topIndicator");
            topIndicator.innerHTML        = "<a style='height:"+imageHeight+"px;text-decoration:none;font-size:30px' href='javascript:void(0);'>" + toTopImage + '</a>';
            topIndicator.addEventListener("mouseover", function(e) {document.defaultView.scrollTo(0,0);}, false);
            topIndicator.style.position   = 'fixed';
            topIndicator.style.right = 0;
            topIndicator.style.zIndex     = '10005';
            topIndicator.style.display = "none";
            document.body.appendChild(topIndicator); 
        }
        var bottomIndicator = document.getElementById("bottomIndicator");
        if(!bottomIndicator) {
            bottomIndicator = document.createElement("div");
            bottomIndicator.setAttribute("id", "bottomIndicator");
            bottomIndicator.innerHTML        = "<a style='height:"+imageHeight+"px;text-decoration:none;font-size:30px' href='javascript:void(0);'>" + toBottomImage + '</a>';
            bottomIndicator.addEventListener("mouseover", function(e) {document.defaultView.scrollTo(0,document.defaultView.scrollMaxY);}, false);
            bottomIndicator.style.position   = 'fixed';
            bottomIndicator.style.right = 0;
            bottomIndicator.style.zIndex     = '10005';
            bottomIndicator.style.display = "none";
            document.body.appendChild(bottomIndicator); 
        }
        }
    
    function mouseScroll(event) {
        if (scrollStartSWTM != -1){
            var document = window.content.document;
            if(document.body instanceof HTMLFrameSetElement) {
                document = window.content.frames[0].document;
            } 
            var factor = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) / window.content.innerHeight;                        
            var delta = speed*factor*(event.screenY - scrollStartSWTM);
            document.body.scrollTop += delta;
            document.documentElement.scrollTop += delta;
        }
        scrollStartSWTM = event.screenY;
    }

    function startScroll() {
        scrollMode = 1;
        if (isShowIndicator) { showIndicator();  }
        window.addEventListener('mousemove', mouseScroll, true);
    }

    function stopScroll() {
        scrollMode = 0;
        scrollStartSWTM = -1;
        if(isShowIndicator) {  hideIndicator();   }
        window.removeEventListener('mousemove', mouseScroll, true);
    }

    window.addEventListener("mousedown", function(e) {
        if(e.button == 0) {
            mouseLeftDown = true;
            if(scrollMode) {stopScroll(); } }
                else if(e.button == 2) {
            if(scrollMode){
               if(isShowIndicator) {
                   var document = window.content.document;
                   var topIndicator = document.getElementById("topIndicator");
                   if(topIndicator) {
                       topIndicator.style.top = (e.clientY - imageHeight/2) + 'px';
                       topIndicator.style.right = (document.documentElement.clientWidth - e.clientX) + 'px'; }
                   var bottomIndicator = document.getElementById("bottomIndicator");
                   if(bottomIndicator) {
                       bottomIndicator.style.top = (e.clientY + imageHeight/2) + 'px';
                       bottomIndicator.style.right = (document.documentElement.clientWidth - e.clientX) + 'px'; }
                   topIndicator.style.display = "block";
                   bottomIndicator.style.display = "block";
               } } }
    }, true);
        
    window.addEventListener("mousemove", function(e)  {
        var navbar= document.getElementById('navigator-toolbox');        
                if (!nav&&e.clientX > window.content.document.documentElement.clientWidth&& e.clientX < window.content.document.documentElement.clientWidth+15){ 
                    startScroll(); 
                }
                        },false);
                        
    var suppressContext = false;
    window.addEventListener("mouseup", function(e) {
        if(e.button == 0) {
            mouseLeftDown = false;
        } else
        if(e.button == 2) {
            if(scrollMode&&isShowIndicator) {
                suppressContext = true;            
            }
        }
    }, true);

    window.addEventListener("contextmenu", function(e) {
        if(suppressContext) {
            suppressContext = false;
            e.preventDefault();
            e.stopPropagation();
        }
    }, false); 
        
        var titlebar=document.getElementById('titlebar');
        var navbar= document.getElementById('navigator-toolbox');
        var sidebar= document.getElementById('sidebar-box');
		var addonbar= document.getElementById('browser-bottombox');
    titlebar.addEventListener("mouseover", function(e)  {
        nav=true;},true);
        navbar.addEventListener("mouseover", function(e)  {
        nav=true;
        stopScroll()},true);        
        navbar.addEventListener("mouseout",function(e)  {
        nav=false;},true);
        sidebar.addEventListener("mouseover", function(e)  {
        stopScroll()},true);
		addonbar.addEventListener("mouseout",function(e)  {
        stopScroll()},true);
})();