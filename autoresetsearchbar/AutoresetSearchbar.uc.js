// ==UserScript==
// @name           auto reset searchbar
// @description    Web検索したらキーワードをクリアして一番上の検索エンジンに戻す
// @version        1.3
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/archives/337
// ==/UserScript==
(function() {
    // リセットするまでにちょっと時間をおくかどうか [true=タイマー使う, false=即時クリア]
    const ARS_USE_TIMER = true;
    // リセットするまでの時間(ミリ秒) [2000=2秒]
    const ARS_TIMER_MS  = 2000;
    // 検索したら一番上の検索エンジンに戻すかどうか [true=戻す, false=そのまま]
    const ARS_USE_DEFAULT_ENGINE = true;
    // リセットタイマーが動いてるときに検索バーにフォーカスでタイマーを止めるかどうか [true=止める, false=止めない]
    const ARS_USE_FOCUS = true;
    // 検索ボタンクリックでクリアするかどうか [true=クリア, false=そのまま]
    const ARS_USE_CLICK = true;
    // 貼り付けて検索のときにクリアするかどうか [true=クリア]
    const ARS_USE_COMMAND = true;
    // Enterキーで検索のときにクリアするかどうか [true=クリア]
    const ARS_USE_ENTER = true;
    // 検索メニューのミドルクリック (search-engine-select-and-paste-and-search.uc.js) も使うか [true=使う]
    const ARS_USE_SELECT_PASTE_SEARCH = true;

    var ucjsAutoResetSearchbar = {
        timer: null,
        searchbar: BrowserSearch.searchBar,
        init: function() {
            if (ARS_USE_FOCUS) {
                this.searchbar.addEventListener('focus', this, false);
            }
            if (ARS_USE_CLICK) {
                this.searchbar.addEventListener('click', this, false);
            }
            if (ARS_USE_COMMAND) {
                this.searchbar.addEventListener('command', this, false);
            }
            if (ARS_USE_ENTER) {
                this.searchbar.addEventListener('keypress', this, false);
            }
            window.addEventListener('unload', this, false);
        },
        uninit: function() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (ARS_USE_FOCUS) {
                this.searchbar.removeEventListener('focus', this, false);
            }
            if (ARS_USE_CLICK) {
                this.searchbar.removeEventListener('click', this, false);
            }
            if (ARS_USE_COMMAND) {
                this.searchbar.removeEventListener('command', this, false);
            }
            if (ARS_USE_ENTER) {
                this.searchbar.removeEventListener('keypress', this, false);
            }
            window.removeEventListener('unload', this, false);
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'focus':
                    // タイマーでリセットする前に検索バーにフォーカスしたらリセットしない
                    if (ARS_USE_TIMER && this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                case 'click':
                    var target = e.originalTarget;
                    // 検索ボタンクリックしての検索
                    if (target.getAttribute('anonid') == 'search-go-button') {
                        if (e.button === 0 || e.button === 1) {
                            // 左クリック(0) or ミドルクリック(1)
                            this.reset();
                        }
                    }
                    if (ARS_USE_SELECT_PASTE_SEARCH && e.button === 1) {
                        // search-engine-select-and-paste-and-search.uc.js
                        if (target.className.indexOf('searchbar-engine-menuitem') != -1) {
                            // 検索メニューのミドルクリック
                            this.reset();
                        } else if (target.getAttribute('anonid') == 'searchbar-engine-button') {
                            // 検索エンジンアイコンのミドルクリック
                            this.reset();
                        }
                    }
                    break;
                case 'command':
                    // 貼り付けて検索
                    if (e.originalTarget.getAttribute('anonid') == 'paste-and-search') {
                        this.reset();
                    }
                    break;
                case 'keypress':
                    // Enterキーで検索
                    if (e.keyCode === 13) {
                        this.reset();
                    }
                    break;
                case 'beforeunload':
                case 'unload':
                    this.uninit();
                    break;
            }
        },
        reset: function() {
            /* chrome://browser/content/browser/search/search.xml */
            if (ARS_USE_TIMER && this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if (ARS_USE_TIMER) {
                // フォーカス奪うやつの対策で50msずらす
                setTimeout(function() {
                    this.timer = setTimeout(this.setDefault.bind(this), ARS_TIMER_MS);
                }.bind(this), 50);
            } else {
                this.setDefault();
            }
        },
        setDefault: function() {
            /*
             * chrome://browser/content/browser/search/search.xml
             *
             * <property name="textbox" onget="return this._textbox;"/>
             * <property name="engines" ...
             */
            var engines = this.searchbar._engines || this.searchbar.engines,
                textbox = this.searchbar._textbox || this.searchbar.textbox ||
                                document.getAnonymousElementByAttribute(searchbar, 'anonid', 'searchbar-textbox');

            textbox.value = '';
            if (ARS_USE_DEFAULT_ENGINE) {
                this.searchbar.currentEngine = engines[0];
            }
        }
    }
    ucjsAutoResetSearchbar.init();
})();
