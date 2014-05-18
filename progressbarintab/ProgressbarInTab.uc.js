// ==UserScript==
// @name           Progressbar in Tab
// @description    タブにプログレスバーを表示
// @namespace      https://forum.mozilla-russia.org/viewtopic.php?id=62808
// @include        main
// ==/UserScript==
(function () {

    var uri = makeURI('data:text/css,' + encodeURIComponent('\
      tabs.tabbrowser-tabs label.tab-text {\
         -moz-binding: url("data:application/xml,%3Cbindings%20id%3D%22tabprogressbarBindings%22%0A%09xmlns%3D%22http%3A%2F%2Fwww.mozilla.org%2Fxbl%22%0A%09xmlns%3Axul%3D%22http%3A%2F%2Fwww.mozilla.org%2Fkeymaster%2Fgatekeeper%2Fthere.is.only.xul%22%0A%09xmlns%3Axbl%3D%22http%3A%2F%2Fwww.mozilla.org%2Fxbl%22%3E%0A%3Cbinding%20id%3D%22tab-label%22%20extends%3D%22xul%3Ahbox%22%3E%0A%09%3Ccontent%3E%0A%09%09%3Cxul%3Avbox%20class%3D%22tab-label-inner-box%22%20flex%3D%221%22%3E%0A%09%09%09%3Cxul%3Astack%20xbl%3Ainherits%3D%22flex%22%20flex%3D%221%22%3E%0A%09%09%09%09%3Cxul%3Ahbox%20class%3D%22label-behind-box%22%20flex%3D%221%22%2F%3E%0A%09%09%09%09%3Cxul%3Avbox%20class%3D%22tab-progress-box%22%20flex%3D%221%22%3E%0A%09%09%09%09%09%3Cxul%3Aprogressmeter%0A%09%09%09%09%09%09class%3D%22tab-progress%22%0A%09%09%09%09%09%09mode%3D%22normal%22%0A%09%09%09%09%09%09xbl%3Ainherits%3D%22value%3Dtab-progress%22%2F%3E%0A%09%09%09%09%3C%2Fxul%3Avbox%3E%0A%09%09%09%09%3Cxul%3Ahbox%0A%09%09%09%09%09flex%3D%221%22%0A%09%09%09%09%09align%3D%22center%22%3E%0A%09%09%09%09%09%3Cxul%3Alabel%0A%09%09%09%09%09%09class%3D%22tab-real-text%22%0A%09%09%09%09%09%09flex%3D%221%22%0A%09%09%09%09%09%09xbl%3Ainherits%3D%22value%2Ccrop%2Caccesskey%22%2F%3E%0A%09%09%09%09%3C%2Fxul%3Ahbox%3E%0A%09%09%09%3C%2Fxul%3Astack%3E%0A%09%09%3C%2Fxul%3Avbox%3E%0A%09%3C%2Fcontent%3E%0A%3C%2Fbinding%3E%0A%3C%2Fbindings%3E#tab-label");\
      }\
      .tab-progress > .progress-remainder {\
         background-color: #5d9856 !important;\
      }\
      .tab-progress > .progress-bar {\
         box-shadow: 0 0 2px #7ffa52;\
         background: #4fca32 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAADCAYAAABPsHHBAAAD10lEQVRYhe3Y+0/VdRzHcf+Go4SIgqgoBMo5Gh0FFRIJrLXVWmttrbbaWqut1dZaa601zjnfc74IiIiIiAhIooCC2gHFG5DUPDcPh3NAgZC4BMKR8Hvu11c/nA+dT99VO9gFpfPD4/f35/3L5/N5LtsqUWHJyrsF0WLPEPafEoU9FoR5/5zFPsuTZMnsUEqR8TCEnEfBw/LkE/t5CiiFKggLVBAW8hTxHKAUB4kOqiAqoRyilFIO85TxHKGUU45SKijHeCp5jlOqeE5Qqik1lFqek0Fb6wK2zTulxjPz6tVIrVcj9bQGz54hGjQQN2ggbtRA3KTF9iYttp8N2EGkndMirVmHtGYd0pt1SG8J2Hn+NnZeCNh1MWi3Uo/dSj0ylHpktAZktuqR2aZHZlsPnrsUsOcy0W5AVrsBWVd+b++1Xuy91ovs60HP3yA6jMjpMCKnMyC304jcLhNyvzNhH/HCTaK7DzFMKZbNX0pCiRpCiQYpEg1SJFpskeiwRaJDsuQ2Nkv1SJbokSztQZLUgCSpAU9Le5EoNSJRZkKC1IQEWR82yfqxSdaPjbI72MjcRbxsAPGyAWxgBrGBGcJ6ZgjrmB+xjhlGHDOMOOYe1jIjWMuMIJb5CbHyUcTIxxAjH8Ma+ThWyyewWj6BaPnPiFZMYpV8EqsUU4hS3EeUYhorFdNYyc4gkjUjkjXjKfYBIthZRLCzWMH+ghXsHJazDwPyubD/AQEbFhb2RMsn9lMKOAgKKUUcBAcoxZSDRAnlEAdBKeUwUUYcoZRzEBylVBDHKJXEcaKKOEFUU2qIWuIkpY74hjhF1BOnKWeIBqKR0kScJc4RzZQW4jwHwQWei8S3hJLSykHQRrnEYfllDhHtHCLbOURd5RB9lcOa6xbE3rAgrsOC9Z0WxHdZkNBlQeJNK5K6rdjcbUXK91aIfrBi2y0rUlU2iNU27NDYkK61YZfWhgydHXv0dmTp7cjusSPHYMc+gx0vGh14yejAyyYHXulz4NV+B16748Drd514Y8CJNwedeGvQibeHnHhn2IV3h114b9iF9++58MGICx+OuPDRqBsfj7rxyZgbn4678dm4G59PuPHFpAdfTnrw1ZQHX095kHffA+m0F8yMF4oZL/LNXhSYvSgye1H8wIeSWR9KZ30om/OhfM6Hioc+VHJ+VHF+VHN+1Fr8qLP4gw+ssLClYNF/3WG/CResx2vviz3XgoVSsPgV66/q1UILFr9i/Vm9etSCxa9Yf7dg8SvWoxas+YpVo/r3C1aDBuLGEApWywILljLEgnUltIKV/QcFKzfEgvUrTkoMxlOixu0AAAAASUVORK5CYII=") no-repeat right;\
      }\
      .tabbrowser-tab:not([busy="true"]) .tab-progress,\
      label.tab-text:not([tab-progress]) .tab-progress {\
         visibility: collapse;\
      }\
      .tab-progress,\
      .tab-real-text,\
      label.tab-text > .tab-label-inner-box,\
      label.tab-text > .tab-label-inner-box > *,\
      label.tab-text > .tab-label-inner-box > stack > *,\
      label.tab-text > .tab-label-inner-box > stack > * > spacer {\
         margin: 0 !important;\
         padding: 0 !important;\
         text-indent: 0 !important;\
      }\
      .tab-progress {\
         min-width: 0 !important;\
         height: 2px !important;\
         min-height: 3px !important;\
         max-height: 3px !important;\
         -moz-appearance: none !important;\
         border: none !important;\
         outline: none !important;\
         margin: -3px 0 0 !important;\
         position: relative !important;\
      }\
      .tab-progress > .progress-bar,\
      .tab-progress > .progress-remainder {\
         -moz-appearance: none !important;\
      }\
      .tab-progress-box { -moz-box-pack: start !important; }\
      '));
    const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    //   addDestructor(function() sss.unregisterSheet(uri, sss.AGENT_SHEET) );


    var tabsProgressListener = {
        onProgressChange: function (browser, webProgr, request, curSelfProgr, maxSelfProgr, curProgr, maxProgr) {
            if (!maxProgr) return;

            var percentage = parseInt((curProgr * 100) / maxProgr);
            var tab = gBrowser._getTabForBrowser(browser);
            var label = document.getAnonymousElementByAttribute(tab, 'class', 'tab-content').querySelector(".tab-text.tab-label");

            browser.webProgress.isLoadingDocument && percentage > 0 && percentage < 100 ? label.setAttribute('tab-progress', percentage) : label.removeAttribute('tab-progress');
        }
    };
    gBrowser.addTabsProgressListener(tabsProgressListener);
//    addDestructor(function () gBrowser.removeTabsProgressListener(tabsProgressListener));

})();
