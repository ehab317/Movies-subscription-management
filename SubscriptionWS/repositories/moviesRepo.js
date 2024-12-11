const moviesModel = require('../models/movieModel')

/**
 * Retrieves all movies from the database.
 * 
 * @function
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 */
const getAllMovies = async () => {
    const movies = await moviesModel.find()
    return movies
}

/**
 * Retrieves movies from the database based on the offset and limit provided.
 * 
 * @function
 * @param {Number} offset - The number of records to skip before returning movies.
 * @param {Number} limit - The maximum number of movies to return.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 */
const getMovies = (offset, limit) => {
    return moviesModel.find().limit(limit).skip(offset)
}

/**
 * Adds a new movie to the database.
 * 
 * @function
 * @async
 * @param {Object} movie - The movie object to add, containing details like Name, Genres, Image, and Premiered date.
 * @returns {Promise<Object>} A promise that resolves to the newly added movie object.
 */
const addMovie = async (movie) => {
    const newMovie = new moviesModel(movie)
    return await newMovie.save()
}

/**
 * Updates an existing movie in the database.
 * 
 * @function
 * @async
 * @param {Object} movie - The movie object containing updated details, including the _id of the movie to update.
 * @returns {Promise<Object>} A promise that resolves to the updated movie object.
 */
const updateMovie = async (movie) => {
    return await moviesModel.findByIdAndUpdate( movie._id , {$set: {...movie}} , {new: true})
}

/**
 * Deletes a movie from the database by its ID.
 * 
 * @function
 * @async
 * @param {string} id - The ID of the movie to be deleted.
 * @returns {Promise<Object|null>} A promise that resolves to the deleted movie object, or null if no movie was found.
 */
const deleteMovie = async (id) => {
    return await moviesModel.findByIdAndDelete(id)
}

module.exports = { getMovies, getAllMovies, addMovie, updateMovie, deleteMovie }