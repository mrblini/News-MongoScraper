// ---------------------------------- PACKAGES:
var express = require("express");
var mongoose = require("mongoose");
const logger = require("morgan");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require('express-handlebars');

// ----------- Require all models
var db = require("./models");

// ---------------------------------- CONNECT TO SERVER (EXPRESS):
var PORT = process.env.PORT || 3000;

var app = express();

// ------------ Handlebars:
app.engine('handlebars', exphbs({
    defaultLayout: "main"
}));
app.set('view engine', 'handlebars');

// ------------- Use MORGAN LOGGER for logging requests:
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));

// ---------------------------------- CONNECT TO DB (MONGODB):
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
// mongoose.connect("mongodb://localhost/NewsYouNeed", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI);





// -------------------------------------------------- ROUTES
// ================================ / 'MAIN PAGE'
app.get('/', function(req, res) {
    res.render("index");
})

// ================================ /SCRAPE 
// Scrape data from NYT and get title, URL and description - place it into the mongodb db
app.get("/scrape", function (req, res) {
    var result = [];

    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/section/world").then(function (response) {
        console.log("===============================")
        // console.log(response.data);

        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // ------------------- POPULATE ARRAY:
        async function makeArray() {
            // ---------------- TITLE
            $("h2.e1xfvim30").each(function () {
                console.log("========--------========-----> title:");
                console.log($(this).text());
                var articleObj = {};
                articleObj.title = $(this).text();
                result.push(articleObj);
                // console.log(articleObj)
                // console.log(result)
            });

            // ---------------- DESCRIPTION
            $("p.e1xfvim31").each(function (i, paragraph) {
                console.log("=====-----==---> description:");
                console.log($(this).text());
                result[i].description = $(this).text();
                // console.log(result)
            })

            // ---------------- LINK
            $("div.css-4jyr1y").each(function (i, link) {
                var urlBase = "https://www.nytimes.com";
                var linkRoute = $(this).children("a").attr("href")
                var full_url = urlBase + linkRoute;
                console.log("==============------------------>> link:");
                console.log(full_url);
                result[i].link = full_url;
                // console.log(result)
            })

        }

        // ----------------------------------------------- POPULATE DB
        makeArray().then(function () {
            for (i = 0; i < result.length; i++) {
                db.Article.create(result[i])
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            }
        })
    });

    // Send a message to the client
    res.render("index");
    // res.send("Scrape Complete");
});

// ================================ /ARTICLES
app.get('/articles', function(req, res) {
    db.Article.find({}).then(function (articlesResponse) {
        res.render("index", {
            articlesResponse
        });
    })
})

// ================================ /CLEAR
app.get('/clear', function(req, res) {
    db.Article.remove({}).then(function (droppedCollection) {
        res.render("index", {
            droppedCollection
        })
    })
})








// ================================ ARTICLES:
// route to list all scraped Article
// Route
// for getting all Articles from the db
// app.get("/articles", function (req, res) {
//     // TODO: Finish the route so it grabs all of the articles
//     db.Article.find({})
//         .then(function (newsdb) {
//             res.json(newsdb);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });

//route to save an article
app.post("/articles/:id", function (req, res) {
    console.log("Updating: " + req.params.id);
    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            favorite: true
        }, {
            new: true
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    res.status(200);
})

//route to list all saved articles
app.get("/articles/saved", function (req, res) {
    console.log("In saved route!");
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({
            favorite: true
        })
        .then(function (dbnews) {
            res.json(dbnews);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//route to save a note on a saved article


//route to edit a note


//route to  delete a note


//route to unsave a note
app.post("/favorite/remove/:id", function (req, res) {
    console.log("Updating: " + req.params.id);
    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            favorite: false
        }, {
            new: true
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    res.status(200);
})

//catch all route
app.get("*", function (req, res) {
    res.redirect("index");
})


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});







// ---------------------------------------- ROUTES

// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Start the server
// app.listen(PORT, function() {
//   console.log("App running on port " + PORT + "!");
// });