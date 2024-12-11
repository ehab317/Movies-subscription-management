import { useState, useEffect } from "react"
import axiosRequest from "../../config/axiosConfig"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
const cinemaUrl = process.env.REACT_APP_CINEMAWS

/**
 * Handles the creation of a new user.
 * This component will display a form that asks for the following information:
 * - First Name
 * - Last Name
 * - Username
 * - Session Time Out (minutes)
 * - Permissions
 * The permissions is an array of strings that can contain the following values:
 * - View Subscriptions
 * - Create Subscriptions
 * - Delete Subscriptions
 * - Update Subscriptions
 * - View Movies
 * - Create Movies
 * - Delete Movies
 * - Update Movies
 * If the user clicks on the Create button, the component will send a POST request to the server
 * with the user data. If the request is successful, the component will dispatch an action to add the
 * new user to the state and will navigate to the /home/users/allUsers page.
 * If the request fails, the component will display an error message.
 * If the user clicks on the Cancel button, the component will navigate to the /home/users/allUsers page.
 * This component also handles the case when the user is logged out by the server.
 * If the server returns a 401 status code, the component will log the user out and navigate to the
 * login page.
 */
const AddUser = () => {

    const [user, setUser] = useState({Username: '', FirstName: '', LastName: '', SessionTimeout: 0, permissions: []})
    const [message, setMessage] = useState('')
    const permissions = ['View Subscriptions', 'Create Subscriptions', 'Delete Subscriptions', 'Update Subscriptions', 'View Movies', 'Create Movies', 'Delete Movies', 'Update Movies']
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /**
     * Handles the creation of a new user.
     * This function will be called when the user clicks on the Create button.
     * It will validate the input fields and send a POST request to the server with the user data.
     * If the request is successful, the function will dispatch an action to add the new user to the state
     * and will navigate to the /home/users/allUsers page.
     * If the request fails, the function will display an error message.
     * If the server returns a 401 status code, the function will log the user out and navigate to the
     * login page.
     */
    const handleCreate = async () => {
        if (!user.Username || !user.FirstName || !user.LastName ) {
            setMessage('All fields are required')
            return
        }

        if(!user.SessionTimeout || user.SessionTimeout < 1) {
            setMessage('Session timeout is required')
            return
        }

        if(user.permissions.length < 1) {
            setMessage('At least one permission is required')
            return
        }
        try {
            const {data} = await axiosRequest.post(`${cinemaUrl}/users/add`, user)
            setMessage(data.message)
            dispatch({type: 'ADD_USER', user: {...data.user}})
        } catch (error) {
            if (error.response.status === 401) {
                setMessage(`${error.response.data.message}, you will be logged out in 3 seconds`)
                setTimeout(() => {
                    dispatch({type: 'RESET_USERS'})
                    dispatch({type: 'RESET_MEMBERS'})
                    dispatch({type: 'LOGOUT'})
                    localStorage.removeItem('token')
                    navigate('/')
                }, 3000)
            } else {
                setMessage(error.response.data.message)
            }
        }
    }

    /**
     * Handles the change event of the permission checkboxes.
     * If the checkbox is checked, the permission is added to the user's permissions.
     * If the checkbox is unchecked, the permission is removed from the user's permissions.
     * @param {object} e The event object.
     */
    const handlePermissions = (e) => {
        if(e.target.checked) {
            setUser({...user, permissions: [...user.permissions, e.target.name]})
        } else {
            setUser({...user, permissions: user.permissions.filter(permission => permission !== e.target.name)})
        }
    }

    useEffect(() => {
        user.permissions && user.permissions.forEach(perm => {
            if(!user.permissions.includes('View Subscriptions') && perm.includes('Subscriptions')) {
                setUser({...user, permissions: [...user.permissions, 'View Subscriptions']})
        }})
        user.permissions && user.permissions.forEach(perm => {
            if(!user.permissions.includes('View Movies') && perm.includes('Movies')) {
                setUser({...user, permissions: [...user.permissions, 'View Movies']})
        }})
    }, [user, user.permissions])

    return (
        <>
        <h1>Add User</h1>
        <div>
                <h2>New User</h2>
                    <form>
                        <label>First Name: </label>
                        <input type="text" name="firstName" onChange={(e) => setUser({...user, FirstName: e.target.value})}/>
                        <br/>
                        <label>Last Name: </label>
                        <input type="text" name="lastName" onChange={(e) => setUser({...user, LastName: e.target.value})}/>
                        <br/>
                        <label>User Name: </label>
                        <input type="text" name="username" onChange={(e) => setUser({...user, Username: e.target.value})}/>
                        <br/>
                        <label>Session Time Out (minutes): </label>
                        <input type="number" name="sessionTimeOut" onChange={(e) => setUser({...user, SessionTimeout: e.target.value})}/>
                        <br/>
                        <label>Permissions: </label><br/>
                        { 
                            permissions.map((permission, index) => {
                                    return (
                                        <div key={index}>
                                            <input type="checkbox" name={permission} {...user.permissions.includes(permission) ? {checked: true} : {}} onChange={(e) => handlePermissions(e)}/>
                                            <label>{permission}</label>
                                        </div>
                                    )

                            })
                        }
                    </form>
                <br/>
                <button style={{marginRight: '10px'}} onClick={() => handleCreate()}>Create</button>
                <Link to={'/home/users/allUsers'}><button style={{marginRight: '10px'}}>Cancel</button></Link>
                <br/>
                {message && <p>{message}</p>}

        </div>
        </>
    )
}

export default AddUser