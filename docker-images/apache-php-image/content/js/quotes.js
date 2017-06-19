$(function() {
    console.log("Loading quotes");

    function loadQuotes() {
        $.getJSON("api/quotes/", function(quotes) {
            console.log(quotes);
            var content = "<h1>No quotes for you (no quote found)</h1>";
            if(quotes.length > 0) {

                content = "";

                for (var i = quotes.length - 1; i >= 0; i--) {
                    content +=
                    "<div class=\"col-lg-12\">" +
                    "<h4>" + quotes[i].quote + "</h4>" +
                    "<h5>" + quotes[i].country + ", " + quotes[i].date + "</h5>" +
                    "<p class=\"text-muted\">" + quotes[i].author + "</p>" +
                    "<a href=\"" + quotes[i].source + "\">source</a>" +
                    "<hr>" +
                    "</div>";
                }

                
            }

            $("div.quotes-place").html(content);
        });
    };

    loadQuotes();
    setInterval(loadQuotes, 3000);
});