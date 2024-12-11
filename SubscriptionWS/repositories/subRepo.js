const subModel = require('../models/subscriptionModel')

/**
 * Retrieves all subscriptions from the database.
 * Populates each subscription's Movies.MovieId field with the corresponding Movie document.
 * 
 * @async
 * @returns {Promise<Array>} An array of subscription documents populated with movie details.
 */
const getAllSubs = async () => {
    const subs = await subModel.find({}).populate({path: 'Movies.MovieId', model: 'Movie'})
    return subs
}

/**
 * Retrieves subscriptions for a specific member from the database.
 * 
 * @async
 * @param {string} id - The ID of the member whose subscriptions are to be retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of subscription documents for the specified member.
 */
const getSubs = async (id) => {
    const subs = await subModel.find({MemberId: id})
    return subs
}

/**
 * Adds a new subscription to the database.
 * 
 * @async
 * @param {object} sub - A subscription object with MemberId and Movies fields.
 * @returns {Promise<Subscription>} A promise that resolves to the newly added subscription document.
 */
const addSub = async (sub) => {
    const newSub = new subModel(sub)
    return await newSub.save()
}

/**
 * Updates an existing subscription in the database with new details.
 * 
 * @async
 * @param {string} id - The ID of the subscription to be updated.
 * @param {object} sub - The subscription object containing updated details.
 * @returns {Promise<Subscription>} A promise that resolves to the updated subscription document.
 */
const updateSub = async (id, sub) => {
    return await subModel.findByIdAndUpdate( id , {$set: {...sub}} , {new: true})
}

/**
 * Deletes a subscription from the database based on the member's ID.
 * 
 * @async
 * @param {string} id - The ID of the member whose subscription is to be deleted.
 * @returns {Promise<Subscription>} A promise that resolves to the deleted subscription document, or null if no subscription was found.
 */
const deleteSub = async (id) => {
    return await subModel.findOneAndDelete({MemberId: id})
}

module.exports = { getAllSubs, addSub, getSubs, updateSub, deleteSub }