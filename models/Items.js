var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemsSchema = new Schema(
  {
    name: String
  }
);

//Export model
module.exports = mongoose.model('Items',ItemsSchema);