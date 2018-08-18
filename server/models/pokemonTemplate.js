module.exports = function(mongoose){
    mongoose.model('PokemonTemplate', mongoose.Schema({
        pokeId: String,
        data: Object
    }));
}