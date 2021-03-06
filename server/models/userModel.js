module.exports = function(mongoose){
    mongoose.model('User', mongoose.Schema({
        username: String,
        password: {
            type: String,
            select: false
        },
        currentPokemonIdx: Number,
        pokemons: Array,
        inventory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        trainerXP: {
            type: Number,
            default: 0
        },
        trainerLVL: {
            type: Number,
            default: 0
        },
        gold: {
            type: Number,
            default: 0
        },
        eggs: [{
            type: Number,
            default: 0
        }],
        gender: String
    }));
}