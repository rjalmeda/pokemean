var mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
var amazon  = require('amazon-affiliate-api'),
    amazonKey = require('./amazonKey.js'),
    client  = amazon.createClient({
        awsId: amazonKey.awsId,
        awsSecret: amazonKey.awsSecret,
        awsTag: amazonKey.awsTag
    });
var Item = mongoose.model('Item');
module.exports = (function(){
    return {
        searchForItems: function(req,res){
            client.itemSearch(req.body, function(err, results){
                console.log(err);
                console.log("****************");
                console.log(results);
                console.log("****************");
                return res.json({
                    errors: err,
                    results: results
                })
            })
        },
        addItemToDB: function(req,res){
            Item.findOne(req.body, function(err, item){
                if (err){
                    return res.json({errors: err, message: "error searching for Item"})
                } else if (item){
                    return res.json({message: "Item already in database", item: item})
                } else if (!item){
                    var newItem = new Item(req.body);
                    newItem.save(function(err1, item1){
                        if (err1){
                            return res.json({errors: err, message: "error adding to db"})
                        } else if (item1){
                            return res.json({message: "added to db", item: item1})
                        }
                    })
                }
            })
        },
        addItemToCart: function(req,res){
            console.log(req.session);
            if(!req.session.CartId){
                client.cartCreate({
                    items: [
                        {
                            ASIN: req.body.ASIN,
                            Quantity: 1
                        }
                    ]
                }, function(err, results){
                    if (err){
                        if (err.Cart){
                            req.session.CartId = err.Cart.CartId;
                            req.session.HMAC = err.Cart.HMAC;
                            req.session.Cart = err.Cart;
                            req.session.save();
                        }
                        return res.json({errors: err, results: results})
                    }
                    else if (results){
                        if (results.Cart){
                            req.session.CartId = results.Cart.CartId;
                            req.session.HMAC = results.Cart.HMAC;
                            req.session.Cart = results.Cart;
                            req.session.save();
                        }
                    }
                    return res.json({errors: err, results: results})
                })
            } else if (req.session.CartId){
                client.cartAdd({
                    CartId: req.session.CartId,
                    HMAC: req.session.HMAC,
                    items: [{
                        ASIN: req.body.ASIN,
                        Quantity: 1
                    }]
                }, function(err, results){
                    if (err){
                        if (err.Cart){
                            req.session.CartId = err.Cart.CartId;
                            req.session.HMAC = err.Cart.HMAC;
                            req.session.Cart = err.Cart;
                            req.session.save();
                        }
                        return res.json({errors: err, results: results})
                    }
                    else if (results){
                        if (results.Cart){
                            req.session.CartId = results.Cart.CartId;
                            req.session.HMAC = results.Cart.HMAC;
                            req.session.Cart = results.Cart;
                            req.session.save();
                        }
                    }
                    return res.json({errors: err, results: results})
                })
            }
        },
        displayCart: function(req,res){
            if (req.session.CartId){
                return res.json({
                    CartId: req.session.CartId,
                    HMAC: req.session.HMAC,
                    Cart: req.session.Cart
                })
            } else {
                return res.json({
                    CartId: "",
                    HMAC: "",
                    Cart: ""
                })
            }
        }
    }
})();