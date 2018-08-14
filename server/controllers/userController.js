var mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var bcrypt = require('bcryptjs');
var Pokemon = mongoose.model('Pokemon');
module.exports = (function(){
    return {
        login: function(req,res){
            User.findOne({username: req.body.username})
                .select('+password')
                .exec(function(err,user){
                if(!user){
                    var newuser = new User(req.body);
                    var password = bcrypt.hashSync(req.body.password, 8);
                    newuser.eggs = [];
                    var firstpokemon = (Math.floor(Math.random()*4))*3+1;
                    if (firstpokemon === 10){
                        firstpokemon = 25;
                    }
                    newuser.eggs.push(firstpokemon);
                    newuser.eggs.push(Math.floor(Math.random()*143)+1);
                    newuser.eggs.push(Math.floor(Math.random()*143)+1);
                    newuser.currentPokemonIdx = 0;
                    newuser.gender = 'male';
                    newuser.password = password;
                    newuser.save().then(function(user){
                        req.session.user = user;
                        return res.json({success: true, user: user})
                    })
                } else {
                    if (bcrypt.compareSync(req.body.password, user.password)){
                        req.session.user = user;
                        return res.json({success: true, user: user});
                    } else {
                        return res.json({success: false, message: 'wrong dude'});
                    }
                }
            })
        },
        checkUser: function(req,res){
            if (req.session.user){
                return res.json({success: true, user: req.session.user})
            } else {
                return res.json({success: false, message: 'not logged in '})
            }
        },
        popEgg: function(req,res){
            User.findOne({username: req.session.user.username}, function(err,user){
                if (!user){
                    return res.json({success: false, message: 'user not found'})
                }
                var newpokemon = req.body;
                user.pokemons.push(newpokemon);
                user.eggs.pop();
                user.save().then(function(data){
                    req.session.user = data;
                    return res.json({success: true, message: 'added new pokemon', user: data});
                })
            })
        }
    } 
})();