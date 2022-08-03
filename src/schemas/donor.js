const mongoose = require('mongoose');
const {model,Schema} = mongoose;

const donorSchema = new Schema({
    name: String,
    city: {
        type: String,
        lowercase: true
    },
    address: String,
    contact: String,
    type: String
})

module.exports = new model('donor',donorSchema);