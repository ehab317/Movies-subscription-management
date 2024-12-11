import {useSelector, useDispatch} from 'react-redux'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axiosRequest from '../../config/axiosConfig'
const cinemaUrl = process.env.REACT_APP_CINEMAWS

/**
 * Component for displaying all users and handling delete of users
 * If the user has appropriate permissions, they can edit or delete users
 * The component displays a list of users with their details and provides
 * links to edit or delete a user. If the user does not have appropriate
 * permissions, they are only able to view the list of users.
 * On deletion, it sends a DELETE request to the server and updates the state
 * accordingly. If the request fails and the status is 401, it logs the user out
 * after 3 seconds.
 * @function
 * @returns {JSX.Element} A JSX element containing a list of users and a link to edit or delete a user
 */
const Allusers = () => {

    const users = useSelector(state => state.systemUsers.users)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

/**
 * Handles the deletion of a user. Sends a DELETE request to the server
 * and updates the state accordingly. If the request fails with a 401 status
 * code, it logs the user out and navigates to the home page after a delay.
 * Displays success or error messages based on the result of the request.
 * @param {React.MouseEvent<HTMLFormElement>} e - The event object
 * @param {string} id - The id of the user to be deleted
 */
    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            const {data} = await axiosRequest.delete(`${cinemaUrl}/users/delete/${id}`)
            setMessage(data.message)
            dispatch({type: 'DELETE_USER', id: id})
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
        <>
        {
            users && users.length && users.map((user) => {
                return (
                    <div key={user._id} style={{border: '1px solid black', width: '50%', padding: '10px', margin: '10px 0'}}>
                        <p>Name: {user.FirstName} {user.LastName}</p>
                        <p>User Name: {user.Username}</p>
                        <p>Session Time Out (minutes): {user.SessionTimeout.toString()}</p>
                        <p>Created Date: {user.CreatedDate && user.CreatedDate.slice(0, 10)}</p>
                        <p>Permissions:</p>
                        <ul>
                        {
                            user.permissions.map((permission, index) => {
                                return (
                                    <li key={index}>{permission}</li>
                                )
                            })
                        }
                        </ul>
                        <br/>
                        <Link to={`edit/${user._id}`}><button style={{marginRight: '10px'}}>Edit</button></Link>
                        <button style={{marginRight: '10px'}} onClick={(e) => handleDelete(e, user._id)}>Delete</button>
                    </div>
                )
            })
        }
        <br/>
        {message && <p>{message}</p>}
        </>
    )
}

export default Allusers