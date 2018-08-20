module.exports = function(mongoose){
    mongoose.model('PokemonCache', mongoose.Schema({
        url: String,
        data: Object
    }));
}