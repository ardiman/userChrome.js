    //   Feed Button  0.5
       
    (function () {

       if (location != 'chrome://browser/content/browser.xul') return;
       
       const buttonLabel = 'RSS Button für Adressleiste';
       const buttonTooltiptext = 'RSS Button für Adressleiste';
       const buttonIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhNJREFUeNqkk9%2BLjGEUxz%2FPM%2B80Q1rmiqstm0K7dlOSRjbFBSGsK1ruiMTFti6sP0AoN4rcSO2FCyWxS42EMrhZrB9xMS0mwtXKMjtr5n1f53nPzPtOflzI6T095%2Bn9nu%2F5nvM8jwnDkImBnmLg%2B3lCH2SvZuQzupIsGhusTX3pOD2e89w%2B8Ov5Res2wsy02yjIWnGvxW2DRQpYQ6lwfZ6DRQRRUq4d1hxOqlQmoXQPXo7A24eQngUpgYcBrN6na0zgVAc1uHxA4jpk26BzK3RvU58sw%2FAuLeTU1GfiVr1mT4Q%2F4N19AQXK%2BPqGxuuPwYo9sFf2F7aAL7hgOh5KoqBegcHnSQsfJX5wFu6egM8vYNNJ6B%2BGi9sFW41hXjJhkTc6ID%2BlwuINsGQz7DgnBMdh%2FBI86Ybl%2FbBwlUArMYGNz8j1%2FuERvJeB3RqC83np%2FQ2sPQodvVA8pdCenVLke0N2TNBooVPkHRyDQ89gqSi4slv%2FrdwvWtNQLsKCZaKg2sxvELiJBt%2FkeI4kM%2BgdUmDpJszvEgLpdqIAmbmCr%2F6phRq%2FWSYjd%2BC2xmlPVarcXwjcMXriY2eSZBdn5wjJ7AZZVj3KEsXGtpyCTclPCT%2FdgWsFBaWk5za5rVOvYKRP4hx8lXi0T4ltC0EtNOXS1cft0cVpPiZj%2BKvJWwitnYpg7jUaY7qcSP7NfMl9GhH8j%2F0UYAByQLfCOoz1CQAAAABJRU5ErkJggg%3D%3D)';   
       
       var feedButton = document.getElementById('feed-button');
       if (!feedButton) {
         window.CustomizableUI.addWidgetToArea('feed-button','nav-bar');
         feedButton = document.getElementById('feed-button');
       };
       feedButton.setAttribute('label', buttonLabel);
       feedButton.setAttribute('tooltiptext', buttonTooltiptext);
       feedButton.style.listStyleImage = buttonIcon;
       feedButton.style.MozImageRegion = 'rect(0px 0px 0px 0px)';

       var urlbarIcons = document.getElementById('urlbar-icons');
       urlbarIcons.appendChild(feedButton);      
       
       var css = '#feed-button .toolbarbutton-icon {padding: 0px !important; margin-bottom: -2px!important;} #feed-button {margin-top: -6px !important; margin-bottom: -6px !important;} #feed-button[disabled]{display: none !important;}';
       var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
       document.insertBefore(stylesheet, document.documentElement);   
       
    }) ();