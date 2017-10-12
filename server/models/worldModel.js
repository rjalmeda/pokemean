var mongoose = require('mongoose');
var WorldSchema = mongoose.Schema({
    region: {
        type: String,
        required: true,
        unique: true
    },
    worldMusic: {
        type: String
    } 
},{strict: false});
mongoose.model('World', WorldSchema);