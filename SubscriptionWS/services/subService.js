const subRepo = require('../repositories/subRepo')

/**
 * Adds a new subscription to the database.
 * If the member is already subscribed to the movie, returns an error message.
 * If the member is not subscribed, adds the movie to the member's subscriptions
 * and returns the updated subscription.
 * @async
 * @param {string} id - The ID of the member whose subscription is to be added.
 * @param {string} movieId - The ID of the movie to which the member is to be subscribed.
 * @param {string} date - The date the subscription was added.
 * @returns {Promise<{success: boolean, sub: Subscription, message?: string}>} A promise that resolves to an object indicating success or failure of the operation, with the subscription document if successful and an error message if not.
 */
const addSub = async (id, movieId, date) => {
    const sub = await subRepo.getSubs(id)
    if (!sub.length) {
        const newSub = await subRepo.addSub({MemberId: id, Movies: [{MovieId: movieId, date}]})
        return {success: true, sub: newSub}
    } else {
        const memberMovies = sub[0].Movies.map((movie) => movie.MovieId.toString())
        if (memberMovies.includes(movieId)) {
            return {success: false, message: 'already subscribed'}
        } else {
            sub[0].Movies.push({MovieId: movieId, date})
            const updatedSub = await subRepo.updateSub(sub[0]._id, sub[0])
            return {success : true, sub: updatedSub}
        }
    }
}

module.exports = { addSub }