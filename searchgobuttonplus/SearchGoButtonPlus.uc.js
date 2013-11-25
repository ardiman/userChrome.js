/* :::::::::::::::::::::::::::::::::::::::::::::: SearchGoButtonPlus :::::::::::::::::::::::::::::::::::::::::::::: */

(function SearchGoButtonPlus() {
// 添加按鈕：
    function createBtn() {
        var navigator = document.getElementById("navigator-toolbox");
                if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
                var SGBtn = document.createElement("toolbarbutton");
                SGBtn.id = "SearchGoButtonPlus";
                SGBtn.setAttribute("type", "button");
                SGBtn.setAttribute("onclick", "SGBtn.onClick(event);");
                SGBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
                SGBtn.setAttribute("removable", "true");
                SGBtn.setAttribute("context", "_child");
                SGBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACTElEQVQ4jWNgwAdCSyXYI0s92CNLPRhCSyXwqkUGbNHFWnJzd25W23btv+6pt/91T739r7bt2n+5uTs3s0UXa+HVzBVbbaK07OxHze2P/6vOPfjdftGhh/aLDj1UnXvwu+b2x/+Vlp/9yBVbbYJdt4MDi/SkbTdVV1/7bzdt091dTz/NPvXu18xT737N3PP002z7aRvvq66+9l960rabDA4OLBj6eRIbQpQXn/kv27H68bbHH7p3P/2Cgrc9/tAt27H6sfLiM/95EhtCMAwQLp08XWHWwf/y9fPmLrv9pmLpzVdVMBqG5evnzVWYdfC/cOnk6RgGCBVPXC7bt+k/T25Pa87uS1HtJ26lQfCdtPYTd9Jydl+K4sntaZXt2/RfqHjicgwDeLNa2qValv3ny+1eKdCw2MF04kYP77m7/Lzn7vIznbjRQ6BhsQNfbvdKqZZl/3mzWtoxYyCizES0ZPJ/kZIpn7kzO2IECvodkDF3ZkeMSMmUz6Ilk/+zxpQaYbqAl1dENqbwuUhh/3+Bgt63PMn1jXwpDV58KQ1ePMn1jQIFvW9FCvv/8ybXr8Wq2cXF5WxYVMx/2ZjC/4LpLf+F8nr/C+R2/xfI7f4vlNf7XzC95T9PfPVhBs9cPgzNtra2Z6Oiov7HxcX9NzEz/8znHVvHE1txmCe+8itPfOVXntiKw9xRpXEY8S8kJMRnbGx8NiAg4H9ERMR/AwODz+Li4k4YTsQFBAQE7DQ1Nf87ODj819LSIk0zDEhISDTKycm9FhERcSBZM6UAAKTbDRCEvK88AAAAAElFTkSuQmCC)";
                SGBtn.setAttribute("label","Search-Go-Button Plus");
                SGBtn.setAttribute("tooltiptext","Rechtsklick: Volltextsuche\nMittelklick: Textsuche aus der Zwischenablage\nLinksklick: Suche");
                navigator.palette.appendChild(SGBtn);
    }

                SGBtn = {
                        onClick: function(event) {
                                switch(event.button) {
                                        case 0:
                                        // Left click
                                        // 左鍵：搜尋
                                        BrowserSearch.loadSearch();
                                        break;
                                        case 1:
                                        // Middle click
                                        // 中鍵：搜尋剪貼簿中的文字
                                        BrowserSearch.loadSearch(readFromClipboard(),true);
                                        break;
                                        case 2:
                                        // Right click
                                        // 右鍵：搜尋選取文字
                                        BrowserSearch.loadSearch(getBrowserSelection(), true);
                                        break;
                                }
                        }
                }

    function updateToolbar() {
    var toolbars = document.querySelectorAll("toolbar");
    Array.slice(toolbars).forEach(function (toolbar) {
        var currentset = toolbar.getAttribute("currentset");
        if (currentset.split(",").indexOf("SearchGoButtonPlus") < 0) return;
        toolbar.currentSet = currentset;
        try {
            BrowserToolboxCustomizeDone(true);
        } catch (ex) {
        }
    });
    }

    createBtn();
    updateToolbar();

})();