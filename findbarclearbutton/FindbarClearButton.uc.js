// ==UserScript==
// @name                  FindbarClearButton.uc.js
// @namespace        FindbarClearButton@iwo.uc.js
// @description        清空查找栏按钮
// @include               main
// @compatibility     Firefox 4.0+
// @author                iwo
// @homepage        http://g.mozest.com/thread-42587-1-1
// @version              0.0.1.1
// @note                   2012.10.26 initiate release
// @note                   Special thanks to Alice0775 & Joji Ikeda for creative splendid ideas      
// @note                   build graggable Fx button reference thread: http://blog.bitcp.com/archives/452
// @updateURL     https://j.mozest.com/ucscript/script/85.meta.js
// @icon          http://j.mozest.com/images/uploads/icons/000/00/00/403f7f66-1d69-a531-75b0-9fe74c6811d0.jpg
// @screenshot    http://j.mozest.com/images/uploads/previews/000/00/00/1b06a7a1-a251-abe6-4dc5-0a006218da72.jpg http://j.mozest.com/images/uploads/previews/000/00/00/thumb-1b06a7a1-a251-abe6-4dc5-0a006218da72.jpg
// ==/UserScript==

/* :::: 清空查找栏按钮 :::: */

(function ClearFindbarButton() {
			var refNode = document.getAnonymousElementByAttribute(gFindBar, 'anonid', 'find-next');
			if (!refNode) return;
			
			const locale = (Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch).getCharPref("general.useragent.locale")).indexOf("zh")==-1;


			var ClearFindbarBtn = document.createElement("toolbarbutton");

			ClearFindbarBtn.setAttribute("id", "clearFindbar-button");
			ClearFindbarBtn.setAttribute("type", "button");
			ClearFindbarBtn.setAttribute("class", "toolbarbutton-1");
			ClearFindbarBtn.setAttribute("oncommand", "clearFindbarTweak.onCommand(event);");
			ClearFindbarBtn.setAttribute("tooltiptext", locale?"Suchleiste löschen":"\u6E05\u7A7A\u67E5\u627E\u680F");//提示工具条

			ClearFindbarBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gUaERUFpcy2xQAAAs9JREFUeNqVkj1sW2UUhp/vu9/19bWvHSl2f6KW/LTYiZtCMGoiNYhIBXVArVphsbSiDLQsbXc2NlZWEBJI3ejCRCaEBOqPOgBKKldp1JLIdrix47hthH8Sx/f7GG4wA0PDWY7Okc6j9z16Bf+jIt9EMpl05ttzJ84NHk8f/7yu6j8+bD5sWPsmfM1AKpH67NLkpcKVzJUDylVnS5RG1+PrvtoX4CssacvL08PTHxZGC3jCo0kz2Yq0LrdoBfuCJHeTZ1OvpG5emLwQc6IOZcpUqODjiyrVxEshH1//ZGKx+/uNk7mTmVgiJlZZpUaNFVYomRLloIy4fevLVHdn+0Sr1UyFZwIhQErJVuOFt9Hsvi9j7nv6UOAm3k2gRhS+4/NYPqa4XTT13+rfq7iX/GL6rXc+woAxBgQIIYj0Aip37/FrucLkmTNIIXgw/4Bqqoqf91kbWmOrstXNbeU2VS8IJtIHh4AQYozBaI1z7y7ez7/wYnycP548YXhkhNmZWZaXl3F+cAgGA6Zendq99sa1dWUCTRAEfQCALJWIfHcbd2qKuUKB4uIiSwsLPLdtnGiUw/HDZKNZZsdn42OHxnpKa02v1+sDANT9+1ieB+fPE7Nt3hwYYMxxWHn6lIVOh8SRI8y8PcfowdFdx3KM0jpUorXGGBP+Y2cHslnodmFjA+X7HHj2jMFqldd8H/J5ItlMy3IcBQiljaHX6/UtCSFop9PE5+ex2m1EMgmNBqyuYlUqxE6dgosXIZGI7QnXyphQyT8QKSXt06epuy7JO3eIFotYnQ5sbsLwMFy9CkePhlkIa0gZTN8OgNYaYVl0Z2Z4nsvhPXqEu7SEFY9jzc0h8vn/BFJ1O9vtem19DxLakdJCKYVlSf7KjWNnjmG7MWzPQ/prCPEvIBp1O6pe+/PTzZ9qH+ggcPcCixASIcLkhj2cZbjo+1DKbkxMvn7rb3caLimXY/cAAAAAAElFTkSuQmCC)";
			
			refNode.parentNode.insertBefore(ClearFindbarBtn, refNode);
			
			// Some codes are from Findbar Basics extension - CatThief - www.tom-cat.com/mozilla. Thanks.
			// Clear button.
			clearFindbarTweak = {
				onCommand: function(event) {
					var findBar = document.getElementById('FindToolbar');
					var findField = document.getElementById('FindToolbar').getElement('findbar-textbox');
					var highlightBtn = findBar.getElement("highlight");
					
					if (findBar.hidden == false) {
						findField.focus();
						findField.select();
						//NG unfortunately
						//goDoCommand('cmd_delete');
						findField.value = "";
						//uncomment below to reuse the code for disable Highlight simultaneously
						//if (findBar.toggleHighlight) {
						//	findBar.toggleHighlight(false);
						//	highlightBtn.removeAttribute("checked");
						//}
					}
					else return;
				}
			}
			
})();