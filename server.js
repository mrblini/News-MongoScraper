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

var PORT = process.env.PORT || 3030;

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



// -------------------- Routes

//function to scrape NYT and get title, URL and description
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
	var returnData = [];
	// Make a request via axios for the news section of `ycombinator`
	axios.get("https://www.nytimes.com/section/technology").then(function (response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		var result = {};
		$("article").each(function (i, element) {
			result.title = $($(element).find("h2").children()[0]).text();
			result.url = "https://www.nytimes.com/" + $(element).find("a").attr("href");
			result.excerpt = $(element).find("p").text();
			result.favorite = false;
			
			db.Headline.create(result)
				.then(function (newsdb) {
					returnData.push(result);
				})
				.catch(function (err) {
					console.log(err);
				})
		});
	})
	// Send data
	//console.log(returnData);
	//res.json(returnData)
})
