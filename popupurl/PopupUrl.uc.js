    // ==UserScript==
    // @name          PopUpUrl
    // @description   Mouse on a hyperlink to display link information, to solve the problem of stitching invalid page
    // @include       *
    // ==/UserScript==

    (function (){
      document.addEventListener('mouseover',function(e){
        if(e.target.nodeName.toLowerCase() == 'a'){
          curLink = e.target;
        } else if(e.target.nodeName.toLowerCase() == 'img'){
          curLink = e.target.parentNode;
        }
       
        if (curLink.title.indexOf("http") == -1 && curLink.href.indexOf('/') > -1){
          if (curLink.title == ''){
            curLink.title = curLink.href;
          } else {
            curLink.title = curLink.title + ' ' + curLink.href;
          }
        }  
      },false);
    })();