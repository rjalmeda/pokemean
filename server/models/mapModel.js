module.exports = function(mongoose){
    mongoose.model('Map', mongoose.Schema({
        mapCoordinates: {
            type: String,
            required: true,
            unique: true
        }
    },{strict: false}));
}