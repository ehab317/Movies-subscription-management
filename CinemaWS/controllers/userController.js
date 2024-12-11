const express = require('express')
const router = express.Router()
const userService = require('../services/usersService')

router.post('/login', async (req, res) => {
    const { name, password } = req.body
    const user = await userService.signIn({ name, password })
    if (!user.success) {
        return res.status(400).json({ user })
    }
    return res.status(200).json({ user })
})

router.post('/register', async (req, res) => {
    const { name, password } = req.body
    const user = await userService.register(name, password)
    if(!user.success) {
        return res.status(400).json({ message: 'User does not exist, please contact admin', user : null})
    }
    return res.status(200).json({ message: 'User created successfully', user: user })
})

router.get('/', async (req, res) => {
    const users = await userService.getAllUsers()
    return res.status(200).send( users )
})

router.put('/update', async (req, res) => {
    const user = req.body
    const newUser = await userService.updateUser(user)
    if (!newUser.success) {
        return res.status(400).json({ message: 'Error updating user'})
    }
    return res.status(200).json({ message: 'User updated successfully'})
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    const deletedUser = await userService.deleteUser(id)
    if (!deletedUser.success) {
        return res.status(400).json({ message: 'Error deleting user'})
    }
    return res.status(200).json({ message: 'User deleted successfully'})
})

router.post('/add', async (req, res) => {
    const user = req.body
    const newUser = await userService.createUser(user)
    if (!newUser.success) {
        return res.status(400).json({ message: 'Error creating user'})
    }
    return res.status(200).json({ message: 'User created successfully', user: newUser.user})
})

module.exports = router