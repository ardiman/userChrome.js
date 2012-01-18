// Mit dem Mausrad auf der Suchleiste weiter suchen

gFindBar.addEventListener('DOMMouseScroll', function (event) {
                gFindBar.onFindAgainCommand(event.detail < 0);},
                false
);