const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
    MemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    Movies: [
        {
            MovieId: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}, 
            date: Date
        }
    ]
}, {versionKey: false})

module.exports = mongoose.model('Subscription', SubscriptionSchema)