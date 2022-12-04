let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new Schema({
    email: {
        type : String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);