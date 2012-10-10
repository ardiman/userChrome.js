// @name				SearchbarClear for WheelClick
// @description	検索エンジンのアイコンをホイールクリックで検索バーをクリア
// @include			main
// ==/UserScript==
(function() {
  var clearSearchBox = function(){
    var searchbar = BrowserSearch.searchBar;
    if (!searchbar) return;
    var setClear = function(event){
      if ( event.button == 1 ){
    event.preventDefault();
    searchbar.value = '';
    searchbar.focus();
      }
    };
    document.getAnonymousElementByAttribute
(searchbar, "anonid", "searchbar-engine-button")
.addEventListener("click", setClear, true);
  };
  clearSearchBox();
  window.addEventListener("aftercustomization", clearSearchBox, false);
}());