const express = require('express')
const router = express.Router()
const membersService = require('../services/membersService')

//Routes for all members related requests, redirectes all requests based on their type and url
router.get('/', async (req, res) => {
    const members = await membersService.getAllMembers()
    if (!members) {
        return res.status(400).json({ success: false, message: 'Error getting members' })
    }
    return res.status(200).json({ success: true, members, message: 'Members retrieved successfully' })
})

router.post('/addmember', async (req, res) => {
    const member = req.body
    const newMember = await membersService.addMember(member)
    if (!newMember) {
        return res.status(400).json({ success: false, message: 'Error adding member' })
    }
    return res.status(200).json({ success: true, message: 'Member added successfully', member: newMember })
})

router.delete('/deletemember/:id', async (req, res) => {
    const id = req.params.id
    const deletedMember = await membersService.deleteMember(id)
    if (!deletedMember) {
        return res.status(400).json({ success: false, message: 'Error deleting member' })
    }
    return res.status(200).json({ success: true, message: 'Member deleted successfully' })
})

router.put('/editmember', async (req, res) => {
    const member = req.body
    const updatedMember = await membersService.editMember(member)
    if (!updatedMember) {
        return res.status(400).json({ success: false, message: 'Error updating member' })
    }
    return res.status(200).json({ success: true, message: 'Member updated successfully', member: updatedMember })
})

module.exports = router