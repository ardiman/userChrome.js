(function(){
var keymap = {//各项键值
'8':'backspace','9':'tab','12':'tenkey5','13':'enter','16':'shift','17':'ctrl','18':'alt',
'19':'pausebreak','20':'shift+capslock','27':'esc','32':'space',
'33':'pageup','34':'pagedown','35':'end','36':'home',
'37':'left','38':'up','39':'right','40':'down','45':'insert','46':'delete',
'48':'0','49':'1','50':'2','51':'3','52':'4','53':'5','54':'6','55':'7','56':'8','57':'9','59':':','61':';',
'65':'a','66':'b','67':'c','68':'d','69':'e','70':'f','71':'g','72':'h','73':'i',
'74':'j','75':'k','76':'l','77':'m','78':'n','79':'o','80':'p','81':'q','82':'r',
'83':'s','84':'t','85':'u','86':'v','87':'w','88':'x','89':'y','90':'z',
'91':'leftwindows','92':'rightwindows',
'96':'0','97':'1','98':'2','99':'3','100':'4','101':'5','102':'6','103':'7','104':'8','105':'9',
'106':'*','107':'+','109':'-','110':'.','111':'/',
'112':'f1','113':'f2','114':'f3','115':'f4','116':'f5','117':'f6',
'118':'f7','119':'f8','120':'f9','121':'f10','122':'f11','123':'f12',
'144':'numlock','145':'scrolllock',
'188':',','190':'.','191':'/','192':'@','219':'[','220':'\\','221':']','222':'^','226':'\\',
'240':'capslock',
};

function $(id){ return document.getElementById(id)}

function keyconfig(e){
   if (/^(input|textarea|select|textbox)$/i.test(e.target.localName)) return;
   var keycode = e.keyCode;
   if (keycode >= 16 && keycode <= 18) return;
   var command = keymap[keycode] + (e.ctrlKey?'+ctrl':'') + (e.shiftKey?'+shift':'') + (e.altKey?'+alt':'');
   var paste = readFromClipboard();
   switch(command){
	  case 'w' : goDoCommand('cmd_scrollLineUp');
				 goDoCommand('cmd_scrollLineUp');
				 goDoCommand('cmd_scrollLineUp'); break; //页面向上三行
	  //case 'w' : goDoCommand('cmd_scrollPageUp'); break;  //页面向上一页
	  case 's' : goDoCommand('cmd_scrollLineDown');
				 goDoCommand('cmd_scrollLineDown');
				 goDoCommand('cmd_scrollLineDown'); break;//页面向下三行
	  //case 's' : goDoCommand('cmd_scrollPageDown'); break;  //页面向下一页
      case 'a' : goDoCommand('cmd_scrollLeft'); break;//页面左移一栏
	  case 'd' : goDoCommand('cmd_scrollRight'); break;//页面右移一栏
	  case 'a+shift' : $("Browser:Back").doCommand(); break;//后退
      case 'd+shift' : $("Browser:Forward").doCommand(); break;//前进	  
      //case 'q' : gBrowser.mTabContainer.advanceSelectedTab(-1, true); break; //上一标签
      //case 'e' : gBrowser.mTabContainer.advanceSelectedTab(+1, true); break; //下一标签
	  //case 'f' : BrowserSearch.loadSearch(getBrowserSelection(), true);  break; //高亮后台搜索
	  case 'z' : goDoCommand('cmd_scrollTop'); break;//到页面顶部
	  case 'x' : goDoCommand('cmd_scrollBottom'); break;  //到页面底部
	  case 'r': BrowserReloadSkipCache(); break;//刷新
      case '++alt' : $("cmd_fullZoomEnlarge").doCommand(); break;//缩放 - 放大
      case '-+alt' : $("cmd_fullZoomReduce").doCommand(); break;//缩放 - 缩小
	  case '0+alt' : FullZoom.reset(); break;//缩放 - 重置(数字0）
      case 'o+alt' : openPreferences(); break;//选项
      case 'f3': gFindBar.onFindAgainCommand(false); break;//查找下一个
	  case 'f1': BrowserCloseTabOrWindow(); break;//Aktuellen Tab schliessen
      case "z+alt": undoCloseTab(); break;//撤销关闭标签页
      case 'm+alt' : BrowserOpenAddonsMgr(); break;//打开附加组件对话框
	  case 'f4+shift': Application.restart(); break;//重启FF 
	  //case "c+alt":var tab = gBrowser.mCurrentTab; gBrowser.removeTab(tab); break;//关闭当前标签 
	  case "f5+shift": BrowserReloadSkipCache(); break;//重新载入(忽略缓存)
	  case 'f':if(/.*[\u4e00-\u9fa5]+.*$/.test(paste))
					{BrowserSearch.loadSearch(paste,true);}
				else openUILinkIn(readFromClipboard(), 'tab', true);  
					break;//在新标签中浏览剪贴板中的网址,或搜索剪贴板中的内容
	  case 'f+shift': if(!paste) return;
			 BrowserSearch.loadSearch(paste,true);  break;//新标签中强制搜索剪贴板中的内容
	  case 't+shift':Components.classes["@mozilla.org/widget/clipboardhelper;1"]
			.getService(Components.interfaces.nsIClipboardHelper)
			.copyString(content.document.title + "：" + content.location); break; //同时复制标签页标题和url（格式“标题”："URL"）
//以下为打开网址
	  case '7+shift': var myUrl = "camp-firefox.de/forum";
                      var ff= document.getElementById("content");
                      var tab = ff.addTab(myUrl);
                      ff.selectedTab = tab;break;
	  default: return;
   }
   e.preventDefault();
}

gBrowser.mPanelContainer.addEventListener('keydown', keyconfig, false);
})(); 