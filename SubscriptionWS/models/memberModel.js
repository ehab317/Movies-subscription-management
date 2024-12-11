const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    City: String
}, {versionKey: false})

module.exports = mongoose.model('Member', memberSchema)
