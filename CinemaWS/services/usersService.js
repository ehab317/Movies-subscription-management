const userRepo = require('../repositories/userRepo')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const permsRepo = require('../repositories/permissionsRepo')

//sign in, append permissions to user & create token for authentication
const signIn = async (user) => {
    const userFound = await userRepo.getUserByUserName(user.name)
    if(!userFound) {
        return ({success: false, user: null, message: 'User not found', token: null})
    }
    if(userFound.Password !== user.password) {
        return ({success: false, user: null, message: 'Wrong password', token: null})
    }
    const token = jwt.sign({id: userFound._id}, secret, {expiresIn: userFound.SessionTimeout * 60})
    const {permissions} = await permsRepo.getPermissions()
    const userPerms = permissions.find( (perms) => perms.id === userFound._id.toString())
    return ({success: true, user: {userName: userFound.Username, fullName: `${userFound.FirstName} ${userFound.LastName}`, created: userFound.CreatedDate, session: userFound.SessionTimeout ,id: userFound._id, permissions: userPerms.permissions}, message: null, token: token})
}

// check if user created by admin, if so then allow user to register
const register = async (name, password) => {
    const user = await userRepo.getUserByUserName(name)
    if(user) {
        const filter = {Username: name}
        const update = {$set: {Password: password}}
        const options = {new: true}
        const updatedUser = await userRepo.updateDBUser(filter, update, options)
        return {success: true, user: updatedUser}
    }

    return {success: false, user: null}
}

//get all users, clear id's and password
const getAllUsers = async () => {
    const users = await userRepo.getAllUsers()
    users.forEach( (user) => {
        delete user.Password
        delete user.Id
        delete user.id
    })
    return users
}

//update user
const updateUser = async (user) => {
    //update user in DB
    const filter = {_id: user._id}
    const update = {$set: {Username: user.Username}}
    const options = {new: true}
    const updatedDBUser = await userRepo.updateDBUser(filter, update, options)
    if(!updatedDBUser) {
        return {success: false, user: user}
    }
    //update user details in json file
    let jsonUsers = await userRepo.getJsonUsers()
    jsonUsers.forEach( (jUser) => {
        if(jUser.Id === user._id) {
            jUser.FirstName = user.FirstName
            jUser.LastName = user.LastName
            jUser.CreatedDate = user.CreatedDate
            jUser.SessionTimeout = parseInt(user.SessionTimeout)
        }
    })
    await userRepo.updateJsonUser(jsonUsers)
    
    //update user permissions in json file
    const {permissions} = await permsRepo.getPermissions()
    permissions.forEach( (perm) => {
        if(perm.id === user._id) {
            perm.permissions = user.permissions
        }
    })

    await permsRepo.updatePermissions(permissions)

    return {success: true}

}

const deleteUser = async (id) => {
    await userRepo.deleteDbUser(id)
    await userRepo.deleteJsonUser(id)
    await permsRepo.deleteUserPermissions(id)
    return {success: true}
}

const createUser = async (user) => {
    const dbUser = await userRepo.saveUser({Username: user.Username, password: ''})
    if(!dbUser) {
        return {success: false, user: null}
    }

    let jsonUsers = await userRepo.getJsonUsers()
    jsonUsers.push({Id: dbUser._id.toString(), FirstName: user.FirstName, LastName: user.LastName, CreatedDate: new Date(), SessionTimeout: parseInt(user.SessionTimeout)})
    await userRepo.updateJsonUser(jsonUsers)

    const {permissions} = await permsRepo.getPermissions()
    permissions.push({id: dbUser._id.toString(), permissions: user.permissions})
    await permsRepo.updatePermissions(permissions)
    return {success: true, user: {_id: dbUser._id.toString(), CreatedDate: new Date(), ...user}}

}

module.exports = {signIn, register, getAllUsers, updateUser, deleteUser, createUser}