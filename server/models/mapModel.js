var mongoose = require('mongoose');
var MapSchema = mongoose.Schema({
    mapCoordinates: {
        type: String,
        required: true,
        unique: true
    }
},{strict: false});
mongoose.model('Map', MapSchema);