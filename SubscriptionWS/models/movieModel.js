const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({

    Name: String,
    Genres: Array,
    Image: String,
    Premiered: Date
}, {versionKey: false})

module.exports = mongoose.model('Movie', movieSchema)