const Chance = require("chance");
const chance = new Chance();

const ProgQuote = require('prog-quote');
const quoteRandom = ProgQuote();

const dateFormat = require('dateformat');

const Express = require("express");
const app = Express();

app.get('/', function (request, response) {
    response.send(generateQuoteList());
});

app.listen(3000, function () {
    console.log("Accepting HTTP request on port 3000");
});

chance.mixin({
    'generateQuote': function () {
        var year = chance.year({
            min: 1990,
            max: 2016
        });

        var date = chance.date({
            american: false,
            year: year
        })

        return {
            quote: quoteRandom.next().value.quote,
            country: chance.country({
                full: true
            }),
            author: chance.first() + " " + chance.last(),
            source: chance.url({
                domain: "www.randomprogquotesfromtheinternet.com"
            }),
            date: dateFormat(date, "'quoted the 'ddS mmmm yyyy")
        };
    }
});

function generateQuoteList() {
    var numberOfQuotes = chance.integer({
        min: 1,
        max: 5
    });

    var quotes = [];

    for (var i = 0; i < numberOfQuotes; i++) {
        quotes.push(chance.generateQuote());
    }

    return quotes;
}