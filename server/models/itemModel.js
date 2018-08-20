module.exports = function(mongoose){
    mongoose.model('Item', mongoose.Schema({
        ASIN: {
            type: String,
            index: true
        },
        DetailPageURL: String,
        IMGURL: String,
        SearchIndex: String,
        Keywords: String
    }));
}