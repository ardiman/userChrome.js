location=="chrome://browser/content/browser.xul"&&window.addEventListener("keyup",function(e){e.keyCode==46&&content.getSelection().toString()&&content.getSelection().deleteFromDocument(0)},0)
