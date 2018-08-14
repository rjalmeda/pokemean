var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var PokemonTemplateModel = mongoose.Schema({
    pokeId: String,
    data: Object
})
mongoose.model('PokemonTemplate', PokemonTemplateModel);