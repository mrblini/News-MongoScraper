var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// ------------- CREATING 'TABLE'
var ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: {
        type: String
    },
    description: {
        type: String
    }
});



var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;