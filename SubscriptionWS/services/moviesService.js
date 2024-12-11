const moviesRepo = require('../repositories/moviesRepo')
const subRepo = require('../repositories/subRepo')

/**
 * Retrieves a list of movies and their subscriptions.
 *
 * @async
 * @function
 * @param {Number} offset - The number of records to skip before returning movies.
 * @param {Number} limit - The maximum number of movies to return.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 */
const getMovies = async (offset, limit) => {
    const movies = await moviesRepo.getMovies(offset, limit)
    const subs = await subRepo.getAllSubs()
    const moviesWithSubs = movies.map((movie) => {
        movie._doc.subscriptions = []
        let id = movie._id.toString()
        subs.forEach((sub) => {
            const toAdd = sub.Movies.map((subMovie) => subMovie.MovieId._id.toString()).includes(id)
            if (toAdd){
                movie._doc.subscriptions.push(sub)
        }
        })

    })
    return movies
}

/**
 * Adds a new movie to the database.
 * @async
 * @function
 * @param {Object} movie - The movie object to add, containing details like Name, Genres, Image, and Premiered date.
 * @returns {Promise<Object>} A promise that resolves to the newly added movie object.
 */
const createMovie = async (movie) => {
    const newMovie = await moviesRepo.addMovie(movie)
    return newMovie
}

/**
 * Updates an existing movie in the database with new details.
 * 
 * @async
 * @function
 * @param {Object} movie - The movie object containing updated details, including the _id of the movie to update.
 * @returns {Promise<Object>} A promise that resolves to an object containing the updated movie.
 */
const updateMovie = async (movie) => {
    try {
        const updatedMovie = await moviesRepo.updateMovie(movie)
        return {updatedMovie: updatedMovie}
    } catch (error) {
        return {updateMovie: null}
    }
}

/**
 * Deletes a movie from the database based on its ID.
 * @async
 * @function
 * @param {string} id - The ID of the movie to be deleted.
 * @returns {Promise<Object>} A promise that resolves to an object containing the deleted movie, or null if no movie was found.
 */
const deleteMovie = async (id) => {
    const deletedMovie = await moviesRepo.deleteMovie(id)
    return deletedMovie
}

module.exports = { getMovies, createMovie, updateMovie, deleteMovie }