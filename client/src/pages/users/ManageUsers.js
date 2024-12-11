import axiosRequest from "../../config/axiosConfig"
import { useEffect, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import Allusers from "./AllUsers"
import AddUser from "./AddUser"
import EditUser from "./EditUser"
import {Routes, Route, Link, useNavigate} from "react-router-dom"

/**
 * ManageUsers component
 *
 * This component is responsible for managing user interactions and navigation
 * within the user management section of the application. It allows users to
 * view all users, add a new user, or edit an existing user. The component
 * handles fetching the list of users from the server and updates the Redux
 * store with the user data. It also manages navigation between different
 * user-related routes and displays messages based on the success or failure
 * of server requests. If a server request fails due to unauthorized access,
 * the component logs the user out after a delay.
 *
 * @returns {JSX.Element} A JSX element containing navigation buttons and routes
 *                        for user management functionalities.
 */
const ManageUsers = () => {

    const [clicked, setClicked] = useState('allUsers')
    const [message, setMessage] = useState('')

    const usersUrl = process.env.REACT_APP_CINEMAWS
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getUsers = useCallback( async () => {
        try {
            const {data} = await axiosRequest.get(`${usersUrl}/users`);
            dispatch({ type: 'SET_USERS', users: data})
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
    }, [ dispatch, usersUrl ])

    useEffect(() => {
        getUsers()
        navigate('allUsers')
    }, [getUsers])

    /**
     * Handles click events for the user management buttons.
     *
     * Updates the `clicked` state based on the id of the clicked button.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e - The event object
     */
    const handleClick = (e) => {
        setClicked(e.target.id)
    }

    return (
        <div style={{border: '1px solid black', width: '75%', margin: '20px auto', textAlign: 'left', padding: '10px'}}>
            <h1>Users</h1>
            <Link to="allusers"><button style={{marginRight: '10px', backgroundColor: clicked === 'allUsers' && 'yellow'}} onClick={(e) => handleClick(e)} id="allUsers">All Users</button></Link>
            <Link to="adduser"><button style={{backgroundColor: clicked === 'addUser' && 'yellow'}} onClick={(e) => handleClick(e)} id="addUser">Add User</button></Link>
            { message && <p>{message}</p> }
            {
                <Routes>
                    <Route path="allusers" element={<Allusers />} />
                    <Route path="adduser" element={<AddUser />} />
                    <Route path="allUsers/edit/:id" element={<EditUser />} />
                </Routes>
            }
        </div>
    )
}

export default ManageUsers