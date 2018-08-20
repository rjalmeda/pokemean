module.exports = function(mongoose){
    mongoose.model('World', mongoose.Schema({
        region: {
            type: String,
            required: true,
            unique: true
        },
        worldMusic: {
            type: String
        } 
    },{strict: false}));
}