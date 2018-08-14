var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var MapSchema = mongoose.Schema({
    mapCoordinates: {
        type: String,
        required: true,
        unique: true
    }
},{strict: false});
mongoose.model('Map', MapSchema);