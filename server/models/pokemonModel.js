module.exports = function(mongoose){
    mongoose.model('Pokemon', mongoose.Schema({
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
    }));
}