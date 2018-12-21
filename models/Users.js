const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


const { Schema } = mongoose;

const UsersSchema = new Schema({
	local: {
		email: String,
		password: String,
	},
});

// methods ======================
// generating a hash
UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UsersSchema);