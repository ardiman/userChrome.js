// ==UserScript==
// @name           JSCSS_Highlight.uc.js
// @description    Syntax Highlight js and css.
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @license        MIT License
// @compatibility  Firefox 10
// @charset        UTF-8
// @include        main
// @version        0.0.2
// @note           0.0.2 AutoHotkey も強調してみた
// @note           0.0.2 細部の調整
// ==/UserScript==

(function(){

var JS = {};
var CSS = {};
var XML = {};
var BASE = {};
var AHK = {};

JS.keyword = [
"abstract","boolean","break","byte","case","catch","char","class","const",
"continue","debugger","default","delete","do","double","else","enum","export",
"extends","false","final","finally","float","for","function","goto","if",
"implements","import","in","instanceof","int","interface","long","native","new",
"null","package","private","protected","public","return","short","static",
"super","switch","synchronized","this","throw","throws","transient","true","try",
"typeof","var","void","volatile","while","with",
"let","yield","infinity","NaN","undefined"
];

JS.object = [
"Array","Boolean","Date","Error","EvalError","Function","Number","Object",
"RangeError","ReferenceError","RegExp","String","SyntaxError","TypeError",
"URIError","eval","decodeURI","decodeURIComponent","encodeURI",
"encodeURIComponent","escape","unescape","isFinite","isNaN","parseFloat",
"parseInt"
];

JS.method = [
"addEventListener","removeEventListener","handleEvent","alert","prompt",
"confirm","setTimeout","setInterval","clearTimeout","clearInterval","toString",
"toSource"
];

JS.property = [
"window","document","prototype","callee","caller","event","arguments"
];

JS.hougen = [
"$","jQuery", "opera","chrome", "gBrowser","Components",
"GM_log","GM_addStyle","GM_xmlhttpRequest","GM_openInTab",
"GM_registerMenuCommand","GM_unregisterMenuCommand","GM_enableMenuCommand",
"GM_disableMenuCommand","GM_getResourceText","GM_getResourceURL",
"GM_setValue","GM_getValue","GM_listValues","GM_deleteValue",
"GM_getMetadata","GM_setClipboard","GM_safeHTMLParser","GM_generateUUID"
];

JS.keyword.sort(function(a,b) b.length - a.length);
JS.object.sort(function(a,b) b.length - a.length);
JS.method.sort(function(a,b) b.length - a.length);
JS.property.sort(function(a,b) b.length - a.length);
JS.hougen.sort(function(a,b) b.length - a.length);


CSS.keyword = [
"@import","@charset","@media","@font-face","@page","@namespace","@keyframes",
"(?:\\!important)\\;",
"@-moz-document",
":root",":not","::?before","::?after","::?first-letter","::?first-line",
":link",":visited",":active",":focus",":hover",
":target",":enabled",":disabled",":checked",":default",":empty",
":nth-(?:last-)child",":nth-(?:last-)of-type",":(?:first|last|only)-child",
":(?:first|last|only)-of-type"
];

CSS.property = ['padding','margin','border','border-radius','background','font','overflow'];
CSS.hougen = [];
var s = getComputedStyle(document.documentElement, null);
for(var i = 0, p; p = s[i]; i++) {
	p[0] === "-" ? CSS.hougen.push(p) : CSS.property.push(p);
}

CSS.colors = [
'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black',
'blanchedalmond','blue','blueviolet','brass','brown','burlywood','cadetblue',
'chartreuse','chocolate','coolcopper','copper','coral','cornflower',
'cornflowerblue','cornsilk','crimson','cyan','darkblue','darkbrown','darkcyan',
'darkgoldenrod','darkgray','darkgreen','darkkhaki','darkmagenta',
'darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen',
'darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink',
'deepskyblue','dimgray','dodgerblue','feldsper','firebrick','floralwhite',
'forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray',
'green','greenyellow','honeydew','hotpink','indianred','indigo','ivory','khaki',
'lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral',
'lightcyan','lightgoldenrodyellow','yellowgreen',

'ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText',
'Highlight','HighlightText','InactiveBorder','InactiveCaption',
'InactiveCaptionText','InfoBackground','InfoText','Menu','MenuText',
'Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText'
];
CSS.property.sort(function(a,b) b.length - a.length);
CSS.hougen.sort(function(a,b) b.length - a.length);
CSS.colors.sort(function(a,b) b.length - a.length);


AHK.keyword = [
"^#AllowSameLineComments","^#ClipboardTimeout","^#CommentFlag","^#ErrorStdOut",
"^#EscapeChar","^#HotkeyInterval","^#HotkeyModifierTimeout","^#Hotstring",
"^#IfWinExist","^#IfWinNotActive","^#IfWinNotExist","^#Include","^#IncludeAgain",
"^#InstallKeybdHook","^#InstallMouseHook","^#KeyHistory","^#LTrim","^#MaxHotkeysPerInterval",
"^#MaxMem","^#MaxThreads","^#MaxThreadsBuffer","^#MaxThreadsPerHotkey","^#NoEnv",
"^#NoTrayIcon","^#Persistent","^#SingleInstance","^#UseHook","^#WinActivateForce",
"^#IfWinActive"
];

AHK.keyword2 = [
"AutoTrim","BlockInput","Break","Click","ClipWait","CoordMode","Continue","Control",
"ControlFocus","ControlGet","ControlGetFocus","ControlGetText","ControlClick","ControlMove",
"ControlGetPos","ControlSend","ControlSendRaw","ControlSetText","Critical","DetectHiddenText",
"DetectHiddenWindows","DllCall","Abs","ACos","Asc","ASin","ATan","Ceil","Chr","Cos",
"Exp","FileExist","Floor","GetKeyState","IL_Add","IL_Create","IL_Destroy","LV_Add",
"LV_Delete","LV_DeleteCol","LV_GetCount","LV_GetNext","LV_GetText","LV_Insert","LV_InsertCol",
"LV_Modify","LV_ModifyCol","LV_SetImageList","InStr","SubStr","Ln","Log","Mod",
"Round","SB_SetIcon","SB_SetParts","SB_SetText","Sin","Sqrt","StrLen","Tan","TV_Add",
"TV_Delete","TV_GetChild","TV_GetCount","TV_GetNext","TV_Get","TV_GetParent","TV_GetPrev",
"TV_GetSelection","TV_GetText","TV_Modify","DriveSpaceFree","Edit","Else","EndRepeat",
"EnvAdd","EnvSub","EnvMult","EnvDiv","EnvGet","EnvSet","EnvSub","EnvUpdate","Exit",
"ExitApp","FileAppend","FileCopy","FileCopyDir","FileCreateDir","FileCreateShortcut",
"FileGetShortcut","FileDelete","FileInstall","FileRead","FileReadLine","FileGetAttrib",
"FileGetSize","FileGetTime","FileGetVersion","FileMove","FileMoveDir","FileRecycle",
"FileRecycleEmpty","FileRemoveDir","FileSelectFile","FileSelectFolder","FileSetAttrib",
"FileSetTime","FormatTime","GetKeyState","Gosub","Goto","GroupActivate","GroupAdd",
"GroupClose","GroupDeactivate","Gui","GuiControl","GuiControlGet","if","is","not",
"contains","HideAutoItWin","Hotkey","IfEqual","IfNotEqual","IfExist","IfNotExist",
"IfGreater","IfGreaterOrEqual","IfInString","IfNotInString","IfLess","IfLessOrEqual",
"IfMsgBox","IfWinActive","IfWinNotActive","IfWinExist","IfWinNotExist","IniDelete",
"IniRead","IniWrite","Input","InputBox","IsFunc","IsLabel","KeyHistory","KeyWait",
"LeftClick","LeftClickDrag","ListHotkeys","ListLines","ListVars","Loop","Menu","MouseClick",
"MouseClickDrag","MouseGetPos","MouseMove","MsgBox","OnExit","OnMessage","OutputDebug",
"Pause","PixelGetColor","PixelSearch","ImageSearch","NumGet","NumPut","PostMessage",
"Process","Random","RegDelete","RegExMatch","RegExReplace","RegRead","RegWrite",
"RegisterCallback","Reload","Repeat","EndRepeat","Return","RightClick","RightClickDrag",
"Run","RunAs","RunWait","Send","SendEvent","SendInput","SendMode","SendPlay","SendRaw",
"SendMessage","SetBatchLines","SetCapslockState","SetControlDelay","SetDefaultMouseSpeed",
"SetEnv","SetFormat","SetKeyDelay","SetMouseDelay","SetNumlockState","SetScrollLockState",
"SetStoreCapslockMode","SetTimer","SetTitleMatchMode","SetWinDelay","SetWorkingDir",
"Shutdown","Sleep","Sort","SoundBeep","SoundGet","SoundGetWaveVolume","SoundPlay",
"SoundSet","SoundSetWaveVolume","Progress","SplashImage","SplashTextOn","SplashTextOff",
"StatusBarGetText","StatusBarWait","StringCaseSense","StringGetPos","StringLeft",
"StringLen","StringLower","StringMid","StringReplace","StringRight","StringSplit",
"SplitPath","StringTrimLeft","StringTrimRight","StringUpper","Suspend","Thread",
"ToolTip","Transform","TrayTip","URLDownloadToFile","VarSetCapacity","WinActivate",
"WinActivateBottom","WinClose","WinGet","SysGet","Drive","DriveGet","While","WinGetActiveStats",
"WinGetActiveTitle","WinGetClass","WinGetPos","WinGetText","WinGetTitle","WinHide",
"WinKill","WinMaximize","WinMenuSelectItem","WinMinimize","WinMinimizeAll","WinMinimizeAllUndo",
"WinMove","WinRestore","WinSet","WinSetTitle","WinShow","WinWait","WinWaitActive",
"WinWaitClose","WinWaitNotActive","Clipboard","ClipboardAll","ComSpec","ProgramFiles",
"ErrorLevel","True","False","A_YEAR","A_YYYY","A_MON","A_MDAY","A_MMMM","A_MMM",
"A_MM","A_DDDD","A_DDD","A_DD","A_HOUR","A_MIN","A_SEC","A_MSEC","A_WDAY","A_YDAY",
"A_YWeek","A_Language","A_LineFile","A_LineNumber","A_AppData","A_AppDataCommon",
"A_Temp","A_ComputerName","A_UserName","A_Desktop","A_DesktopCommon","A_StartMenu",
"A_StartMenuCommon","A_Programs","A_ProgramsCommon","A_Startup","A_StartupCommon",
"A_MyDocuments","A_WORKINGDIR","A_AhkPath","A_AhkVersion","A_ScreenWidth","A_ScreenHeight",
"A_SCRIPTNAME","A_SCRIPTDIR","A_SCRIPTFULLPATH","A_NUMBATCHLINES","A_BatchLines",
"A_ExitReason","A_ThisMenu","A_ThisMenuItem","A_ThisMenuItemPos","A_EventInfo","A_Gui",
"A_GuiControl","A_GuiControlEvent","A_GuiEvent","A_GuiHeight","A_GuiWidth","A_GuiX",
"A_GuiY","A_LastError","A_Now","A_NowUTC","A_IsCompiled","A_IsSuspended","A_TitleMatchMode",
"A_TitleMatchModeSpeed","A_DetectHiddenWindows","A_DetectHiddenText","A_AutoTrim",
"A_StringCaseSense","A_FormatInteger","A_FormatFloat","A_KeyDelay","A_WinDelay",
"A_ControlDelay","A_MouseDelay","A_DefaultMouseSpeed","A_IconHidden","A_IconTip",
"A_IconFile","A_IconNumber","A_IsCritical","A_IsPaused","A_OSTYPE","A_OSVERSION",
"A_WinDir","A_ProgramFiles","A_CURSOR","A_EndChar","A_CaretX","A_CaretY","A_ISADMIN",
"A_IPADDRESS1","A_IPADDRESS2","A_IPADDRESS3","A_IPADDRESS4","A_THISFUNC","A_THISHOTKEY",
"A_THISLABEL","A_PRIORHOTKEY","A_TIMESINCETHISHOTKEY","A_TIMESINCEPRIORHOTKEY","A_TIMEIDLE",
"A_TIMEIDLEPHYSICAL","A_TICKCOUNT","A_SPACE","A_TAB","A_INDEX","A_LOOPFILENAME",
"A_LOOPFILEFULLPATH","A_LoopFileLongPath","A_LOOPFILESHORTNAME","A_LoopFileShortPath",
"A_LOOPFILEDIR","A_LoopFileExt","A_LOOPFILETIMEMODIFIED","A_LOOPFILETIMECREATED",
"A_LOOPFILETIMEACCESSED","A_LOOPFILEATTRIB","A_LOOPFILESIZE","A_LOOPFILESIZEKB",
"A_LOOPFILESIZEMB","A_LOOPREGNAME","A_LOOPREGTYPE","A_LOOPREGKEY","A_LOOPREGSUBKEY",
"A_LOOPREGTIMEMODIFIED","A_LOOPREADLINE","A_LOOPFIELD","return"
];

AHK.property = [
"RGB","PIXEL","MOUSE","SCREEN","RELATIVE","BETWEEN","IN","INTEGER","FLOAT","INTEGERFAST",
"FLOATFAST","NUMBER","DIGIT","XDIGIT","ALPHA","UPPER","LOWER","ALNUM","TIME","DATE",
"AlwaysOnTop","Topmost","Bottom","Transparent","Redraw","Region","TransColor","ID",
"IDLAST","ProcessName","MinMax","CONTROLLIST","COUNT","LIST","CAPACITY","StatusCD",
"Eject","Label","FILESYSTEM","LABEL","SETLABEL","SERIAL","TYPE","STATUS","SECONDS",
"MINUTES","HOURS","DAYS","static","global","local","ByRef","READ","PARSE","Logoff",
"Close","Error","Single","TRAY","ADD","RENAME","CHECK","UNCHECK","TOGGLECHECK","ENABLE",
"DISABLE","TOGGLEENABLE","DEFAULT","NODEFAULT","STANDARD","NOSTANDARD","DELETE",
"DELETEALL","ICON","NOICON","TIP","SHOW","MAINWINDOW","NOMAINWINDOW","USEERRORLEVEL",
"AltTab","ShiftAltTab","AltTabMenu","AltTabAndMenu","AltTabMenuDismiss","Unicode",
"Asc","Chr","Deref","Mod","Pow","Exp","Sqrt","Log","Ln","Round","Ceil","Floor","Abs",
"Sin","Cos","Tan","ASin","ACos","ATan","BitNot","BitAnd","BitOr","BitXOr","BitShiftLeft",
"BitShiftRight","YES","NO","OK","CANCEL","ABORT","RETRY","IGNORE","TRYAGAIN","HKEY_LOCAL_MACHINE",
"HKEY_USERS","HKEY_CURRENT_USER","HKEY_CLASSES_ROOT","HKEY_CURRENT_CONFIG","HKLM","HKU",
"HKCU","HKCR","HKCC","REG_SZ","REG_EXPAND_SZ","REG_MULTI_SZ","REG_DWORD","REG_BINARY",
"Font","Resize","Owner","Submit","NoHide","Minimize","Maximize","Restore","NoActivate",
"NA","Cancel","Destroy","Center","Text","Picture","Pic","GroupBox","Button","Checkbox",
"Radio","DropDownList","DDL","ComboBox","ListBox","ListView","DateTime","MonthCal",
"UpDown","Slider","StatusBar","TreeView","Tab","Tab2","Disabled","LastFound","LastFoundExist",
"TabStop","Section","AltSubmit","Wrap","HScroll","VScroll","Border","Top","Bottom",
"Number","Uppercase","Lowercase","Limit","Password","Multi","WantReturn","Group",
"Background","Buttons","Expand","First","ImageList","Lines","WantCtrlA","WantF2",
"Vis","VisFirst","Theme","Caption","Delimiter","MinimizeBox","MaximizeBox","SysMenu",
"ToolWindow","Flash","Style","ExStyle","Check3","Checked","CheckedGray","ReadOnly",
"Password","Hidden","Left","Right","Center","NoTab","Section","Move","Focus","Hide",
"Choose","ChooseString","Text","Pos","Enabled","Visible","ahk_id","ahk_pid","ahk_class",
"ahk_group"
];

AHK.key = [
"[LR]?SHIFT","[LR]?ALT","[LR]?CONTROL","[LR]?CTRL","[LR]WIN","[LMR]Button",
"APPSKEY","WheelUp","WheelDown","WheelLeft","WheelRight","XButton1","XButton2",
"Joy[1-9]","Joy1[0-9]","Joy2[0-9]","Joy3[0-2]","Joy[XYZRUV]","JoyPOV",
"JoyName","JoyButtons","JoyAxes","JoyInfo","SPACE","TAB","ENTER","ESCAPE","ESC",
"BACKSPACE","BS","DELETE","DEL","INSERT","INS","PGUP","PGDN","HOME","END","UP",
"DOWN","LEFT","RIGHT","PRINTSCREEN","CTRLBREAK","PAUSE","ScrollLock","Capslock",
"Numlock","NUMPAD[0-9]","NUMPADMULT","NUMPADADD","NUMPADSUB","NUMPADDIV","NUMPADDOT",
"NUMPADDEL","NUMPADINS","NUMPADCLEAR","NUMPADUP","NUMPADDOWN","NUMPADLEFT","NUMPADRIGHT",
"NUMPADHOME","NUMPADEND","NUMPADPGUP","NUMPADPGDN","NUMPADENTER","F[1-9]","F1[0-9]",
"F2[0-4]","BROWSER_BACK","BROWSER_FORWARD","BROWSER_REFRESH","BROWSER_STOP","BROWSER_SEARCH",
"BROWSER_FAVORITES","BROWSER_HOME","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","MEDIA_NEXT",
"MEDIA_PREV","MEDIA_STOP","MEDIA_PLAY_PAUSE","LAUNCH_MAIL","LAUNCH_MEDIA","LAUNCH_APP1",
"LAUNCH_APP2",
];
AHK.keyword.sort(function(a,b) b.length - a.length);
AHK.keyword2.sort(function(a,b) b.length - a.length);
AHK.property.sort(function(a,b) b.length - a.length);
AHK.key.sort(function(a,b) b.length - a.length);


JS.keyword_r  = '\\b(?:' + JS.keyword.join('|') + ')\\b';
JS.object_r   = '\\b(?:' + JS.object.join('|') + ')\\b';
JS.method_r   = '\\b(?:' + JS.method.join('|') + ')\\b';
JS.property_r = '\\b(?:' + JS.property.join('|') + ')\\b';
JS.hougen_r   = '\\b(?:' + JS.hougen.join('|') + ')\\b';
JS.regexp_r   = "\\\/\(\(\?\:\\\\\.\|\\\[\(\?\:\\\\\.\|\[\^\\\]\]\)\*\\\]\|\[\^\\\/\\n\]\)\{0\,100\}\)\\\/\(\[gimy\]\*\)";
JS.CDATA_r    = "&lt\\;\\!\\\[CDATA\\\[\[\\s\\S\]\*\?\\\]\\\]&gt\\;";

CSS.keyword_r  = '(?:' + CSS.keyword.join('|') + ')';
CSS.property_r = '\\b(?:' + CSS.property.join('|') + ')\\b';
CSS.colors_r   = '\\b(?:' + CSS.colors.join('|') + ')\\b';
CSS.hougen_r   = '(?:' + CSS.hougen.join('|') + ')\\b';
CSS.url_r      = 'url\\([^)]+\\)';

AHK.keyword_r  = '(?:' + AHK.keyword.join('|') + ')\\b';
AHK.keyword2_r = '\\b(?:' + AHK.keyword2.join('|') + ')\\b';
AHK.property_r = '\\b(?:' + AHK.property.join('|') + ')\\b';
AHK.key_r      = '\\b(?:' + AHK.key.join('|') + ')\\b';
AHK.SComment_r = '(^|\\s+)\\;.*';

XML.MComment_r = '&lt\\;!--[\\s\\S]+?--&gt\\;';

BASE.URL_r      = '(?:https?|ftp|file|chrome|data):\\/\\/\\/?[a-z0-9](?:[\\w#$%()=~^@:;?_.,\\/+-]|&amp;)+(?:[\\w#$%=:;?_,\\/+-]|&amp;)';
BASE.BASE64_r   = "data:image/[a-zA-Z-]+\;base64\,[a-zA-Z0-9/+]+={0,2}";
BASE.MComment_r = "\\\/\\\*\[\\s\\S\]\*\?\\\*\\\/";
BASE.SComment_r = "\\\/\\\/\.\*";
BASE.string_r   = '"(?:[^\\n"\\\\]|\\\\.|\\\\\\n)*"' + '|' +
                  "'(?:[^\\n'\\\\]|\\\\.|\\\\\\n)*'";


JS.keyword_s  = 'color:#a09;';
JS.object_s   = 'color:#c15;';
JS.method_s   = 'color:#027;';
JS.property_s = 'color:#06a;';
JS.hougen_s   = 'color:#06a;';
JS.regexp_s   = 'color:#c11;';
JS.CDATA_s    = 'color:#c11;';

CSS.keyword_s  = 'color:#a09;';
CSS.property_s = 'color:#06a;';
CSS.hougen_s   = 'color:#06a;';

AHK.keyword_s  = 'color:#a09;';
AHK.keyword2_s = 'color:#a09;';
AHK.property_s = 'color:#06a;';
AHK.key_s      = 'color:#06a;';
AHK.SComment_s = 'color:#080;';

XML.MComment_s = 'color:#080;';

BASE.MComment_s = 'color:#080;';
BASE.SComment_s = 'color:#080;';
BASE.string_s   = 'color:#c11;';
BASE.URL_s      = '';
BASE.BASE64_s   = 'color:green;';

JS.R_keyword  = new RegExp(JS.keyword_r);
JS.R_object   = new RegExp(JS.object_r);
JS.R_method   = new RegExp(JS.method_r);
JS.R_property = new RegExp(JS.property_r);
JS.R_hougen   = new RegExp(JS.hougen_r);

CSS.R_keyword  = new RegExp(CSS.keyword_r);
CSS.R_property = new RegExp(CSS.property_r);
CSS.R_colors   = new RegExp(CSS.colors_r);
CSS.R_hougen   = new RegExp(CSS.hougen_r);
CSS.R_url      = new RegExp(CSS.url_r);

AHK.R_keyword  = new RegExp(AHK.keyword_r, 'm');
AHK.R_keyword2 = new RegExp(AHK.keyword2_r);
AHK.R_property = new RegExp(AHK.property_r);
AHK.R_key      = new RegExp(AHK.key_r);
AHK.R_SComment = new RegExp(AHK.SComment_r, 'm');


BASE.R_URL = new RegExp(BASE.URL_r, "g");
BASE.R_BASE64 = new RegExp(BASE.BASE64_r, "g");

JS.R_ALL = new RegExp([
	BASE.MComment_r
	,BASE.SComment_r
	,BASE.string_r
	,JS.CDATA_r
	,JS.keyword_r
	,JS.object_r
	,JS.method_r
	,JS.property_r
	,JS.hougen_r
//	,JS.regexp_r
].join('|'), "g");

CSS.R_ALL = new RegExp([
	BASE.MComment_r
	,BASE.string_r
	,CSS.keyword_r
	,CSS.property_r
	,CSS.colors_r
	,CSS.hougen_r
].join('|'), "g");

AHK.R_ALL = new RegExp([
	BASE.MComment_r
	,AHK.SComment_r
	,BASE.string_r
	,AHK.keyword_r
	,AHK.keyword2_r
	,AHK.property_r
	,AHK.key_r
].join('|'), "gm");

XML.R_ALL = new RegExp([
	XML.MComment_r
	,JS.CDATA_r
	,BASE.string_r
].join('|'), "g");

BASE.R_ALL = new RegExp([
	XML.MComment_r
	,BASE.string_r
	,CSS.colors_r
].join('|'), 'g');

function parse(aText, type) {
	aText = aText.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
	if (type == "CSS") aText = CSSParser(aText);
	else if (type == "JS") aText = JSParser(aText);
	else if (type == "XML") aText = XMLParser(aText);
	else if (type == "AHK") aText = AHKParser(aText);
	else aText = EXParset(aText);

	aText = aText.replace(BASE.R_BASE64, '<img src="$&" alt="$&">');
	aText = aText.replace(BASE.R_URL, '<a href="$&" style="'+ BASE.URL_s +'">$&</a>');
	return aText;
}

function JSParser(aText) {
	return aText.replace(JS.R_ALL, function(str, offset, s) {
		if (str.indexOf("//") === 0) {
			return '<span style="'+ BASE.SComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str + '</span>';
		}
		else if (str.indexOf("/") === 0) {
			return '<span style="'+ JS.regexp_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;![CDATA[") === 0) {
			if (CSS.R_keyword.test(str)) return CSSParser(str);
			return '<span style="'+ JS.CDATA_s +'">' + str + '</span>';
		}
		else if (JS.R_keyword.test(str)) {
			return '<span style="'+ JS.keyword_s +'">' + str + '</span>';
		}
		else if (JS.R_object.test(str)) {
			return '<span style="'+ JS.object_s +'">' + str + '</span>';
		}
		else if (JS.R_method.test(str)) {
			return '<span style="'+ JS.method_s +'">' + str + '</span>';
		}
		else if (JS.R_property.test(str)) {
			return '<span style="'+ JS.property_s +'">' + str + '</span>';
		}
		else if (JS.R_hougen.test(str)) {
			return '<span style="'+ JS.hougen_s +'">' + str + '</span>';
		}
		else {
			return str;
		}
	});
}

function XMLParser(aText) {
	return aText.replace(XML.R_ALL, function(str, offset, s) {
		if (str.indexOf("&lt;!--") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;![CDATA[") === 0) {
			let res = JSParser(str.replace("&lt;![CDATA[", "").replace("]]&gt;", ""));
			return "&lt;![CDATA[" + res + "]]&gt;";
		}
		else {
			return str;
		}
	});
}

function CSSParser(aText) {
	return aText.replace(CSS.R_ALL, function(str, offset, s) {
		if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;") + '</span>';
		}
		else if (CSS.R_hougen.test(str)) {
			return '<span style="'+ CSS.hougen_s +'">' + str + '</span>';
		}
		else if (CSS.R_colors.test(str)) {
			return '<span style="color:'+ str +';">' + str + '</span>';
		}
		else if (CSS.R_keyword.test(str)) {
			return '<span style="'+ CSS.keyword_s +'">' + str + '</span>';
		}
		else if (CSS.R_property.test(str)) {
			return '<span style="'+ CSS.property_s +'">' + str + '</span>';
		}
		else {
			return str;
		}
	});
}
function AHKParser(aText) {
	return aText.replace(AHK.R_ALL, function(str, offset, s) {
		if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;") + '</span>';
		}
		else if (AHK.R_SComment.test(str)) {
			return '<span style="'+ AHK.SComment_s +'">' + str + '</span>';
		}
		else if (AHK.R_keyword.test(str)) {
			return '<span style="'+ AHK.keyword_s +'">' + str + '</span>';
		}
		else if (AHK.R_keyword2.test(str)) {
			return '<span style="'+ AHK.keyword2_s +'">' + str + '</span>';
		}
		else if (AHK.R_property.test(str)) {
			return '<span style="'+ AHK.property_s +'">' + str + '</span>';
		}
		else if (AHK.R_key.test(str)) {
			return '<span style="'+ AHK.key_s +'">' + str + '</span>';
		}
		else {
			return str;
		}
	});
}

function EXParset(aText) {
	return aText.replace(BASE.R_ALL, function(str, offset, s) {
		if (str.indexOf("/*") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("&lt;!--") === 0) {
			return '<span style="'+ BASE.MComment_s +'">' + str + '</span>';
		}
		else if (str.indexOf("'") === 0 || str.indexOf('"') === 0) {
			return '<span style="'+ BASE.string_s +'">' + str.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;") + '</span>';
		}
		else if (CSS.R_colors.test(str)) {
			return '<span style="color:'+ str +';">' + str + '</span>';
		}
		return str;
	});
}

if (window.JSCSS) {
	window.JSCSS.destroy();
	delete window.JSCSS;
}

var _disabled = true;
window.JSCSS = {
	get disabled () _disabled,
	set disabled (bool) {
		if (_disabled != bool) {
			if (bool) {
				gBrowser.mPanelContainer.removeEventListener("DOMContentLoaded", this, false);
			} else {
				gBrowser.mPanelContainer.addEventListener("DOMContentLoaded", this, false);
			}
		}
		document.getElementById("JSCSS-menuitem").setAttribute("checked", !bool);
		return _disabled = !!bool;
	},
	init: function() {
		var menuitem = document.createElement("menuitem");
		menuitem.setAttribute("id", "JSCSS-menuitem");
		menuitem.setAttribute("label", "JSCSS hervorheben");
		menuitem.setAttribute("type", "checkbox");
		menuitem.setAttribute("checked", "true");
		menuitem.setAttribute("autoCheck", "false");
		menuitem.setAttribute("oncommand", "JSCSS.disabled = !JSCSS.disabled;");
		var ins = document.getElementById("devToolsSeparator");
		ins.parentNode.insertBefore(menuitem, ins);

		this.disabled = false;
		window.addEventListener("unload", this, false);
	},
	uninit: function() {
		this.disabled = true;
	},
	destroy: function() {
		this.disabled = true;
		var i = document.getElementById("JSCSS-menuitem");
		if (i) i.parentNode.removeChild(i);
	},
	handleEvent: function(event) {
		switch(event.type){
			case "DOMContentLoaded":
				var doc = event.target;
				if (!/css|javascript|plain/.test(doc.contentType) || 
				    doc.location.protocol === "view-source:"
				) return;
				this.run(doc, 100000);
				break;
			case "unload":
				this.uninit();
				break;
		}
	},
	write: function(pre) {
		var doc = pre.ownerDocument;
		var { contentType, URL } = doc;
		var type = contentType.indexOf('javascript') >= 0 ? 'JS' : 
			contentType.indexOf('css') >= 0 ? 'CSS' : 
			contentType === 'text/plain' ?
				/\.(?:xul|xml)(?:\.txt)?$/.test(URL) ? 'XML' :
				/\.(?:js|jsm|jsee|ng)(?:\.txt)?$/i.test(URL) ? 'JS' :
				/\.(?:css)$/i.test(URL) ? 'CSS' :
				/\.(?:ahk)(?:\.txt)?$|\/autohotkey\.ini$/.test(URL) ? 'AHK' :
				'TXT' :
			'TXT';
		var html = parse(pre.textContent, type);
		var preRange = doc.createRange();
		preRange.selectNodeContents(pre);
		preRange.deleteContents();
		
		var range = doc.createRange();
		range.selectNodeContents(doc.body);
		var df = range.createContextualFragment(html);
		range.detach();
		preRange.insertNode(df);
		preRange.detach();
	},
	run: function(doc, maxLength) {
		var self = this;
		doc || (doc = content.document);
		var pre = doc.getElementsByTagName('pre')[0];
		if (pre.textContent.length > maxLength) {
			var browser = gBrowser.getBrowserForDocument(doc);
			var notificationBox = gBrowser.getNotificationBox(browser);
			var message = "Der Text ist zu lang. Wollen Sie hervorheben? (Es besteht Absturzgefahr!)"
			var buttons = [{
				label: "Ja",
				accessKey: "J",
				callback: function (aNotification, aButton) {
					 self.write(pre);
				}
			}];
			notificationBox.appendNotification(
				message, "JSCSS",
				"chrome://browser/skin/Info.png",
				notificationBox.PRIORITY_INFO_MEDIUM,
				buttons);
			return;
		}
		self.write(pre);
	},
};
JSCSS.init();

})();