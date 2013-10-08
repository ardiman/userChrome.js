// ==UserScript==
// @name					smartlyCloseFindbar
// @namespace		http://d.hatena.ne.jp/blooo/
// @description		ページ内検索後検索バーからフォーカスを移すと自動的に閉じる
// @include				main
// ==/UserScript==

(function(){

function closeFindbar(e){
	if(!gFindBar.hidden)
	{
		if(e.target.id != "FindToolbar"){
			gFindBar.close();
		}
	}
}

addEventListener('mousedown', closeFindbar, false);
addEventListener('keydown', closeFindbar, false);

})();
