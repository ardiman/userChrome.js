// ==UserScript==
// @name           Speeddial_light
// @namespace      http://d.hatena.ne.jp/Griever/
// @include        main
// ==/UserScript==

gBrowser.mPanelContainer.addEventListener('DOMContentLoaded', function({target: doc}){
	if (doc.location.href != 'about:blank') return;

doc.body.appendChild(doc.createRange().createContextualFragment(
<![CDATA[
	<style>
body, html{
	width: 100%;
	height: 100%;
	margin: 0;
	padding:0;
	overflow: hidden;
}
#speeddial {
	list-style: none;
	width: 90%;
	height: 90%;
	margin: auto;
	padding: auto;
}
#speeddial > li{
	display: inline-block;
	text-align: center;
	width: 33%;
	height: 33%;
	overflow: hidden;
}
#speeddial > li > a{
	display: block;
	width: 100%;
	height: 100%;
	color: black;
	font-size: 22pt;
	font-weight: bold;
}
span.box{
	display: inline-block;
	width: 1.1em;
	height: 1.1em;
}
li:nth-child(odd) { background-color: azure; }
li:nth-child(even){ background-color: beige; }

	</style>

	<div style="text-align:center; margin:1em;">
		<form method="GET" action="http://www.google.de/search" style="padding:0; margin:0;">
			<input type="text" name="q" size="31" value="">
			<input type="hidden" name="hl" value="de">
			<input type="submit" name="btnG" value="Google">
		</form>
	</div>

	<ol id="speeddial">
		<li>
			<a href="http://www.google.de/" style="text-shadow: 6px 3px 3px #999;">
				<span style="color:#00f;">G</span>
				<span style="color:#f00;">o</span>
				<span style="color:#ff0;">o</span>
				<span style="color:#00f;">g</span>
				<span style="color:#080;">l</span>
				<span style="color:#f00;">e</span>
			</a>
		</li>
		<li>
			<a href="http://www.google.de/mail" style="text-shadow: 6px 3px 3px #999;">
				<span style="color:#00f;">G</span>
				<span style="color:#f00;">o</span>
				<span style="color:#ff0;">o</span>
				<span style="color:#00f;">g</span>
				<span style="color:#080;">l</span>
				<span style="color:#f00;">e</span>
				<br>
				<span style="color:#00f;">mail</span>
			</a>
		</li>
		<li>
			<a href="http://www.google.de/reader/view" style="text-shadow: 6px 3px 3px #999;">
				<span style="color:#00f;">G</span>
				<span style="color:#f00;">o</span>
				<span style="color:#ff0;">o</span>
				<span style="color:#00f;">g</span>
				<span style="color:#080;">l</span>
				<span style="color:#f00;">e</span>
				<br>
				<span style="color:#00f;">reader</span>
			</a>
		</li>
		<li>
			<a href="http://www.ask.com">
				<span style="background-color:#f00; color:#fff; -moz-border-radius:4px;">ask.com</span>
			</a>
		</li>
		<li>
			<a href="http://www.yahoo.de/">
				<span style="color:#7a0098;">YAHOO!</span>
				<br>
				<span style="color:#7a0098; font-size:xx-small;">deutsch</span>
			</a>
		</li>
		<li>
			<a href="http://www.youtube.com">
				You
				<span style="background-color:#f00; color:#fff; -moz-border-radius:4px;">Tube</span>
			</a>
		</li>
		<li>
			<a href="http://www.camp-firefox.de/forum">
			Camp Firefox / Forum
			</a>
		</li>
		<li>
			<a href="http://forums.mozillazine.org/">
			Mozillazine / Forum
			</a>
		</li>
		<li>
			<a href="https://github.com/ardiman/userChrome.js">
			userchrome.js-Scripte (ardiman)
			</a>
		</li>
	</ol>
]]>.toString()
));

},false);