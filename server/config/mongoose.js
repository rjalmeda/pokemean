var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pokeMean');
var fs = require('fs');
var path = require('path');
var models_path = path.join(__dirname, './../models');

mongoose.plugin(schema => { schema.options.usePushEach = true });

fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js') >= 0){
        require(path.join(models_path, file))(mongoose);
    }
})