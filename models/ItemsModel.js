var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemsSchema = new Schema(
  {
    item_name: {
    	type: String,
    	required: true
    },
   }
);

//Export model
module.exports = mongoose.model('Item', ItemsSchema);