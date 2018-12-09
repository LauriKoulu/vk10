var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemsSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

//Export model
module.exports = mongoose.model('Items', AuthorSchema);