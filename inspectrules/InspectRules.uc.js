// ==UserScript==
// @name           Inspect Rules
// @description    要素のCSSルールのファイルを開く
// @include        main
// @version        1.0
// @charset        utf-8
// ==/UserScript==

(function(){
  const kXULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  const DOMUtils = Components.classes["@mozilla.org/inspector/dom-utils;1"]
                             .getService(Components.interfaces.inIDOMUtils);

  let menu = document.createElementNS(kXULNS, "menu");
  menu.setAttribute("id", "inspect-rules");
  menu.setAttribute("label", "CSS Regel");
  let popup = document.createElementNS(kXULNS, "menupopup");
  popup.setAttribute("id", "Inspect-rules-menu");
  let norules = document.createElementNS(kXULNS, "menuitem");
  norules.setAttribute("id", "inspect-no-rules");
  norules.setAttribute("label", "Keine Regel");
  norules.setAttribute("disabled", "true");
  popup.appendChild(norules);
  popup.addEventListener("popupshowing", function(){
    for(let i = this.childNodes.length - 1; i >= 1; i--){
      this.removeChild(this.childNodes[i]);
    }

    let rules = DOMUtils.getCSSStyleRules(gContextMenu.target);
    let count = rules.Count();
    norules.setAttribute("hidden", count > 0);

    for(let i = 0; i < count; i++){
      let rule = rules.GetElementAt(i);
      let uri = rule.parentStyleSheet && rule.parentStyleSheet.href;
      let lineNumber = (rule.type == CSSRule.STYLE_RULE) ? DOMUtils.getRuleLine(rule)
                                                         : null;
      let menuitem = document.createElementNS(kXULNS, "menuitem");
      menuitem.setAttribute("label", rule.selectorText);
      menuitem.setAttribute("tooltiptext", (uri.length > 200 ? uri.substr(0, 200) +
        "..." : uri) + "#" + lineNumber);
      menuitem.addEventListener("command", function(){
        gViewSourceUtils.viewSource(uri, null, null, lineNumber);
      }, false);
      popup.appendChild(menuitem);
    }
  }, false);
  menu.appendChild(popup);
  var zEle=document.getElementById("contentAreaContextMenu");
  if (zEle !=null) {
    zEle.insertBefore(menu,
      document.getElementById("context-inspect").nextSibling);
  }
})();
