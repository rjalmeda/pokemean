var mongoose = require('mongoose');
var PokemonCacheModel = mongoose.Schema({
    url: String,
    data: Object
})
mongoose.model('PokemonCache', PokemonCacheModel);