var express = require("express");
var mongoose = require("mongoose");
const logger = require("morgan");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 6060;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
// mongoose.connect("mongodb://localhost/NewsYouNeed", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI);


console.log("sdflhskdfhsdkljfhaskdjh")

// -------------------- Routes

// GET method route
app.get('/bb', function (req, res) {
	res.send('GET request to the homepage')
  })
  
  // POST method route
  app.post('/bb', function (req, res) {
	res.send('POST request to the homepage')
  })

//function to scrape NYT and get title, URL and description
// Scrape data from one site and place it into the mongodb db
// app.get("/scrape", function (req, res) {
// 	var returnData = [];
// 	// Make a request via axios for the news section of `ycombinator`
// 	axios.get("https://www.nytimes.com/section/technology").then(function (response) {
// 		// Then, we load that into cheerio and save it to $ for a shorthand selector

// 		console.log("inside axios")

// 		var $ = cheerio.load(response.data);
// 		var result = {};
// 		$("article").each(function (i, element) {
// 			result.title = $($(element).find("h2").children()[0]).text();
// 			result.url = "https://www.nytimes.com/" + $(element).find("a").attr("href");
// 			result.excerpt = $(element).find("p").text();
// 			result.favorite = false;

// 			db.Headline.create(result)
// 				.then(function (newsdb) {
// 					returnData.push(result);
// 				})
// 				.catch(function (err) {
// 					console.log(err);
// 				})
// 		});
// 	})
// 	// Send data
// 	console.log(returnData);
// 	res.json(returnData)
// })

//route to list all scraped Article
// Route for getting all Articles from the db
// app.get("/articles", function (req, res) {
// 	// TODO: Finish the route so it grabs all of the articles
// 	db.Article.find({})
// 		.then(function (newsdb) {
// 			res.json(newsdb);
// 		})
// 		.catch(function (err) {
// 			res.json(err);
// 		});
// });

// //route to save an article
// app.post("/articles/:id", function (req, res) {
// 	console.log("Updating: " + req.params.id);
// 	db.Article.findOneAndUpdate({
// 			_id: req.params.id
// 		}, {
// 			favorite: true
// 		}, {
// 			new: true
// 		})
// 		.catch(function (err) {
// 			// If an error occurred, send it to the client
// 			res.json(err);
// 		});
// 	res.status(200);
// })

// //route to list all saved articles
// app.get("/articles/saved", function (req, res) {
// 	console.log("In saved route!");
// 	// TODO: Finish the route so it grabs all of the articles
// 	db.Article.find({
// 			favorite: true
// 		})
// 		.then(function (dbnews) {
// 			res.json(dbnews);
// 		})
// 		.catch(function (err) {
// 			res.json(err);
// 		});
// });

// //route to save a note on a saved article


// //route to edit a note


// //route to  delete a note


// //route to unsave a note
// app.post("/favorite/remove/:id", function (req, res) {
// 	console.log("Updating: " + req.params.id);
// 	db.Article.findOneAndUpdate({
// 			_id: req.params.id
// 		}, {
// 			favorite: false
// 		}, {
// 			new: true
// 		})
// 		.catch(function (err) {
// 			// If an error occurred, send it to the client
// 			res.json(err);
// 		});
// 	res.status(200);
// })

// //catch all route
// app.get("*", function (req, res) {
// 	res.redirect("index");
// })


// // Start the server
// app.listen(PORT, function () {
// 	console.log("App running on port " + PORT + "!");
// });