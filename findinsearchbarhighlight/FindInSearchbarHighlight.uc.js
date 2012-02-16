// ==UserScript==
// @name           find_in_searchbar_highlight.uc.js (mod)
// @description    検索バーでページ内検索＋検索文字のハイライト
// @include        chrome://browser/content/browser.xul
// @author         yosuke
// @compatibility  Firefox 4.0
// @Note           (概要)
// @Note           ・検索バー内にある検索ボタン(虫眼鏡)をクリックすると，検索バーに入力された文字列をページ内検索する．
// @Note           ・検索バーの右端にあるペンボタンをクリックすると，検索バーに入力された文字列をすべてハイライト表示する．
// @Note           ・検索した結果，文字列がみつからない場合，検索バー内の背景が赤になる．
// @Note           ・先頭に戻って検索するか，末尾に戻って検索する場合，検索バー内の背景が緑になる．
// @Note           (具体的な使い方)
// @Note             検索ボタンの右クリック -> ページ内検索，次を検索
// @Note             検索ボタンの左クリック -> 前を検索
// @Note             検索ボタンの中クリック -> 検索バー内の文字列を消去
// @Note             ペンボタンをクリック   -> ハイライトのオン，オフ
// @Note           (注意)
// @Note             「任意の設定」の値を変更することで各種機能を個別に設定できます．
// @Note             検索バーによるページ内検索を行う場合，検索ボタンを表示させてください．
// @Note           (追加機能:oflow)
// @Note             ハイライトボタンの位置を検索ボックスの中に移動
// @Note             ページ内検索をした時だけハイライトボタンを表示するように変更
// @Note             Ctrl+Enter, Alt+Nでページ内検索(次を検索)
// @Note             Ctrl+Shift+Enter, Alt+Pでページ内検索(次を検索)
// ==/UserScript==

(function() {
    /*----- Einstellungen -----*/
    // Findbar in der Searchbar erlauben("true" ja "false" nein)
    const USE_FINDSEARCH = "true"
    // Den "Hervorheben"-Button neben der Searchbar platzieren("true" ja "false" nein)
    const USE_HIGHLIGHTBUTTON = "true"
    // Das zusätzliche Erscheinen der Findbar aktivieren("true" ja "false" nein)
    const USE_FINDBAR = "false"
    // Beim Suchende automatisch nach oben an den Suchanfang("true" ja "false" nein)
    const USE_WRAP= "true"
    
    /*----- 初期設定 -----*/
    // ID, Class  Object
    var searchbar = document.getElementById("searchbar");
    var searchbox = document.getAnonymousElementByAttribute(searchbar, "anonid", "searchbar-textbox");
    var searchGoButton = document.getAnonymousElementByAttribute(searchbar, "anonid", "search-go-button");
    var inputbox = document.getAnonymousElementByAttribute(searchbar, "anonid", "input");
    var findstatus = gFindBar.getElement("find-status-icon");
    
    // Colour, Image
    const white = "#ffffff";
    const green = "#ccffcc";
    const red   = "#ffcccc";
	var onHighlight = 'data:image/png;base64,'+
    'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI'+
	'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wQFBAcXveirYgAAAB10RVh0Q29tbWVudABDcmVhdGVk'+
	'IHdpdGggVGhlIEdJTVDvZCVuAAADKUlEQVR4AQEeA+H8AAAAAAAAAAAAAAAAAP///wD///8A////'+
	'AP///wD///8A////ANCwHRpDSEf/Q0hH/4+Pj4Py2xoAAQAAAAAAAAAAAAAAAP///wAAAAAAAAAA'+
	'AAAAAAAAAAAA0bEeGgAAAOUuRZQARVOWACEcHQArKyuEAQAAAAAAAAAAAAAAAP///wAAAAAAAQEB'+
	'AAAAAADQsB0xAAAAzi5FlAD+9q8A9vC6AFFtLQAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'ANCwHTEAAADOLkWUAP72rwD28LoA+/nmAI1o1gAAAAAAAQAAAAAAAAAAAAAAAP///wAAAAAA0bEe'+
	'GgAAAOUuRZQA/vavAPbwugD7+eYA/w0AAOTPHQAAAAAbAgAAAAAAAAAAAAAAAAAAAADRsR4aAAAA'+
	'5S5FlAD+9q8A9vC6APv55gD/DQAA5M8dAAAAABsuRZTmAgAAAAAAAAAAAAAAANGxHhoAAADlLkWU'+
	'AP72rwD28LoA+/nmAP8NAADkzx0AAAAAMi5FlOb+9q8AAgAAAAAAAAAAQ0hHGgAAAOUuRZQA/vav'+
	'APbwugD7+eYA/w0AAOTPHQAAAAAyLkWUz/72rwD28LoABAAAAABDSEcaAAAA5S5FlAD+9q8A9vC6'+
	'APv55gD/DQAA5M8dAAAAABsuRZTm/vavAPbwugD7+eYAAgAAAAAAAADlTEdIAEVTlgD28LoA+/nm'+
	'AP8NAADkzx0AAAAAGy5FlOb+9q8A9vC6APv55gD/DQAAAgAAAAAAAAAAAAAAACEcHQBRbS0A/xIA'+
	'AOTPHQAAAAAbLkWU5v72rwD28LoA+/nmAP8NAADkzx0AAdCwHTRzmCrLIRwdAAAAAAAAAAAA3+Tj'+
	'AAAAABu7rWrm/vavAPbwugD7+eYA/w0AAOTPHQAvT+IAAdCwHYAcPON/yswBAKqp/wAAAAAA8/JT'+
	'AP7+/gD7+/sA+vr6APf39wD19fUA8fHxANzc3AEAAAAAAeTaCf/s1hQAkLHjAAYFZgACAgIAAQEB'+
	'AAMDAwAAAAAA/f39APz8/AD5+fkA9fX1APHx8QDw8PAAYSYWElWJpbsAAAAASUVORK5CYII=';
	var offHighlight = 'data:image/png;base64,'+
	'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI'+
	'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wQFBAIFMyYubwAAAB10RVh0Q29tbWVudABDcmVhdGVk'+
	'IHdpdGggVGhlIEdJTVDvZCVuAAADKUlEQVR4AQEeA+H8AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAAAAAAAAAAAAACklEncdITSIAAAAAAMDAwC3t7cBAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAAAAAAAAOTITRoOEi4iqqqoAAAAAABsbGwBJSUn/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAABXTR8zqamp//Dw8P/h4eH/zc3N/0ZGRv9GRkb/AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AEY/IDZbY4rLR0dHAPHx8QDs7OwA9/f3ACQkJADPz88AAgAAAAAAAAAAAAAAAAAAAAAAAAAAIh8S'+
	'FWNqiXJHR0cA8fHxAOzs7AD39/cACAgIAAAAAOvY1ctrAAAAAAAAAAAAAAAAAAAAAAAiHxI7qamp'+
	'qfDw8P/h4eH/zc3N/8TExP/MzMz/tat7/zUvE0kAAAAABAAAAAAAAAAAAAAAAFRJFT5VYJTBR0dH'+
	'APHx8QDs7OwA9/f3AAgICADd3d0AwbOkXsvR7bcAAAAABAAAAAAAAAAAGx0dKFVgjMFHR0cA8fHx'+
	'AOzs7AD39/cACAgIAOHdzgDm0YRHlqTiugAAAAAAAAAABAAAAABARUQSBQECwkdHRwDx8fEA7Ozs'+
	'APf39wAKCfcA493HAIKBhzLR1u7PAAAAAAAAAAAAAAAAAgAAAAADAgLtSklJFVZWVgDs7OwA9/f3'+
	'AAgICADo3r65gIGIRNHW7s8AAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAB4eHgB5eXkACwsL'+
	'AOHdywByeZmnz9XtvQAAAAAAAAAAAAAAAAAAAAAAAAAAAUtEIYT4AyV7IR0eAAAAAAAAAAAA4uLi'+
	'AMLCwtn4+PgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVVVf99fX0AdHR0AAAAAAAAAAAADQ0N'+
	'AP7+/gD7+/sA+vr6APf39wD19fUA8fHxAN3d3QEAAAAAAcbGxv/j4+MAvLy8AAEBAQACAgIAAQEB'+
	'AAMDAwAAAAAA/f39APz8/AD5+fkA9fX1APHx8QDw8PAAdePqGO2XyzMAAAAASUVORK5CYII=';

    /*----- 検索ボタンをページ検索ボタンに -----*/
    // ページ内検索検索関数
    function find_in_searchbar(e){
        document.getElementById('toggle-all-highlight').style.display = 'block';
        var sel = searchbar.value;
        // 中クリック -> 検索文字列消去
        if(e.button == 1){
            gFindBar.toggleHighlight(false);
            searchbar.value = "";
            searchbox.style.backgroundColor = white;
        }
        // 左クリック, Ctrl+Enter       -> ページ内検索，次を検索
        // 右クリック, Ctrl+Shift+Enter -> 前を検索
        else if(sel){
            gFindBar._findField.value = sel;
            if(e.button == 0 || (e.ctrlKey && !e.shiftKey && e.keyCode == 13) || (e.altKey && e.keyCode == 78)){
                // 左クリック or Ctrl+Enter or Alt+N
                // 次へ
                gFindBar.onFindAgainCommand(false);
            } else if (e.button == 2 || (e.ctrlKey && e.shiftKey && e.keyCode == 13) || (e.altKey && e.keyCode == 80)) {
                // 右クリック or Ctrl+Shift+Enter or Alt+P
                // 前へ
                gFindBar.onFindAgainCommand(true);
            }
            if(findstatus.getAttribute("status")=="notfound"){
                searchbox.style.backgroundColor = red;
                // 見つからなくても検索ボックスにフォーカス
                searchbox.focus();
            }
            // 折り返し判定
            else if(findstatus.getAttribute("status")=="wrapped"){
                if(USE_WRAP=="false"){
                    if(e.button == 0){
                        gFindBar.onFindAgainCommand(true);
                    }else{
                        gFindBar.onFindAgainCommand(false);
                    }
                }
                searchbox.style.backgroundColor = green;
            }else{
                searchbox.style.backgroundColor = white;
            }
        }
        // ページ検索バーを表示するかどうか
        if(USE_FINDBAR == "true"){
            gFindBar.open();
        }else if(USE_FINDBAR == "false"){
            gFindBar.close();
        }
    }
    
    // 検索ボタン設定
    if(USE_FINDSEARCH == "true"){
        searchGoButton.removeAttribute("onclick");
        searchGoButton.setAttribute("oncontextmenu","return(false);");
        searchGoButton.addEventListener("click", function(e){ find_in_searchbar (e);}, false);
        searchbar.addEventListener("click", function(){searchbox.style.backgroundColor = white;}, true);
    }
    
    /*----- ハイライトボタンの生成 -----*/
    var sw = true;
    var str = "";
    // ハイライトオン，オフ関数
    function highlight_toggle() {
        var sel = searchbar.value;
        if(sel){
            gFindBar._findField.value = sel;
            gFindBar.toggleHighlight(false);                        // ハイライト初期化
            gFindBar.toggleHighlight(true);
            // 検索結果 notfound
            if(findstatus.getAttribute("status")=="notfound"){
                newButton.setAttribute("image",offHighlight);
                searchbox.style.backgroundColor = red;
                sw = false;
            }
            else if(sw){
                newButton.setAttribute("image",onHighlight);
                searchbox.style.backgroundColor = white;
            }else if(!sw){
                if(str == sel){
                    gFindBar.toggleHighlight(false);
                    newButton.setAttribute("image",offHighlight);
                    //sw = false;
                }else{
                    sw = !sw;
                    newButton.setAttribute("image",onHighlight);
                    searchbox.style.backgroundColor = white;
                }
            }
            sw = !sw;
        }
        else{
            sw = "false";
            newButton.setAttribute("image",offHighlight);
            gFindBar.toggleHighlight(false);
        }
        str = sel;
        // ページ検索バーを表示するかどうか
        if(USE_FINDBAR == "true"){
            gFindBar.open();
        }else if(USE_FINDBAR == "false"){
            gFindBar.close();
        }

    }
    // ハイライトボタン設定
    var newButton = document.createElement("toolbarbutton");
    newButton.setAttribute("label", "\u3059\u3079\u3066\u5f37\u8abf\u8868\u793a");
    // ツールチップテキストは検索バーと同じ「すべて強調表示」
    newButton.setAttribute("tooltiptext", "Jedes gefundene Wort markieren");
    newButton.setAttribute("id", "toggle-all-highlight");
    newButton.addEventListener("click", highlight_toggle, false);
    newButton.setAttribute("oncontextmenu","return(false);");
    newButton.setAttribute("image",offHighlight);
    // ボタンのマージンとかの設定
    newButton.style.cssText = 'display: none; margin: -6px 0px;';
    // 検索ボックス内にボタン表示する場合は背景色透過も
    //newButton.style.cssText = 'display: none; margin: 0px -2px; background-color: transparent !important';
    if(USE_HIGHLIGHTBUTTON == "true"){
	    // "Hervorheben"-Button rechts neben der Searchbar
           searchbar.parentNode.insertBefore(newButton, searchbar.nextSibling);
        // "Hervorheben"-Button rechts in der Searchbar neben der Lupe
        // searchGoButton.parentNode.insertBefore(newButton, searchGoButton.nextSibling);
        // "Hervorheben"-Button links neben der Searchbar
        // searchbar.parentNode.insertBefore(newButton, searchbar);

    }

    // 検索ボックスのCtrl+Enterでもページ内検索(次へ)
    //               Ctrl+Shift+Enterでもページ内検索(前へ)
    //               Ctrl+Hでハイライト切り替え
    // ついでに検索バーと同じようにAlt+Nで次、Alt+Pで前も使えるようにしておく
    searchbox.addEventListener('keydown', function(e) {
        // keyCode: 13=Enter, 72=h, 78=n, 80=p
        if ((e.ctrlKey && e.keyCode == 13) || (e.altKey && (e.keyCode == 78 || e.keyCode == 80))) {
            // suggestが出てる場合があるのでページ内検索実行時は消す
            searchbox.blur();
            searchbox.focus();

            find_in_searchbar(e);

            e.stopPropagation();
            e.preventDefault();
        } else if (e.ctrlKey && e.keyCode == 72) {
            highlight_toggle();
            e.stopPropagation();
            e.preventDefault();
        }
        if (!e.ctrlKey && e.keyCode == 13) {
            // ページ内検索を使用しない場合ハイライトボタンは不要なので非表示にする
            newButton.style.display = 'none';
            // ページ内検索して背景色変わってるかもしれないので戻す
            searchbox.style.backgroundColor = white;
        }
    }, false);
    searchbox.addEventListener('keyup', function(e) {
        if (searchbar.value == '') {
            // 検索ボックスのテキストが空なら背景色戻す
            searchbox.style.backgroundColor = white;
        }
    }, false);
})();