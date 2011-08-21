//==========================================================
//Auto Copy
//==========================================================

var gautocopy_lastSelection = null;
var gautocopy_clipboardcontents = new Array();

window.addEventListener("load",function() {initAutoCopyStatus();} ,false);

window.addEventListener("mouseup", autocopyOnMouseUp ,false);
window.addEventListener("keyup", autocopy_onKeyUpCheck ,false);



function AutocopyClipboardContents(adataType, adata, adataLength)
{
	this.dataType = adataType;
	this.data = adata;
	this.dataLength = adataLength;
}



function initAutoCopyStatus() 
{
	document.getElementById("cmd_selectAll").setAttribute("oncommand", "goDoCommand('cmd_selectAll'); AutocopySelectAll();");

	 	var strings = document.getElementById("autocopyStrings");
	var str = Components.classes[ "@mozilla.org/supports-string;1" ].createInstance( Components.interfaces.nsISupportsString );
}


function autocopy_onKeyUpCheck(e)
{
	if(e.keyCode == e.DOM_VK_A && e.ctrlKey)
	{
		autocopyOnMouseUp(e);
	}
}


function autocopyOnMouseUp(e)
{
	 if ((!e.ctrlKey) || (e.keyCode))
	 {
	var targetclassname = e.target.toString();
	if(!targetclassname.match(/SelectElement|OptionElement/i))
	{
		if(!Autocopy_isTargetEditable(e.target))
		{
			if((autocopy_getSelection().length > 0) && (gautocopy_lastSelection != autocopy_getSelection()))
			{
				//were going to copy
				gautocopy_lastSelection = autocopy_getSelection();
				autocopy_saveclipboard();
				goDoCommand('cmd_copy');
			}
		}
	}
	 }
}


function AutocopySelectAll()
{
	var targetclassname = "";
	if(document.commandDispatcher.focusedElement)
	{	
		targetclassname = document.commandDispatcher.focusedElement.toString();
	}
	if(!targetclassname.match(/SelectElement|OptionElement/i))
	{
		if(!Autocopy_isTargetEditableDispatcher(document.commandDispatcher))
		{
			if(autocopy_getSelection().length > 0)
			{
				//were going to copy
				gautocopy_lastSelection = autocopy_getSelection();
				autocopy_saveclipboard();
				goDoCommand('cmd_copy');
			}
		}
	}
}



function Autocopy_isTargetEditable(target)
{
	if(target)
	{
		if(target.toString().match(/InputElement|TextAreaElement/i))
		{
			return true;
		} 
	}

	if(target)
	{
		if(target.textbox)
		{
			return true;
		} 
	}

	if(target)
	{
		if(target.toString().match(/object XUL/i))
		{
//			if(target.textbox.value)
//			{
				return true;
//			}
		} 
	}

	if(target.ownerDocument!=null)
	{
		if(target.ownerDocument.designMode)
		{
			if(target.ownerDocument.designMode.match(/on/i))
			{
				return true;
			}
		}
	}
	return false;
}

function Autocopy_isTargetEditableDispatcher(commandDispatcher)
{
	if(commandDispatcher.focusedElement)
	{
		if(commandDispatcher.focusedElement.toString().match(/InputElement|TextAreaElement/i))
		{
			return true;
		}
	}
	else
	{
		if(commandDispatcher.focusedWindow.document.designMode)
		{
			if(commandDispatcher.focusedWindow.document.designMode.match(/on/i))
			{
				return true;
			}
		}
	}

	return false;
}


function autocopy_getSelection() 
{
	var SelectionText = "";
	var trywindow = false;
	
	var focusedElement = document.commandDispatcher.focusedElement;
	if(focusedElement && null != focusedElement)
	{
		try
		{
			SelectionText = focusedElement.value.substring(focusedElement.selectionStart, focusedElement.selectionEnd);
		}
		catch(e)
		{
			trywindow = true;
		}
	}
	else
	{
		trywindow = true;
	}
	
	if(trywindow)
	{
		var focusedWindow = document.commandDispatcher.focusedWindow;
		try
		{
			var winWrapper = new XPCNativeWrapper(focusedWindow, 'document', 'getSelection()');
			var Selection = winWrapper.getSelection();
		}
		catch(e)
		{
			var Selection = focusedWindow.getSelection();
		}
		if (Selection!=null) SelectionText = Selection.toString();

	}
	return SelectionText;
}

function autocopy_saveclipboard()
{
	var clip = Components.classes["@mozilla.org/widget/clipboard;1"].
						 getService(Components.interfaces.nsIClipboard);
	if (!clip) return false;

	var trans = Components.classes["@mozilla.org/widget/transferable;1"].
							createInstance(Components.interfaces.nsITransferable);
	if (!trans) return false;

	var importflavors = trans.flavorsTransferableCanImport();	
	var exportflavors = trans.flavorsTransferableCanExport();	

	trans.addDataFlavor("text/unicode");

	clip.getData(trans,clip.kGlobalClipboard);

	var dataType = new Object();
	var data = new Object();
	var dataLength = new Object();

	try{
		trans.getAnyTransferData(dataType, data, dataLength);
	}
	catch(e){	
		return false;
	}

	var autocopy_clipboardcontents = new AutocopyClipboardContents(dataType, data, dataLength);
	gautocopy_clipboardcontents.unshift(autocopy_clipboardcontents); //adds to the begining of array
	if(gautocopy_clipboardcontents.length > 10 + 1)  
	{
		gautocopy_clipboardcontents.pop();	//remove last one if length to long
	}

	return true;
}

