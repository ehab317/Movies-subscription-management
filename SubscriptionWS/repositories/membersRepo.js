const memberModel = require('../models/memberModel')
const getAllMembers = () => {
    return memberModel.find({})
}

/**
 * Adds a new member to the members collection in the database
 * @param {Object} member - The member to be added, must have Name, Email, and City properties
 * @returns {Promise} - Resolves with the newly added member, rejects with an error
 */
const addMember = (member) => {
    const newMember = new memberModel(member)
    return newMember.save()
}

/**
 * Deletes a member from the database by their ID.
 * @param {string} id - The ID of the member to be deleted.
 * @returns {Promise} - Resolves with the deleted member document, or null if no member was found.
 */
const deleteMember = (id) => {
    return memberModel.findByIdAndDelete(id)
}

/**
 * Updates an existing member in the database with new details.
 * 
 * @param {Object} member - The member object containing updated details.
 * @param {string} member._id - The ID of the member to be updated.
 * @param {string} member.Name - The new name of the member.
 * @param {string} member.Email - The new email of the member.
 * @param {string} member.City - The new city of the member.
 * @returns {Promise} - Resolves with the updated member document, or null if no member was found.
 */
const updateMember = (member) => {
    return memberModel.findByIdAndUpdate(member._id, {Name: member.Name, Email: member.Email, City: member.City}, { new: true })
}

module.exports = {getAllMembers, addMember, deleteMember, updateMember}