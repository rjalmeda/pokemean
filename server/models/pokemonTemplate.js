var mongoose = require('mongoose');
var PokemonTemplateModel = mongoose.Schema({
    pokeId: String,
    data: Object
})
mongoose.model('PokemonTemplate', PokemonTemplateModel);