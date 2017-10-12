var mongoose = require('mongoose');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var bcrypt = require('bcryptjs');
var Pokemon = mongoose.model('Pokemon');
module.exports = (function(){
    return {
        login: function(req,res){
            User.findOne({username: req.body.username}, function(err,user){
                if(!user){
                    var newuser = new User(req.body);
                    var password = bcrypt.hashSync(req.body.password, 8);
                    console.log(password);
                    newuser.eggs = [];
                    var firstpokemon = (Math.floor(Math.random()*4))*3+1;
                    if (firstpokemon === 10){
                        firstpokemon = 25;
                    };
                    newuser.eggs.push(firstpokemon);
                    newuser.eggs.push(Math.floor(Math.random()*143)+1);
                    newuser.eggs.push(Math.floor(Math.random()*143)+1);
                    console.log(newuser);
                    newuser.currentPokemonIdx = 0;
                    newuser.gender = 'male';
                    newuser.password = password;
                    newuser.save(function(err1,data){
                        req.session.user = data;
                        req.session.save();
                        data.password = '';
                        return res.json({success: true, user: data})
                    })
                } else {
                    if (bcrypt.compareSync(req.body.password, user.password)){
                        req.session.user = user;
                        req.session.save();
                        return res.json({success: true, user: user});
                    } else {
                        return res.json({success: false, message: 'wrong password dude'});
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
                console.log(user);
                var newpokemon = req.body;
                console.log(newpokemon);
                user.pokemons.push(newpokemon);
                user.eggs.pop();
                user.save(function(err,data){
                    req.session.user = data;
                    req.session.save();
                    data.password = '';
                    return res.json({success: true, message: 'added new pokemon', user: data});
                })
            })
        }
    } 
})();