const jf = require('jsonfile')
const file = './data/Permissions.json'

//get all permissions from permissions.json
const getPermissions = async () => {
    const permissions = await jf.readFile(file)
    return permissions
}

//update permissions
const updatePermissions = async (json) => {
    jf.writeFile(file, {permissions: json}, (err) => {
        if (err) { 
            console.log(err)
        }
    })
}

//delete user permissions
const deleteUserPermissions = async (id) => {
    const {permissions} = await jf.readFile(file)
    const index = permissions.findIndex( (permission) => permission.id === id)
    permissions.splice(index, 1)
    jf.writeFile(file, {permissions: permissions}, (err) => {
        if (err) { 
            console.log(err)
        }
    })
}

module.exports = {getPermissions, updatePermissions, deleteUserPermissions}