UICopy = {

  // configure...
  mouseButton: 2,
  ctrlKey: false,
  separator: " \u2013 ",
  flashColor: "yellow",
  flashTime: 200,

  // private:
  sofar: "",

  click: function (event) {
    if (event.button != UICopy.mouseButton) return
    if (UICopy.ctrlKey && !event.ctrlKey) return

    var elem = event.target
    var pcl = elem.ownerDocument.location.protocol
    if (pcl == "mailbox:" || pcl == "view-source:") return

    var text = UICopy.extract(elem)
    if (!text) {
      elem = event.originalTarget
      text = UICopy.extract(elem)
      }
    if (!text) return

    if (event.shiftKey) {
      if (UICopy.sofar) UICopy.sofar += UICopy.separator
      UICopy.sofar += text
      text = UICopy.sofar
      }
    else {
      if (elem.localName == "menuitem" || elem.localName == "menu") {
        var menu = elem.parentNode.parentNode
        while (menu.localName == "menu") {
          text = menu.getAttribute("label") + UICopy.separator + text
          menu = menu.parentNode.parentNode
          }
        }
      UICopy.sofar = text
      }

    Components
      .classes["@mozilla.org/widget/clipboardhelper;1"]
      .getService(Components.interfaces.nsIClipboardHelper)
      .copyString(text)

    if (elem.localName == "treechildren") return

    var nodes = elem.ownerDocument.getAnonymousNodes(elem)
    for each (var node in nodes) {
       if (node.localName == "label") {
        elem = node
        break
        }
      }

    var was = elem.style.color
    elem.style.color = UICopy.flashColor
    setTimeout(UICopy.clear, UICopy.flashTime, elem, was)
    },

  clear: function (elem, was) {
    elem.style.color = was
    },

  extract: function (elem) {
    var tag = elem.localName
    if (tag == "prefwindow" || tag == "wizard" || tag == "dialog") return ""
    if ((elem.localName == "label" || elem.localName == "description")
      && elem.textContent) return elem.textContent
    if (elem.firstChild && elem.firstChild.nodeType == 3)
      return elem.firstChild.nodeValue
    if (elem.hasAttribute("label")) return elem.getAttribute("label")
    if (elem.hasAttribute("value")) return elem.getAttribute("value")
    if (elem.hasAttribute("title")) return elem.getAttribute("title")
    if (elem.localName == "treechildren") {
      var min = {}, tree = elem.parentNode
      tree.view.selection.getRangeAt(0, min, {});
      return tree.view.getCellText(min.value, tree.columns[0])
      }
    return ""
    },

  load: function (win) {
    win.addEventListener("click", UICopy.click, true)
    },

  observe: function (win, act) {
    if (act = "domwindowopened")
      win.QueryInterface(Components.interfaces.nsIDOMEventTarget)
        .addEventListener(
          "load",
          function () {UICopy.load(
            win.QueryInterface(Components.interfaces.nsIDOMWindow))},
          false
          )
    }

  }


UICopy.load(self)

Components
  .classes["@mozilla.org/embedcomp/window-watcher;1"]
  .getService(Components.interfaces.nsIWindowWatcher)
  .registerNotification(UICopy)