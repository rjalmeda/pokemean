var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var ItemSchema = mongoose.Schema({
    ASIN: {
        type: String,
        index: true
    },
    DetailPageURL: String,
    IMGURL: String,
    SearchIndex: String,
    Keywords: String
});
mongoose.model('Item', ItemSchema);