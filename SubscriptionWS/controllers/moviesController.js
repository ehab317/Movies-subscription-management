const express = require('express')
const router = express.Router()
const moviesService = require('../services/moviesService')

//Routes for all movies related requests, redirectes all requests based on their type and url
router.get('/', async (req, res) => {
    const { offset, limit } = req.query
    const movies = await moviesService.getMovies(offset, limit)
    if (!movies) {
        return res.status(400).json({ message: 'Error getting movies' })
    }
    return res.status(200).json({ movies })
})

router.post('/create', async (req, res) => {
    const movie = req.body
    const newMovie = await moviesService.createMovie(movie)
    if (!newMovie._id) {
        return res.status(400).json({ message: 'Error creating movie' })
    }
    return res.status(200).json({ message: 'Movie created successfully', movie: newMovie })
})

router.put('/updatemovie', async (req, res) => {
    const movie = req.body
    const updatedMovie = await moviesService.updateMovie(movie)
    if (!updatedMovie) {
        return res.status(400).json({ message: 'Error updating movie' })
    }
    return res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie })
})

router.delete('/deletemovie/:id', async (req, res) => {
    const id = req.params.id
    const deletedMovie = await moviesService.deleteMovie(id)
    if (!deletedMovie) {
        return res.status(400).json({ success: false, message: 'Error deleting movie' })
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully' })
})

module.exports = router