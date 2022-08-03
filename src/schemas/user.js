const mongoose = require('mongoose');
const {model,Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String
})

userSchema.plugin(passportLocalMongoose);
module.exports = new model('user',userSchema);