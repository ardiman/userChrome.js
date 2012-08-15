
/**
 * Vertical tab for Firefox 3 Beta 3
 *
 * Set browser.tabs.closeButtons to 2 using about:config.
 */

(function () {

// From Tree Style Tab (written by piro)
gBrowser.mTabBox.orient = 'horizontal';
gBrowser.mStrip.orient =
gBrowser.mTabContainer.orient =
gBrowser.mTabContainer.mTabstrip.orient =
gBrowser.mTabContainer.mTabstrip.parentNode.orient = 'vertical';


// For Mac OS X, proto style.
var style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
style.type = "text/css";
style.appendChild(document.createTextNode(navigator.platform.indexOf("Mac") > -1 ? Mac() : Win()));


document.documentElement.appendChild(style);


function Mac () { return <><![CDATA[
	@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);

	.tabs-stack {
		width: 15em !important; /* Tab Width */
		padding: 5px 0 0 0 !important;
		border-style: solid !important;
		border-width: 1px 5px 0 0 !important;
		border-color: #444 #b6b6b6 !important;
		background:#797979 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAAATCAIAAAA26UVlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFlJREFUWMPt1MENwEAIA0GSrumXKjjZpIhIx2e3hLHkJzODbjUzks453V1VLyKX9WfGtqSIQH9nAPTX9G3bRn/zfNBfDn300Sf00Sf00Sf00Sf00Sf00ae/fcgdNtGP2RYEAAAAAElFTkSuQmCC") repeat-y top right !important;
	}

	tab {
		margin: 1px 0 !important;
	}

	tab .tab-icon {
		margin: 0 0 0 0 !important;
	}

	tab .tab-text-stack {
		padding: 3px 0 0 0 !important;
	}

	tab .tab-image-middle {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAaCAIAAADqseFyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANxJREFUKM91kk2yhCAQg3NaWeNKrzEqiPzNUV93AwpjvY8QAlT1KtCz1jOhK3PdZFDTNClak1KsgpIXxJgi78QHe7oz8otvE3LKrNx5E1KFLonuqQPfnP8bi2fIayy6Gb9jEXvScEMMsSl0mYXgA6vgB4f3wTfCbRJwuYt1XUMQpz9HekF/Du507iTE2J1rgq2cwyHAMFa2tZKtZEowh2EZU0MnHPtBokVns10eDuzb/qjQrtg+28DnCZCOcF9i7UvpDp8o9erbdlcNtZXSUj23jkrAsqxLYR1tWf8AJr2Qe2DQNzkAAAAASUVORK5CYII=") repeat-x top left !important;
		border: none !important;
		padding: 0 0 0 0 !important;
	}

	tab .tab-image-left {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAIAAADnr5E1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXtJREFUOMt9VO1ygyAQ9GnjpNOaMRM10TdoZvKjMQLKRyp90N4BCpemWU9Y4kLWkyM7/YNyDygD9uHOnuogNjlcmzzH8ABC1E1TH4/Hy+UyilEppZXWCnsdQmWJtKnregSI8W6MjxV+mKUGOOeCi6DT2sAFLfIQUb3b7UC9PogLuzkeqboAc0abdDFDzUR1UaBaShkMaDrnwUnh1p6maXXskQ6J73meMXcubRHJkPj+sVZJ9SKIbztbuWJyIUlLfFtrpwiZdIHTta0F3zFGSsbxUS0Q8Owp/qrh23MhMLjjbjeEXwRRQwYZZ8zd7EnPqPp7ZgMbBsZcLGRwBMaMfJ27uQ+34UUkO7YsIUfwdzdEf+t7bJD6BsdRXVWVr5r+2mP0fSQLJ5UGZYaZ5QKcXr+uEQuP6q5tXa3V588zpM3Xogp16Ws02YNd1/nqhJL7+Hh/227zTb5WvkdUt7B4255a9FPXzeFQ4RmCp8VypuyT86RNiJ+Eb4JzY/MLtC97An2cRbkAAAAASUVORK5CYII=") no-repeat top left !important;
		width: 10px !important;
	}

	tab .tab-image-right {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAIAAAABhlpxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASVJREFUKBUFwdGRU0cUQMG+0lSZYp2PSQuihE+cyoqVtHpvDt3z/fsPMpjRee7X6/X8fN4/7rfbbf35c5shjcluH8fxeDwfjwfWt/++UYbGnOfxeH7ePz7e399///97XS7DIIPpcr3M5TJzGawCwJBSBCsBgyallLBmZkBgZmZmZmYGSwIABIKVAKCQJKwKAGpv7XaFJQCgbAKsyhAYUSXBSsKQVISE1c5QMNrtXdUOK2lGKClVCUsoKFOVIli7DQAVaScsxSSGLWpHYRUCGVVRBWu3jWmQtmqn3cYSSRC7qAQrQQykShLW29c3xIg5zuN6Xeo4Dqyfv35iBuRsn6/j+fm83x9Yb2//mgQzzt3r9Xm5Xpnb7ba+fPkHAPbelxk5zxN/Ab8bI0CpEO7fAAAAAElFTkSuQmCC") no-repeat top left !important;
		width: 10px !important;
	}

	tab[selected="true"] .tab-image-middle {
		color: #000 !important;
		border: none !important;
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAaCAIAAADqseFyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUKM9jyMzKTAeCDAhGQQx+uAHD5k2bcaFRuVE5DLndu3bjQnjTWUYGKGkiJVEoBwgYKnEDAAQjv6hLimGWAAAAAElFTkSuQmCC") repeat-x top left !important;
		height: 26px !important;
	}

	tab[selected="true"] .tab-image-left {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAIAAADnr5E1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPpJREFUOMuV1N1uwiAUB3CfcAXcRXspaTLpOGS6FCP1NWYfo0m/aPHlZEuNaaru8A9w9Qs5J+GwOt5iisKfWh++93sAJTLx4bOd9l+2q+M9JtcaQG44j+P47VEmXZxO+qCFEGmann/OVVU1dbNckzbGgFJZltV1Y63t2u6V1nnOOS/L0tOHbqa/drskSdqmfXbrTPsaKGWv6V1/SskY67sepUFKyqjtLUpLr2mgHuyA1YTQcRhxGoAQgtXgdUTc6JCVQBRFzjnk3dLri7tguwzTvkusVkqt1+/YusPeYNj7Dpud5Vz6jpfrpn+/h9nMM0afz3xRhP4n/+cKjYKqgQhXyaIAAAAASUVORK5CYII=") no-repeat top left !important;
		width: 10px !important;
	}

	tab[selected="true"] .tab-image-right {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAIAAAABhlpxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEFJREFUKM9jSE/PwIMY/PAChs2bNuNBo9Kj0tST3r1rNx5EKKWmQ0EGEMCYUAwEDJWooLy8vLCwMCsrKyEhAagbALBg8EPs/C58AAAAAElFTkSuQmCC") no-repeat top left !important;
		width: 10px !important;
	}

	.tabs-alltabs-box,
	.tabs-alltabs-box-animate,
	.tabs-alltabs-button {
		display: none !important;
	}

	tabs stack.scrollbutton-down-stack ,
	tabs toolbarbutton.scrollbutton-down ,
	tabs toolbarbutton.scrollbutton-up {
		display: none !important;
	}
]]></>.toString() }

function Win () { return <><![CDATA[
	@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);

	.tabs-stack {
		width: 15em !important; /* Tab Width */
		padding: 5px 0 0 0 !important;
		border-style: solid !important;
		border-width: 1px 5px 0 0 !important;
		border-color: #444 #b6b6b6 !important;
		background:#797979 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAAATCAIAAAA26UVlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFlJREFUWMPt1MENwEAIA0GSrumXKjjZpIhIx2e3hLHkJzODbjUzks453V1VLyKX9WfGtqSIQH9nAPTX9G3bRn/zfNBfDn300Sf00Sf00Sf00Sf00Sf00ae/fcgdNtGP2RYEAAAAAElFTkSuQmCC") repeat-y top right !important;
	}

	.tabbrowser-tab {
		margin:  0 !important;
		padding: 2px 3px !important;
		-moz-border-radius-topleft: 2px !important;
		-moz-border-radius-bottomleft: 2px !important;
		-moz-border-left-colors: ThreeDShadow rgba(255,255,255,.3) !important;
		-moz-border-top-colors: rgba(0,0,0,.1) !important;
		-moz-border-bottom-colors: ThreeDShadow rgba(255,255,255,.3) !important;
		border: 2px solid !important;
		border-right: none !important;

		background: #b6b6b6 !important;
		opacity: 0.5 !important;
	}

	.tabbrowser-tab label {
		background: transparent;
	}

	.tabbrowser-tab .tab-icon {
		margin: 0 0 0 0 !important;
	}

	.tabbrowser-tab .tab-text-stack {
		padding: 3px 0 0 0 !important;
	}

	.tabbrowser-tab:hover ,
	.tabbrowser-tab[selected="true"] {
		opacity: 1 !important;
	}

	.tabbrowser-tab:before {
		display: none !important;
	}

	.tabbrowser-tab:after {
		display: none !important;
	}



	.tabs-alltabs-box,
	.tabs-alltabs-box-animate,
	.tabs-alltabs-button {
		display: none !important;
	}

	tabs stack.scrollbutton-down-stack ,
	tabs toolbarbutton.scrollbutton-down ,
	tabs toolbarbutton.scrollbutton-up {
		display: none !important;
	}
]]></>.toString() }

})();
