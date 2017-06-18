$(function() {
    console.log("Loading quotes");

    function loadQuotes() {
        $.getJSON("api/quotes/", function(quotes) {
            console.log(quotes);
            if(quotes.length > 0) {
            
                var content = "";

                for (var i = quotes.length - 1; i >= 0; i--) {
                    content +=
                    "<div class=\"col-lg-12\">" +
                    "<h3>" + quotes[i].quote + "</h3>" +
                    "<p class=\"text-muted\">" + quotes[i].author + "</p>" +
                    "<h4>" + quotes[i].country + ", " + quotes[i].date + "</h4>" +
                    "<a href=\"" + quotes[i].source + "\">source</a>"
                    "</div>";
                }

                $("div.quotes-place").html(content);
            }
        });
    };

    loadQuotes();
    setInterval(loadQuotes, 3000);
});