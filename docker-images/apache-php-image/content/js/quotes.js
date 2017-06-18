$(function() {
    console.log("Loading quotes");

    function loadQuotes() {
        $.getJSON("api/quotes/", function(quotes) {
            console.log(quotes);
            var message = "There's no quotes";
            if(quotes.length > 0) {
                message = quotes[0].quote + " " + quotes[0].author;
            }
            //$("#services, div.container, div.row, div.col-lg-12 text-center, div.section-subheading text-muted").text(message);
        });
    };

    loadQuotes();
    setInterval(loadQuotes, 3000);
});