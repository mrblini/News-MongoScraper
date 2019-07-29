var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// ------------- CREATING 'TABLE'
var ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        unique: true
    }
});



var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;