// ==UserScript==
// @name          Contexpector
// @namespace     http://www.mozilla.org/MPL/
// @description   Right click anywhere to DOMInspect the element.
// @include       *
// @exclude       chrome://global/content/alerts/alert.xul
// @exclude       chrome://global/content/commonDialog.xul
// @exclude       javascript:*
// @compatibility 3.5+
// @author        LouCypher Alice0775 satyr
// ==/UserScript==
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Element Inspector script for userChrome.js
 *
 * The Initial Developer of the Original Code is LouCypher.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s)
 *  LouCypher <loucypher.moz@gmail.com>
 *  Alice0775
 *  satyr <murky.satyr@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
!function Contexpector(){
  function MenuItem(parent, attrs){
    var mi = document.createElement("menuitem");
    for(let key in attrs) mi.setAttribute(key, attrs[key]);
    mi.setAttribute(
      "onclick",
      "if(event.button == 1){ " +
      attrs.oncommand.replace("DOMDocument", "Object") +
      " } parentNode.hidePopup()");
    return parent.appendChild(mi);
  }
  function addMenuitem(popup, index){
    if (popup.id == "backForwardMenu") return;
    var id = "context-inspector";
    if(index != null){
      id += "-" + index;
      popup.appendChild(document.createElement("menuseparator"))
        .id = id + "-separator";
    }
    MenuItem(popup, {
      id: id,
      label: (popup.id == "contentAreaContextMenu"
              ? "DOMInspect Element"
              : "DOMInspect Chrome Element"),
      accesskey: "E",
      oncommand: (
        "Components.classes['@mozilla.org/appshell/window-mediator;1']"+
        ".getService(Components.interfaces.nsIWindowMediator)"+
        ".getMostRecentWindow('navigator:browser')"+
        ".inspectDOMDocument(document._contexpected)"),
    });
  }
  Array.forEach(
    document.querySelectorAll("popupset > menupopup, popupset > popup"),
    addMenuitem);

  var newPopup = document.createElement("menupopup");
  addMenuitem(newPopup);
  var mainPS = document.getElementById("mainPopupSet");
  if (!mainPS) {
    mainPS = document.createElement("popupset");
    mainPS.id = "mainPopupSet";
    document.documentElement.appendChild(mainPS);
  };
  document.documentElement.setAttribute(
    "context",
    mainPS.appendChild(newPopup).id = "chrome-inspector-popup");
  // Fx3.6 / Stylish 1.0+ statusbar icon
  newPopup.setAttribute(
    "onpopupshowing",
    "var it = document._contexpected;" +
    "return !(it instanceof HTMLElement) && it.id != 'stylish-panel'");

  var tabContextMenu = document.getElementById('tabContextMenu') || (
    self.gBrowser &&
    document.getAnonymousElementByAttribute(
      gBrowser, "anonid", "tabContextMenu"));
  if(tabContextMenu){
    tabContextMenu.appendChild(document.createElement("menuseparator"))
      .id = "tab-inspector-separator";
    MenuItem(tabContextMenu, {
      id: "tab-inspector",
      label: "DOMInspect Document",
      accesskey: "D",
      oncommand: (
        "inspectDOMDocument(gBrowser.selectedTab.localName == 'tabs'" +
        " ? gBrowser" +
        " : gBrowser.selectedTab.linkedBrowser.contentDocument)"),
    });
    MenuItem(tabContextMenu, {
      id: "tab-inspector2",
      label: "DOMInspect Chrome Element",
      accesskey: "E",
      oncommand: "inspectDOMDocument(document._contexpected)",
    });
  }

  document.addEventListener("click", function noteElement(ev) {
    if (ev.button == 2) this._contexpected = ev.target;
  }, false);
}()
