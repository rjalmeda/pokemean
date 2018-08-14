var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var PokemonCacheModel = mongoose.Schema({
    url: String,
    data: Object
})
mongoose.model('PokemonCache', PokemonCacheModel);