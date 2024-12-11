const userModel = require('../models/userModel')
const jf = require('jsonfile')
const file = './data/Users.json'
const pfile = './data/Permissions.json'

 //Get a user by id from database
const getUserByid = (id) => {
    return userModel.findById(id)
}

//Get a user by his username from DB & append the user's details from json file
const getUserByUserName = async (userName) => {
    const dbUser = await userModel.findOne({Username: userName})
    const {users} = await jf.readFile(file)
    if(!dbUser) {
        return null
    }
    const jsonUser = users.find( (user) => user.Id === dbUser._doc._id.toString())
    return ({...dbUser._doc, ...jsonUser})
}

//get all users details from json file
const getJsonUsers = async () => {
    const {users} = await jf.readFile(file)
    return users
}

//save new user to DB
const saveUser = async (user) => {
    const newUser = new userModel(user)
    await newUser.save()
    return newUser
}

//update user in DB
const updateDBUser = async (filter, update, options) => {
    const updatedUser = await userModel.findOneAndUpdate(filter, update, options)
    return updatedUser
}

//get all users from DB + append details & permissions from json files
const getAllUsers = async () => {
    const userNames = await userModel.find()
    const jsonUsers = await jf.readFile(file)
    const permissions = await jf.readFile(pfile)
    const users = userNames.map( (user) => {
        const jsonUser = jsonUsers.users.find( (jsonUser) => jsonUser.Id === user._doc._id.toString())
        const jsonPermission = permissions.permissions.find( (permission) => permission.id === user._doc._id.toString())
        return ({...user._doc, ...jsonUser, ...jsonPermission})
    })
    return users
}

// update user details in json file
const updateJsonUser = (json) => {
    jf.writeFile(file,{users: json}, (err) => {
        if (err) { 
            console.log(err)
        }
    })
}

//delete user from DB
const deleteDbUser = async (id) => {
    const deletedUser = await userModel.findByIdAndDelete(id)
    return deletedUser
}

//delete user details from json file
const deleteJsonUser = async (id) => {
    const {users} = await jf.readFile(file)
    const index = users.findIndex( (user) => user.Id === id)
    users.splice(index, 1)
    jf.writeFile(file, {users: users}, (err) => {
        if (err) { 
            console.log(err)
        }
    })
}


module.exports = {getUserByid, saveUser, getUserByUserName, updateDBUser, getAllUsers, updateJsonUser, getJsonUsers, deleteDbUser, deleteJsonUser}