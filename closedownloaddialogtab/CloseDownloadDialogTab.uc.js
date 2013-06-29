// ==UserScript==
// @include        main
// ==/UserScript==
	eval("gBrowser.mTabProgressListener = " + gBrowser.mTabProgressListener.toString().replace(/(?=var location)/, '\
      if (aWebProgress.DOMWindow.document.documentURI == "chrome://mozapps/content/downloads/downloads.xul"\
          && aRequest.QueryInterface(nsIChannel).URI.spec != "chrome://mozapps/content/downloads/downloads.xul") {\
        aWebProgress.DOMWindow.setTimeout(function() {\
          !aWebProgress.isLoadingDocument && aWebProgress.DOMWindow.close();\
        }, 100);\
      }\
    '));