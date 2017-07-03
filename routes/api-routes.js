// Requiring our Note and Article models
const Note = require("../models/Note.js");
const Article = require("../models/Article.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

module.exports = function(app) {

    // A GET request to scrape the echojs website
    app.get("/scrape", function(req, res) {

        // First, we grab the body of the html with request
        request("http://www.echojs.com/", function(error, response, html) {

            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);

            // Now, we grab every h2 within an article tag, and do the following:
            $("article h2").each(function(i, element) {

                // Save an empty object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);

                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });

            });
        });
        // Tell the browser that we finished scraping the text
        res.send("Scrape Complete");
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {


        // TODO: Finish the route so it grabs all of the articles
        Article.find({}).populate('Note')
            .then((result) => {
                res.json(result);
            }).catch((err) => {
                res.json(err);
            })


    });

    //Grabs an article by its ObjectId
    app.get("/articles/:id", function(req, res) {
        //finds one article using the req.params.id,
        //runs the populate method and passes it "Note",
        //then responds with the article with the note included.
        //the populate method tells it what to include along with the Article.

        let artId = req.params.id;

        Article.findOne({
                "_id": artId
            }).populate("Note").exec()
            .then((article) => {
                res.json(article);
            })
            .catch((err) => {
                res.json(err);
            });

    });

    // Creates a new note or replaces an existing one
    app.post("/articles/:id", function(req, res) {

        //saves the new note that gets posted to the Notes collection.
        //then finds an article by _id using req.params.id
        //and updates its "note" property with the _id of the new note

        let newNote = new Note(req.body);

        newNote.save()
            .then((dbNote) => {
                return Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $set: {
                        "note": dbNote._id
                    }
                })
            }).then((doc) => {
                res.json(doc);
            })
            .catch((err) => {
                res.json(err);
            });


    });

}
