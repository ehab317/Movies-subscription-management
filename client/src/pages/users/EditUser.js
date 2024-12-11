import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate,useParams } from "react-router"
import {Link} from 'react-router-dom'
import axiosRequest from "../../config/axiosConfig"
const cinemaUrl = process.env.REACT_APP_CINEMAWS

/**
 * Handles the editing of a user.
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
 * If the user clicks on the Update button, the component will send a PUT request to the server
 * with the user data. If the request is successful, the component will dispatch an action to update the
 * user in the state and will navigate to the /home/users/allUsers page.
 * If the request fails, the component will display an error message.
 * If the user clicks on the Cancel button, the component will navigate to the /home/users/allUsers page.
 * This component also handles the case when the user is logged out by the server.
 * If the server returns a 401 status code, the component will log the user out and navigate to the
 * login page.
 * @function
 * @async
 * @returns {JSX.Element} JSX element for editing a user
 */
const EditUser = () => {

    const id = useParams().id
    const users = useSelector(state => state.systemUsers.users)
    const permissions = ['View Subscriptions', 'Create Subscriptions', 'Delete Subscriptions', 'Update Subscriptions', 'View Movies', 'Create Movies', 'Delete Movies', 'Update Movies']
    const [user, setUser] = useState({})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setUser(users.find(user => user._id === id))
    }, [users, id])

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

    /**
     * Handles the update of a user.
     * This function will be called when the user clicks on the Update button.
     * It will send a PUT request to the server with the user data.
     * If the request is successful, the function will dispatch an action to update the
     * user in the state and will navigate to the /home/users/allUsers page.
     * If the request fails, the function will display an error message.
     * If the server returns a 401 status code, the function will log the user out and navigate to the
     * login page.
     */
    const handleUpdate = async () => {
        try {
            const {data} = await axiosRequest.put(`${cinemaUrl}/users/update`, user)
            setMessage(data.message)
            dispatch({type: 'UPDATE_USER', user: user})
            navigate('/home/users/allUsers')
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

    return (
        <div>
            { user ? (
            <>            
                <h2>Edit {`${user.FirstName} ${user.LastName}`}</h2>
                <form>
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={user.FirstName} onChange={(e) => setUser({...user, FirstName: e.target.value})}/>
                    <br/>
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={user.LastName} onChange={(e) => setUser({...user, LastName: e.target.value})}/>
                    <br/>
                    <label>Created Date: </label>
                    <input type="date" name="createdDate" value={user.CreatedDate && user.CreatedDate.slice(0, 10)} onChange={(e) => setUser({...user, CreatedDate: e.target.value})}/>
                    <br/>
                    <label>User Name: </label>
                    <input type="text" name="username" value={user.Username} onChange={(e) => setUser({...user, Username: e.target.value})}/>
                    <br/>
                    <label>Session Time Out (minutes): </label>
                    <input type="number" name="sessionTimeOut" value={user.SessionTimeout} onChange={(e) => setUser({...user, SessionTimeout: e.target.value})}/>
                    <br/>
                    <label>Permissions: </label><br/>
                    { user.permissions &&
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
                <button style={{marginRight: '10px'}} onClick={() => handleUpdate()}>Update</button>
                <Link to={'/home/users/allUsers'}><button style={{marginRight: '10px'}}>Cancel</button></Link>
                <br/>
                {message && <p>{message}</p>}
            </>
            ) : (
                <h2>Loading...</h2>
            )
        }
        </div>
    )
}

export default EditUser