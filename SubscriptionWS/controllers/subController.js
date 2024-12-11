const express = require('express')
const router = express.Router()
const sebService = require('../services/subService')

//Routes for all subscriptions related requests, redirectes all requests based on their type and url
router.post('/addsub', async (req, res) => {
    const id = req.body.MemberId
    const movieId = req.body.movieId
    const date = req.body.date
    if (!id || !movieId || !date) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    const newSub = await sebService.addSub(id, movieId, date)
    if (!newSub.success) {
        if (newSub.message === 'already subscribed') {
            return res.status(400).json({ message: 'Member already subscribed to this movie' })
        }
        return res.status(400).json({ message: 'Error adding subscription' })
    }
    return res.status(200).json({ message: 'Subscription added successfully', sub: newSub.sub })
})

module.exports = router