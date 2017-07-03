/* Scrape and Display (18.3.8)
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

// Initialize Express
var app = express();
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

//Requiring HTML and API routes
var htmlRoutes = require('./routes/html-routes.js');
var APIRoutes = require('./routes/api-routes.js');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));


//Bringing in our routes
// htmlRoutes(app);
APIRoutes(app);



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");

  // Show any mongoose errors
  db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });

  // Once logged in to the db through mongoose, log a success message
  db.once("open", function() {
    console.log("Mongoose connection successful.");
  });
});
