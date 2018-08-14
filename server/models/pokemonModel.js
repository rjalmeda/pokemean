var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var PokemonSchema = mongoose.Schema({
    name: String,
    id: Number,
    type: Array,
    xp: Number,
    lvl: Number,
    abilities: Array,
    moves: Array,
    hp: Number,
    currentHP: Number,
    atk: Number,
    def: Number,
    spcAtk: Number,
    spcDef: Number,
    spd: Number
})
mongoose.model('Pokemon', PokemonSchema);