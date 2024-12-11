const membersRepo = require('../repositories/membersRepo')
const subRepo = require('../repositories/subRepo')

/**
 * Retrieves all members and their subscriptions
 * @function
 * @async
 * @returns {Object[]} - An array of objects, each containing a member's details and subscriptions
 */
const getAllMembers = async () => {
    const members = await membersRepo.getAllMembers()
    const subs =  await subRepo.getAllSubs()
    const membersWithSubs = members.map((member) => {
        const memberSubs = subs.filter((sub) => sub.MemberId.toString() === member._id.toString())
        if (memberSubs.length) {
            return {
                ...member._doc,
                subscriptions: memberSubs[0].Movies
            }
        } else {
            return {
                ...member._doc,
                subscriptions: []
            }
        }
    })
    return membersWithSubs
}

/**
 * Adds a new member to the database.
 * @async
 * @param {Object} member - The new member to be added, must have Name, Email, and City properties
 * @returns {Promise<Object>} - Resolves with the newly added member document
 */
const addMember = async (member) => {
    const newMember = await membersRepo.addMember(member)
    return newMember
}

/**
 * Deletes a member from the database. If the member has subscriptions, it also deletes the subscriptions.
 * @async
 * @param {string} id - The id of the member to be deleted
 * @returns {Promise<Object|boolean>} - Resolves with the deleted member document if successful, or false if not
 */
const deleteMember = async (id) => {
    const deletedMember = await membersRepo.deleteMember(id)
    const subs = await subRepo.getSubs(id)
    if (subs.length) {
        const deletedSubs = await subRepo.deleteSub(id)
        if (!deletedSubs) {
            return false
        }
    }
    if (!deletedMember) {
        return false
    }
    return deletedMember
}

/**
 * Updates an existing member in the database with new details.
 * @async
 * @param {Object} member - The member object containing updated details, must have an _id property
 * @returns {Promise<Object>} - Resolves with the updated member document, or null if no member was found
 */
const editMember = async (member) => {
    const updatedMember = await membersRepo.updateMember(member)
    return updatedMember
}
module.exports = {getAllMembers, addMember, deleteMember, editMember}