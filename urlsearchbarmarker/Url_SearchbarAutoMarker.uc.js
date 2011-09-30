    document.getElementById("urlbar").addEventListener("mouseover",
        function(e) { document.getElementById("urlbar").select(); },
        false);
    document.getElementById("searchbar").addEventListener("mouseover",
        function(e) { document.getAnonymousElementByAttribute(document
        .getElementById("searchbar"), "class", "searchbar-textbox").
        select(); }, false);